const express = require('express');
const http = require('http');
const watch = require('watch');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const process = require('process');
const fs = require('fs');

// Get content from file
var config = fs.readFileSync('config/config.json');
// Define to JSON type
var configJSON = JSON.parse(config);

let port = configJSON.port;

let app = express();

// middleware
app.use(helmet());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(compression());

const webRoot = path.join(__dirname, 'public');

app.use(favicon(path.join(webRoot + '/img/favicon.png')));

if (configJSON.underMaintenance) {
	console.log('MAINTENANCE MODE ENABLED,..');
	app.use('/', express.static('public/maintenance'));
	app.use('/temp', express.static('public'));
} else {
	//site is NOT under maintenance. normal operation
	app.use('/', express.static('public'));
}

//redirect on 404s
app.use('*', function (req, res) {
	res.redirect("/404");
});
app.use('/404', express.static('public/404'));

//handle dynamic browser refresh crap
app.use('/browser-refresh-url', function (req, res) {
	res.send(process.env.BROWSER_REFRESH_URL);
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}\n`);
	if (process.send) {
		process.send('online'); //setup browser refresh
	}
});