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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/realestates?page=${page}`)
      .then((res) => {
        setLoadError(false);
        setItems(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="admin-realestates">
      <h1>All listings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : loadError ? (
        <p className="admin-error">
          Could not load listings. <button type="button" onClick={load}>Try again</button>
        </p>
      ) : (
        <ListRealEstate listResult={items} onItemDeleted={load} />
      )}

      <div className="admin-pagination">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
