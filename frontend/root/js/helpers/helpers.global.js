module.exports.validateEmail = function(email_address){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email_address);
};

module.exports.serializeObject = function(form){
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
};

// Color Range
/* Usage:
  GWIWIDGET.Helpers.colorRange({
    colours: [{r:202,g:3,b:123,pos:0}, {r:61,g:149,b:214,pos:100}],
    value: GWIWIDGET.Helpers.randomInt(0,100),
    total: 100,
    asObject: true, // if you want object returned
    opacity: 0.5
  });
*/
module.exports.colorRange = function(options) {

  var totalColours = options.colours.length,
    currentPositionMin = 0,
    currentPositionMax = totalColours > 2 ? options.total / totalColours : options.total, r, g, b;

  for(var i = 0; i < totalColours-1; i ++){

    if(options.value >= (options.colours[i].pos || 0) && options.value <= (options.colours[i+1].pos || 100)){
      r = GWIWIDGET.Helpers.Interpolate(options.colours[i].r, options.colours[i+1].r, currentPositionMax, options.value);
      g = GWIWIDGET.Helpers.Interpolate(options.colours[i].g, options.colours[i+1].g, currentPositionMax, options.value);
      b = GWIWIDGET.Helpers.Interpolate(options.colours[i].b, options.colours[i+1].b, currentPositionMax, options.value);
      break;
    }

    currentPositionMax+=currentPositionMax;

  }

  if(options.asObject){
    return {r:r,g:g,b:b};
  }else{
    return "rgba(" + r + "," + g + "," + b + "," + (options.opacity || "1") + ")";
  }
};

module.exports.interpolate = function(start, end, steps, count) {
  var s = start,
    e = end,
    final = s + (((e - s) / steps) * count);
  return Math.floor(final);
};

// Set up an ajax pool, this allows you to keep track of ajax requests and abort all if necessary.
module.exports.setUpAjaxPool = function(){
  $.xhrPool = [];
  $.xhrPool.abortAll = function() {
    $(this).each(function(idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length = 0;
  };

  $.ajaxSetup({
    beforeSend: function(jqXHR) {
        $.xhrPool.push(jqXHR);
    },
    complete: function(jqXHR) {
      var index = _.indexOf($.xhrPool, jqXHR);
      if (index > -1) {
          $.xhrPool.splice(index, 1);
      }
    }
  });
};
