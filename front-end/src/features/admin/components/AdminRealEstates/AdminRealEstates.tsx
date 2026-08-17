import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ListRealEstate } from '../../../main/components/ListRealEstate/ListRealEstate';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { API_URL } from '../../../../config';
import './AdminRealEstates.scss';

export function AdminRealEstates() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/realestates`, { params: { search: debouncedSearch, page } })
      .then((res) => {
        setLoadError(false);
        setItems(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? 1);
        setTotalCount(res.data.totalCount ?? 0);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="admin-realestates">
      <h1>All listings</h1>

      <div className="user-search-bar">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : loadError ? (
        <p className="admin-error">
          Could not load listings. <button type="button" onClick={load}>Try again</button>
        </p>
      ) : items.length === 0 ? (
        <p className="admin-empty">
          {debouncedSearch ? `No listings match "${debouncedSearch}".` : 'No listings yet.'}
        </p>
      ) : (
        <>
          <p className="admin-result-count">
            {totalCount} {totalCount === 1 ? 'listing' : 'listings'} found
          </p>
          <ListRealEstate listResult={items} onItemDeleted={load} />
        </>
      )}

      <div className="admin-pagination">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
