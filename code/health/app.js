/*******************************************************
 * service: health-check demo
 * module: top-level app.js
 * Mike Amundsen (@mamund)
 *******************************************************/

// base modules
var http = require('http');
var querystring = require('querystring');

/// internal modules
var representation = require('./representor.js');
var config = require('./config.js');

// connector modules
var home = require('./connectors/home.js');
var health = require('./connectors/health.js');
var utils = require('./connectors/utils.js');

var healthCheck = require('./components/health-check.js');

// shared vars
var root = '';
var port = (process.env.PORT || '8282');
var acceptType = 'text/html';
var contentType = 'text/html';
var htmlType = 'text/html';
var formType = 'application/x-www-form-urlencoded';
var csType = '';
var csAccept = '';

// routing rules
var reHome = new RegExp('^\/$','i');
var reHealth = new RegExp('^\/health\/.*','i');
var reFile = new RegExp('^\/files\/.*','i');

// request handler
function handler(req, res) {
  var segments, i, x, parts, rtn, flg, doc, url;

  // set local vars
  root = 'http://'+req.headers.host;
  csType = contentType;
  flg = false;
  file = false;
  doc = null;

  // rudimentary accept-header handling
  csAccept = req.headers["accept"];
  if(!csAccept || csAccept.indexOf(htmlType)!==-1) {
    csType = acceptType;
  }
  else {
    csType = csAccept.split(',')[0];
  }
  
  // parse incoming request URL
  parts = [];
  segments = req.url.split('/');
  for(i=0, x=segments.length; i<x; i++) {
    if(segments[i]!=='') {
      parts.push(segments[i]);
    }
  }
  
  // handle options call
  if(req.method==="OPTIONS") {
    sendResponse(req, res, "", 200);
    return;
  }

  // home handler
  if(reHome.test(req.url)) {
    flg = true;
    doc = home(req, res, parts, handleResponse);
  }

  // health handler
  if(reHealth.test(req.url)) {
    flg = true;
    doc = health(req, res, parts, handleResponse);
  }

  // file handler
  try {
    if(flg===false && reFile.test(req.url)) {
      flg = true;
      utils.file(req, res, parts, handleResponse);
    }
  }
  catch(ex) {}
  
  // final error
  if(flg===false) {
    handleResponse(req, res, utils.errorResponse(req, res, 'Not Found', 404));
  }
}

// handle response work
function handleResponse(req, res, doc) {
  var rtn;
  
  if(doc!==null) {
    if(doc.file===true) {
      rtn = doc.doc;
    }
    else {
      rtn = representation(doc.doc, csType, root);
    }
    sendResponse(req, res, rtn, doc.code, doc.headers);
  }
  else {
    sendResponse(req, res, 'Server Response Error', 500);
  }
}
function sendResponse(req, res, body, code, headers) {
  var hdrs;
  
  if(headers && headers!==null) {
    hdrs = headers;
  }
  else {
    hdrs = {}
  }
  if(!hdrs['content-type']) {
    hdrs['content-type'] = csType;
  }

  // always add CORS headers to support external clients
  hdrs["Access-Control-Allow-Origin"] = "*";
  hdrs["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS PATCH HEAD";
  hdrs["Access-Control-Allow-Credentials"] = true;
  hdrs["Access-Control-Max-Age"] = '86400'; // 24 hours
  hdrs["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

  res.writeHead(code, hdrs),
  res.end(body);
}

// wait for request
http.createServer(handler).listen(port);
console.log('registry service listening on port '+port);

// EOF

