/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns in the gallery (each product)
  const columns = Array.from(element.querySelectorAll('.StickyFooterGallery_galleryItem__ZGmEN'));
  if (!columns.length) return;

  // Table header as a single cell, matching example
  const tableCells = [['Columns (columns26)']];

  // Compose the first row: product block for each column
  const firstRow = columns.map(col => {
    // To capture all text and visuals, grab the main product tile content
    const productTile = col.querySelector('.ProductTile_productTile__P1DTD');
    // Add links below the product tile if present (these are outside the tile in some structures)
    const productLinksFooter = col.querySelector('.ProductTileLinks_tileFooter__y7zXD');
    if (productTile && productLinksFooter) {
      return [productTile, productLinksFooter];
    }
    // If only one found, just use it
    if (productTile) return productTile;
    if (productLinksFooter) return productLinksFooter;
    // Fallback: use all children
    return Array.from(col.children);
  });
  tableCells.push(firstRow);

  // For feature comparison rows, find the max number for all columns
  let maxFeatures = 0;
  const featureRowsByCol = columns.map(col => {
    // Select all rows inside .ToutTableItem_column__qmPtw and null blocks
    const features = Array.from(col.querySelectorAll('.ToutTableItem_column__qmPtw > div, .ToutTableItem_nullContainer__1QM3q'));
    if (features.length > maxFeatures) maxFeatures = features.length;
    return features;
  });

  // Now build each feature comparison row
  for (let i = 0; i < maxFeatures; i++) {
    const row = featureRowsByCol.map(features => {
      // Always reference the actual element from the document
      if (features[i]) return features[i];
      // If missing, use empty string for that cell
      return '';
    });
    tableCells.push(row);
  }

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
