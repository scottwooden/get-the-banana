var local = require('helpers/helpers.localstorage');
var cookies = require('helpers/helpers.cookies');

module.exports = (function(){

  var storage = {

    set: function(key, value, options){

      this.storageMethod.set(key, value, options);

    },

    get: function(key){

      return this.storageMethod.get(key);

    },

    clear: function(){

      this.storageMethod.clear();

    }

  };

  try {

    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    storage.storageMethod = local;

  } catch(e) {

    storage.storageMethod = cookies;

  }

  return storage;

}());