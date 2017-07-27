/*
 * Copyright (c) 2014-2016 fe@zuoyebang.com, All rights reseved.
 * @fileoverview 与networkReq panel页的通信页面
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-09 | wangyan01    // 初始版本。
 *                                          // 将网络请求（静态资源以及document）转化成file，部署到测试环境。
 *                                          // 通过actReceiver（代码同fisreceiver）部署，静态资源部署路径与fis部署测试机路径一致
 *                                          // 转化document成 .html文件部署到/static/customeTarget目录中
 *
 * @version 1.1 | 2016-07-09 | wangyan01    // 待完成
 *                                          // 通知服务器打包，并获取包路径用于cms上传（）
 */

var ports = [],
  receiver = 'actReceiver.php',
  CUSTOMTARGET = null,
  deploy = {
    from: 'static',
    to: '/home/homework/webroot'
  },
  excludeUrl = [
    'http://www.zybang.com/napi/stat/addnotice',
    'http://notice.zuoyebang.cc/napi/stat/addnotice'
  ]; // url.origin + url.pathname

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

  port.onMessage.addListener(function(conf) {
    // Received message from devtools.
    receiver = conf.env + receiver,
      CUSTOMTARGET = conf.path;

    conf.msg.forEach(function(resource, index) {
      getFileAsync(resource, sendFile.bind(null, receiver));
      // notifyDevtools({url: urlProcesser(resource, CUSTOMTARGET)});
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

  if (!~excludeUrl.indexOf(urlObj.origin + urlObj.pathname)) {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'; //force the HTTP response, response-type header to be blob

    xhr.onload = function() {
      //添加自定义目录结构
      var pathname = urlObj.pathname;
      blob = xhr.response; //xhr.response is now a blob object
      var file = new File([blob], pathname);
      if (callback && typeof callback === 'function') {
        callback.call(null, {
          to: urlProcesser(resource, CUSTOMTARGET),
          file: file
        });
      }
    }
    xhr.onerror = function() {
      alert('getFile error');
    }
    xhr.open('GET', resource.url);
    xhr.send();
  }
}

function sendFile(target, form) {
  var formData = new FormData(),
    sendXHR = new XMLHttpRequest();
  formData.append('to', form.to);
  formData.append('file', form.file);
  sendXHR.onprogress = function(progress) {
    // notifyDevtools({url: 'progress:' + JSON.stringify(progress)});
  };
  sendXHR.onload = function() {
    notifyDevtools({ url: 'succ: ' + form.to });
  }
  sendXHR.onerror = function() {
    notifyDevtools({ url: 'err: ' + form.to });
  }
  sendXHR.open('POST', target);
  sendXHR.send(formData);
}

/*
 * 部署路径参照fis部署静态资源到相应测试机路径
 * 将html文件部署到 /static 或 /customTarget
 */
function urlProcesser(resource, customTarget) {
  var urlObj = urlParser(resource.url),
    url = deploy.to;

  var resName = /[^\/]+[^\/]$/.exec(urlObj.pathname);
  //document
  if (resource.type === 'document') {
    resName = resName ? resName[0] : 'index.html';
    url += customTarget + '/' + resName + '.html';

    //other type(image/js/css)
  } else {
    url += urlObj.pathname;
  }
  return url;
}

function urlParser(url) {
  var orig = /http(?:s?):\/\/[^\/]+/.exec(url),
    pname = /http(?:s?):\/\/[^\/]+((?:\/[^\/\?\&#@!]+)+)/.exec(url);
  return {
    origin: orig ? orig[0] : '',
    pathname: pname ? pname[1] : ''
  }
}