import { useState, useEffect, useRef } from 'react';
import forma from './FormGenerator/form';
import './Filter.scss';
import axios from 'axios';
import InputWithOptions from '../../../../shared/components/InputWithOptions/InputWithOptions'
import { Map } from '../../../../shared/components/Map/Map';
export interface FilterProps {
  prop?: string;
  setPagedResult: (paged: { data: any[]; currentPage: number; totalPages: number; totalCount: number }) => void;
  page: number;
  onLoadingChange?: (loading: boolean) => void;
  onFilterChange?: () => void;
}

export function Filter({ setPagedResult, page, onLoadingChange, onFilterChange }: FilterProps) {
  const [city, setCity] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeObject, setTYPEoBJECT] = useState<{ id: number; naziv: string }[]>([])
  const [filterableAmenities, setFilterableAmenities] = useState<{ id: number; name: string; icon: string | null }[]>([])
  const [formav, setForma] = useState({
    select:0,
    text:'',

    city: [] as any[],
    registered:null,
    minPrice:0,
    maxPrice:10000000,
    typeObject:null,
    minRooms:0,
    sortBy:'',
    amenityIds: [] as number[],


  })


function clamper( ){
setForma(prev => {
    let min = Number(prev.minPrice);
    let max = Number(prev.maxPrice);

    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = min+1;

    if (min < 0) min = 0;
    if (max < min) max = min+1;

    return {
      ...prev,
      minPrice: min,
      maxPrice: max
    };
  });


}
  useEffect(()=>{
axios.get("https://localhost:7154/api/TypeOfObject").then((response)=>{

      setTYPEoBJECT(response.data);


    })
  }, [])

  useEffect(() => {
    axios.get("https://localhost:7154/api/amenities").then((response) => {
      setFilterableAmenities(response.data.filter((a: any) => a.isFilterable));
    })
  }, [])

  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);
  const isFirstFilterRun = useRef(true);
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
    } else {
      onFilterChange?.();
    }
  }, [formav]);

  useEffect(() => {
    let ignore = false;
    const queryParams = [];
    if (formav.city.length) queryParams.push('city=' + formav.city.map(x => x.id).join(','));
    queryParams.push(`minRooms=${formav.minRooms}`);
    queryParams.push(`minPrice=${formav.minPrice}`);
    queryParams.push(`maxPrice=${formav.maxPrice}`);
    if (formav.typeObject !== null) queryParams.push(`typeObject=${formav.typeObject}`);
    if (formav.sortBy) queryParams.push(`sortBy=${formav.sortBy}`);
    if (formav.amenityIds.length) queryParams.push(`amenityIds=${formav.amenityIds.join(',')}`);
    queryParams.push(`page=${page}`);

    onLoadingChange?.(true);
    axios.get(`https://localhost:7154/api/RealEstateMain?${queryParams.join('&')}`).then((response) => {
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
  }, [formav, page]);
  function toggleAmenity(amenityId: number) {
    setForma((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter((id) => id !== amenityId)
        : [...prev.amenityIds, amenityId]
    }));
  }

  function handleChange(e) {
    console.log(e.target.value)
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForma((prev) => ({
        ...prev,
        [name]: checked ? value : null
      }));
    } else {
      setForma((prev) => ({
        ...prev,
        [name]: value === '' ? null : value
      }));
    }
    console.log(formav);

  }
  return <>
    <div className="sort-bar">
      <label htmlFor="sortBy">Sort by</label>
      <select name="sortBy" id="sortBy" value={formav.sortBy} onChange={(e) => handleChange(e)}>
        <option value="">Newest</option>
        <option value="priceAsc">Price: low to high</option>
        <option value="priceDesc">Price: high to low</option>
        <option value="areaDesc">Largest area</option>
      </select>
    </div>

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
      <div className="row">
            <label >City</label>
<InputWithOptions name="city" id="city" setCity={setForma} selectedCity={formav}  /> 
      </div>

<div className="row">
  <label htmlFor="select">Type of realestate</label>
<select name="typeObject" id="typeObject" onChange={(e)=>handleChange(e)}>
  <option value="">Any</option>
  {
    typeObject.map((el, i) => (
      <option value={el.id} key={i}>{el.naziv}</option>
    ))
  }
</select>

</div>

<div className="row">
  <label htmlFor="minRooms">Minimal Room Amount</label>
  <input type="number" name="minRooms" step="0.5" defaultValue="0" min="0" max="10" id="minRooms" onChange={(e)=>handleChange(e)} />
</div>

<div className="row">
      <label htmlFor="">Price Range</label>
  <div className=" range">

    
    <input type="number" onBlur={(e)=>clamper(formav.minPrice, formav.maxPrice)} name="minPrice" id="minPrice" value={formav.minPrice} onChange={(e)=>handleChange(e)} />
    <input type="number" onBlur={(e)=>clamper( formav.minPrice,formav.maxPrice)} name="maxPrice" id="maxPrice" value={formav.maxPrice} onChange={(e)=>handleChange(e)}/>
  </div>

</div>

<div className="row ">
<div className="options">
  <div className="option">

    <input type="checkbox" name="registered" id="registered" value="true" onChange={(e)=>handleChange(e)} />   <label htmlFor="registered">Registered</label>
</div>

</div>
 </div>

{filterableAmenities.length > 0 && (
  <div className="row">
    <label>Amenities</label>
    <div className="options">
      {filterableAmenities.map((a) => (
        <div className="option" key={a.id}>
          <input
            type="checkbox"
            id={`amenity-${a.id}`}
            checked={formav.amenityIds.includes(a.id)}
            onChange={() => toggleAmenity(a.id)}
          />
          <label htmlFor={`amenity-${a.id}`}>{a.name}</label>
        </div>
      ))}
    </div>
  </div>
)}


    </form>



  </>;
}
