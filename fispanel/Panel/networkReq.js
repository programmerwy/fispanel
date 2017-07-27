/*
 * Copyright (c) 2014-2016 fe@zuoyebang.com, All rights reseved.
 * @fileoverview 面板页
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-09 | wangyan01    // 初始版本。
 *                                          // 获取页面所有网络请求，并将结果交付background处理
 *                                          // 负责panel与background通信的代理
 * @version 1.1 | 2017-07-27 | wangyan01    // 优化代码。
 */

var container = document.querySelector('#list');

!function() {
  window.addEventListener('load', initEvents);
}();

function initEvents() {
  addEvt('#refresh', 'click', refreshList);
  addEvt('#clear', 'click', clearList);
  chrome.devtools.inspectedWindow.getResources(function(res) {
    addEvt('#push', 'click', function() {
      var eleEnv = document.getElementById('env'),
        elePath = document.getElementById('path');
      // No need to check for the existence of `respond`, because
      // the panel can only be clicked when it's visible...
      post({
        msg: resFilter(res),
        env: eleEnv.value,
        path: elePath.value || elePath.getAttribute('data-value')
      });
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

  // '<a href="' + url + '" target="_blank">' + url + '</a>'
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
    updateUI(resFilter(res).map((item) => item.url).sort());
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
  return resources.filter(function(item) {
    return /http(?:s?):\/\//.test(item.url) && !/hybridaction/.test(item.url);
  })
}