import Link from 'next/link';

// Pagination controls component
export default function Pagination({ page = 1, total = 0, limit = 10, query = '', tag = '', tags = '' }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Next page aur Prev page URLs banane ke liye
  const getPageUrl = (pageNum) => {
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    if (query) params.set('q', query);
    if (tags) {
      params.set('tags', tags);
    } else if (tag) {
      params.set('tag', tag);
    }
    return `/blog?${params.toString()}`;
  };

  // Max 3 pages numbers hi show karenge
  let startPage = Math.max(1, page - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="pagination-wrapper">
      <nav className="pagination-nav right-aligned" aria-label="Blog posts pagination">
        {/* Previous Button (Page 1 par disabled) */}
        {isFirstPage ? (
          <span
            className="pagination-circle-btn disabled"
            title="Previous Page (Disabled)"
            aria-disabled="true"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
        ) : (
          <Link
            href={getPageUrl(page - 1)}
            scroll={false}
            className="pagination-circle-btn prev-btn"
            title="Previous Page"
            aria-label="Previous Page"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        )}

        {/* Max 3 Page Numbers (1 2 3) */}
        <div className="pagination-list">
          {visiblePages.map((pageNum) => {
            const isActive = pageNum === page;
            return isActive ? (
              <span
                key={pageNum}
                className="pagination-number active"
                aria-current="page"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum)}
                scroll={false}
                className="pagination-number"
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Circle Next Button (Disabled on Last Page) */}
        {isLastPage ? (
          <span
            className="pagination-circle-btn disabled"
            title="Next Page (Disabled)"
            aria-disabled="true"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        ) : (
          <Link
            href={getPageUrl(page + 1)}
            scroll={false}
            className="pagination-circle-btn next-btn"
            title="Next Page"
            aria-label="Next Page"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
