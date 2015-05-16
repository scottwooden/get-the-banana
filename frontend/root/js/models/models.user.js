define([
  'models/models.master',
  'collections/collections.words'
], function(Master, WordsCollection){

  return Master.extend({

  	urlRoot: "api/users",

    startWords: [
      'Fruit',
      'Tongan music notation',
      'Tractor',
      'Owl',
      'Spiderman',
      'Hackathon',
      'Buttocks',
      'Donkey',
      'Natural_History_Museum',
      'London_Underground',
      'Red',
      'North Pole',
      'Tyrannosaurus'
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

  });

});