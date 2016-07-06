'use strict'
var server = require('./server.js'),
  router = require('./router.js'),
  reqHandlers = require('./reqHandlers.js');
var handler = new Object();

for(let key in reqHandlers) {
  handler[key] = reqHandlers[key];
}

server.start(router, handler);