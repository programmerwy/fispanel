/*
 * @copyright fe@zuoyebang.com
 * 
 * @description  // 本页面用于获取页面所有网络请求，并将结果交付background处理
 *
 */

var container = document.querySelector('#list'),
  resources = null;

!function() {
  window.addEventListener('load', initEvents);
}();

function initEvents() {
  addEvt('#refresh', 'click', refreshList);
  addEvt('#clear', 'click', clearList);
  chrome.devtools.inspectedWindow.getResources(function(res) {
    addEvt('#push', 'click', function() {
      // No need to check for the existence of `respond`, because
      // the panel can only be clicked when it's visible...
      post(resFilter(res));
    });
  });
}

function response(msg) {
  updateUI([msg.url]);
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

function clearList() {
  container.innerHTML = '';
}

function refreshList() {
  clearList();
  chrome.devtools.inspectedWindow.getResources(function(res) {
    resources = res;
    var urlList = new Array();
    res.forEach(function(item, index) {
      /http(?:s?):\/\//.test(item.url) && urlList.push(item.url);
    });
    updateUI(urlList.sort());
  });
}

function updateUI(list) {
  list.forEach(function(item) {
    container.appendChild(createRow(item));
  });
}

/*
 * 过滤掉插件等非寄主页面资源
 */
function resFilter(resources) {
  var array = resources.filter(function(item) {
    return /http(?:s?):\/\//.test(item.url);
  });
  return array;
}