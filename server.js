const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const process = require('process');
const fs = require('fs');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const logger = require('morgan');

let app = express();

// middleware
app.use(helmet());
// Body Parser Middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());
app.use(compression());
// app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => express.static('public/'));

//files
app.get('*/js/ga.js', function (req, res, next) {
	let options = {
		root: __dirname + '/public/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	let fileName = '/js/ga.js';
	res.sendFile(fileName, options, function (err) {
		if (err) {
			next(err);
		} else {
			// console.log('Sent:', fileName);
		}
	});
});
app.get('/resume', function (req, res, next) {
	let options = {
		root: __dirname + '/public/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	let fileName = '/misc-pages/resume.pdf';
	res.sendFile(fileName, options, function (err) {
		if (err) {
			next(err);
		} else {
			// console.log('Sent:', fileName);
		}
	});
});

//PORT routes
app.use('/admin', express.static('public/portfolio/admin'));

//MISC routes
app.use('/internet', express.static('public/misc-pages/internet'));
app.use('/erc', express.static('public/misc-pages/effective-rate'));

//api stuff
app.use('/browser-refresh-url', function (req, res) {
	res.send(process.env.BROWSER_REFRESH_URL);
});
app.post('/send-email', (req, res) => {
	console.log(req.body);
	let output = `
    <p>Someone is requesting to get in touch with you through the portfolio get in touch form.</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
	  <li>Phone: ${req.body.phone}</li>`;
	if (req.body.subscription) {
		output += `<li>This person also wants to join the email list!!</li>`;
	}
	output += `</ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

	const sgTransport = require('nodemailer-sendgrid-transport');

	let options = {
		service: 'SendGrid',
		auth: {
			api_user: 'adappt-email-server',
			api_key: 'server4adapptDOTtech'
		}

	}

	let client = nodemailer.createTransport(sgTransport(options));

	// var client = nodemailer.createTransport({

	// });

	let email = {
		from: 'contact@adappt.tech',
		to: 'contact@adappt.tech',
		subject: 'Portfolio Contact Form Response',
		text: 'Hello world?',
		html: output
	};

	client.sendMail(email, function (err, info) {
		if (err) {
			console.log(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
});

//handle all other 404s
app.use('/404', express.static('public/misc-pages/404'));
app.all('*', function (req, res) {
	res.redirect('/404');
});

const opn = require('opn');
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`);
	if (process.send) {
		process.send('online'); //setup browser refresh
	}

	// opn(`http://localhost:${PORT}`);

});