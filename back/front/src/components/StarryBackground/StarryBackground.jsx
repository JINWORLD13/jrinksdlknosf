import React from 'react';
import styles from './StarryBackground.module.scss';

/**
 * 움직이는 별 배경 컴포넌트
 * 오버플로우 없이 전체 화면에 별들이 움직입니다
 */
const StarryBackground = () => {
  return (
    <div className={styles['starry-background']}>
      <div className={`${styles.stars} ${styles['stars-layer-1']}`}></div>
      <div className={`${styles.stars} ${styles['stars-layer-2']}`}></div>
      <div className={`${styles.stars} ${styles['stars-layer-3']}`}></div>
      <div className={styles['shooting-star']}></div>
    </div>
  );
};

export default StarryBackground;
