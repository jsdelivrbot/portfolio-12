const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Get content from file
var config = fs.readFileSync('config/config.json');
// Define to JSON type
var configJSON = JSON.parse(config);

let port = configJSON.port;

let app = express();

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(compression());

const webRoot = path.join(__dirname, 'public');

app.use(favicon(path.join(webRoot + '/img/favicon.png')));

if (configJSON.underMaintenance) {
	app.use(express.static('public/maintenance'));
	app.use('/temp', express.static('public'));
} else {
	//site is NOT under maintenance. normal operation
	app.use(express.static('public'));
}

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}\n`);
});
