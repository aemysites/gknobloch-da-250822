/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (top-level divs)
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));

  // For each column, collect all its sections (div.ac-gf-directory-column-section)
  const cells = columns.map((column) => {
    // Gather every section in this column
    const sections = Array.from(column.querySelectorAll(':scope > .ac-gf-directory-column-section'));
    // Each section gets its title text and its list
    const sectionContents = sections.map((section) => {
      const parts = [];
      // Extract title
      const titleSpan = section.querySelector('.ac-gf-directory-column-section-title-text');
      if (titleSpan) {
        // Wrap in <strong> for emphasis, which mirrors a heading in a single table cell
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        parts.push(strong);
      }
      // Extract list(s)
      const ul = section.querySelector('ul');
      if (ul) {
        parts.push(ul);
      }
      return parts.length === 1 ? parts[0] : parts;
    });
    // Flatten multiple sections per column into one array
    return sectionContents.length === 1 ? sectionContents[0] : sectionContents.flat();
  });

  // Table header according to block name
  const headerRow = ['Columns (columns22)'];

  // Compose table rows: first is header, second is columns
  const tableRows = [headerRow, cells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
