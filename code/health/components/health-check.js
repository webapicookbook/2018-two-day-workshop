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

// to get some machine stats
var os = require('os');

module.exports = main;

function main() {
  var data = [];
  
  data.push({uptime:os.uptime()});
  data.push({totalmem:os.totalmem()});
  data.push({freemem:os.freemem()});
  data.push({loadavg:os.loadavg()});
  data.push({cpus:os.cpus()});
  
  rtn = data;
  return rtn;
}

// EOF

