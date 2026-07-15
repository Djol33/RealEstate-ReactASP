import React from 'react';

import   './Overlay.scss';

 
export function Overlay( {children, isVisible, changeVisibility} ) {
  return isVisible && <div  id="overlay">{ children}
  
  
  <i className="fa-solid fa-x" onClick={()=>{changeVisibility(false)}}></i>
  </div>
}
