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