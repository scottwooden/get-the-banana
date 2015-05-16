module.exports.supports3d = (function() {

  var el = document.createElement('p'),
      has3d,
      transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
      };

  // Add it to the body to get the computed style.
  document.body.insertBefore(el, null);

  for (var t in transforms) {
      if (el.style[t] !== undefined) {
          el.style[t] = "translate3d(1px,1px,1px)";
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
  }

  document.body.removeChild(el);

  return (has3d !== undefined && has3d.length > 0 && has3d !== "none");

}());

module.exports.supportsCanvas = (function(){

  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));

}());

module.exports.hasLocalStorage = (function(){

  var mod = 'modernizr';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch(e) {
    return false;
  }

}());