var server = require('../server');
var io = require('../io');
var mongoose = require('mongoose');
var _ = require('underscore');

var Client;

var addSchema = function(){

  var schema = new mongoose.Schema({
    "active": {type: Boolean, default: true},
    "createdAt": {type: Date, default: new Date()},
    "updatedAt": {type: Date, default: new Date()},
    "color": {type: String, default: ""},
    "answer": {type: String, default: ""},
    "answers": [{}]
  });

  // Disable version key as only one user can modify a client
  schema.set("versionKey", false);

  schema.statics.getActive = function(callback){

    return this.find({active: true}, callback);

  };

  // Static function for checking for and updating idle clients
  schema.statics.updateIdle = function(callback){

    var self = this;

    // Set expiry date for clients (5 mins ago)
    var expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() - 1);

    // Query to be run
    var query = {active: true, updatedAt: {$lt: expiry}};

    // Delete active & expired models
    this.remove(query, function(error, changed){

      if(error) console.log("Error checking for idle clients");

      if(changed){

        self.getActive(function(error, clients){
          if(error) console.log("Error getting active clients");
          io.emit("client:sync", clients);
        });

        self.getStats(function(stats){
          io.emit('stats:update', stats);
        });

      }

    });

  };

  // Return stats about visualisation usage
  schema.statics.getStats = function(callback){

    var stats = { active: 0, today: 0, all: 0 };

    // Only run callback once all queries have finished
    callback = _.after(3, callback);

    // Count all active clients
    this.count(function(error, count){
      if(error) console.log("Error counting all clients");
      stats.all = count;
      callback(stats);
    });

    // Start of current day
    var startDate = new Date();
    startDate.setHours(0,0,0,0);

    // Count clients from today
    this.count({ updatedAt: { "$gte": startDate, "$lt": new Date() } }, function(error, count){
      if(error) console.log("Error counting clients from today");
      stats.today = count
      callback(stats);
    });

    // Count active clients
    this.count({ active: true }, function(error, count){
      if(error) console.log("Error counting active clients");
      stats.active = count;
      callback(stats);
    });

  };

  Client = mongoose.model("Client", schema);

};

var addRoutes = function(){

  server.route([
    {
      method: 'GET',
      path: '/client/{id?}',
      handler: function(request, reply){

        // Get id from request params
        var id = request.params.id;

        if(!id){

          // If no id, return all clients
          Client.find({active: true}, function(error, clients){
            if(error) return reply("Error getting clients").code(500);
            return reply(clients);
          });

        } else {
      
          // Else find client where _id is id
          Client.findOne({"_id": id}, function(error, client){
            if(error) return reply("Error finding client").code(500); 
            if(!client) return reply("Client does not exist").code(404);
            return reply(client);
          });
          
        }

      }
    },
    {
      method: 'POST',
      path: '/client',
      handler: function(request, reply){

        var data = request.payload;
        if(!data) return reply("No data provided").code(500);
        
        Client.create(data, function(error, client){
          
          if(error) return reply("Error creating new Client").code(500);
          if(!client) return reply("Client does not exist").code(404);
          io.emit('client:update', client);
          reply(client);

          Client.getStats(function(stats){
            io.emit('stats:update', stats);
          });

        });

      }
    },
    {
      method: 'PUT',
      path: '/client/{id}',
      handler: function(request, reply){

        var data = request.payload;
        if(!data) return reply("No data provided").code(500);
        
        var id = request.params.id;
        delete data._id;

        // Update 'updatedAt' at date
        data.updatedAt = new Date();

        Client.findByIdAndUpdate(id, data, function(error, client){

          if(error) return reply("Error updating Client").code(500);

          if(!client) return reply("Client does not exist").code(404);

          if(data.active){

            io.emit("client:update", client);
            
          } else {

            io.emit("client:update", client);
            io.emit("client:remove", id);

            Client.getStats(function(stats){
              io.emit('stats:update', stats);
            });
            
          }

          var question = _.last(data.answers).question;

          mongoose.models.Question.getCounts(question, function(error, counts){
            io.emit("questions:update", _.first(counts));
          });
          
          return reply({});      

        });

      }
    },
    {
      method: 'PATCH',
      path: '/client/{id}',
      handler: function(request, reply){

        var data = request.payload;
        if(!data) return reply("No data provided").code(500);

        var id = request.params.id;

        // Update 'updatedAt' at date
        data.updatedAt = new Date();

        Client.findByIdAndUpdate(id, data, function(error, client){

          if(error) return reply("Error updating Client").code(500);

          if(!client) return reply("Client does not exist").code(404);

          // Add id to data as to merge with existing model
          data._id = id;

          io.emit("client:update", data);
          
          return reply({});      

        });

      }
    },
    {
      method: "DELETE",
      path: "/client/{id}",
      handler: function(request, reply){

        var id = request.params.id;

        if(!id) return reply("No id provided").code(404);
      
        // Delete specified client
        Client.findByIdAndRemove(id, function(error, deleted){

          if(error) return reply("Error deleting client " + id).code(500);
          // if(!deleted) return reply("Client does not exist").code(404);

          io.emit("client:remove", id);
          reply("");
          
          Client.getStats(function(stats){
            io.emit('stats:update', stats);
          });

        }); 

      }
    },
    {
      method: "DELETE",
      path: "/client",
      handler: function(request, reply){

        // Delete all clients
        Client.remove(function(error, deleted){

          if(error) return reply("Error deleting clients").code(404);
          return reply("");

        }); 

      }
    },
    {
      method: 'GET',
      path: '/stats',
      handler: function(request, reply){

        Client.getStats(function(stats){
          reply(stats);
        });

      }
    }
  ]);

};

var initialize = function(){

  addSchema();
  addRoutes();

}();

module.exports = Client;