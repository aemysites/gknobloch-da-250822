/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav block inside the given element
  const nav = element.querySelector('nav');
  if (!nav) return;
  // Find all column groups (each group is a column)
  const groupSelector = ':scope > .Index_indexGroup__NLNA6';
  const groups = Array.from(nav.querySelectorAll(groupSelector));

  // For each group, build a column cell that contains all direct children of the group (to preserve all rendered content)
  const columns = groups.map((group) => {
    // Get all direct children of group (h3, ul, etc)
    const children = Array.from(group.children).filter((child) => {
      // Only include elements that have text or child elements (skip empty headings or empty uls)
      if (child.tagName === 'H3') {
        return child.textContent.trim() !== '';
      }
      if (child.tagName === 'UL') {
        return child.children.length > 0;
      }
      return true;
    });
    // If there's more than one child, wrap in a fragment
    if (children.length === 1) {
      return children[0];
    }
    if (children.length > 1) {
      // Use DocumentFragment to avoid extra <div>
      const frag = document.createDocumentFragment();
      children.forEach(c => frag.appendChild(c));
      return frag;
    }
    return null;
  }).filter(Boolean);

  if (columns.length === 0) return;

  const headerRow = ['Columns (columns14)'];
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
