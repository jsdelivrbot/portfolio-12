const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Get content from file
var config = fs.readFileSync('config.json');
// Define to JSON type
var configJSON = JSON.parse(config);

let port = configJSON.port;

let app = express();

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());

if (configJSON.underMaintenance) {
	app.use(express.static('public/maintenance'));
} else {
	//site is not under maintenance. normal operation
	app.use(express.static('public'));
}

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}\n`);
});
