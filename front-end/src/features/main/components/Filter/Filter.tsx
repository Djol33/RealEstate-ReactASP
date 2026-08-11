import { useState, useEffect } from 'react';
import './Filter.scss';
import axios from 'axios';
import { useFilterState, PagedResult } from './useFilterState';
import { SortBar } from './SortBar';
import { FilterFormFields } from './FilterFormFields';
import { API_URL } from '../../../../config';

export interface FilterProps {
  prop?: string;
  setPagedResult: (paged: PagedResult) => void;
  page: number;
  onLoadingChange?: (loading: boolean) => void;
  onFilterChange?: () => void;
}

export function Filter({ setPagedResult, page, onLoadingChange, onFilterChange }: FilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeObject, setTYPEoBJECT] = useState<{ id: number; naziv: string }[]>([]);
  const [filterableAmenities, setFilterableAmenities] = useState<{ id: number; name: string; icon: string | null }[]>([]);

  const { formav, setForma, clamper, toggleAmenity, handleChange } =
    useFilterState(page, setPagedResult, onLoadingChange, onFilterChange);

  useEffect(() => {
    axios.get(`${API_URL}/api/TypeOfObject`).then((response) => {
      setTYPEoBJECT(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/amenities`).then((response) => {
      setFilterableAmenities(response.data.filter((a: any) => a.isFilterable));
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);

  return <>
    <button
      type="button"
      className={`filter-fab ${filterOpen ? 'is-open' : ''}`}
      onClick={() => setFilterOpen(o => !o)}
      aria-label={filterOpen ? 'Close filters' : 'Open filters'}
    >
      {filterOpen
        ? <i className="fa-solid fa-xmark" />
        : <i className="fa-solid fa-filter" />}
    </button>

    {filterOpen && (
      <div className="filter-backdrop" onClick={() => setFilterOpen(false)} />
    )}

    <form id="filter-form" className={filterOpen ? 'is-open' : ''} action="">
      <SortBar sortBy={formav.sortBy} onChange={handleChange} />

      <FilterFormFields
        formav={formav}
        setForma={setForma}
        typeObject={typeObject}
        filterableAmenities={filterableAmenities}
        onChange={handleChange}
        onClamp={clamper}
        onToggleAmenity={toggleAmenity}
      />
    </form>
  </>;
}
