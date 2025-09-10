'use client';

import React from 'react';
import styles from './P2PLayout.module.css';

interface P2PLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const P2PLayout: React.FC<P2PLayoutProps> = ({ leftContent, rightContent }) => {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftSection}>
        {leftContent}
      </div>
      <div className={styles.rightSection}>
        {rightContent}
      </div>
    </div>
  );
};

export default P2PLayout;