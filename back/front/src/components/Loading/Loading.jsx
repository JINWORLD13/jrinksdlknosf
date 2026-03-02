import React from 'react';
import styles from './LoadingForm.module.scss';

const LoadingForm = ({ phrase }) => {
  return (
    <div id="load" className={styles['container']}>
      <div className={styles['starry-background']}>
        <div className={`${styles.stars} ${styles['stars-layer-1']}`}></div>
        <div className={`${styles.stars} ${styles['stars-layer-2']}`}></div>
        <div className={`${styles.stars} ${styles['stars-layer-3']}`}></div>
        <div className={styles['shooting-star']}></div>
      </div>
      <div className={styles['bar-and-phrase']}>
        {phrase != null && phrase !== '' ? (
          <p className={styles['phrase']}>{phrase}</p>
        ) : (
          <div className={styles['phrase-spacer']} aria-hidden="true" />
        )}
        <div className={styles['loading-bar-wrap']} aria-hidden="true">
          <div className={styles['loading-bar-track']}>
            <div className={styles['loading-bar-fill']} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingForm;
