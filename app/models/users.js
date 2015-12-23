// app/models/user.js
'use strict';

// Set up ----------------------------------------------------------------------
var mongoose = require('mongoose');


// Mongoose schema -------------------------------------------------------------
var userSchema = mongoose.Schema({
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    bars: Array
});


// Export the handler class ----------------------------------------------------
module.exports = mongoose.model('User', userSchema);


// EOF -------------------------------------------------------------------------
