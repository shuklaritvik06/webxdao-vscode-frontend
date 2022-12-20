"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
var path = _interopRequireWildcard(require("path"));
var vscode = _interopRequireWildcard(require("vscode"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand("react-webview.start", function () {
    ReactPanel.createOrShow(path.join(context.extensionPath));
  }));
}
var ReactPanel = /*#__PURE__*/function () {
  function ReactPanel(extensionPath, column) {
    var _this = this;
    _classCallCheck(this, ReactPanel);
    _defineProperty(this, "_disposables", []);
    this._extensionPath = extensionPath;
    this._panel = vscode.window.createWebviewPanel(ReactPanel.viewType, "WebXDAO", column, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(this._extensionPath, "build"))]
    });
    this._panel.webview.html = this._getHtmlForWebview();
    this._panel.onDidDispose(function () {
      return _this.dispose();
    }, null, this._disposables);
    this._panel.webview.onDidReceiveMessage(function (message) {
      switch (message.command) {
        case "alert":
          vscode.window.showErrorMessage(message.text);
          return;
      }
    }, null, this._disposables);
  }
  /**
   * Dispose all disposables
   */
  _createClass(ReactPanel, [{
    key: "dispose",
    value: function dispose() {
      ReactPanel.currentPanel = undefined;
      this._panel.dispose();
      while (this._disposables.length) {
        var x = this._disposables.pop();
        if (x) {
          x.dispose();
        }
      }
    }
  }, {
    key: "_getHtmlForWebview",
    value: function _getHtmlForWebview() {
      var scriptPathOnDisk = this._panel.webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, "build", "main.js")));
      var stylePathOnDisk = this._panel.webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionPath, "build", "style.css")));
      var nonce = getNonce();
      return "<!DOCTYPE html>\n\t\t\t<html lang=\"en\">\n\t\t\t<head>\n\t\t\t\t<meta charset=\"utf-8\">\n\t\t\t\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,shrink-to-fit=no\">\n\t\t\t\t<meta name=\"theme-color\" content=\"#000000\">\n\t\t\t\t<title>WebXDAO Extension</title>\n\t\t\t\t<script src=\"https://cdn.tailwindcss.com\"></script>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t<noscript>You need to enable JavaScript to run this app.</noscript>\n        <div>Hello</div>\n\t\t\t\t<div id=\"root\"></div>\n\t\t\t\t<script nonce=\"".concat(nonce, "\" src=\"").concat(scriptPathOnDisk, "\" defer></script>\n\t\t\t</body>\n\t\t\t</html>");
    }
  }], [{
    key: "createOrShow",
    value: function createOrShow(extensionPath) {
      var column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
      if (ReactPanel.currentPanel) {
        ReactPanel.currentPanel._panel.reveal(column);
      } else {
        ReactPanel.currentPanel = new ReactPanel(extensionPath, column || vscode.ViewColumn.One);
      }
    }
  }]);
  return ReactPanel;
}();
_defineProperty(ReactPanel, "viewType", "webxdao");
function getNonce() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function deactivate() {}
