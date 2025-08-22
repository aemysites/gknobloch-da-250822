/* global WebImporter */
export default function parse(element, { document }) {
  // Get all primary columns in the nav
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));

  // For each column, build the content for one cell
  const columnCells = columns.map((column) => {
    // Gather all sections in this column
    const sections = Array.from(column.querySelectorAll(':scope > .ac-gf-directory-column-section'));
    // For each section, combine heading and list
    const sectionElements = sections.map((section) => {
      // Only use existing elements (don't clone or create new ones)
      // Clean up the h3 by removing button (if present)
      const h3 = section.querySelector('h3');
      if (h3) {
        const btn = h3.querySelector('button');
        if (btn) btn.remove();
      }
      const ul = section.querySelector('ul');
      const elems = [];
      if (h3) elems.push(h3);
      if (ul) elems.push(ul);
      return elems;
    });
    // Flatten section elements for this column
    return sectionElements.flat();
  });

  // Compose the table for the block
  const headerRow = ['Columns (columns2)'];
  // Second row: one cell per column
  const dataRow = columnCells;
  const table = [headerRow, dataRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
