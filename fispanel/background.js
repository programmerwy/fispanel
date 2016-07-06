/*
 * @copyright fe@zuoyebang.com
 * 
 * @description  // 本页面用于通过devtools.js代理与networkReq panel通信
 *               // 主要用来接收参数，进行文件跨域传输
 *               // 文件会部署到测试机特定（指定）目录，方便后续打包行为
 *               // 目录结构：- html文件名
 *               //           - 资源目录
 *               //             - 资源
 *               //           - 资源目录
 *               //             - 资源
 */

var ports = [],
  test4 = 'http://test4.afpai.com/fisreceiver.php',
  excludeUrl = ['http://www.zybang.com/napi/stat/addnotice'];  // url.origin + url.pathname
  // reciever = 'http://127.0.0.1/fisreceiver.php';

var sendToTest04 = sendFile.bind(null, test4);

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== "devtools") {
    return;
  }
  ports.push(port);

  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function() {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });

  port.onMessage.addListener(function(msg) {
    // Received message from devtools. Do something:
    msg.forEach(function(resource, index) { 
      getFileAsync(resource, sendToTest04);
      notifyDevtools({url: resource.url});
    });
  });
});

// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
  ports.forEach(function(port) {
    port.postMessage(msg);
  });
}

function getFileAsync(resource, callback) {
  var urlObj = urlParser(resource.url);
  if(~excludeUrl.indexOf(urlObj.origin + urlObj.pathname)) {
    var blob = null;
    var xhr = new XMLHttpRequest(); 
    xhr.responseType = 'blob';//force the HTTP response, response-type header to be blob
    xhr.onload = function() {
      //添加自定义目录结构
      var pathname = urlObj.pathname;
      blob = xhr.response;//xhr.response is now a blob object
      var file = new File([blob], pathname);
      if(callback && typeof callback === 'function') {
        callback.call(null, {
          to: resource.type == 'document' ? (pathname ? (pathname + '.html') : 'index.html') : pathname,
          file: file
        });
      }
    }
    xhr.onerror = function() {
      alert('getFile error');
    }
    xhr.open('GET', url);
    xhr.send();
  }
}

function sendFile(target, form) {
  var formData = new FormData(),
    sendXHR = new XMLHttpRequest();
  formData.append('to', form.to);
  formData.append('file', form.file);
  sendXHR.onprogress = function(progress) {
  };
  sendXHR.open('POST', target);
  sendXHR.send(formData);
}

function urlParser(url) {
  return {
    origin: /http(?:s?):\/\/[^\/]+/.exec(url)[0],
    pathname: /http(?:s?):\/\/[^\/]+((?:\/[^\/\?\&#@!]+)+)/.exec(url)[1]
  }
}