var reciever = 'http://test4.afpai.com/fisreceiver.php',
    sendToReciver = sendFile.bind(null, reciever);
getFileAsync('http://127.0.0.1:8080/static/common/js/m-mod.js', sendToReciver);

function getFileAsync(url, callback) {
  var blob = null, file = null;
  var xhr = new XMLHttpRequest(); 
  xhr.responseType = 'blob';//force the HTTP response, response-type header to be blob
  xhr.onload = function() {
    blob = xhr.response;//xhr.response is now a blob object
    file = new File([blob], 'test.js');
    if(callback && typeof callback === 'function') {
      callback.call(null, file);
    }
  }
  xhr.open('GET', url); 
  xhr.send();
}

function sendFile(target, file) {
  var formData = new FormData(),
    sendXHR = new XMLHttpRequest();
  formData.append('to', 'static/testsend/' + file.name);
  formData.append('file', file);
  sendXHR.open('POST', target);
  sendXHR.send(formData);
}