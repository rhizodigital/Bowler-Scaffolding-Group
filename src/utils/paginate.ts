import type { Page } from "astro";

// Represents a link to a specific page
export type PageLink = {
  pageNum: number; // The page number (1-based)
  text: string; // The text to display for the link (e.g., "1", "2", etc.)
  href: string; // The URL for this page
};

// Represents an ellipsis in the pagination (e.g., "...")
export type Ellipsis = {
  text: string; // Text for the ellipsis (e.g., "...")
  pageNum?: never; // No associated page number for ellipses
  href?: never; // No associated URL for ellipses
};

/**
 * Generates a compact pagination range with ellipses for skipped pages.
 *
 * @param pageObj - The page object containing the current page and total pages.
 * @param indexPage - The base URL for the pagination links.
 * @returns An array of PageLink and Ellipsis objects representing the pagination.
 */
export function collapseRange(
  pageObj: Page<unknown>, // Page object from Astro with pagination info
  indexPage: string // Base URL for generating pagination links
): Array<PageLink | Ellipsis> {
  const total = pageObj.lastPage; // Total number of pages
  const currentPage = pageObj.currentPage; // The current active page
  const maxVisible = 5; // Maximum number of visible pages, including ellipses

  // Create a list of all pages as PageLink objects
  const pages = [...Array(total)].map((_, i) => {
    return {
      pageNum: i + 1, // Page number (1-based index)
      text: String(i + 1), // Text for the page (e.g., "1", "2")
      href: `${indexPage}${i === 0 ? "" : `${i + 1}/`}`, // URL for the page
    };
  });

  // If the total number of pages is less than or equal to maxVisible,
  // return all pages without ellipses.
  if (total <= maxVisible) {
    return pages;
  }

  // Generate a compact list of page numbers to display.
  // Include:
  // 1. The first page (always visible).
  // 2. The last page (always visible).
  // 3. The current page (always visible).
  // 4. Up to two pages before and after the current page.
  const pagination = pages
    .map((_, i) => i + 1) // Convert to 1-based page numbers
    .filter(
      (page) =>
        page === 1 || // Always include the first page
        page === total || // Always include the last page
        page === currentPage || // Always include the current page
        (page >= currentPage - 2 && page <= currentPage + 2) // Include pages near the current page
    );

  // Add ellipses for skipped ranges and generate the final pagination
  const paginationWithEllipses: Array<PageLink | Ellipsis> = [];
  pagination.forEach((page, i) => {
    // Add an ellipsis ("...") if there is a gap between the current page
    // and the previous page. For example:
    // - If the previous page was 3 and the current page is 6, add "..."
    if (i > 0 && page > pagination[i - 1] + 1) {
      paginationWithEllipses.push({ text: "..." }); // Add ellipsis
    }
    // Add the actual page link to the result
    paginationWithEllipses.push(pages[page - 1]); // Use 1-based indexing
  });

  return paginationWithEllipses;
}
