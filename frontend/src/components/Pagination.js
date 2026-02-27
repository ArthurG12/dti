import React from 'react';

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginação de produtos">
      <button
        className="btn btn-outline btn-sm"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >← Anterior</button>
      <span className="pagination-info">{page} / {totalPages}</span>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >Próxima →</button>
    </nav>
  );
}
