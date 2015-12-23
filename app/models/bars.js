// app/models/bars.js
'use strict';

// Set up ----------------------------------------------------------------------
var mongoose = require('mongoose');


// Mongoose schema -------------------------------------------------------------
var barSchema = mongoose.Schema({
    barId : String,
    rsvps  : Array,
});


// Export the handler class ----------------------------------------------------
module.exports = mongoose.model('Bar', barSchema);


// EOF -------------------------------------------------------------------------
