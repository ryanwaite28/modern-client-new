// Install express server
const express = require('express');
const secure = require('express-force-https');
const path = require('path');

const app = express();
app.use(secure);

const appName = 'modern-client';

// Serve only the static files form the dist directory
app.use(express.static(__dirname + `/dist/${appName}`));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, `./dist/${appName}/index.html`));
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