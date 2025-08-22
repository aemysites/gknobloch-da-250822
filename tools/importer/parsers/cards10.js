/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from the HTML structure
  function extractCards(root) {
    // Find all immediate wrappers of cards (usually direct children)
    const cardWrappers = Array.from(root.querySelectorAll(':scope > div'));
    const cardRows = [];
    cardWrappers.forEach(wrapper => {
      // Each wrapper should contain the card
      const card = wrapper.querySelector('.BannerCard_bannerCard__xHrOV');
      if (!card) return;
      // Find image: use whole <figure> if it exists
      const figure = card.querySelector('figure, .ResponsivePicture_responsive-picture__VWL7l, picture');
      // Compose text content
      const textContainer = card.querySelector('.BannerCard_copyLockup__9uRdS, .CopyLockup_textAlignCenter__7B4Wl') || card;
      const heading = textContainer.querySelector('.CopyLockup_header__BZWbY, h3, h2, h1');
      const desc = textContainer.querySelector('.CopyLockup_copy__t5rPE, p:not(:has(*))');
      const cta = textContainer.querySelector('.OptionalCTABlock_ctaBlock__k2dm5 a, a.OptionalCTABlock_link__pk9oy, a.StandardsLink_link__WcJoK');
      const textCell = [];
      if (heading) textCell.push(heading);
      if (desc) textCell.push(desc);
      if (cta) textCell.push(cta);
      cardRows.push([figure, textCell]);
    });
    return cardRows;
  }

  const headerRow = ['Cards (cards10)'];
  const cardRows = extractCards(element);
  // Only create if there are cards
  if (cardRows.length > 0) {
    const cells = [headerRow, ...cardRows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
