const getPromptText = (searchTarget) => {
  return `${searchTarget}という単語または表現の意味を日本語で説明し、さらに単語や表現が使われる一般的な文章を英語で3パターン作成してください。`
}

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "search",
    title: "Search",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "delete",
    title: "Delete",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "search":
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = (await chrome.storage.sync.get("openApiKey"))[
        "openApiKey"
      ];
      chrome.tabs.sendMessage(
        tab.id,
        { message: "getSelectedText" },
        (selectedText) => {
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: getPromptText(selectedText) }],
            }),
          }).then((fetchResponse) => {
            fetchResponse.json().then((jsonData) => {
              console.log(jsonData);
              chrome.storage.sync.set({
                [selectedText]: jsonData.choices[0].message.content,
              });
              chrome.tabs.sendMessage(tab.id, { message: "updatePage" });
            });
          });
        }
      );
      break;
    case "delete":
      chrome.tabs.sendMessage(
        tab.id,
        { message: "getSelectedText" },
        (selectedText) => {
          chrome.storage.sync.remove(selectedText);
          chrome.tabs.sendMessage(tab.id, { message: "updatePage" });
        }
      );
      break;
  }
});
