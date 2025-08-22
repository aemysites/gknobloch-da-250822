/* global WebImporter */
export default function parse(element, { document }) {
  // The header row is always the block name
  const headerRow = ['Columns (columns26)'];

  // Defensive: Find the main gallery UL (columns)
  const gallery = element.querySelector('ul.StickyFooterGallery_itemContainer__Iir9v');
  if (!gallery) return;

  // Each LI in the gallery is a column
  const columns = Array.from(gallery.querySelectorAll(':scope > li'));
  if (!columns.length) return;

  // For each column, gather its primary content and spec/features
  const cells = columns.map(col => {
    // Product Tile (image, title, description, links)
    const tile = col.querySelector('.ProductTile_productTile__P1DTD');
    // Features/specs are just after the tile, in ToutTableItem_column__qmPtw
    // (sometimes there can be multiple, but for this block there's only one per col)
    const specs = col.querySelector('.ToutTableItem_column__qmPtw');
    // Compose a wrapper div with everything for this column
    const wrapper = document.createElement('div');
    if (tile) wrapper.appendChild(tile);
    if (specs) wrapper.appendChild(specs);
    return wrapper;
  });

  // Final table: header row (block name), then one row of N columns
  const tableData = [headerRow, cells];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
