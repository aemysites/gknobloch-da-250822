/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must be a single-cell row with exactly the required text
  const headerRow = ['Columns (columns29)'];

  // Gather the columns: heading (left), description (right)
  const h1 = element.querySelector('h1');
  let desc = null;
  const descDiv = element.querySelector('.PageHeader_description__pXv2d');
  if (descDiv) {
    const p = descDiv.querySelector('p');
    desc = p || descDiv;
  }

  // Second row: exactly two columns, left is h1, right is desc
  const columnsRow = [h1 || '', desc || ''];

  // The table should be [[headerRow], columnsRow]: first row is one cell, second row has two cells
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
