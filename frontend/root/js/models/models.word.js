define([
  'models/models.master'
], function(Master){

  return Master.extend({

    idAttribute: "title",

    urlRoot: "/api/search",

    checkLink: function(string) {

      var regex = new RegExp('\\b' + string + '\\b', 'i');

      var matches = _.filter(this.get('links'), function(link){
        return regex.test(link);
      });

      if(!matches.length || matches.length > 1) return false;

      return _.first(matches);

    }

  });

});