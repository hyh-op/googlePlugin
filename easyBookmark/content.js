//用于接收来自 popup.js 脚本的消息，并在网页中查找并突出显示匹配的关键字。
(function(){
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('hyh')
        if (request.keywords && request.keywords.length > 0) {
          var keywords = request.keywords.split(",");
          for (var i = 0; i < keywords.length; i++) {
            //正则规则
            var regex = new RegExp(keywords[i], "ig");
            var matches = document.body.innerHTML.match(regex);
            if (matches) {
              for (var j = 0; j < matches.length; j++) {
                var span = document.createElement("span");
                span.style.backgroundColor = "yellow";
                span.textContent = matches[j];
                matches[j] = matches[j].replace(/[-[]/{}()*+?.\^$|]/g, "\$&");
                //matches[j] = matches[j].replace(/[-[]{}()*+?.\^$|]/g, "\$&");
                document.body.innerHTML = document.body.innerHTML.replace(new RegExp(matches[j], "g"), span.outerHTML);
              }
            }
          }
        }
      });
})()
  