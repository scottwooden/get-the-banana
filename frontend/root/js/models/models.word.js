define([
  'models/models.master'
], function(Master){

  return Master.extend({

    idAttribute: "title",

    urlRoot: "/api/search",

    checkLink: function(string) {

      var regex = new RegExp(string, 'i');

      console.log("this.get('links')", this.get('links'));      

      return;


        var output = [];
        var cntObj = {};
        var array, item, cnt;
        // for each array passed as an argument to the function
        for (var i = 0; i < arguments.length; i++) {
            array = arguments[i];
            // for each element in the array
            for (var j = 0; j < array.length; j++) {
                item = "-" + array[j];
                cnt = cntObj[item] || 0;
                // if cnt is exactly the number of previous arrays, 
                // then increment by one so we count only one per array
                if (cnt == i) {
                    cntObj[item] = cnt + 1;
                }
            }
        }
        // now collect all results that are in all arrays
        for (item in cntObj) {
            if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
                output.push(item.substring(1));
            }
        }
        return(output); 

    }

  });

});