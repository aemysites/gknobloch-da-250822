/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all column sections within a .ac-gf-directory-column
  function getColumnSections(col) {
    // Only immediate children that are .ac-gf-directory-column-section
    return Array.from(col.querySelectorAll(':scope > .ac-gf-directory-column-section'));
  }
  // Get all columns in the directory
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));
  // For each column, group its sections vertically into a single cell
  const columnCells = columns.map((col) => {
    const sections = getColumnSections(col);
    if (sections.length === 1) {
      // If there's only one section, use it directly
      return sections[0];
    } else {
      // If multiple, wrap in a div for vertical stack
      const div = document.createElement('div');
      sections.forEach((sec) => div.appendChild(sec));
      return div;
    }
  });
  // Compose the columns table
  const headerRow = ['Columns (columns8)'];
  const cells = [
    headerRow,
    columnCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
