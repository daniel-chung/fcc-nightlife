// /app/controllers/rsvpController.server.js
'use strict';

// Set up ----------------------------------------------------------------------
var Bars = require('../models/bars.js');
var Users = require('../models/users.js');


// Main export class -----------------------------------------------------------
function RsvpHandler () {

  // Rsvp method ---------------------------------------------------------- //
  this.rsvp = function (req, res) {
    //Twitter login if not signed in
    if(typeof req.user === 'undefined'){
      res.json({login: false});
      //console.log(window.location.origin);
      //window.location.replace(...)
      //res.redirect('/auth/twitter');
    }

    //Otherwise simple rsvp
    else {
      var user_id = req.user._id;
      var y_id = req.params.yid;

      Bars.findOne (
        { barId: y_id },
        function (err, bar) {
          if (err)        throw err;
          else if (bar)   updateBarInfo(bar);
          else            addNewBar();
        }
      );

      function updateBarInfo(bar) {
        var currUserPos = bar.rsvps.indexOf(user_id);
        if (currUserPos > -1) var cond = { $pull: { rsvps : user_id } };
        else                  var cond = { $push: { rsvps : user_id } };

        Bars.findOneAndUpdate(
          { barId: y_id },
          cond,
          { new: true },
          function updateBarCallBack(err, barUpdate) {
            //console.log('barUpdate', barUpdate);
            res.json({
              rsvps: barUpdate.rsvps.length,
              login: true,
            });
          });

      };

      function addNewBar() {
        var newBar = new Bars();
        newBar.barId = y_id;
        newBar.rsvps = [user_id];
        newBar.save(function(err) {
          if (err)
            throw err;
          res.json({
            rsvps: newBar.rsvps.length,
            login: true,
          });
        });
      };
    }

  };  // End rsvp method -------------------------------------------------- //


  // Fetch method --------------------------------------------------------- //
  this.fetch = function (req, res) {
    var y_id = req.params.yid;

    Bars.findOne (
      { barId: y_id },
      function (err, bar) {
        if (err)        throw err;
        else if (bar)   res.json({rsvps: bar.rsvps.length});
        else            res.json({rsvps: 0});
      }
    );

  };  // End fetch method ------------------------------------------------- //

};


// Export the handler class ----------------------------------------------------
module.exports = RsvpHandler;


// EOF -------------------------------------------------------------------------
