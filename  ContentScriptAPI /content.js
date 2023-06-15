//使用document.querySelectorAll方法获取所有的搜索结果列表，并将其保存在results变量中。
let results = document.querySelectorAll('.result.c-container');

//遍历每个搜索结果，为其创建一个「过滤」按钮，并将该按钮添加到搜索结果中。
results.forEach((result) => {
  let filterButton = document.createElement('button');
  filterButton.textContent = '过滤';

  result.appendChild(filterButton);

  filterButton.addEventListener('click', () => {
    //为每个「过滤」按钮添加一个点击事件监听器，当用户点击该按钮时，向插件的后台页面发送消息，以保存用户选择的过滤条件，并将当前搜索结果隐藏。
    chrome.runtime.sendMessage({
      type: 'filter',
      url: result.querySelector('h3 a').href
    });

    result.style.display = 'none';
  });
});

//获取保存在本地的过滤条件列表，如果搜索结果的链接地址包含任意一个过滤条件，则将该搜索结果隐藏。
chrome.storage.local.get({ filters: [] }, function (data) {
  let filters = data.filters;

  results.forEach((result) => {
    if (filters.some(filter => result.querySelector('h3 a').href.includes(filter))) {
      result.style.display = 'none';
    }
  });
});
