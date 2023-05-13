chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "add",
    title: "Add to Dictionary",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "add":
      console.log(tab)
      chrome.tabs.sendMessage(tab.id, "getSelectedText", response => {
        chrome.storage.sync.set({ response: response });
      });
      break;
  }
});
