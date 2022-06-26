const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const AWS =  require('aws-sdk');
const mime = require('mime-types')

const s3 = new AWS.S3();


const logs = [];



logs.push(`dirname: ${__dirname}`);




const cloudfrontDistributionsByAppNameMap = new Map();
cloudfrontDistributionsByAppNameMap.set(`modern`,       `E2Z43VS5TYP8MM`);
cloudfrontDistributionsByAppNameMap.set(`deliverme`,    `E19JOPTUD5DT0P`);
cloudfrontDistributionsByAppNameMap.set(`carmaster`,    `E3JW329FHL0PKB`);



const s3BucketByAppNameMap = new Map();
s3BucketByAppNameMap.set(`modern`,       `modern-apps-modern.s3.us-east-1.amazonaws.com`);
s3BucketByAppNameMap.set(`deliverme`,    `modern-apps-deliverme.s3.us-east-1.amazonaws.com`);
s3BucketByAppNameMap.set(`carmaster`,    `modern-apps-carmaster.s3.us-east-1.amazonaws.com`);





function savelogs() {
  const deployLogsPath = path.join(__dirname, 'deploy-cloudfront-logs');
  if (!fs.existsSync(deployLogsPath)) {
    fs.mkdirSync(deployLogsPath);
  }

  const contents = logs.join(`\n\n`);
  const filename = `deploy-logs-${Date.now()}.txt`;
  const filePath = path.join(deployLogsPath, filename);
  const results = fs.writeFileSync(filePath, contents);
  console.log(`Logs saved`);

  return results;
}



// https://stackoverflow.com/questions/27670051/upload-entire-directory-tree-to-s3-using-aws-sdk-in-node-js#answer-46213474
async function getUploads(rootPath) {
  logs.push(JSON.stringify({ rootPath }));

  const gatherUploads = async (currentRootPath) => {
    const list = [];
    const contents = fs.readdirSync(currentRootPath);
    logs.push(JSON.stringify({ currentRootPath, contents }));

    for (const item of contents) {
      const absolutePath = path.join(currentRootPath, item).replace(/\\/g, '/');
      const splitter = absolutePath.split(rootPath.replace(/\\/g, '/') + '/');
      const relativePath = splitter[1];
      const s3UploadPath = absolutePath.split(__dirname.replace(/\\/g, '/') + '/')[1];
      const contentType = mime.lookup(absolutePath) || 'application/octet-stream';
      
      const stat = fs.statSync(absolutePath);
      const uploadItem = { absolutePath, relativePath, s3UploadPath, contentType, stats: JSON.stringify(stat) };
      
      const isFile = stat.isFile();
      const isDir = stat.isDirectory();
      
      if (isFile) {
        logs.push(JSON.stringify(uploadItem));
        list.push(uploadItem);
      }
      if (isDir) {
        const deeperContents = await gatherUploads(absolutePath);
        list.push(...deeperContents);
      }
    }
    return list;
  }

  const uploads = await gatherUploads(rootPath);
  return uploads;
}

async function emptyS3Directory(bucket, dir) {
  // https://stackoverflow.com/questions/20207063/how-can-i-delete-folder-on-s3-with-node-js

  const listParams = {
      Bucket: bucket,
      Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();
  logs.push(JSON.stringify({ listedObjects, listParams }));

  
  if (listedObjects.Contents.length === 0) return;
  
  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };
  
  logs.push(JSON.stringify({ deleteParams }));

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  const results = await s3.deleteObjects(deleteParams).promise();
  logs.push(JSON.stringify(results));

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

async function uploadToS3 (uploadItems, Bucket, bucketUploadPath) {
  const promises = [];

  for (const uploadItem of uploadItems) {
    const promise = new Promise((resolve, reject) => {
      const Key = `${bucketUploadPath}/${uploadItem.relativePath}`;
      const Body = fs.readFileSync(uploadItem.absolutePath);
      const params = { Bucket, Key, Body, ContentType: uploadItem.contentType };
      logs.push(`attempting upload with params: ${JSON.stringify(params)}`);
      s3.putObject(params, (err, data) => {
        if (err) {
          logs.push('Error uploading with params');
          logs.push(String(err));
          reject(err);
        } else {
          logs.push('Successfully uploaded with params', data);
          resolve(data);
        }
      });
    });
    promises.push(promise);
  }

  return Promise.all(promises);
}

async function deployProject(appName) {
  // determine if project is built
  logs.push(`checking if ${appName} is built...`);

  const projectDistRoot = path.join(__dirname, `/dist/${appName}`).replace(/\\/g, '/');
  const projectNotBuilt = fs.existsSync(projectDistRoot);
  if (!projectNotBuilt) {
    logs.push(`project "${appName}" is not built; could not find by path: ${projectDistRoot}`);
    savelogs();
    process.exit(1);
  }

  logs.push(`${appName} is built, checking distribution...`);

  // check if distribution exists for the given app
  const cloudfrontId = cloudfrontDistributionsByAppNameMap.get(appName);
  if (!cloudfrontId) {
    logs.push(`project "${appName}" does not have a cloudfront distribution associated to it...`);
    savelogs();
    process.exit(1);
  }

  logs.push(`project "${appName}" does have a cloudfront distribution associated to it. checking if project has bucket...`);

  // check if distribution exists for the given app
  const bucketOrigin = s3BucketByAppNameMap.get(appName);
  if (!bucketOrigin) {
    logs.push(`project "${appName}" does not have a bucket associated to it...`);
    savelogs();
    process.exit(1);
  }

  logs.push(`project "${appName}" does have a bucket associated to it. uploading build to it...`);

  const bucket = bucketOrigin.split('.')[0];
  let uploadItems;
  
  // get files to upload
  try {
    uploadItems = await getUploads(projectDistRoot);
    logs.push(JSON.stringify({ uploadItems }));
  } catch (error) {
    logs.push(String(err));
    savelogs();
    process.exit(1);
  }
  
  // try to upload them to s3
  let uploadResults;
  const timestamp = Date.now();
  const bucketUploadPath = `app/${timestamp}`;

  try {
    uploadResults = await uploadToS3(uploadItems, bucket, bucketUploadPath);
    logs.push(JSON.stringify({ uploadResults }));
  } catch (error) {
    logs.push(String(err));
    savelogs();
    process.exit(1);
  }

  // now updats cloudfront distribution
  const cloudfrontClient = new AWS.CloudFront();

  const cloudfrontConfig = await cloudfrontClient.getDistributionConfig({ Id: cloudfrontId }).promise();
  logs.push(JSON.stringify(cloudfrontConfig));

  const oldOriginPath = cloudfrontConfig.DistributionConfig.Origins.Items[0].OriginPath;
  cloudfrontConfig.DistributionConfig.Origins.Items[0].OriginPath = `/${bucketUploadPath}`;

  logs.push(JSON.stringify(cloudfrontConfig));

  let updateConfigResults;
  try {
    const updateParams = {
      Id: cloudfrontId,
      IfMatch: cloudfrontConfig.ETag,
      DistributionConfig: cloudfrontConfig.DistributionConfig,
    };
    updateConfigResults = await cloudfrontClient.updateDistribution(updateParams).promise();
  } catch (error) {
    logs.push(String(err));
    savelogs();
    process.exit(1);
  }

  logs.push(`origin path updated.`);

  if (oldOriginPath) {
    logs.push(`attempting invalidation on old path: /*`);
    let invalidaion;
    try {
      const updateParams = {
        DistributionId: cloudfrontId,
        InvalidationBatch: {
          CallerReference: `${Date.now()}`,
          Paths: {
            Quantity: 3,
            Items: [`${oldOriginPath}/*`, `/index.html`, `/*`],
          }
        }
      };
      invalidaion = await cloudfrontClient.createInvalidation(updateParams).promise();
      logs.push(`invalidaion created on old path /*.`);
    } catch (err) {
      logs.push(String(err));
      savelogs();
      process.exit(1);
    }


    try {
      const useOldPath = oldOriginPath.substring(1);
      logs.push(`attempting to delete old origin path: ${useOldPath}`);
      await emptyS3Directory(bucket, useOldPath);
      logs.push(`deleted old path ${useOldPath} from bucket successfully`);
    }
    catch (err) {
      logs.push(String(err));
      logs.push(`could not delete old path`);
    }
  }

  const cloudfront = await cloudfrontClient.getDistribution({ Id: cloudfrontId }).promise();
  logs.push(JSON.stringify(cloudfront));

  const completeMsg = `\n\n\n---------------Deployment complete. \n\n\n`;
  logs.push(completeMsg);
  console.log(completeMsg);
  savelogs();
}



const givenAppName = process.argv[2];
logs.push(`given app name: ${givenAppName}`);



deployProject(givenAppName);