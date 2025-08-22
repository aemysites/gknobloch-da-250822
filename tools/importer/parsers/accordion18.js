/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the exact block name from requirements
  const headerRow = ['Accordion'];

  // Determine all items (li's). If element is a single li, gather all siblings from parent.
  let items;
  if (element.tagName === 'LI') {
    // Check if parent is a list (ul/ol)
    const parent = element.parentElement;
    if (parent && (parent.tagName === 'UL' || parent.tagName === 'OL')) {
      items = Array.from(parent.children);
    } else {
      items = [element];
    }
  } else {
    // Try to get direct li children (covers UL/OL or other containers)
    items = Array.from(element.querySelectorAll(':scope > li'));
    if (items.length === 0) {
      // fallback: treat all children as items
      items = Array.from(element.children);
    }
  }

  // Build accordion rows
  const rows = items.map((item) => {
    // 1. Title cell: get the text node or span inside the button
    let titleNode;
    const button = item.querySelector('h3 button');
    if (button) {
      // Title is (typically) in a span with class ImageAccordion_accordionTitleText__6ouHq, possibly with a child span
      let titleSpan = button.querySelector('.ImageAccordion_accordionTitleText__6ouHq span');
      if (!titleSpan) {
        // fallback: get first span/text inside button
        titleSpan = button.querySelector('span') || button.childNodes[0];
      }
      // Use the *existing* element
      if (titleSpan && titleSpan.nodeType === Node.ELEMENT_NODE) {
        titleNode = titleSpan;
      } else if (titleSpan && titleSpan.nodeType === Node.TEXT_NODE) {
        // If only a text node
        titleNode = document.createTextNode(titleSpan.textContent.trim());
      } else {
        titleNode = document.createTextNode(button.textContent.trim());
      }
    } else {
      titleNode = document.createTextNode('');
    }

    // 2. Content cell: get the content div (text and image)
    let contentCellNodes = [];
    const tray = item.querySelector('.ImageAccordion_accordionTray__BHx_I');
    if (tray) {
      const content = tray.querySelector('.ImageAccordion_accordionContent__qFdLA');
      if (content) {
        // There are divs inside: first is usually the p, second is usually image container
        const blocks = Array.from(content.children);
        blocks.forEach((block) => {
          // Paragraph block
          if (block.querySelector('p')) {
            const p = block.querySelector('p');
            if (p) contentCellNodes.push(p);
          }
          // Image block
          if (block.className && block.className.includes('ImageAccordion_accordionItemImageContainer')) {
            const fig = block.querySelector('figure');
            if (fig) contentCellNodes.push(fig);
          }
        });
      }
    }
    // Fallback if nothing found
    if (contentCellNodes.length === 0) {
      contentCellNodes = [document.createTextNode('')];
    }

    // If only one element, don't wrap in array
    const cellContent = contentCellNodes.length === 1 ? contentCellNodes[0] : contentCellNodes;
    return [titleNode, cellContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace only the relevant nodes: if element is li, replace all in parent, else replace element
  if (element.tagName === 'LI' && element.parentElement && (element.parentElement.tagName === 'UL' || element.parentElement.tagName === 'OL')) {
    // Remove all li and insert table
    const parent = element.parentElement;
    parent.replaceWith(table);
  } else {
    element.replaceWith(table);
  }
}
