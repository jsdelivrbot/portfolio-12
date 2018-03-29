console.log('\nLoading Server');

const PORT = 8080;
// TODO 15 horsefeathers

const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');

// create express app
const app = express();

const webRoot = path.join(__dirname, 'public');

// have express app use middleware
app.use(favicon(path.join(webRoot, 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false })); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(helmet());

//TODO 7 add course CRUD
//TODO 9 spike solution for MongoDB CRUD,
//       admin console
//       mongoose, crest

//C)reate
//TODO 13 mongo
app.post('/api/v1/:courseId', function(req, res) {
	const courseId = req.params.courseId;
	res.status(404).sendFile(path.join(webRoot, '404.html'));
});

//R)ead
//TODO 10 mongo
app.get('/api/v1/:courseId/:assignmentId', function(req, res) {
	const courseId = req.params.courseId;
	const assignmentId = req.params.assignmentId;
	console.log(courseId, assignmentId);
	res.status(404).sendFile(path.join(webRoot, '404.html'));
});

//U)pdate
//TODO 12 mongo
app.put('/api/v1/:courseId/:assignmentId', function(req, res) {
	const courseId = req.params.courseId;
	const assignmentId = req.params.assignmentId;
	res.status(404).sendFile(path.join(webRoot, '404.html'));
});

//D)elete
//TODO 11 mongo
app.delete('/api/v1/:courseId/:assignmentId', function(req, res) {
	const courseId = req.params.courseId;
	const assignmentId = req.params.assignmentId;
	res.status(404).sendFile(path.join(webRoot, '404.html'));
});

app.use(express.static(webRoot));
app.get('*', (req, res) => {
	res.status(404).sendFile(path.join(webRoot, '404.html'));
});

const port = process.argv[2] || process.env.PORT || PORT;
const server = app.listen(port, null, null, () =>
	console.log(`\nServer listening on server: ${server.address().port}`)
);

function gracefulShutdown() {
	console.log('\nStarting Shutdown');
	server.close(() => console.log('\nShutdown Complete'));
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

// process.stdout.write()
// process.argv
