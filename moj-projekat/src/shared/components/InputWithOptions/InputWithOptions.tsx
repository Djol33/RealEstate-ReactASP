import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InputWithOptions.scss'

 

export default function InputWithOptions({name,id,setCity, selectedCity,...prop}) {
  const [inputValue,setInputValue] = useState('')
  const [options, setOptions] = useState([])
  useEffect(()=>{
console.log(selectedCity.city.map(x => x.id).join(',')); // "3,7,12"
    axios.get(`https://localhost:7154/api/City?CityName=${inputValue}&CitiesToIgnore=${    selectedCity.city.length ?  selectedCity.city.map(x => x.id).join(','):""}`).then((x)=>{
      
      setOptions(x.data)

    })


  },[selectedCity,inputValue])



  function setOnclick(e, item){
    console.log(e,item,"usli u funkciju ")
    setCity((a)=>({
      ...a,
      city:[...a.city, item]
    }))
    setInputValue("")
  }
  function deleteOnClick(e, item){

    setCity((a)=>({
      ...a,
      city:[...a.city].filter((a)=>a.id !== item.id)
    }))
  }
  return <>
  <div className='row'>
<input type="text" name={ name} id={ id} value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
    <div className="options">
      {options.map((item)=>{
        
        return <span key={item.Id}   onMouseDown={(e)=>{   setOnclick(e, item)}}>{item.cityName}</span>

      })}
    </div>
  </div>
    
    <div className="selectedOptions">
        { selectedCity.city.length ? selectedCity.city.map((a)=>{
          return <span onMouseDown={(e)=>{deleteOnClick(e,a)}} >{a.cityName}</span>


        }) : null}
    </div>
  
  </>;
}
