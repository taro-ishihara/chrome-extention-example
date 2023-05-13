document.addEventListener("DOMContentLoaded", () => {
  const openApiKey = document.getElementById("open_api_key");
  openApiKey.addEventListener("input", () => {
    chrome.storage.sync.set({ 'openApiKey': openApiKey.value });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const promptTemplate = document.getElementById("prompt_template");
  promptTemplate.addEventListener("input", () => {
    chrome.storage.sync.set({ 'promptTemplate': promptTemplate.value });
  });
});
