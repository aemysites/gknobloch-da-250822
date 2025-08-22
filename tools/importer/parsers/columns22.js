/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns (immediate children with class 'ac-gf-directory-column')
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));

  // Helper to extract contents from one column
  function extractColumnContent(col) {
    // For a column, collect all its immediate children with class 'ac-gf-directory-column-section'
    const sections = Array.from(col.querySelectorAll(':scope > .ac-gf-directory-column-section'));

    // Edge case: no sections, use column as-is
    if (sections.length === 0) return col;
    // If only one section, return it directly
    if (sections.length === 1) return sections[0];
    // If more than one section, combine sections with <br> for separation
    const wrapper = document.createElement('div');
    sections.forEach((section, idx) => {
      wrapper.appendChild(section);
      if (idx !== sections.length - 1) {
        wrapper.appendChild(document.createElement('br'));
      }
    });
    return wrapper;
  }

  // Compose the table rows
  const headerRow = ['Columns (columns22)'];
  const contentRow = columns.map(extractColumnContent);

  // Only create table if there is at least one column
  if (columns.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      contentRow,
    ], document);
    element.replaceWith(table);
  }
}
