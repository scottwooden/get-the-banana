define([
  'models/models.master',
  'collections/collections.words'
], function(Master, WordsCollection){

  return Master.extend({

  	urlRoot: "api/users",

    startWords: [
      // 'Fruit',
      // 'Tractor',
      // 'Owl',
      // 'Hackathon',
      // 'Buttocks',
      // 'Donkey',
      // 'London Underground',
      // 'Red',
      'North Pole',
      // 'Tyrannosaurus'
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