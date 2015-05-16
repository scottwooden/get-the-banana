define([
  'collections/collections.master',
  'models/models.word'
], function(Master, Word){

  return Master.extend({

    model: Word,

  });

});