import React, { useState } from 'react';
import { Filter } from '../Filter/Filter';
import './Main.scss';
import { ListRealEstate } from '../ListRealEstate/ListRealEstate';
import { Suspense } from 'react';
import { Placeholder } from '../../../../shared/components/Placeholder/Placeholder';

interface PagedResult {
  data: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function Main() {
  const [listResult, setListResult] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function handlePagedResult(paged: PagedResult) {
    setListResult(paged.data);
    setTotalPages(paged.totalPages);
  }

  return (
    <>
      <div className="wrapper">
        <Filter setPagedResult={handlePagedResult} page={page} />
        <Suspense fallback={<Placeholder />}>
          <ListRealEstate listResult={listResult} />
        </Suspense>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <span className="page-info">{page} / {totalPages}</span>

          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  );
}
