/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if we find the <ul> with card items
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header must match the block name/variant exactly
  const headerRow = ['Cards (cards3)'];
  const tableRows = [headerRow];

  // For each LI (card)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // IMAGE: Find the figure > img (or fallback to figure or picture)
    let imgCell = null;
    const bgImg = li.querySelector('.FeatureCard_backgroundImage__fdw48 figure');
    if (bgImg) {
      const img = bgImg.querySelector('img');
      imgCell = img ? img : bgImg;
    } else {
      // fallback: any <img>
      const img = li.querySelector('img');
      imgCell = img || null;
    }

    // TEXT: Strong heading (from h3), description (from p)
    const textCell = [];
    const h3 = li.querySelector('h3');
    if (h3) {
      // Use <strong> for heading/title
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent.trim();
      textCell.push(strong);
    }
    const p = li.querySelector('p');
    if (p) {
      // Insert a <br> if there's a heading above
      if (textCell.length > 0) textCell.push(document.createElement('br'));
      textCell.push(p);
    }
    // The example does not show visible CTA/link text: skip the card <a> button

    // Add row: [image/html element, text content (array)]
    tableRows.push([imgCell, textCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
