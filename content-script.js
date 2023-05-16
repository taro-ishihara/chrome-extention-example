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

let debounceTimer;
document.addEventListener("selectionchange", function () {
  clearTimeout(debounceTimer);
  const selection = window.getSelection();
  if (selection.type === "Range") {
    debounceTimer = setTimeout(() => {
      console.log(selection.anchorNode.parentNode.textContent);
    }, 300); // 300ミリ秒後に実行
  }
  //   if (selection.type !== "Range") {
  //     return;
  //   }
  //   if (selection.anchorNode === selection.focusNode) {
  //     console.log(selection.anchorNode.nodeValue);
  //   } else {
  //     if (
  //       selection.anchorNode.compareDocumentPosition(selection.focusNode) &
  //       Node.DOCUMENT_POSITION_PRECEDING
  //     ) {
  //       let currentNode = selection.focusNode;
  //       let sentence = "";
  //       while (currentNode !== selection.anchorNode) {
  //         sentence += currentNode.nodeValue;
  //         currentNode = currentNode.;
  //       }
  //       console.log(sentence);
  //     } else {
  //       let currentNode = selection.anchorNode;
  //       let sentence = "";
  //       while (currentNode !== selection.focusNode) {
  //         sentence += currentNode.nodeValue;
  //         currentNode = currentNode.nextSibling;
  //       }
  //       console.log(sentence);
  //     }
  //   }
});
