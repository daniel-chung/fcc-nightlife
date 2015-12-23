// /server.js
'use strict';

// Load packages ---------------------------------------------------------------
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
var morgan = require('morgan');
var bodyParser  = require('body-parser');


// Additional setup ------------------------------------------------------------
var routes = require('./app/index.js');
var port = process.env.PORT || 8080;
var app = express();
dotenv.load(); 					// What is this?
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // set up session
app.use(session({
	secret: 'bar$hopping$sessions',
	resave: true,
	saveUninitialized: true,
	httpOnly: false,
}));
app.use(bodyParser.urlencoded({  // get form data
  extended: true,
}));


// Passport setup --------------------------------------------------------------
require('./config/passport')(passport);
mongoose.connect(process.env.MONGO_URI);
//app.use(session({ secret: 'barhoppingleftandright' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// App links -------------------------------------------------------------------
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/css', express.static(process.cwd() + '/views/css'));


// Load routes -----------------------------------------------------------------
routes(app, passport);


// Start server ----------------------------------------------------------------
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});


// EOF -------------------------------------------------------------------------
