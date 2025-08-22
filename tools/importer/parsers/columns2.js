/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as specified
  const headerRow = ['Columns (columns2)'];

  // Get all top-level columns in the nav
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));

  // For each column, group all the sections inside that column
  const columnsCells = columns.map(col => {
    // For each section in the column
    const sections = Array.from(col.querySelectorAll(':scope > .ac-gf-directory-column-section'));
    // Each cell contains all sections for that column (preserves semantic grouping)
    // Reference existing elements directly
    return sections;
  });

  // Only create main block, as there is no Section Metadata in the example
  const table = [headerRow, columnsCells];
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original element
  element.replaceWith(block);
}
