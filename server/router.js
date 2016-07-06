exports.router = function(handler, req, res, pathname) {
  if(typeof handler[pathname] === 'function') {
    handler[pathname](req, res);
  } else {
    res.writeHead(200, {'Content-Type': 'text-html'});
    res.write('404 Not Found');
    res.end();
  }
}