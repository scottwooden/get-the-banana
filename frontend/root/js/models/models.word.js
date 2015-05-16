define([
  'models/models.master'
], function(Master){

  return Master.extend({

    idAttribute: "title",

    urlRoot: "/api/search",

    checkLink: function(string){

      if(!string) return;

      var regex = new RegExp('\\b' + string + '\\b', 'i');

      var matches = _.filter(this.get('links'), function(link){
        return regex.test(link);
      });

      if(!matches.length) return;

      if(matches.length == 1) return _.first(matches);

      console.log("matches", matches);

      regex.compile('^' + string + '$', 'i');

      var match = _.find(matches, function(match){
        return regex.test(match);
      });

      return match;

    }

  });

});