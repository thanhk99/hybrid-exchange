'use client';

import React from 'react';
import styles from './P2PHeader.module.css';

interface P2PHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

const P2PHeader: React.FC<P2PHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.mainTitle}>{title}</h1>
      <h2 className={styles.subtitle}>{subtitle}</h2>
      
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default P2PHeader;