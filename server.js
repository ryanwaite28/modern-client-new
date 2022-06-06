// Install express server
const express = require('express');
const secure = require('express-force-https');
const path = require('path');

const app = express();
app.use(secure);

const appName = process.argv[2];

const isAppNameValid = [
  'modern',
  'deliverme',
  'carmaster',
].includes(appName);

if (!isAppNameValid) {
  console.log(`${appName} is invalid...`);
  process.exit(1);
}

const appDistRoot = __dirname + `/dist/${appName}`;
console.log(`app dist root: ${appDistRoot}`);

// Serve only the static files form the dist directory
app.use(express.static(appDistRoot));

app.get('*', function(req, res) {
  res.sendFile(`${appDistRoot}/index.html`);
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});


/**
 * Found help at:
 * ---
 * https://itnext.io/how-to-deploy-angular-application-to-heroku-1d56e09c5147
 * https://medium.com/@avisek.cool/deploy-angular-7-app-on-heroku-quick-and-easy-way-b739001ac90f
 */