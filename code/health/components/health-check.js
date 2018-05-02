/*******************************************************
 * HealthCheck module
 * middleware component (server)
 * Mike Amundsen (@mamund)
 *
 * interesting reading:
 * http://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html
 * http://www.brendangregg.com/usemethod.html
 * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/
 * https://medium.com/devopslinks/how-to-monitor-the-sre-golden-signals-1391cadc7524
 * https://www.weave.works/blog/the-red-method-key-metrics-for-microservices-architecture/
 *******************************************************/

var storage = require('./../storage.js');
var utils = require('./../connectors/utils.js');
var profileConfig = require('./../profile-config.js');

// to get some machine stats
var os = require('os');

module.exports = main;

function main() {
  var data = [];
  
  // service values
  data.push({requestRate:profileConfig.rate});
  data.push({requestErrors:profileConfig.errors});
  data.push({requestDuration:profileConfig.duration});
  
  // machine values
  data.push({uptime:os.uptime()});
  data.push({totalmem:os.totalmem()});
  data.push({freemem:os.freemem()});
  data.push({loadavg:os.loadavg()});
  
  cpus = os.cpus();
  for(i=0,x=cpus.length;i<x;i++) {
    data.push({cpu:cpus[i]});
  }
  
  return data;
}

// EOF

