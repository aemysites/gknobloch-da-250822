/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block header row
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Helper to handle extraction of card content
  function extractCard(cardEl) {
    // 1. Image/Icon: Figure (with <picture>/<img>)
    const figure = cardEl.querySelector('figure');

    // 2. Text Content (title, description, CTA)
    const copyLockup = cardEl.querySelector('.BannerCard_copyLockup__9uRdS');
    const textParts = [];
    if (copyLockup) {
      // Title: h3 (may not always be present, fallback to h2/h1)
      const heading = copyLockup.querySelector('h3,h2,h1');
      if (heading) textParts.push(heading);

      // Description: p (may not always be present)
      const desc = copyLockup.querySelector('p');
      if (desc) textParts.push(desc);

      // CTA: link inside copyLockup (may not always be present)
      // Only add if it is visible (has text)
      const ctaLink = copyLockup.querySelector('a');
      if (ctaLink && ctaLink.textContent.trim()) textParts.push(ctaLink);
    }

    // Always reference original elements, not clones, not strings
    return [figure, textParts];
  }

  // Find all cards for this block (direct children under animation wrappers)
  // To ensure resilience to HTML variations, select all .BannerCard_bannerCard__xHrOV within this block
  const cardEls = element.querySelectorAll('.BannerCard_bannerCard__xHrOV');
  cardEls.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create the cards10 block table: 2 columns, multiple rows
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the block element
  element.replaceWith(table);
}
