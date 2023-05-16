document.addEventListener("DOMContentLoaded", async () => {
  const openApiKey = document.getElementById("open_api_key");
  const value = (await chrome.storage.sync.get("openApiKey"))["openApiKey"];
  openApiKey.value = value;
  openApiKey.addEventListener("input", () => {
    chrome.storage.sync.set({ openApiKey: openApiKey.value });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const promptTemplate = document.getElementById("prompt_template");
  const value = (await chrome.storage.sync.get("promptTemplate"))[
    "promptTemplate"
  ];
  promptTemplate.value = value;
  promptTemplate.addEventListener("input", () => {
    chrome.storage.sync.set({ promptTemplate: promptTemplate.value });
  });
});
