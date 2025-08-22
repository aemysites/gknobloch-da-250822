/* global WebImporter */
export default function parse(element, { document }) {
  // Find the navigation (contains the columns)
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Find all .Index_indexGroup__NLNA6 (column containers)
  const groups = Array.from(nav.querySelectorAll(':scope > div.Index_indexGroup__NLNA6'));
  // For each group, create a <div> with their header and list
  const columns = groups.map(group => {
    // Create an empty div that will contain content of this column
    const colDiv = document.createElement('div');
    // Grab the heading, but only if it has text content
    const h3 = group.querySelector('h3');
    if (h3 && h3.textContent && h3.textContent.trim().length > 0) {
      colDiv.appendChild(h3);
    }
    // Grab the ul (if it has any li children)
    const ul = group.querySelector('ul');
    if (ul && ul.children.length > 0) {
      colDiv.appendChild(ul);
    }
    // Only include if non-empty
    return colDiv.childNodes.length ? colDiv : null;
  }).filter(Boolean); // Remove empty columns

  // Only build a columns block if there is at least one non-empty column
  if (columns.length) {
    const table = WebImporter.DOMUtils.createTable([
      ['Columns (columns6)'],
      columns
    ], document);
    element.replaceWith(table);
  }
}
