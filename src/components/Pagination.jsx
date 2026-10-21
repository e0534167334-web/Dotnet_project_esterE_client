// שלב 9 – pagination אמיתי: הרכיב רק מחליף מספר עמוד; הנתונים מגיעים מהשרת לפי page ו-pageSize
const PAGE_SIZES = [6, 9, 12, 24];

export default function Pagination({ page, pageSize, totalCount, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalCount === 0) return null;

  // חלון של עד 5 מספרי עמודים סביב העמוד הנוכחי
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <nav className="pagination" aria-label="ניווט בין עמודים">
      <span className="pagination__info">{from}–{to} מתוך {totalCount}</span>

      <div className="pagination__pages">
        <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="העמוד הקודם">›</button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'is-active' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="העמוד הבא">‹</button>
      </div>

      <label className="pagination__size">
        בכל עמוד
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </nav>
  );
}
