document.addEventListener("DOMContentLoaded", function () {
  const generalLink = document.getElementById("general-link");
  const fileClassificationLink = document.getElementById(
    "file-classification-link"
  );
  const generalSettings = document.getElementById("general-settings");
  const fileClassificationSystem = document.getElementById(
    "file-classification-system"
  );

  generalLink.addEventListener("click", function () {
    generalSettings.style.display = "block";
    fileClassificationSystem.style.display = "none";
  });

  fileClassificationLink.addEventListener("click", function () {
    generalSettings.style.display = "none";
    fileClassificationSystem.style.display = "block";
  });

  generalSettings.style.display = "none";
  fileClassificationSystem.style.display = "block";

  const enableRoutingCheckbox = document.getElementById("enable-routing");
  const folderSettingsContainer = document.getElementById("folder-settings");
  const addSettingButton = document.getElementById("add-setting");
  const saveSettingsButton = document.getElementById("save-settings");
  const enableDownloadsCheckbox = document.getElementById("enable-downloads");

  const defaultSettings = getDefaultSettings();

  // Load settings
  chrome.storage.sync.get(
    ["enableRouting", "folderSettings", "enableDownloads"],
    function (data) {
      enableRoutingCheckbox.checked =
        data.enableRouting !== undefined ? data.enableRouting : true;
      enableDownloadsCheckbox.checked =
        data.enableDownloads !== undefined ? data.enableDownloads : true;
      const folderSettings =
        data.folderSettings || defaultSettings.folderSettings;
      folderSettings.forEach((setting) => {
        addFolderSetting(setting.fileType, setting.folder);
      });
    }
  );

  // Add setting input fields
  addSettingButton.addEventListener("click", function () {
    addFolderSetting("", "");
  });

  // Save settings
  saveSettingsButton.addEventListener("click", function () {
    const folderSettings = [];
    document.querySelectorAll(".folder-setting").forEach((setting) => {
      const fileType = setting.querySelector(".file-type").value;
      const folder = setting.querySelector(".folder").value;
      folderSettings.push({ fileType, folder });
    });
    chrome.storage.sync.set(
      {
        enableRouting: enableRoutingCheckbox.checked,
        folderSettings: folderSettings,
        enableDownloads: enableDownloadsCheckbox.checked,
      },
      function () {
        alert("设置已保存！");
      }
    );
  });

  function addFolderSetting(fileType, folder) {
    const settingDiv = document.createElement("div");
    settingDiv.className = "folder-setting";
    settingDiv.innerHTML = `
    <input type="text" class="folder" placeholder="文件夹名称" value="${folder}" >
    <input type="text" class="file-type" placeholder="文件格式 (e.g., pdf)" value="${fileType}">
    <button class="remove-setting">删除</button>
    `;
    settingDiv
      .querySelector(".remove-setting")
      .addEventListener("click", function () {
        settingDiv.remove();
      });
    folderSettingsContainer.appendChild(settingDiv);
  };
});
