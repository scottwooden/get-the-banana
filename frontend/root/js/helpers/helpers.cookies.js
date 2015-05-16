module.exports = (function(){

  return {

    set: function(key, value, options){

      options = options || {};

      var expires = "";

      if(options.days){
        var date = new Date();
        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }

      // TODO: encode value that gets stored in cookie

      document.cookie = key + "=" + JSON.stringify( value ) + expires + "; path=/";

    },

    get: function(key){

      key = key + "=";

      var ca = document.cookie.split(';'),
      val;

      for(var i=0; i<ca.length; i++) {

        var c = ca[i].trim();

        if( c.indexOf(key) === 0 )
          val = c.substring( key.length, c.length );

      }

      // TODO: decode value that gets retrieved from a cookie

      return JSON.parse( val );

    },

    clear: function(){

      document.cookie = null;

    }

  };

}());