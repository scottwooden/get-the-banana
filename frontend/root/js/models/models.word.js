define([
  'models/models.master'
], function(Master){

  return Master.extend({

    urlRoot: "/backend/search",

    url: function(){

      return this.urlRoot + "/" + this.get('title');

    },

    checkLink: function(string){

      if(!string) return;

      var regex = new RegExp('\\b' + string + '\\b', 'i');

      var matches = _.filter(this.get('links'), function(link){
        return regex.test(link);
      });

      if(!matches.length) return;

      if(matches.length == 1) return _.first(matches);

      regex.compile('^' + string + '$', 'i');

      var match = _.find(matches, function(match){
        return regex.test(match);
      });

      return match;

    },

    getHint: function(){

      var shortLinks = _.filter(this.get("links"), function(link){
        return link.match(/\S+/g).length <= 3;
      });

      if(!shortLinks.length) shortLinks = this.get("links");

      var word = _.sample(shortLinks);

      word = word.substring(0, Math.floor(word.length * 0.75));

      word += "...";

      return word;

    },

    preloadImage: function(){

      var deferred = $.Deferred();

      var img = new Image();
     
      img.onload = img.onerror = function(){
        deferred.resolve();
      };

      img.src = this.get('image');

      return deferred;

    }

  });

});