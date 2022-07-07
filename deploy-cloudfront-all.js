const dotenv = require('dotenv');
dotenv.config();

const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);


const cli_call_list = [
  'node deploy-cloudfront.js modern',
  'node deploy-cloudfront.js deliverme',
  'node deploy-cloudfront.js carmaster',
];



const givenEnviroment = process.argv[2] && process.argv[2].toLowerCase().trim();

async function deploy() {
  console.log(`===== Begin Running Scripts =====`);

  for (const script_call of cli_call_list) {
    const useScriptCall = `${script_call} ${givenEnviroment}`;
    console.log(`Running "${useScriptCall}"`);

    const out = await exec(useScriptCall).catch(e => {
      console.error(e);
    });

    console.log({ out });
  }

  console.log(`===== End Running Scripts =====`);
}

deploy();