document.addEventListener("DOMContentLoaded", function () {
  const settingsButton = document.getElementById("settings-button");

  settingsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });

  const downloadsContainer = document.getElementById("downloads");

  chrome.downloads.search({}, function (results) {
    if (results.length === 0) {
      const noRecordsMessage = document.createElement("div");
      noRecordsMessage.className = "download-item";
      noRecordsMessage.textContent = "No download records found.";
      downloadsContainer.appendChild(noRecordsMessage);
    } else {
      results.forEach(function (downloadItem) {
        const item = document.createElement("div");
        item.className = "download-item";

        // 创建文件图标容器
        const iconWrapper = document.createElement("div");
        iconWrapper.id = "file-icon-wrapper";
        iconWrapper.className = "icon-wrapper";
        iconWrapper.setAttribute("role", "img");
        iconWrapper.setAttribute("aria-hidden", "true");
        iconWrapper.setAttribute("aria-label", "");

        // 创建文件图标
        const icon = document.createElement("img");
        icon.className = "icon";
        icon.id = "file-icon";
        icon.setAttribute("alt", "");
        icon.setAttribute("icon-color", "");

        // 加载图标
        chrome.downloads.getFileIcon(
          downloadItem.id,
          { size: 32 },
          (iconURL) => {
            if (chrome.runtime.lastError) {
              icon.src = "../../assets/icon.png"; // 使用默认图标
            } else {
              icon.src = iconURL;
            }
          }
        );

        iconWrapper.appendChild(icon);

        // 创建备用 iron-icon（隐藏）
        const ironIcon = document.createElement("iron-icon");
        ironIcon.className = "icon";
        ironIcon.setAttribute("icon-color", "");
        ironIcon.setAttribute("icon", "");
        ironIcon.setAttribute("hidden", "true");
        iconWrapper.appendChild(ironIcon);

        item.appendChild(iconWrapper);

        // 文件详情
        const details = document.createElement("div");
        details.className = "download-details";
        const filename = document.createElement("div");
        filename.classList.add("download-filename", "download-limit-wh");
        // filename.className = "download-filename";
        filename.textContent = downloadItem.filename.split("/").pop();
        const url = document.createElement("div");
        url.classList.add("download-url", "download-limit-wh");
        // url.className = "download-url";
        url.textContent = downloadItem.url;
        const size = document.createElement("div");
        size.className = "download-size";
        size.textContent = `${(downloadItem.fileSize / 1024).toFixed(2)} KB`;
        details.appendChild(filename);
        details.appendChild(url);
        details.appendChild(size);
        item.appendChild(details);

        // 下载时间
        const time = document.createElement("div");
        time.className = "download-time";
        const date = new Date(downloadItem.endTime);
        time.textContent = date.toLocaleTimeString();
        item.appendChild(time);

        // 下载操作按钮
        const actions = document.createElement("div");
        actions.className = "download-actions";
        const retryButton = document.createElement("button");
        retryButton.innerHTML = "&#x21bb;";
        retryButton.addEventListener("click", function () {
          chrome.downloads.download({ url: downloadItem.url });
        });
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "&#x2716;";
        removeButton.addEventListener("click", function () {
          chrome.downloads.erase({ id: downloadItem.id }, function () {
            item.remove();
          });
        });
        actions.appendChild(retryButton);
        actions.appendChild(removeButton);
        item.appendChild(actions);

        downloadsContainer.appendChild(item);
      });
    }
  });
});
