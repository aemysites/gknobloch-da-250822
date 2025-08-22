/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of cards
  const list = element.querySelector('ul');
  if (!list) return;
  const cards = Array.from(list.children);
  // Table header row must match exactly
  const rows = [['Cards (cards13)']];

  // For each card, extract icon/image and all text content (heading, desc, cta)
  cards.forEach(card => {
    // Find the icon/image (first img in card)
    const img = card.querySelector('img');
    // Extract text content: all children of IconCard_contentContainer__G34xf except the img
    const contentContainer = card.querySelector('.IconCard_contentContainer__G34xf');
    let contentElements = [];
    if (contentContainer) {
      contentElements = Array.from(contentContainer.children).filter(child => child.tagName !== 'IMG');
    }
    // Find CTA link or button, if any
    // It is always a direct child of the top-level card's main container
    let cta = card.querySelector('a.cards_cardLink__W1UKy, button.cards_cardLink__W1UKy');
    // Build content cell as an array of elements in DOM order
    const cellContent = [...contentElements];
    if (cta) cellContent.push(cta);
    // Always reference the actual node(s), not cloned
    rows.push([img, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
