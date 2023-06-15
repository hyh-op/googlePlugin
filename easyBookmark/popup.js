//存储书签
let bookmarks = [];

//向 bookmarks 数组中添加新的书签，并将其保存到 Chrome 存储storage中，以便在浏览器关闭后也能够保留。
function saveBookmark(url, name) {
  bookmarks.push({ url: url, name: name });
  chrome.storage.sync.set({ bookmarks: bookmarks });
}

//从 bookmarks 数组中删除指定索引位置的书签，并将更新后的数组保存到 Chrome 存储中。
function removeBookmark(index) {
  bookmarks.splice(index, 1);
  chrome.storage.sync.set({ bookmarks: bookmarks });
}

//从 Chrome 存储中加载已有的书签，并将它们显示在页面上的列表中。
function loadBookmarks() {
  chrome.storage.sync.get(['bookmarks'], function (result) {
    if (result.bookmarks) {
      bookmarks = result.bookmarks;
      ///拿到ul标签，插入li
      let list = document.getElementById('list');
      for (let i = 0; i < bookmarks.length; i++) {
        let item = document.createElement('li');
        let link = document.createElement('a');
        let edit = document.createElement('button');
        let del = document.createElement('button');
        link.textContent = bookmarks[i].name;
        link.href = bookmarks[i].url;
        link.target = '_blank'
        edit.textContent = '编辑';
        edit.style.marginLeft = '16px';
        del.textContent = '删除';
        del.style.color='red';
        edit.addEventListener('click', function () {
          let newName = prompt('请输入新的书签名称：', bookmarks[i].name);
          if (newName) {
            bookmarks[i].name = newName;
            chrome.storage.sync.set({ bookmarks: bookmarks });
            link.textContent = newName;
          }
        });
        del.addEventListener('click', function () {
          removeBookmark(i);
          item.remove();
        });
        item.appendChild(link);
        item.appendChild(edit);
        item.appendChild(del);
        list.appendChild(item);
      }
    }
  });
}

//与 content.js 脚本通信并将用户在弹出窗口中输入的关键字发送给 content.js。
//chrome.tabs.query() 方法查找当前活动标签页，然后获取 文本框的值。
//chrome.tabs.sendMessage() 方法向当前活动标签页发送包含 keywords 的消息。
function highlightKeywords() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var keywords = document.getElementById("keywords").value;
    chrome.tabs.sendMessage(tabs[0].id, { keywords: keywords });
  });
}

//用于监听 DOMContentLoaded 事件，以便在页面加载完毕后执行初始化操作。
document.addEventListener('DOMContentLoaded', function () {
  loadBookmarks();
  //主要用于绑定表单提交事件和加载已有的书签列表。
  let form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    //首先阻止默认行为
    event.preventDefault();
    let url = document.getElementById('url').value.trim();
    let name = document.getElementById('name').value.trim();
    if (url && name) {
      saveBookmark(url, name);
      let list = document.getElementById('list');
      let item = document.createElement('li');
      let link = document.createElement('a');
      let edit = document.createElement('button');
      let del = document.createElement('button');
      link.textContent = name;
      link.href = url;
      edit.textContent = '编辑';
      del.textContent = '删除';
      edit.addEventListener('click', function () {
        let newName = prompt('请输入新的书签名称：', name);
        if (newName) {
          saveBookmark(url, newName);
          link.textContent = newName;
        }
      });
      del.addEventListener('click', function () {
        removeBookmark(bookmarks.findIndex(b => b.url === url));
        item.remove();
      });
      item.appendChild(link);
      item.appendChild(edit);
      item.appendChild(del);
      list.appendChild(item);
      form.reset();

      // 使用Tabs Manager API创建新的标签选项卡
      chrome.tabs.create({ url: url });
    }
  });

  //在 DOM 内容加载完成时，添加一个点击事件监听器，当用户单击按钮时调用函数，触发与content.js 的通信操作。
  document.getElementById("highlightBtn").addEventListener("click", highlightKeywords);
});



//在 DOM 内容加载完成时，添加一个点击事件监听器，当用户单击按钮时调用函数，触发与content.js 的通信操作。
// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("highlightBtn").addEventListener("click", highlightKeywords);
// });
