/* global WebImporter */
export default function parse(element, { document }) {
  // Table must start with EXACT header
  const cells = [['Cards (cards19)']];

  // Find all card items
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  lis.forEach((li) => {
    // Column 1: Image/icon (may be missing)
    const img = li.querySelector('img') || '';

    // Column 2: All visible card text content, including CTA
    const textElems = [];

    // Collect h3 title (use original element)
    const h3 = li.querySelector('h3');
    if (h3) textElems.push(h3);

    // Collect p description (use original element)
    const p = li.querySelector('p');
    if (p) textElems.push(p);

    // CTA: link or button, with visible text
    const link = li.querySelector('a.cards_cardLink__W1UKy');
    if (link) {
      let linkText = '';
      const vh = link.querySelector('.utilities_visuallyhidden__5vJWI');
      if (vh && vh.textContent.trim()) {
        linkText = vh.textContent.trim();
      } else if (link.textContent.trim()) {
        linkText = link.textContent.trim();
      }
      if (linkText) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = linkText;
        textElems.push(a);
      }
    } else {
      // If there is a button with an aria-label, use it as CTA text
      const button = li.querySelector('button.cards_cardLink__W1UKy');
      if (button && button.hasAttribute('aria-label')) {
        const span = document.createElement('span');
        span.textContent = button.getAttribute('aria-label');
        textElems.push(span);
      }
    }

    // If no h3, p, or CTA found, include direct text from copy container
    if (textElems.length === 0) {
      // Try to find the main text holding container
      const copyContainer = li.querySelector('.IconCard_copyContainer__JW46n');
      if (copyContainer && copyContainer.textContent.trim()) {
        textElems.push(copyContainer.textContent.trim());
      } else if (li.textContent.trim()) {
        textElems.push(li.textContent.trim());
      }
    }

    // Push row
    cells.push([img, textElems.length === 1 ? textElems[0] : textElems]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
