var ports = [],
  test4 = 'http://test4.afpai.com/fisreceiver.php';
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
  var blob = null;
  var xhr = new XMLHttpRequest(); 
  xhr.responseType = 'blob';//force the HTTP response, response-type header to be blob
  xhr.onload = function() {
    var pathname = urlParser(resource.url).pathname;
    blob = xhr.response;//xhr.response is now a blob object
    var file = new File([blob], pathname);
    if(callback && typeof callback === 'function') {
      callback.call(null, {
        to: pathname,
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
    origin: /http:\/\/[^\/]+/.exec(url)[0],
    pathname: /http:\/\/[^\/]+((?:\/[^\/\?\&#@!]+)+)/.exec(url)[1]
  }
}