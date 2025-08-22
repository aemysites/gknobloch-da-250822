/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav inside the main container
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Get all immediate index groups (columns)
  const groups = nav.querySelectorAll(':scope > div.Index_indexGroup__NLNA6');

  // Only keep non-empty groups (with a header or at least one <li>)
  const nonEmptyGroups = Array.from(groups).filter(group => {
    const header = group.querySelector('h3');
    const list = group.querySelector('ul');
    const hasHeader = header && header.textContent.trim().length > 0;
    const hasListItems = list && list.children.length > 0;
    return hasHeader || hasListItems;
  });

  // For each group, create a column cell
  // Each cell should reference existing group element from the document, not a clone
  const cells = nonEmptyGroups.map(group => group);

  // Only build the table if we have at least one group
  if (cells.length === 0) return;

  // Table header must match spec exactly
  const headerRow = ['Columns (columns6)'];
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    cells
  ], document);

  // Replace original element with the new block table
  element.replaceWith(blockTable);
}
