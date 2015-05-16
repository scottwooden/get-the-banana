define(function(){

  return (function(){

    return {

      set: function(key, value, options){

        try {

          localStorage.setItem( key, JSON.stringify(value) );

        } catch (e) {

          this.error(e, key, value);

        }

      },

      get: function(key){

        try {

          return JSON.parse( localStorage.getItem( key ) );

        } catch (e) {

          this.error(e, key, value);

        }

      },

      clear: function(){

        try {

          localStorage.clear();

        } catch (e) {

          this.error(e, key, value);

        }

      }

    };

  }());

});