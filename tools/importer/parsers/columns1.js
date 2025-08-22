/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row should be a single cell (one column)
  const headerRow = ['Columns (columns1)'];

  // Find nav element inside the block
  const nav = Array.from(element.children).find(e => e.tagName.toLowerCase() === 'nav');
  if (!nav) return;

  // Find all column group divs inside nav
  const columnGroups = Array.from(nav.children).filter(e => e.tagName.toLowerCase() === 'div');
  if (!columnGroups.length) return;

  // For each column group, collect all direct children (h3 and ul)
  const columnCells = columnGroups.map(group => {
    const children = Array.from(group.children)
      .filter(e => ['h3', 'ul'].includes(e.tagName.toLowerCase()));
    // If both present, return as array, otherwise the only element
    return children.length === 1 ? children[0] : children;
  });

  // Compose the table with header row (single cell), then a row with column cells
  const tableRows = [headerRow, columnCells];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
