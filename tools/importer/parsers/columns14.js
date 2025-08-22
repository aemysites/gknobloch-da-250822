/* global WebImporter */
export default function parse(element, { document }) {
  // Get the <nav> inside the given element.
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Each direct > div of nav is a column group.
  const groups = nav.querySelectorAll(':scope > div');

  // Build one column for each non-empty group (either h3 or any <ul> with children)
  const columns = [];
  groups.forEach((group) => {
    // Check if group has content: either h3 with text or ul with li
    const h3 = group.querySelector('h3');
    const ul = group.querySelector('ul');
    const hasHeader = h3 && h3.textContent.trim();
    const hasList = ul && ul.querySelector('li');
    if (hasHeader || hasList) {
      // We'll reference the header and ul directly if they exist
      const elements = [];
      if (hasHeader) elements.push(h3);
      if (hasList) elements.push(ul);
      // If both present, add both, otherwise only whichever exists
      columns.push(elements.length === 1 ? elements[0] : elements);
    }
  });

  // If there are no non-empty columns, do nothing
  if (columns.length === 0) return;

  // Create table rows: header then one row of columns
  const tableRows = [
    ['Columns (columns14)'],
    columns
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
