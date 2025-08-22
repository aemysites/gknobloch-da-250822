/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards28)'];
  const tableRows = [headerRow];

  // Each card is a <li> inside the <ul>
  const ul = element.querySelector('ul');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach(li => {
      // First cell: image (icon)
      const img = li.querySelector('img');

      // Second cell: text content
      const copyContainer = li.querySelector('.IconCard_copyContainer__JW46n');
      const textContent = [];
      if (copyContainer) {
        // Title: find h3 (preserving heading semantics)
        const h3 = copyContainer.querySelector('h3');
        if (h3) textContent.push(h3);
        // Description: find p
        const p = copyContainer.querySelector('p');
        if (p) textContent.push(p);
      }
      // Add the row only if at least one of image/text exists
      if (img || textContent.length) {
        tableRows.push([
          img || '',
          textContent
        ]);
      }
    });
  }
  // Create and replace with the table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}