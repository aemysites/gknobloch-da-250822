/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate columns in the directory
  const columns = Array.from(element.querySelectorAll(':scope > .ac-gf-directory-column'));
  if (!columns.length) return;
  // For each column, extract its main content
  const columnCells = columns.map(col => {
    const section = col.querySelector(':scope > .ac-gf-directory-column-section');
    if (!section) return document.createTextNode('');
    // Collect content for the cell
    const frag = document.createDocumentFragment();
    // Find the section title (take the first span.ac-gf-directory-column-section-title-text)
    const titleSpan = section.querySelector('.ac-gf-directory-column-section-title-text');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Find the ul (list)
    const ul = section.querySelector('ul');
    if (ul) {
      const newUl = document.createElement('ul');
      ul.querySelectorAll('li').forEach(li => {
        const a = li.querySelector('a');
        if (a) {
          const newLi = document.createElement('li');
          newLi.appendChild(a);
          newUl.appendChild(newLi);
        }
      });
      frag.appendChild(newUl);
    }
    return frag;
  });
  // Header row: exactly one cell (single array element)
  const headerRow = ['Columns (columns12)'];
  const table = WebImporter.DOMUtils.createTable([headerRow, columnCells], document);
  // After table is created, fix the header row to span all columns
  // Only if there are more than one columns
  if (columnCells.length > 1) {
    const th = table.querySelector('tr:first-child th');
    if (th) {
      th.setAttribute('colspan', columnCells.length);
    }
  }
  element.replaceWith(table);
}
