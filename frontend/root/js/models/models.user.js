define([
  'models/models.master',
  'collections/collections.words'
], function(Master, WordsCollection){

  return Master.extend({

  	urlRoot: "api/users",

    defaults: {
      score: 0
    },

    startWords: [
      'Fruit',
      'Tractor',
      'Owl',
      'Hacker',
      'Buttocks',
      'Donkey',
      'London Underground',
      'Red',
      'North Pole',
      'Tyrannosaurus',
    ],

    initialize: function(){

      this.words = new WordsCollection();

      this.words.add({
        title: _.sample(this.startWords)
      });

      this._super();

    },

    getTrail: function(){

      return this.words.pluck('title');

    },

    getCurrentWord: function(){

      return this.words.last();

    },
    
  });

});