import React, { useState } from 'react';

import   './ImageCarousel.scss';

export interface ImageCarouselProps {
  prop?: string;
}

export function ImageCarousel({imageArray} ) {
  const [count, setCount] = useState(0);

  function prev() {
    setCount(i => (i - 1 + imageArray.length) % imageArray.length);
  }

  function next() {
    setCount(i => (i + 1) % imageArray.length);
  }
  return <div className='wrap-parent'>  
    <i onClick={prev} className="fa-solid fa-angle-left arr"></i>

     {imageArray && imageArray.length > 0 ? (
      <img  src={'https://localhost:7154/'+imageArray[count].location} alt="Real estate" />
    ) : (
      <p>Slika se učitava...</p>
      
    )}
    <i onClick={next} className="fa-solid fa-angle-right arr" ></i>
    </div>
}
