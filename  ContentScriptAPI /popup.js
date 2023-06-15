// 获取保存按钮和状态信息的元素
let saveButton = document.getElementById('save');
let statusText = document.getElementById('status');

// 为保存按钮添加点击事件
saveButton.addEventListener('click', () => {
  // 获取用户输入的关键词
  let keyword = document.getElementById('keyword').value.trim();

  // 如果关键词不能为空
  if (keyword === '') {
    statusText.textContent = '关键词不能为空！';
    return;
  }

  // 将关键词添加到过滤条件中
  chrome.storage.local.get({ filters: [] }, function (data) {
    let filters = data.filters;
    if (!filters.includes(keyword)) {
      filters.push(keyword);
      chrome.storage.local.set({ filters: filters }, function () {
        statusText.textContent = '保存成功！';
      });
    } else {
      statusText.textContent = '该关键词已存在！';
    }
  });
});
