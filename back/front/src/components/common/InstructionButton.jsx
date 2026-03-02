import React from 'react';
import { useLanguageChange } from '@/hooks';
import styles from './InstructionButton.module.scss';

export const InstructionButton = props => {
  const browserLanguage = useLanguageChange();
  return (
    <button
      type={props?.type || 'button'}
      className={`${
        browserLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
      } ${props?.className}`}
      onClick={props?.onClick}
    >
      {props?.children === '' || !props?.children ? '?' : props?.children}
    </button>
  );
};
