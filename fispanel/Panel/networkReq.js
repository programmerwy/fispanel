! function() {
  var container = document.querySelector('#list');

  function initEvents() {
    addEvt('#refresh', 'click', refreshList);
    addEvt('#clear', 'click', clearList);
    chrome.devtools.inspectedWindow.getResources(setList);

    alert(chrome.downloads);
    // chrome.downloads.download({
    //   filename: 'http://test1.afpai.com/static/lts-activity/mytopic/mytopic.js'
    // }, function(downloadId){
    //   alert(downloadId);
    // });
  }

  function addEvt(sel, evtName, callback) {
    document.querySelector(sel).addEventListener(evtName, callback);
  }

  function createRow(url) {
    var li = document.createElement('li'),
      link = document.createElement('a');
    '<a href="' + url + '" target="_blank">' + url + '</a>'
    link.href = url,
      link.target = '_blank',
      link.innerHTML = url;
    li.appendChild(link);
    return li;
  }

  function setList(res) {
    var list = [];
    res.forEach(function(item) {
      if (isUrl(item.url)) {
        list.push(item.url);
      }
    });
    updateUI(list);
  }

  function clearList() {
    container.innerHTML = '';
  }

  function refreshList() {
    chrome.devtools.inspectedWindow.getResources(setList);
  }

  function updateUI(list) {
    list.forEach(function(item) {
      container.appendChild(createRow(item));
    });
  }

  function isUrl(url) {
    return /^http(?:s?):\/\//i.test(url);
  }

  window.addEventListener('load', initEvents);
}();