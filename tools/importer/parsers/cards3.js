/* global WebImporter */
export default function parse(element, { document }) {
  // Get <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Header row per instructions
  const rows = [['Cards (cards3)']];

  // Each <li> is a card
  Array.from(ul.children).forEach((li) => {
    // Find image: <img> inside <figure> (not a link)
    let imgEl = null;
    const bgDiv = li.querySelector('.FeatureCard_backgroundImage__fdw48');
    if (bgDiv) {
      const figure = bgDiv.querySelector('figure');
      if (figure) {
        const img = figure.querySelector('img');
        if (img) imgEl = img;
      }
    }

    // Card text: get <h3> and <p>
    const textContent = document.createElement('div');
    const h3 = li.querySelector('h3');
    if (h3) {
      // Use heading as <strong>
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent.trim();
      textContent.appendChild(strong);
    }
    const p = li.querySelector('p');
    if (p) {
      // If h3 exists, put a <br> after it
      if (textContent.childNodes.length) {
        textContent.appendChild(document.createElement('br'));
      }
      // Copy p contents, preserving <br>
      p.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          textContent.appendChild(document.createTextNode(node.textContent));
        } else if (node.nodeName === 'BR') {
          textContent.appendChild(document.createElement('br'));
        } else {
          textContent.appendChild(node);
        }
      });
    }
    // Find CTA link with visible text
    let cta = null;
    Array.from(li.querySelectorAll('a')).forEach((a) => {
      if (a.textContent && a.textContent.trim()) {
        cta = a;
      }
    });
    if (cta) {
      // Add a <br> before CTA if text exists
      if (textContent.childNodes.length) {
        textContent.appendChild(document.createElement('br'));
      }
      textContent.appendChild(cta);
    }

    // Only add row if image and text are present
    if (imgEl && textContent.childNodes.length) {
      rows.push([imgEl, textContent]);
    }
  });

  // Build the block table using referenced nodes
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
