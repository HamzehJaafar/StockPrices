'use strict';
var express = require('express')
	, logger = require('morgan')
	, app = express();
var bodyParser = require('body-parser');
var path = require('path');
var crypto = require('crypto');
var mysql = require('mysql');
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
/* Create Salt */
var genRandomString = function (length) {
	return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};
/* Hash password with sha512 */
var sha512 = function (password, salt) {
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt
		, passwordHash: value
	};
};
/* Generate hash for storage in database */
function saltHashPassword(userpassword) {
	var salt = genRandomString(16); //Gives salt of length 16
	var passwordData = sha512(userpassword, salt);
	//console.log('UserPassword = ' + userpassword);
	//console.log('Passwordhash = ' + passwordData.passwordHash);
	//console.log('nSalt = ' + passwordData.salt);
	return passwordData;
}

function checkHashPassword(pass, salt) {
	var passwordData = sha512(pass, salt);
	return passwordData.passwordHash;
}
saltHashPassword('MYPASSWORD');

/* Server */
app.get('/investorsreport', function (req, res) {
	console.log('GET');
	var user = req.query.username;
	if (!user) {
		console.log("N/E");
	res.sendFile(__dirname + '/public/index.html');
	}
	else {
	}
});
app.get('/investorsreport/index.html', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/investorsreport/report.html', function (req, res) {
	try {
		var user = req.query.username;
		var company = req.query.company;
		console.log("Found params " + user + " " + company);
	}
	catch (e) {
		var user = '';
		var company = '';
		throw e;
	}
	if (!user || !company) {
		console.log("Params null");
	}
	else {
		console.log("UPDATING database query");
		
	}
	res.sendFile(__dirname + '/public/report.html');
});
app.get('/investorsreport/css/style.css', function (req, res) {
	res.sendFile(__dirname + '/public/css/style.css');
});
app.get('/investorsreport/img/profile.png', function (req, res) {
	res.sendFile(__dirname + '/public/img/profile.png');
});
app.get('/investorsreport/css/main.css', function (req, res) {
	res.sendFile(__dirname + '/public/css/main.css');
});
app.get('/investorsreport/js/index.js', function (req, res) {
	res.sendFile(__dirname + '/public/js/index.js');
});
app.get('/investorsreport/mapping.json', function (req, res) {
	res.sendFile(__dirname + '/public/mapping.json');
});
app.get('/investorsreport/css/report.css', function (req, res) {
	res.sendFile(__dirname + '/public/css/report.css');
});
app.get('/investorsreport/CReport.html', function (req, res) {
	res.sendFile(__dirname + '/public/CReport.html');
});
app.get('/investorsreport/js/compare.js', function (req, res) {
	res.sendFile(__dirname + '/public/js/compare.js');
});
app.get('/investorsreport/signup.html', function (req, res) {
	res.sendFile(__dirname + '/public/signup.html');
});
app.get('/investorsreport/about.html', function (req, res) {
	res.sendFile(__dirname + '/public/about.html');
});
app.get('/investorsreport/terms.html', function (req, res) {
	res.sendFile(__dirname + '/public/terms.html');
});
app.listen(process.env.PORT || 3001, function () {
	console.log('Listening on port' + (process.env.PORT || 3001))
});
