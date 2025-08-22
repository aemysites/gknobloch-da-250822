/* global WebImporter */
export default function parse(element, { document }) {
  // Table (striped) block for paddle navigation in sticky footer gallery
  // The entire nav is wrapped in a single cell as per structure guideline
  const headerRow = ['Table (striped)'];
  // The navigation area is the direct sticky footer nav area, which may have extra wrappers
  // We want the '.PaddleNav_paddlenav__QfLbi' element specifically, as it's the actual nav block
  const paddleNav = element.querySelector('.PaddleNav_paddlenav__QfLbi');
  // Fallback to the whole element if not found (should never happen in provided HTML)
  const navContent = paddleNav || element;
  // Assemble table rows
  const rows = [headerRow, [navContent]];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
