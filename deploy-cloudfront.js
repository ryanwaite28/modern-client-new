const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const fs_p = require('fs/promises');
// https://stackoverflow.com/questions/37732331/execute-bash-command-in-node-js-and-get-exit-code
const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);
const path = require('path');
const AWS =  require('aws-sdk');
const mime = require('mime-types')



const s3 = new AWS.S3();
const logs = [];
const runDate = new Date();

const allowedAppNames = new Set([
  'modern',
  'deliverme',
  'carmaster',
]);

const allowedEnviroments = new Set([
  'dev',
  'production'
]);




logs.push(`Date: ${runDate.toLocaleString()} (${runDate.toISOString()})`);

const givenAppName = process.argv[2] && process.argv[2].toLowerCase().trim();
if (!givenAppName || !allowedAppNames.has(givenAppName)) {
  console.log(`No valid argument for app; exiting...`);
  process.exit(1);
}

const givenEnviroment = process.argv[3] && process.argv[3].toLowerCase().trim();
if (!givenEnviroment || !allowedEnviroments.has(givenEnviroment)) {
  console.log(`No valid argument for enviroment; exiting...`);
  process.exit(1);
}



logs.push(`given app name: ${givenAppName}; enviroment: ${givenEnviroment}`);
logs.push(`dirname: ${__dirname}`);



function savelogs() {
  const deployLogsPath = path.join(__dirname, 'deploy-cloudfront-logs');
  if (!fs.existsSync(deployLogsPath)) {
    fs.mkdirSync(deployLogsPath);
  }

  const deployAppLogsPath = path.join(deployLogsPath, givenAppName);
  if (!fs.existsSync(deployAppLogsPath)) {
    fs.mkdirSync(deployAppLogsPath);
  }

  const deployAppEnvLogsPath = path.join(deployAppLogsPath, givenEnviroment);
  if (!fs.existsSync(deployAppEnvLogsPath)) {
    fs.mkdirSync(deployAppEnvLogsPath);
  }

  const contents = logs.join(`\n\n`);
  const timestamp = Date.now();
  const filename = `deploy-logs-${givenAppName}-${givenEnviroment}-${timestamp}.txt`;
  const filePath = path.join(deployAppEnvLogsPath, filename);
  const results = fs.writeFileSync(filePath, contents);
  console.log(`Logs saved\n`);

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
          logs.push('Successfully uploaded with params:' + (typeof data === 'object') ? JSON.stringify(data) : String(data));
          resolve(data);
        }
      });
    });
    promises.push(promise);
  }

  return Promise.all(promises);
}





async function deployProject(appName, env) {
  let appConfigs, deployConfig;
  try {
    appConfigs = require('./deploy-cloudfront.json');
    deployConfig = appConfigs[appName][env];
    if (!deployConfig) {
      throw new Error(`No deploy config defined for app ${appName} env ${env}; exiting...`);
    }
  }
  catch (err) {
    logs.push(String(err));
    savelogs();
    process.exit(1);
  }


  // determine if project is built
  logs.push(`checking if ${appName} is built...`);

  const projectDistRoot = path.join(__dirname, `/dist/${appName}`).replace(/\\/g, '/');
  const projectBuildFound = fs.existsSync(projectDistRoot);
  
  if (projectBuildFound) {
    logs.push(`found build for project "${appName}"; deleting old build and starting new build...`);
    try {
      logs.push(`attempting to delete dir: ${projectDistRoot}`);
      await fs_p.rm(projectDistRoot, { recursive: true, force: true });
      logs.push(`deleted dir ${projectDistRoot} successfully`);
    }
    catch (err) {
      logs.push(String(err));
      savelogs();
      process.exit(1);
    }
  }

  try {
    logs.push(`attempting to build ${appName} for env ${env}...`);
    const out = await exec(`npm run build-${appName}-${env}`).catch(e => { console.error(e); logs.push(String(e)); return e; });
    logs.push(String(out));
    out && out.stdout && logs.push(out.stdout);
    if (out && out.code && out.code === 1) {
      logs.push(`could not build ${appName}; exiting...`);
      savelogs();
      process.exit(1);
    }
  }
  catch (err) {
    logs.push(String(err));
    savelogs();
    process.exit(1);
  }

  logs.push(`${appName} is built, checking distribution...`);

  // check if distribution exists for the given app
  const cloudfrontId = deployConfig['cloudfront_distribution_id'];
  if (!cloudfrontId) {
    logs.push(`project "${appName}" does not have a cloudfront distribution associated to it...`);
    savelogs();
    process.exit(1);
  }

  logs.push(`project "${appName}" does have a cloudfront distribution associated to it. checking if project has bucket...`);

  // check if distribution exists for the given app
  const bucketOrigin = deployConfig['s3_bucket'];
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
    logs.push(String(error));
    savelogs();
    process.exit(1);
  }

  // now updats cloudfront distribution
  const cloudfrontClient = new AWS.CloudFront();

  const cloudfrontConfig = await cloudfrontClient.getDistributionConfig({ Id: cloudfrontId }).promise();
  logs.push(JSON.stringify(cloudfrontConfig));

  // cloudfrontConfig.DistributionConfig.Comment = `${appName} - ${env}`;

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
    logs.push(`attempting invalidation...`);
    let invalidaion;
    const invalidaionPaths = [`${oldOriginPath}/*`, `/index.html`, `/*`];
    try {
      const updateParams = {
        DistributionId: cloudfrontId,
        InvalidationBatch: {
          CallerReference: `${Date.now()}`,
          Paths: {
            Quantity: 3,
            Items: invalidaionPaths,
          }
        }
      };
      invalidaion = await cloudfrontClient.createInvalidation(updateParams).promise();
      logs.push(`invalidaion created: ${JSON.stringify(updateParams)}`);
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



deployProject(givenAppName, givenEnviroment);