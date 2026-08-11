import './Pagination.scss';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageList(page: number, totalPages: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const siblings = 1;

  const start = Math.max(2, page - siblings);
  const end = Math.min(totalPages - 1, page + siblings);

  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">&hellip;</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`page-number ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className="page-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right" />
      </button>
    </div>
  );
}
