import React, { useState } from 'react';
import { Filter } from '../Filter/Filter';
import './Main.scss';
import { ListRealEstate } from '../ListRealEstate/ListRealEstate';
import { Placeholder } from '../../../../shared/components/Placeholder/Placeholder';
import { RecommendationShelf } from '../RecommendationShelf/RecommendationShelf';
import { HeroBanner } from '../HeroBanner/HeroBanner';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { useAuth } from '../../../../AuthStore';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';

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
      <SEO
        title="Find your next home"
        description="Browse apartments and houses for sale or rent. List your property and reach buyers and renters near you."
      />
      <HeroBanner />
      {user && (
        <RecommendationShelf title="Recommended for you" endpoint="/api/Recommendations/for-you" />
      )}
      {user && (
        <RecommendationShelf title="Recently viewed" endpoint="/api/Recommendations/recently-viewed" />
      )}
      <RecommendationShelf title="Most viewed" endpoint="/api/Recommendations/trending" />

      <div className="wrapper">
        <Filter setPagedResult={handlePagedResult} page={page} onLoadingChange={setLoading} onFilterChange={() => setPage(1)} />
        {loading
          ? <Placeholder />
          : <ListRealEstate listResult={listResult} />}
      </div>

      <div className="pagination-wrap">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
