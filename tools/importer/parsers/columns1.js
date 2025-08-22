/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav inside the container (the direct child)
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Get all group divs directly under nav
  const groupDivs = Array.from(nav.querySelectorAll(':scope > div'));
  if (groupDivs.length === 0) return;

  // For each group, collect the heading and the list as a cell
  const columns = groupDivs.map((group) => {
    const colContent = [];
    const header = group.querySelector('h3');
    const list = group.querySelector('ul');
    if (header) colContent.push(header);
    if (list) colContent.push(list);
    if (colContent.length === 1) {
      return colContent[0];
    } else if (colContent.length > 1) {
      return colContent;
    } else {
      // fallback: include all children if empty
      return Array.from(group.children);
    }
  });

  // Header row: exactly one cell as per the spec
  const headerRow = ['Columns (columns1)'];
  // Second row: one cell per column
  const columnsRow = columns;

  // Build table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the element
  element.replaceWith(block);
}
