/**************************************
 simple profile timer
 **************************************/

// holds the tracking values for this run
var config = require('./profile-config.js');

// increment request counter
exports.rate = function() {
  config.rate++;
} 

// increment error counter
exports.errors = function() {
  config.errors++;
}

// mark start of a timer
exports.start = function() {
  process.hrtime();
}

// mark end of timer (record in config)
exports.duration = function(start, url) {
  var average = 0;
  var measure = 0;
  var elapsed = 0;
  
  measure = process.hrtime(start);
  elapsed = format(measure);
  if(average === 0) {
    average = elapsed;
  }
  else {
    average = (average + elapsed)/2;
  }
  
  config.duration = record(
    config.duration,
    {"url":url,"req":elapsed,"avg":average}
  );
}

// compute data point to store
function record(array, item) {
  var f=false;
  
  for(i=0,x=array.length;i<x;i++) {
    if(array[i].url == item.url) {
      array[i] = item;
      f=true;
    }
  }
  if(f===false) {
    array.push(item);
  }
  return array;
}

// compute elapsed time (millisec)
function format(measure) {
  return (measure[0] * 1000) + (measure[1] / 1e6);
}
