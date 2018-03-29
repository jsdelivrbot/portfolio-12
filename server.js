const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');

let app = express();

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static('public'));

const port = 8080;

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}\n`);
});
