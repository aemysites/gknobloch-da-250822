/* global WebImporter */
export default function parse(element, { document }) {
  // The block name for the table header exactly as in the requirements
  const headerRow = ['Columns (columns5)'];

  // Extract left and right column content
  // Left: the h1 title
  const titleEl = element.querySelector('h1');
  // Right: the description, which is usually under .PageHeader_description__pXv2d
  let descriptionEl = null;
  const descWrap = element.querySelector('.PageHeader_description__pXv2d');
  if (descWrap) {
    // Prefer the <p> if present for correct semantic meaning
    descriptionEl = descWrap.querySelector('p') || descWrap;
  } else {
    // Fallback: find first <p> in element
    descriptionEl = element.querySelector('p');
  }

  // If nothing found, use empty element to maintain two columns
  if (!titleEl) {
    const emptyDiv = document.createElement('div');
    titleEl = emptyDiv;
  }
  if (!descriptionEl) {
    const emptyDiv = document.createElement('div');
    descriptionEl = emptyDiv;
  }

  // Second row contains both columns
  const secondRow = [ titleEl, descriptionEl ];

  // No Section Metadata table in example, so don't create one

  // Create the block table using the helper
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace original element with new table block
  element.replaceWith(blockTable);
}
