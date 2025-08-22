/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the UL containing card LIs
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Step 2: Prepare header row matching block name exactly
  const headerRow = ['Cards (cards24)'];

  // Step 3: Build each card row
  const rows = [];
  const lis = Array.from(ul.children);
  lis.forEach(li => {
    // Card image/icon in first cell
    let imgCell = null;
    const figure = li.querySelector('figure');
    if (figure) {
      // Prefer img inside figure
      const img = figure.querySelector('img');
      imgCell = img ? img : figure;
    }

    // Card text in second cell: title, description, CTA
    const textCell = [];
    // Title (usually h3)
    const h3 = li.querySelector('h3');
    if (h3) textCell.push(h3);
    // Description (usually p)
    const p = li.querySelector('p');
    if (p) textCell.push(p);
    // Handle extra text: p siblings after headline
    let nextEl = p ? p.nextElementSibling : null;
    while (nextEl && nextEl.tagName === 'P') {
      textCell.push(nextEl);
      nextEl = nextEl.nextElementSibling;
    }
    // Call-to-action (a[role=button])
    const cta = li.querySelector('a[role="button"]');
    if (cta) textCell.push(cta);

    rows.push([imgCell, textCell]);
  });

  // Step 4: Create block table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Step 5: Replace original element
  element.replaceWith(table);
}
