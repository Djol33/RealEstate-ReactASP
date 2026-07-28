import React, { useState } from 'react';
import { Filter } from '../Filter/Filter';
import './Main.scss';
import { ListRealEstate } from '../ListRealEstate/ListRealEstate';
import { Placeholder } from '../../../../shared/components/Placeholder/Placeholder';
import { RecommendationShelf } from '../RecommendationShelf/RecommendationShelf';
import { useAuth } from '../../../../AuthStore';

interface PagedResult {
  data: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function Main() {
  const { user } = useAuth();
  const [listResult, setListResult] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  function handlePagedResult(paged: PagedResult) {
    setListResult(paged.data);
    setTotalPages(paged.totalPages);
  }

  return (
    <>
      {user && (
        <RecommendationShelf title="Recommended for you" endpoint="/api/Recommendations/for-you" />
      )}
      {user && (
        <RecommendationShelf title="Recently viewed" endpoint="/api/Recommendations/recently-viewed" />
      )}
      <RecommendationShelf title="Most viewed" endpoint="/api/Recommendations/trending" />

      <div className="wrapper">
        <Filter setPagedResult={handlePagedResult} page={page} onLoadingChange={setLoading} />
        {loading
          ? <Placeholder />
          : <ListRealEstate listResult={listResult} />}
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
