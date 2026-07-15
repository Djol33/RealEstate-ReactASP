import React from 'react';

import styles from './RegisterCompany.css';

export interface RegisterCompanyProps {
  prop?: string;
}

export function RegisterCompany({prop = 'default value'}: RegisterCompanyProps) {
  return <div className={styles.RegisterCompany}>RegisterCompany {prop}</div>;
}
