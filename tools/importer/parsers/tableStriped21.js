/* global WebImporter */
export default function parse(element, { document }) {
  // Table (striped) block: The screenshots and example markdown indicate a single table block with the header 'Table (striped)'.
  // The provided HTML is not a real tabular data block but a carousel paddle navigation (footer nav for galleries).
  // To ensure semantic meaning and resilience, we include the entire content of the paddlenav container as a single cell.

  // Header row matches the example
  const headerRow = ['Table (striped)'];
  // Find the paddle nav block (which is always a descendant div with class 'PaddleNav_paddlenav__QfLbi')
  let paddlenavBlock = null;
  // Look for any child div with paddlenav class directly under the element
  const childDivs = element.querySelectorAll(':scope > div > div');
  childDivs.forEach(div => {
    if (div.classList.contains('PaddleNav_paddlenav__QfLbi')) {
      paddlenavBlock = div;
    }
  });

  // Fallback: If we didn't find it, just grab the main nav container (usually the first inner div under element)
  if (!paddlenavBlock) {
    paddlenavBlock = element.querySelector(':scope > div');
  }
  // Defensive: If still nothing, reference the element itself
  if (!paddlenavBlock) {
    paddlenavBlock = element;
  }

  // Cells structure: first row (header), second row (content)
  const cells = [
    headerRow,
    [paddlenavBlock]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
