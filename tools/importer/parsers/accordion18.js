/* global WebImporter */
export default function parse(element, { document }) {
  // This function processes a single accordion item (li) at a time,
  // producing a table with a header row ('Accordion') and one item row (title, content).

  // Header row, single column with exact string
  const headerRow = ['Accordion'];

  // Extract title
  let h3 = Array.from(element.children).find(child => child.tagName.toLowerCase() === 'h3');
  let titleCell = '';
  if (h3) {
    const button = h3.querySelector('button');
    let titleText = '';
    if (button) {
      // Prefer deepest span inside button for title
      const deepSpan = button.querySelector('.ImageAccordion_accordionTitleText__6ouHq span');
      if (deepSpan) {
        titleText = deepSpan.textContent.trim();
      } else {
        // fallback: use button's text
        titleText = button.textContent.trim();
      }
    } else {
      titleText = h3.textContent.trim();
    }
    // Render title as <strong> for semantic weight
    const strong = document.createElement('strong');
    strong.textContent = titleText;
    titleCell = strong;
  }

  // Extract content cell (all blocks inside accordionContent)
  let contentTray = element.querySelector('.ImageAccordion_accordionTray__BHx_I');
  let contentCell = '';
  if (contentTray) {
    let accordionContent = contentTray.querySelector('.ImageAccordion_accordionContent__qFdLA');
    if (accordionContent) {
      // All direct children (usually text block + image block)
      const directBlocks = Array.from(accordionContent.children);
      if (directBlocks.length > 0) {
        contentCell = directBlocks;
      } else {
        contentCell = [accordionContent];
      }
    } else {
      contentCell = [contentTray];
    }
  }

  // Compose table structure: header row, followed by a single accordion item row
  const rows = [
    headerRow,           // ["Accordion"]
    [titleCell, contentCell] // [title, content]
  ];

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
