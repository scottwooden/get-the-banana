// Clamp an input value between two values
// Clamp value between two values
module.exports.clamp = function(value, min, max){
  return Math.max(min, Math.min(max, value));
};

// Get range between two numbers
module.exports.range = function(input, domain, range){
 return (input-domain[0])/(domain[1]-domain[0]) * (range[1]-range[0]) + range[0];
};

// Get values percentage between min and max (e.g value = 50, min = 0, max = 100, return 50)
module.exports.percentageRange = function(value, min, max) {
  return ((value-min)/(max-min)) * 100;
};