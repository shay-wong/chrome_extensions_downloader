document.addEventListener("DOMContentLoaded", function () {
  // 获取按钮元素
  var deleteSweepButton = document.getElementById("delete_sweep_button");
  var settingsButton = document.getElementById("settings_button");

  // 为删除按钮添加点击事件
  deleteSweepButton.addEventListener("click", function () {
    console.log("Delete Sweep button clicked");
    // 在这里添加您的删除逻辑
  });

  // 为设置按钮添加点击事件
  settingsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
    // 在这里添加您的设置逻辑
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
        size.textContent = formatFileSize(downloadItem.fileSize);
        details.appendChild(filename);
        details.appendChild(url);

        const bottomRow = document.createElement("div");
        bottomRow.className = "download-bottom-row";
        details.appendChild(bottomRow);

        bottomRow.appendChild(size);
        item.appendChild(details);

        // 下载时间
        const time = document.createElement("div");
        time.className = "download-time";
        const date = new Date(downloadItem.endTime);
        time.textContent = date.toLocaleTimeString();
        item.appendChild(time);

        const list = ["file_open", "folder_open", "replay", "cancel"];

        // 下载操作按钮
        const actions = document.createElement("div");
        actions.className = "download-actions";

        list.forEach((action) => {
          const button = document.createElement("button");
          const icon = document.createElement("i");
          icon.className = "material-symbols-outlined";
          icon.id = `i-${action}`;
          icon.textContent = action;
          button.appendChild(icon);
          button.addEventListener("click", function () {
            switch (action) {
              case "file_open":
                chrome.downloads.open(downloadItem.id);
                break;
              case "folder_open":
                chrome.downloads.show(downloadItem.id);
                break;
              case "replay":
                chrome.downloads.download({ url: downloadItem.url });
                break;
              case "backspace":
                chrome.downloads.erase({ id: downloadItem.id }, function () {
                  item.remove();
                });
                break;
              default:
                break;
            }
          });
          actions.appendChild(button);
        });
        bottomRow.appendChild(actions);

        downloadsContainer.appendChild(item);
      });
    }
  });
});

function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${formatNumber(bytes)} ${units[unitIndex]}`;
}

function formatNumber(number, decimalPlaces = 2) {
  // 如果小数部分为0，直接返回整数部分的字符串表示
  if (Math.floor(number) === number) {
    return number.toString();
  }

  // 使用 toFixed 保留指定的小数位数
  const fixedNumber = number.toFixed(decimalPlaces);

  // 使用正则表达式匹配并移除小数点后不必要的零，但不包括最后的小数点（如果有的话）
  const trimmedNumber = fixedNumber.replace(/(\.?0+)$/, function (match) {
    // 如果匹配到的是小数点本身（没有零），则保留小数点
    return match === "." ? "." : "";
  });

  return trimmedNumber;
}
