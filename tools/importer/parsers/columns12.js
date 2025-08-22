/* global WebImporter */
export default function parse(element, { document }) {
  // Get all column blocks
  const columns = Array.from(element.querySelectorAll(':scope > div.ac-gf-directory-column'));
  if (!columns.length) return;

  // For each column, build the cell with heading and list
  const rowCells = columns.map(col => {
    const section = col.querySelector(':scope > div.ac-gf-directory-column-section');
    if (!section) return '';

    // Title
    let title = '';
    const h3 = section.querySelector('h3');
    if (h3) {
      const span = h3.querySelector('.ac-gf-directory-column-section-title-text');
      if (span) {
        title = span.textContent.trim();
      }
    }
    const strong = document.createElement('strong');
    strong.textContent = title;

    // List
    const ul = section.querySelector('ul');

    // Compose cell content
    const fragment = document.createDocumentFragment();
    fragment.appendChild(strong);
    if (ul) {
      fragment.appendChild(ul);
    }
    return fragment;
  });

  // Correct table structure with header row: single cell
  const tableRows = [
    ['Columns (columns12)'], // Single cell header row
    rowCells                // One cell for each column
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
