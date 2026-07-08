import React from 'react';
 import { useEffect } from 'react';
import RealEstateBlock from '../../../../shared/components/RealEstateBlock';
import './ListRealEstate.css';
import { Placeholder } from '../../../../shared/components/Placeholder/Placeholder';
import { Link } from 'react-router-dom';
export interface ListRealEstateProps {
  prop?: string;
  listResult:Array<any>;
}

export function ListRealEstate({prop = 'default value', listResult}: ListRealEstateProps) {
const placeholder = [1,2,3,4,5,6,7,8,9,10];
 
  useEffect(() => {
    console.log("zadatak",listResult)
  }, [listResult]);

  return (<div className="list-real-estate-row">
   {
           !listResult?.length ? (
            <div className="no-item-matched">No Item Matched</div>
           ) : (
          
            listResult.map((item) => (
                <Link key={item.id} to={'realestate/'+item.id} style={{textDecoration:"none", color:'black', display:"block"}}>
                    <RealEstateBlock data={item} />
                </Link>
            ))
          )
        }
      
  
  </div>)
}
