/*******************************************************
 * service: healthcheck demo
 * module: home connector
 * Mike Amundsen (@mamund)
 *******************************************************/

// handles HTTP resource operations 
var wstl = require('./../wstl-module.js');
var utils = require('./utils.js');

var gTitle = "HealthCheck Demo";

module.exports = main;

function main(req, res, parts, respond) {

  switch (req.method) {
  case 'GET':
    sendPage(req, res, respond);
    break;
  default:
    respond(req, res, utils.errorResponse(req, res, 'Method Not Allowed', 405));
    break;
  }
}

function sendPage(req, res, respond) {
  var doc, coll, root, data, related, content;

  root = 'http://'+req.headers.host;
  coll = [];
  data = []; 
  related = {};
  content = "";
  
  coll = wstl.append({name:"home",href:"/",rel:["self", "home", "collection"], root:root},coll);
  coll = wstl.append({name:"healthLink",href:"/health/",rel:["health", "healthlink"], root:root},coll);
  
  content =  '<div>';
  content += '<h2>HealthCheck</h2>';
  content += '<p>Simple health-check demo server</p>';
  content += '</div>';
  
  // compose graph 
  doc = {};
  doc.title = gTitle;
  doc.data =  data;
  doc.actions = coll;
  doc.content = content;
  doc.related = related;

  // send the graph
  respond(req, res, {
    code : 200,
    doc : {
      home : doc
    }
  });
  
}

// EOF

