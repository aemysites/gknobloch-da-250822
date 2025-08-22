/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards23)'];
  const rows = [];

  // Find all immediate card <li>s
  const cardEls = element.querySelectorAll('ul > li');
  cardEls.forEach(card => {
    // First column: the image/icon
    const img = card.querySelector('img');

    // Second column: text content
    const textParts = [];
    // Title (h3)
    const headline = card.querySelector('h3');
    if (headline) textParts.push(headline);
    // Description (p)
    const desc = card.querySelector('p');
    if (desc) textParts.push(desc);
    // CTA (a or button)
    const linkEl = card.querySelector('a.cards_cardLink__W1UKy, button.cards_cardLink__W1UKy');
    if (linkEl) {
      let ctaText = '';
      // Prefer visually hidden span as label
      const vhSpan = linkEl.querySelector('.utilities_visuallyhidden__5vJWI');
      if (vhSpan && vhSpan.textContent.trim()) {
        ctaText = vhSpan.textContent.trim();
      } else if (linkEl.getAttribute('aria-label')) {
        ctaText = linkEl.getAttribute('aria-label');
      } else {
        ctaText = linkEl.textContent.trim();
      }
      // For <a> use anchor, for <button> use <span>
      if (linkEl.tagName.toLowerCase() === 'a') {
        const a = document.createElement('a');
        a.href = linkEl.href;
        a.textContent = ctaText || linkEl.textContent.trim();
        textParts.push(a);
      } else {
        // <button> is not a true link: just text
        const span = document.createElement('span');
        span.textContent = ctaText || linkEl.textContent.trim();
        textParts.push(span);
      }
    }
    rows.push([img, textParts]);
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
