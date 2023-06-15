chrome.contextMenus.create({
  title: "Search",
  contexts: ["selection"],
  onclick: function (info, tab) {
    //回调函数通过 chrome.tabs.sendMessage() 函数将所选文本发送到扩展程序的内容脚本中进行处理。
    chrome.tabs.sendMessage(tab.id, { action: "search", selection: info.selectionText });
  }
});

//通过 chrome.tabs.create() 函数打开一个新的标签页，加载请求的 URL。
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openTab") {
    chrome.tabs.create({ url: request.url });
  }
});
