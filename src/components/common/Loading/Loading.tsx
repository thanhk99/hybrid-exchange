// components/common/loading/Loading.tsx
'use client';

import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  overlay = false,
}) => {
  if (overlay) {
    return (
      <div className={styles.overlay}>
        <div className={styles.loadingContent}>
          <div className={`${styles.spinner} ${styles[size]}`}></div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inlineLoading}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};