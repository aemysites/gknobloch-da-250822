/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: the main title (h1)
  const title = element.querySelector('h1');
  // Extract right column: the description div (contains a p tag)
  const descDiv = element.querySelector('.PageHeader_description__pXv2d');
  let rightContent = descDiv;
  if (!rightContent) {
    rightContent = element.querySelector('p');
  }
  // The header row must be a single cell spanning all columns
  // So: headerRow = ['Columns (columns29)']
  // Content row: [title, rightContent] for two columns
  const cells = [
    ['Columns (columns29)'],
    [title, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
