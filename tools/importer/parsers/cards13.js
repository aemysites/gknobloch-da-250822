/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as per the example markdown
  const headerRow = ['Cards (cards13)'];

  // Get all direct card items
  const cards = Array.from(element.querySelectorAll('ul > li'));
  const rows = cards.map(card => {
    // Get the image/icon (first img element)
    const img = card.querySelector('img');

    // Get the card text container
    const copyContainer = card.querySelector('.IconCard_copyContainer__JW46n');
    // Get the title (h3) and description (p)
    let title = null;
    let desc = null;
    if (copyContainer) {
      title = copyContainer.querySelector('h3');
      desc = copyContainer.querySelector('p');
    }

    // Get CTA (link or button)
    let cta = card.querySelector('a.cards_cardLink__W1UKy, button.cards_cardLink__W1UKy');
    // If CTA is a button, try to extract visually hidden description from inside
    if (cta && cta.tagName === 'BUTTON') {
      // Find visually hidden span inside button
      const vh = cta.querySelector('.utilities_visuallyhidden__5vJWI');
      if (vh) {
        // Use a span for the label
        const span = document.createElement('span');
        span.textContent = vh.textContent;
        cta = span;
      } else {
        cta = null; // No text, skip button
      }
    }
    // If CTA is a link, keep as is, keep all content

    // Compose contents in order: title, desc, cta
    const textElems = [];
    if (title) textElems.push(title);
    if (desc) textElems.push(desc);
    if (cta) textElems.push(cta);
    // If no text content at all, add a blank span to preserve cell
    if (!textElems.length) {
      textElems.push(document.createElement('span'));
    }

    // row = [image/icon, text content]
    return [img, textElems];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
