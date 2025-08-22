/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare the header row
  const headerRow = ['Columns (columns8)'];

  // 2. Gather all top-level columns. Each column is a <div class="ac-gf-directory-column">
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));

  let cellsRow = [];
  if (columns.length > 0) {
    // For each column, group all its .ac-gf-directory-column-section children together as a cell
    cellsRow = columns.map(col => {
      // Get all direct .ac-gf-directory-column-section children
      const sections = Array.from(col.querySelectorAll(':scope > .ac-gf-directory-column-section'));
      if (sections.length === 1) {
        // Single section, reference the element directly
        return sections[0];
      } else if (sections.length > 1) {
        // Multiple sections, reference them as an array
        return sections;
      } else {
        // Edge case: no sections, use column itself
        return col;
      }
    });
  } else {
    // Fallback in case there are no columns (unexpected in provided HTML)
    // We'll treat all .ac-gf-directory-column-section as columns
    const sections = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column-section'));
    cellsRow = sections.length ? sections : [element];
  }

  // 3. Build the table cells structure
  const cells = [headerRow, cellsRow];

  // 4. Create the block table using the required helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element with the block table
  element.replaceWith(block);
}
