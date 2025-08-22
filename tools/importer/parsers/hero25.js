/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content container (which contains the image)
  const contentContainer = element.querySelector('.FeatureVideo_contentContainer__n_ErD');
  let imageEl = null;
  if (contentContainer) {
    const figure = contentContainer.querySelector('figure');
    if (figure) {
      const picture = figure.querySelector('picture');
      if (picture) {
        // Use the <img> inside <picture>
        imageEl = picture.querySelector('img');
      }
    }
  }
  // Compose the table as specified: 3 rows, 1 column
  // 1st row: block name
  // 2nd row: background image (img element if found, otherwise empty string)
  // 3rd row: headline/subhead/cta (none present in provided HTML examples)
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [''],
  ];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
