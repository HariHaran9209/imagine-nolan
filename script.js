function search() {
    let searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    let resultsContainer = document.getElementById('results');
    let content = document.getElementById('content');

    // Clear any previous highlights and results
    clearHighlights(content);
    resultsContainer.innerHTML = '';

    // If search input is empty, show a message and exit
    if (searchInput === "") {
        resultsContainer.innerHTML = "Please enter a search term.";
        return;
    }

    // Collect all text nodes and highlight matches
    let matchCount = highlightMatches(content, searchInput);

    // Display search result count
    if (matchCount > 0) {
        resultsContainer.innerHTML = `Found ${matchCount} result(s) for "${searchInput}".`;
    } else {
        resultsContainer.innerHTML = `No results found for "${searchInput}".`;
    }
}

// Function to clear previous highlights
function clearHighlights(element) {
    const highlighted = element.querySelectorAll('span.highlight');
    highlighted.forEach(span => {
        span.outerHTML = span.textContent; // Replace <span> with just text
    });
}

// Function to highlight matches
function highlightMatches(element, searchInput) {
    let matchCount = 0;
    let textNodes = [];

    // Traverse and collect text nodes
    function collectTextNodes(node) {
        if (node.nodeType === 3) { // Text node
            textNodes.push(node);
        } else if (node.nodeType === 1 && !/(script|style)/i.test(node.tagName)) {
            for (let i = 0; i < node.childNodes.length; i++) {
                collectTextNodes(node.childNodes[i]);
            }
        }
    }

    // First, collect all text nodes
    collectTextNodes(element);

    // Now loop through the text nodes and highlight the matches
    textNodes.forEach(textNode => {
        let text = textNode.textContent;
        let lowerText = text.toLowerCase();
        let index = lowerText.indexOf(searchInput);

        if (index !== -1) {
            // Create a span element for highlighting
            let span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = text.substring(index, index + searchInput.length);

            // Split the text into three parts: before, match, after
            let before = document.createTextNode(text.substring(0, index));
            let after = document.createTextNode(text.substring(index + searchInput.length));

            // Insert new nodes into the DOM
            let parent = textNode.parentNode;
            parent.insertBefore(before, textNode);
            parent.insertBefore(span, textNode);
            parent.insertBefore(after, textNode);

            // Remove the original text node
            parent.removeChild(textNode);

            matchCount++;
        }
    });

    return matchCount;
}