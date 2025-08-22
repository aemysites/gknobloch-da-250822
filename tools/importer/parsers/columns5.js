/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns5)'];

  // Columns: title and description (side by side)
  // Find the immediate children of the top element
  const children = Array.from(element.children);
  // Typically h1 and a div with description
  let titleElem = null;
  let descElem = null;
  children.forEach(child => {
    if (child.tagName.toLowerCase() === 'h1') {
      titleElem = child;
    } else if (child.classList.contains('PageHeader_description__pXv2d')) {
      descElem = child.querySelector('p');
    }
  });

  // Compose the content row: two columns for side-by-side layout (as in screenshot)
  const contentRow = [titleElem || '', descElem || ''];

  // Cells array: header row (1 column), content row (as many columns as needed)
  const cells = [headerRow, contentRow];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
