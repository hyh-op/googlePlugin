//接收到 "search" 消息时，会触发 chrome.runtime.onMessage.addListener() 函数注册的回调函数
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "search") {
    var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(request.selection);
    //通过 chrome.runtime.sendMessage() 函数发送一个 "openTab" 消息，并携带搜索 URL 作为参数。
    chrome.runtime.sendMessage({ action: "openTab", url: searchUrl });
  }
});
