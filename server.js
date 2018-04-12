const express = require('express');
// const http = require('http');
// const watch = require('watch');
// const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
// const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const process = require('process');
const fs = require('fs');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');

// Get content from file
const config = fs.readFileSync('config/config.json');
// Define to JSON type
const configJSON = JSON.parse(config);

let port = configJSON.port;

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
let router = express.Router();
const webRoot = path.join(__dirname, 'public');

if (configJSON.underMaintenance) {
	console.log('\nMAINTENANCE MODE ENABLED...');
	app.use('/', express.static('public/misc-pages/maintenance'));
	app.use('/temp', express.static('public'));
} else {
	//site is NOT under maintenance. normal operation
	app.use('/', express.static('public'));
	app.use('/maintenance', express.static('public/misc-pages/maintenance'));
}
//normal routes
app.use('/port-film', express.static('public/misc-pages/port-film'));
app.use('/internet', express.static('public/misc-pages/internet'));

if (configJSON.deployMode) {
	console.log('\nDeploy mode ENABLED...');
	//redirect on 404s
	app.use('/404', express.static('public/misc-pages/404'));
	app.all('*', function(req, res) {
		res.redirect('/404');
	});
} else {
	console.log('\nDeploy mode DISABLED...');
	//handle dynamic browser refresh crap
	app.use('/browser-refresh-url', function(req, res) {
		res.send(process.env.BROWSER_REFRESH_URL);
	});
}

//email stuff
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.post('/send-email', (req, res) => {
	console.log(req.body);
	const output = `
    <p>Someone is requesting to get in touch with you through the portfolio get in touch form.</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: 'adappt.email.server@gmail.com', // generated ethereal user
			pass: 'ThisIsHowWeDoIt69' // generated ethereal password
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"Portfolio Contact Form Response" <contact@adappt.tech>', // sender address
		to: 'contact@adappt.tech', // list of receivers
		subject: 'Portfolio Contact Form Response', // Subject line
		text: 'Hello world?', // plain text body
		html: output // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent');

		res.send('Message Sent');

		//res.render(webRoot, { msg: 'Email has been sent' });
	});
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}\n`);
	if (process.send) {
		process.send('online'); //setup browser refresh
	}
});
