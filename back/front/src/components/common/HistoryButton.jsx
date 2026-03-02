import React from 'react';
import { useLanguageChange } from '@/hooks';
import styles from './HistoryButton.module.scss';

export const HistoryButton = props => {
  const browserLanguage = useLanguageChange();
  return (
    <button
      type={props?.type || 'button'}
      className={`${props?.className || ''} ${styles['btn-japanese']}`}
      onClick={props?.onClick}
      title={props?.title || ''}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform:
            browserLanguage === 'ja' ? 'translateY(0px)' : 'translateY(0px)',
        }}
      >
        {props?.children || ''}
      </span>
    </button>
  );
};
