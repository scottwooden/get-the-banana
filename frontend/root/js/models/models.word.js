define([
  'models/models.master'
], function(Master){

  return Master.extend({

    idAttribute: "title",

    urlRoot: "/api/search"

  });

});