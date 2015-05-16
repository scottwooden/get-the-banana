var fs = require('fs');
var colors = require('colors');

/* Mongoose */ 
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/art_hackathon');

/* Hapi */
var server = require('./server');

/* Models */
// var Client = require('./models/client');

var initialize = function(){

  // Start server
  server.start();

  console.log(colors.green("Started server"));

}();
