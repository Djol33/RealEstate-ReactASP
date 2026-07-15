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
}

export function Filter({ setPagedResult, page }: FilterProps) {
  const [city, setCity] = useState('');
  const [typeObject, setTYPEoBJECT] = useState<{ id: number; naziv: string }[]>([])
  const [formav, setForma] = useState({
    select:0,
    text:'',
    
    city: [] as any[],
    registered:null,
    minPrice:0,
    maxPrice:10000000,
    typeObject:null,
    minRooms:0,


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
    const queryParams = [];
    if (formav.city.length) queryParams.push('city=' + formav.city.map(x => x.id).join(','));
    queryParams.push(`minRooms=${formav.minRooms}`);
    queryParams.push(`minPrice=${formav.minPrice}`);
    queryParams.push(`maxPrice=${formav.maxPrice}`);
    if (formav.typeObject !== null) queryParams.push(`typeObject=${formav.typeObject}`);
    queryParams.push(`page=${page}`);

    axios.get(`https://localhost:7154/api/RealEstateMain?${queryParams.join('&')}`).then((response) => {
      const paged = response.data;
      setPagedResult({
        data: paged.data ?? paged.Data ?? [],
        currentPage: paged.currentPage ?? paged.CurrentPage ?? 1,
        totalPages: paged.totalPages ?? paged.TotalPages ?? 1,
        totalCount: paged.totalCount ?? paged.TotalCount ?? 0,
      });
    });
  }, [formav, page]);
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
    <form id="filter-form" action="">
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
<div className=" options d-block">
  <div className="option display-inline-block"> 
    
    <input type="checkbox" name="registered" id="registered" value="true" onChange={(e)=>handleChange(e)} />   <label htmlFor="registered">Registered</label>
</div>

</div>
 </div>
     
  


    </form>



  </>;
}
