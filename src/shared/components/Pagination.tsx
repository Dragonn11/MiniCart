interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', padding: '1rem 0' }}>
      <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '0.5rem 1rem', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}>
        Previous
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          style={{
            padding: '0.5rem 0.75rem', fontWeight: p === currentPage ? 'bold' : 'normal',
            background: p === currentPage ? '#1a73e8' : '#fff',
            color: p === currentPage ? '#fff' : '#333',
            border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer',
          }}>
          {p}
        </button>
      ))}
      <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '0.5rem 1rem', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>
        Next
      </button>
    </nav>
  );
}
