// /app/index.js
'use strict';

// Set up ----------------------------------------------------------------------
var path = process.cwd();
var YelpHandler = require(path + '/app/controllers/yelpController.server.js');
var RsvpHandler = require(path + '/app/controllers/rsvpController.server.js');


// Main index function ---------------------------------------------------------
module.exports = function (app, passport) {

	// Server side controllers ---------------------------------------------- //
	var yelpHandler = new YelpHandler();
	var rsvpHandler = new RsvpHandler();


  // HOME PAGE (with login links) ----------------------------------------- //
	app.route('/')
		.get(function(req, res) {
			// var passedVariable = req.session.ysearch;
			// req.session.ysearch = null; // resets session variable
			// console.log('passed session', passedVariable);
			res.sendFile(path + '/views/index.html');
		});
  //var passedVariable = req.query.valid;

	// Error page - WIP
	app.route('/error')
		.get(function(req, res) {
			res.send('This is an error page');
		});


	// API CALLS ------------------------------------------------------------ //
	app.route('/api/search/:loc')
		.get(yelpHandler.search);

	app.route('/api/rsvp/:yid')
		.get(rsvpHandler.rsvp);

	app.route('/api/fetch/:yid')
		.get(rsvpHandler.fetch);


	// TWITTER -------------------------------------------------------------- //
	// A redirect to store the search term into sessions
	app.route('/auth/twitter/s/:yelpSearch')
		.get(function(req, res) {
			req.session.ysearch = req.params.yelpSearch;
			res.redirect('/auth/twitter');
		});

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', function(req, res, next) {
		passport.authenticate('twitter', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/error'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
					return res.redirect('/');
				//console.log('yelp search', req.session.ysearch);
	      //return res.redirect('/?search=' + req.session.ysearch);
	    });
		})(req, res, next);
		//passport.authenticate('twitter', {
    //  successRedirect: '/',
    //  failureRedirect: '/error')}
    });

};


// EOF -------------------------------------------------------------------------
