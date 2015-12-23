// /app/controllers/yelpController.server.js
'use strict';

// Set up ----------------------------------------------------------------------
var Yelp = require('yelp');


// Main export class -----------------------------------------------------------
function YelpHandler () {

  // Search method -------------------------------------------------------- //
  this.search = function (req, res) {
    var yelp = new Yelp({
  		consumer_key:    process.env.YELP_CONSUMER_KEY,
  	  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  	  token:           process.env.YELP_TOKEN,
  	  token_secret:    process.env.YELP_TOKEN_SECRET,
  	})
  	yelp.search({
      category_filter: 'bars',
      location: req.params.loc,
      limit: 20
     })
  		.then(function (data) {
        res.json(data);
  		})
  		.catch(function (err) {
  		  console.error(err);
  		});
  };

};


// Export the handler class ----------------------------------------------------
module.exports = YelpHandler;


// EOF -------------------------------------------------------------------------
