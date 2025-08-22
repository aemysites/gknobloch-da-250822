/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards23) table, header row must match example
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Find all cards (li elements)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const liList = Array.from(ul.children);

  liList.forEach(li => {
    // First column: image/icon element if present
    let img = li.querySelector('img') || '';

    // Second column: text stack (heading, desc, cta)
    const textCol = [];
    // Heading (h3)
    let heading = li.querySelector('.IconCard_headline__0cXta');
    if (heading) textCol.push(heading);
    // Description (p)
    let desc = li.querySelector('.IconCard_bodyCopy__AxRxx');
    if (desc) textCol.push(desc);
    // CTA: a.cards_cardLink__W1UKy or button.cards_cardLink__W1UKy
    const ctaLink = li.querySelector('a.cards_cardLink__W1UKy');
    if (ctaLink) {
      // Reference the existing <a>, but clean up to keep only the visually hidden text or aria-label
      // Remove inner icons (SVGs etc)
      const icons = ctaLink.querySelectorAll('[aria-hidden], svg');
      icons.forEach(node => node.remove());
      // If visuallyhidden span exists, use its textContent as link text
      const vh = ctaLink.querySelector('.utilities_visuallyhidden__5vJWI');
      if (vh) {
        ctaLink.textContent = vh.textContent;
      } else if (ctaLink.getAttribute('aria-label')) {
        ctaLink.textContent = ctaLink.getAttribute('aria-label');
      } else {
        // fallback: whatever is left
        ctaLink.textContent = ctaLink.textContent;
      }
      textCol.push(ctaLink);
    } else {
      // If button, use aria-label as text only (for modal CTAs)
      const ctaBtn = li.querySelector('button.cards_cardLink__W1UKy');
      if (ctaBtn && ctaBtn.getAttribute('aria-label')) {
        const span = document.createElement('span');
        span.textContent = ctaBtn.getAttribute('aria-label');
        textCol.push(span);
      }
    }
    // The cells array for the current card
    rows.push([
      img,
      textCol.length === 1 ? textCol[0] : textCol
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
