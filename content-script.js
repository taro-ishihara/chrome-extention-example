chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request) {
    case "getSelectedText":
      const selectedText = window.getSelection().toString();
      sendResponse(selectedText);
      break;
  }
});

const regex = /extension/gi;

function* getTargetNodes(query) {
  const acceptNode = (node) => {
    if (/script|style/i.test(node.parentNode.nodeName)) {
      return NodeFilter.FILTER_REJECT;
    }
    if (regex.test(node.nodeValue)) {
      return NodeFilter.FILTER_ACCEPT;
    }
    //return NodeFilter.FILTER_ACCEPT;
  };
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode }
  );

  while (walker.nextNode()) yield walker.currentNode;
}

const highlightWord = (node) => {
  const highlightStyle = "background-color: green;";
  const newNode = document.createElement("span");
  newNode.innerHTML = node.nodeValue.replace(
    regex,
    `<span style="${highlightStyle}">$&</span>`
  );
  node.parentNode.replaceChild(newNode, node);
};

window.addEventListener("load", () => {
  const targetNodes = [...getTargetNodes("extension")];
  targetNodes.forEach(highlightWord);
});
