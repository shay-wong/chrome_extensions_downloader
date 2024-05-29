// background.js
importScripts("../settings/default_settings.js");

// 初始化默认设置
function initializeDefaultSettings() {
  const defaultSettings = getDefaultSettings();

  chrome.storage.sync.get(
    ["enableRouting", "folderSettings", "enableDownloads"],
    function (data) {
      if (data.enableRouting === undefined) {
        chrome.storage.sync.set({
          enableRouting: defaultSettings.enableRouting,
        });
      }
      if (data.enableDownloads === undefined) {
        chrome.storage.sync.set({
          enableDownloads: defaultSettings.enableDownloads,
        });
      }
      if (!data.folderSettings) {
        chrome.storage.sync.set({
          folderSettings: defaultSettings.folderSettings,
        });
      }
    }
  );
}

// 调用初始化函数
initializeDefaultSettings();

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  chrome.storage.sync.get(
    ["enableRouting", "folderSettings", "enableDownloads"],
    function (data) {
      if (data.enableRouting) {
        const folderSettings = data.folderSettings || [];
        const fileType = item.filename.split(".").pop().toLowerCase();
        const setting = folderSettings.find((s) => {
          const fileTypesArray = s.fileType
            .split(", ")
            .map((type) => type.trim().toLowerCase());
          return fileTypesArray.includes(fileType);
        });

        if (setting) {
          try {
            suggest({ filename: `${setting.folder}/${item.filename}` });
          } catch (error) {
            console.error("Error in suggest callback:", error);
          }
        } else {
          try {
            suggest({ filename: `${item.filename}` });
          } catch (error) {
            console.error("Error in suggest callback:", error);
          }
        }
      } else {
        try {
          suggest({ filename: `${item.filename}` });
        } catch (error) {
          console.error("Error in suggest callback:", error);
        }
      }
    }
  );
  return true;
});
