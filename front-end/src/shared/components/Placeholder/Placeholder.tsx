import React from 'react';

import './Placeholder.css';
export interface PlaceholderProps {
  prop?: string;
}

export function Placeholder({prop = 'default value'}: PlaceholderProps) {
  return <div className='result-item placeholder' > </div>;
}
