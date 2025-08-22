/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example: single column with exact label
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find all cards (li elements under ul)
  const cards = element.querySelectorAll('ul > li');

  cards.forEach(card => {
    // 1st column: icon/image (can be null if not present)
    const img = card.querySelector('img') || '';

    // 2nd column: all text content as it visually appears
    // Prefer the card's copy container if it exists
    let textCell = null;
    const mainCopy = card.querySelector('.IconCard_copyContainer__JW46n');
    if (mainCopy) {
      // Use the existing node so all formatting is preserved
      textCell = mainCopy;
    } else {
      // Fallback: Collect all h1-h6 and p in the card
      const parts = [];
      card.querySelectorAll('h1,h2,h3,h4,h5,h6,p').forEach(el => parts.push(el));
      textCell = parts.length ? parts : card.textContent.trim();
    }
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}