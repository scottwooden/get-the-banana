var colors = require('colors');
var request = require('request');
var _ = require('underscore');
var Q = require('q');

/* Mongoose */ 
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/art_hackathon');

/* Hapi */
var server = require('./server');


var baseUrl = "http://en.wikipedia.org/w/api.php?";

var defaults = {
  format: "json",
  action: "query"
};

server.route({
  method: "GET",
  path: "/api/search/{title}",
  handler: function(req, reply){

    getPage(req.params.title).then(function(data){
      return reply(data);
    });

    return;

  }
});


var getPage = function(title){

  var deferred = Q.defer();

  var promises = [];

  promises.push(getInfo(title));
  promises.push(getLinks(title));

  Q.all(promises).then(function(data){

    data = _.reduce(data, function(object, value, key){
      return _.extend(object, value);
    }, {});

    return deferred.resolve(data);

  });

  return deferred.promise;

};

var getInfo = function(title){

  var params = _.extend({}, defaults, {
    prop: "info|pageimages",
    inprop: "displaytitle",
    piprop: "original",
    titles: title,
    redirects: ""
  });

  var deferred = Q.defer();

  request(baseUrl, { qs: params, json: true }, function(err, response, body){

    if(err) throw(err);

    // if(!_.isEmpty(body.query.pages)) // No results

    var page = _.first(_.values(body.query.pages));

    var data = { title: page.displaytitle };

    if(page.thumbnail) data.image = page.thumbnail.original;
    
    deferred.resolve(data);
    
  });

  return deferred.promise;

};

var getLinks = function(title){

  var params = _.extend({}, defaults, {
    titles: title,
    prop: "links",
    plnamespace: 0, // Only get links from main content
    pllimit: 500, // Ammount of results to load
    redirects: ""
  });

  var deferred = Q.defer();

  var links = [];

  var load = function(resolve, plcontinue){

    if(plcontinue) params.plcontinue = plcontinue;

    request(baseUrl, { qs: params, json: true }, function(err, response, body){

      if(err) throw(err);
      // if(!_.isEmpty(body.query.pages)) // No results

      var page = _.first(_.values(body.query.pages));

      // If links returned, concat into links array
      if(page.links.length){

        var titles = _.pluck(page.links, 'title');
        links = links.concat(titles);

      }

      if(body['query-continue']){

        // If continue value is provided, make another request with this value
        var plcontinue = body['query-continue'].links.plcontinue;
        return load(resolve, plcontinue);

      } else {
        // Else resolve promise and pass data
        deferred.resolve({ links: links });
      }

    });

  };

  load();

  return deferred.promise;

};

var getGoogleImage = function(title){

  // var params = {
  //   tbm: 'isch',
  //   ''
  // }

  // var baseUrl = https://www.google.co.uk/search?q=bird&tbm=isch

};

/* Models */
// var Client = require('./models/client');
