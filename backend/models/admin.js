var server = require('../server');

var Client = require('./client');
var Question = require('./question');

var csv = require('csv');
var _ = require('underscore');

server.route([
  {
    method: 'GET',
    path: '/admin/download',
    handler: function(request, reply){

      var data = [];

      // Get all question _id's (question title)
      Question.distinct("_id", function(error, questions){

        // Add 'User' heading
        questions.unshift("User");

        // Push into array as heading row
        data.push(questions);

        // 
        Client.find(function(error, questions){

          questions = _.map(questions, function(question, i){
            var array = _.pluck(question.answers, "answer");
            array.unshift(i + 1);
            return array;
          });

          data = data.concat(questions);

          csv.stringify(data, function(error, formattedCsv){
            reply(formattedCsv).header('Content-Type', 'application/octet-stream');
          })


        });

      });

    }
  },
  {
    method: 'POST',
    path: '/admin/upload',
    handler: function(request, reply){

    }
  }
]);