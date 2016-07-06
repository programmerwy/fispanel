var http = require('http'),
  url = require('url');

const PORT = 8081;

function start(router, handler) {
  function onReq(req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log('Pathname: ' + pathname);
    router(handler, req, res, pathname);
  }
  http.createServer(onReq).listen(PORT);
  console.log('server is listening at 8081');
}

exports.start = start;