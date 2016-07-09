/*
 * Copyright (c) 2014-2016 fe@zuoyebang.com, All rights reseved.
 * @fileoverview 插件入口页
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-09 | wangyan01    // 初始版本。
 *                                          // 创建devtools panel
 *                                          // 负责panel与background通信的代理
 */
 
chrome.devtools.panels.create("fisPanel",
  "icon.png",
  "Panel/networkReq.html",
  function(panel) {
    // 面板创建时调用的代码
    var _window; // Going to hold the reference to panel.html's `window`

    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});
    port.onMessage.addListener(function(msg) {
      // Write information to the panel, if exists.
      // If we don't have a panel reference (yet), queue the data.
      if (_window) {
        _window.response(msg);
      } else {
        data.push(msg);
      }
    });

    panel.onShown.addListener(function tmp(panelWindow) {
      panel.onShown.removeListener(tmp); // Run once only
      _window = panelWindow;

      // Release queued data
      var msg;
      while (msg = data.shift()) {
        _window.response(msg);
      }
      // Just to show that it's easy to talk to pass a message back:
      _window.post = function(msg) {
        port.postMessage(msg);
      };
    });
  }
);