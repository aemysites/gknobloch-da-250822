/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all card <li> elements inside the main cards container
  const cardsContainer = element.querySelector('ul.Gallery_itemContainer__Zirbx');
  if (!cardsContainer) return;
  const cardItems = Array.from(cardsContainer.querySelectorAll(':scope > li'));
  
  // 2. Table header matches the example: 'Cards (cards19)'
  const cells = [['Cards (cards19)']];

  // 3. For each card, assemble cells
  cardItems.forEach((card) => {
    // Image/icon: always present per spec
    const img = card.querySelector('img');
    // Text container
    const textContainer = card.querySelector('.IconCard_copyContainer__JW46n');
    const textCell = [];
    if (textContainer) {
      // Title (h3)
      const h = textContainer.querySelector('h3');
      if (h) textCell.push(h);
      // Description (p)
      const p = textContainer.querySelector('p');
      if (p) textCell.push(p);
      // CTA: only if it's visually hidden (for a11y, used as label)
      // Prefer <a> then <button>
      const cardRoot = card.querySelector('.IconCard_iconCard__ptoS0') || card;
      let cta = cardRoot.querySelector('a.cards_cardLink__W1UKy');
      let visLabel;
      if (cta) {
        visLabel = cta.querySelector('.utilities_visuallyhidden__5vJWI');
        if (visLabel) {
          // Use a link with extracted label
          const link = document.createElement('a');
          link.href = cta.getAttribute('href');
          link.textContent = visLabel.textContent;
          textCell.push(link);
        }
      } else {
        // If no <a>, try <button> with visually hidden label
        cta = cardRoot.querySelector('button.cards_cardLink__W1UKy');
        if (cta) {
          visLabel = cta.querySelector('.utilities_visuallyhidden__5vJWI');
          if (visLabel) {
            const span = document.createElement('span');
            span.textContent = visLabel.textContent;
            textCell.push(span);
          }
        }
      }
    }
    // Push the row: [image, text content]
    cells.push([img, textCell]);
  });

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
