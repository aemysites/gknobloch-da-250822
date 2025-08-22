/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the two main pieces of content for the columns
  const title = element.querySelector('h1');
  const desc = element.querySelector('.PageHeader_description__pXv2d');

  // Header row: exactly one column (per requirements)
  const headerRow = ['Columns (columns15)'];

  // Content row: two columns (left: title, right: description)
  const contentRow = [title ? title : '', desc ? desc : ''];

  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
