/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row with correct block name
  const headerRow = ['Columns (columns15)'];

  // Defensive: Get all direct children
  const children = Array.from(element.children);
  // Find the h1 (title) and the description div
  let h1 = null, descDiv = null;
  for (const child of children) {
    if (child.tagName === 'H1') {
      h1 = child;
    } else if (child.classList.contains('PageHeader_description__pXv2d')) {
      descDiv = child;
    }
  }

  // Edge case: If missing, fallback to empty div to keep columns count consistent
  const leftCol = h1 ? h1 : document.createElement('div');
  const rightCol = descDiv ? descDiv : document.createElement('div');

  // Compose the table cells as per example: header, then two columns
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
