// 使用chrome.runtime.onMessage.addListener方法注册一个消息监听器，该监听器会在接收到来自Content Script的消息时被调用。
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'filter') {
      // 保存用户选择的过滤条件
      chrome.storage.local.get({filters: []}, function(data) {
        let filters = data.filters;
        if (!filters.includes(request.url)) {
          filters.push(request.url);
          //在回调函数中，将接收到的过滤条件列表取出并保存到本地存储中。
          chrome.storage.local.set({filters: filters});
        }
      });
    }
  });
  