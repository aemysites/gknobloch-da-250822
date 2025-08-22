/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exact as required
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow];

  // The cards are list items inside the UL
  const list = element.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  items.forEach(card => {
    // --- IMAGE CELL ---
    let imgCell = null;
    const figure = card.querySelector('.FeatureCard_backgroundImage__fdw48 figure');
    if (figure) {
      // Prefer the <img> inside <picture> for alt text and correct image
      const img = figure.querySelector('img');
      if (img) {
        imgCell = img;
      } else {
        // If no img, use the whole figure element for maximum compatibility
        imgCell = figure;
      }
    }

    // --- TEXT CELL ---
    // Combine all content textually and semantically as in the example
    const contentEls = [];
    // Try to get topic/heading
    let topic = card.querySelector('.FeatureCard_topicLabel__dwo6T');
    if (topic && topic.textContent.trim()) {
      // Render heading as a <strong> for semantic meaning (example uses bold)
      const title = document.createElement('strong');
      title.textContent = topic.textContent.trim();
      contentEls.push(title);
    }
    // Try headline/description
    let desc = card.querySelector('.FeatureCard_headline__VE1MS, .typography_headline__zZkHA');
    if (desc && desc.textContent.trim()) {
      const descPara = document.createElement('p');
      descPara.textContent = desc.textContent.trim();
      contentEls.push(descPara);
    }
    // If there are extra paragraphs, include them
    // (Not present in sample HTML, but support for future)
    // Try to find a CTA link with aria-label (never clone; reference only)
    let cta = card.querySelector('a.cards_cardLink__W1UKy');
    if (cta && cta.getAttribute('aria-label')) {
      // Reference the link directly from the document
      contentEls.push(cta);
    }
    // Defensive: If all above fail, add any meaningful text
    if (contentEls.length === 0) {
      // Get all text from this card
      const rawText = card.textContent.trim();
      if (rawText) {
        contentEls.push(document.createTextNode(rawText));
      }
    }

    // Add the row, referencing actual elements from the original document
    cells.push([imgCell, contentEls]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
