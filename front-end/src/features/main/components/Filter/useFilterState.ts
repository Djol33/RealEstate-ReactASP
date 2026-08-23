import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';

export interface PagedResult {
  data: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface FilterForm {
  select: number;
  text: string;
  city: any[];
  search: string;
  registered: string | null;
  minPrice: number;
  maxPrice: number;
  typeObject: string | null;
  minRooms: number;
  minArea: number;
  maxArea: number;
  sortBy: string;
  amenityIds: number[];
}

const emptyForm: FilterForm = {
  select: 0,
  text: '',
  city: [],
  search: '',
  registered: null,
  minPrice: 0,
  maxPrice: 10000000,
  typeObject: null,
  minRooms: 0,
  minArea: 0,
  maxArea: 0,
  sortBy: '',
  amenityIds: [],
};

export function useFilterState(
  page: number,
  setPagedResult: (paged: PagedResult) => void,
  onLoadingChange?: (loading: boolean) => void,
  onFilterChange?: () => void,
) {
  const [formav, setForma] = useState<FilterForm>(emptyForm);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch((formav.search ?? '').trim()), 400);
    return () => clearTimeout(t);
  }, [formav.search]);

  function clamper() {
    setForma(prev => {
      let min = Number(prev.minPrice);
      let max = Number(prev.maxPrice);

      if (isNaN(min)) min = 0;
      if (isNaN(max)) max = min + 1;

      if (min < 0) min = 0;
      if (max < min) max = min + 1;

      let minA = Number(prev.minArea);
      let maxA = Number(prev.maxArea);

      if (isNaN(minA) || minA < 0) minA = 0;
      if (isNaN(maxA) || maxA < 0) maxA = 0;
      if (maxA > 0 && maxA < minA) maxA = minA;

      return { ...prev, minPrice: min, maxPrice: max, minArea: minA, maxArea: maxA };
    });
  }

  const isFirstFilterRun = useRef(true);
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
    } else {
      onFilterChange?.();
    }
  }, [formav.city, formav.registered, formav.minPrice, formav.maxPrice, formav.typeObject,
      formav.minRooms, formav.minArea, formav.maxArea, formav.sortBy, formav.amenityIds, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    const queryParams = [];
    if (formav.city.length) queryParams.push('city=' + formav.city.map(x => x.id).join(','));
    queryParams.push(`minRooms=${formav.minRooms}`);
    queryParams.push(`minPrice=${formav.minPrice}`);
    queryParams.push(`maxPrice=${formav.maxPrice}`);
    if (debouncedSearch) queryParams.push(`search=${encodeURIComponent(debouncedSearch)}`);
    const minArea = Number(formav.minArea);
    const maxArea = Number(formav.maxArea);
    if (minArea > 0) queryParams.push(`minArea=${minArea}`);
    if (maxArea > 0) queryParams.push(`maxArea=${maxArea}`);
    if (formav.typeObject !== null) queryParams.push(`typeObject=${formav.typeObject}`);
    if (formav.registered !== null) queryParams.push(`registered=${formav.registered}`);
    if (formav.sortBy) queryParams.push(`sortBy=${formav.sortBy}`);
    if (formav.amenityIds.length) queryParams.push(`amenityIds=${formav.amenityIds.join(',')}`);
    queryParams.push(`page=${page}`);

    onLoadingChange?.(true);
    axios.get(`${API_URL}/api/RealEstateMain?${queryParams.join('&')}`).then((response) => {
      if (ignore) return;
      const paged = response.data;
      setPagedResult({
        data: paged.data ?? paged.Data ?? [],
        currentPage: paged.currentPage ?? paged.CurrentPage ?? 1,
        totalPages: paged.totalPages ?? paged.TotalPages ?? 1,
        totalCount: paged.totalCount ?? paged.TotalCount ?? 0,
      });
    }).finally(() => {
      if (!ignore) onLoadingChange?.(false);
    });

    return () => { ignore = true; };
  }, [formav.city, formav.registered, formav.minPrice, formav.maxPrice, formav.typeObject,
      formav.minRooms, formav.minArea, formav.maxArea, formav.sortBy, formav.amenityIds,
      page, debouncedSearch]);

  function toggleAmenity(amenityId: number) {
    setForma((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter((id) => id !== amenityId)
        : [...prev.amenityIds, amenityId],
    }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setForma((prev) => ({ ...prev, [name]: checked ? value : null }));
    } else {
      setForma((prev) => ({ ...prev, [name]: value === '' ? null : value }));
    }
  }

  return { formav, setForma, clamper, toggleAmenity, handleChange };
}
