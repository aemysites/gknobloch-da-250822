/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Hero'];

  // Find the background image asset (figure containing the image)
  let backgroundAsset = null;
  const contentContainer = element.querySelector('.FeatureVideo_contentContainer__n_ErD');
  if (contentContainer) {
    // Prefer figure with image
    const figures = contentContainer.getElementsByTagName('figure');
    if (figures.length > 0) {
      backgroundAsset = figures[0]; // Reference the DOM element directly
    }
    // If figure not found (shouldn't happen with provided HTML), fallback to video
    if (!backgroundAsset) {
      const videos = contentContainer.getElementsByTagName('video');
      if (videos.length > 0) {
        backgroundAsset = videos[0];
      }
    }
  }
  // If no asset found, provide empty string
  const secondRow = [backgroundAsset || ''];

  // Third row is empty string since all provided HTML lacks heading, subheading, or CTA
  const thirdRow = [''];

  // Assemble the table cells as rows
  const cells = [
    headerRow,
    secondRow,
    thirdRow
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
