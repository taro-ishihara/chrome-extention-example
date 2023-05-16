const getTargetNodes = function* (key) {
  regex = new RegExp(key, "gi");
  const acceptNode = (node) => {
    if (/script|style/i.test(node.parentNode.nodeName)) {
      return NodeFilter.FILTER_REJECT;
    }
    if (regex.test(node.nodeValue)) {
      return NodeFilter.FILTER_ACCEPT;
    }
  };
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode }
  );

  while (walker.nextNode()) yield walker.currentNode;
};

const highlightWord = (node, key, description) => {
  regex = new RegExp(key, "gi");
  const newNode = document.createElement("span");
  newNode.innerHTML = node.nodeValue.replace(
    regex,
    `<span class="aidext-highlight"><abbr title="${description}">$&</abbr></span>`
  );
  node.parentNode.replaceChild(newNode, node);
};

const updatePage = async () => {
  const items = await chrome.storage.sync.get(null);
  for (const key in items) {
    const targetNodes = [...getTargetNodes(key)];
    for (const node of targetNodes) {
      highlightWord(node, key, items[key]);
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case "getSelectedText":
      const selectedText = window.getSelection().toString();
      sendResponse(selectedText);
      break;
    case "updatePage":
      updatePage();
      break;
  }
});

window.addEventListener("load", () => {
  updatePage();
});

document.addEventListener("selectionchange", function () {
  const selection = window.getSelection();
  if (selection.type !== "Range") {
    return;
  }
  const selectedNode = selection.anchorNode;
  console.log(selectedNode.nodeValue);
});
