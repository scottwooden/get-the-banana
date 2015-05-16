var server = require('../server');
var mongoose = require('mongoose');
var _ = require('underscore');

var Question;

var addSchema = function(){

  var schema = new mongoose.Schema({
    "_id": String,
    "answers": [{"_id": String}]
  });

  schema.set("versionKey", false);

  schema.statics.getCounts = function(question, callback){

    var query = [
       { $unwind : "$answers" },
       { $group: { "_id": { "question": "$answers.question", "answer": "$answers.answer" }, answerCount: { $sum : 1}, "previous" : { $push: "$answers.previous" } } },
       { $unwind : "$previous" },
       { $group: { "_id": { "question": "$_id.question", "answer": "$_id.answer", "previous" : "$previous", answerCount: "$answerCount" }, previousCount: { "$sum" : 1 } } },
       { $group: { "_id": { "question": "$_id.question", "answer": "$_id.answer", answerCount: "$_id.answerCount" },  "previous" : { "$push": { "_id": "$_id.previous", count: "$previousCount" } } } },
       { $group: { "_id": "$_id.question", "count": { "$sum": "$_id.answerCount" }, "answers" : { "$push" : { "_id": "$_id.answer", "count": "$_id.answerCount", "previous": "$previous" } } } }
    ];

    // If question is set, filter to only results for this question
    if(question) query.splice(1, 0, { $match: { "answers.question": question } });

    mongoose.models.Client.aggregate(query, callback);
  
  };

  Question = mongoose.model("Question", schema);

};

var addRoutes = function(){

  server.route([
    {
      method: 'GET',
      path: '/question',
      handler: function(request, reply){

        // Find all questions
        // Using 'lean' forces mongoose to return a json object, not model instances
        Question.find().lean().exec(function(error, questions){

          if(error) return reply("Error finding questions");

          Question.getCounts(null, function(error, counts){

            if(error) return reply("Error finding counts");

            _.each(questions, function(question){

              var match = _.findWhere(counts, { _id: question._id });
              question.count = match ? match.count : 0;

              _.each(question.answers, function(answer){

                var answerMatch;

                if(match) answerMatch = _.findWhere(match.answers, { _id: answer._id });

                if(answerMatch){
                  answer.count = answerMatch.count;
                  answer.previous = answerMatch.previous;
                } else {
                  answer.count = 0;
                  answer.previous = [];
                }

              });

            });

            reply(questions);

          });

        });

      },
    },
    {
      method: "DELETE",
      path: "/question",
      handler: function(request, reply){

        // Delete all questions
        Question.remove(function(error, deleted){
          if(error) reply("Error deleting questions")
          console.log(deleted + " questions deleted");
          return reply("");
        }); 

      }
    }
  ]);

};

/* TEMP */
var createQuestions = function(){

  var questions = require('./../questions.json');

  for(var question in questions){
    Question.create(questions[question]);
  }

};

var initialize = function(){

  addSchema();
  addRoutes();

  createQuestions();

}();

module.exports = Question;




/* all questions and answers */
// db.clients.aggregate( [
// { $unwind : "$answers" }, 
// { $group: {"_id": "$answers.question", count: { $sum: 1 }, answers: { $push: { "answer": "$answers.answer", "question": "$answers.question"} } } },
// { $unwind : "$answers" }, 
// { $group: { "_id": {"answer":"$answers.answer", "question":"$answers.question", "totalCount": "$count"}, count: { $sum: 1 } } },
// { $group: { "_id": {"_id": "$_id.question", "count": "$_id.totalCount"}, "answers": { $push : {"answer": "$_id.answer", count: "$count", percentage: { $divide: ["$count", "$_id.totalCount"] } } } } },
// { $project: { "_id": 0, "question": "$_id._id", count: "$_id.count", answers: "$answers" } }
// ])

// /* specific question */
// db.clients.aggregate( [
// { $unwind : "$answers" },
// { $match: { "answers.question": "Who will you vote for in May 2050?" } }, 
// { $group: {"_id": "$answers.question", count: { $sum: 1 }, answers: { $push: { "answer": "$answers.answer", "question": "$answers.question"} } } },
// { $unwind : "$answers" }, 
// { $group: { "_id": {"answer":"$answers.answer", "question":"$answers.question", "totalCount": "$count"}, count: { $sum: 1 } } },
// { $group: { "_id": {"_id": "$_id.question", "count": "$_id.totalCount"}, "answers": { $push : {"answer": "$_id.answer", count: "$count", percentage: { $divide: ["$count", "$_id.totalCount"] } } } } },
// { $project: { "_id": 0, "question": "$_id._id", count: "$_id.count", answers: "$answers" } }
// ])