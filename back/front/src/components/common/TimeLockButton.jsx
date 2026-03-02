import React from 'react';
import styles from './Button.module.scss';
import { useButtonLock } from '@/hooks';
import { useLanguageChange } from '@/hooks';

const TimeLockButton = ({ ...props }) => {
  const browserLanguage = useLanguageChange();
  const { clickCount, isLocked, remainingTime, handleClick, isLoading } =
    useButtonLock({
      maxClicks: 5,
      particalLockDuration: 60 * 60 * 1000,
      lockDuration: 5 * 60 * 60 * 1000,
      uniqueId: 'myButton',
    });

  //   <p>클릭 횟수: {clickCount}</p>
  //       <p>버튼 상태: {isLocked ? '잠김' : '사용 가능'}</p>

  return (
    <div className={styles['container']}>
      <button
        onClick={handleClick}
        disabled={isLocked}
        className={`${
          browserLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
        } ${props?.className || ''} ${isLocked ? styles['locked'] : ''}`}
      >
        {clickCount === 5 ? remainingTime : `클릭하세요! ${clickCount}/5회`}
      </button>
    </div>
  );
};

export default TimeLockButton;
