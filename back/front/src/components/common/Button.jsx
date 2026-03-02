import React, { useRef, useEffect } from 'react';
import styles from './Button.module.scss';
import { useLanguageChange } from '@/hooks';

const Button = props => {
  const browserLanguage = useLanguageChange();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (props?.autoFocus) {
      buttonRef.current.focus();
    }
  }, [props.autoFocus]);

  const handleKeyDown = event => {
    if (event.key === 'Enter' && props?.autoFocus) {
      event.preventDefault();
      event.stopPropagation();
      props.onClick(event);
    }
  };

  // document 레벨에서 엔터 키 이벤트를 감지
  useEffect(() => {
    const handleGlobalKeyDown = event => {
      if (event.key === 'Enter' && props?.autoFocus) {
        event.preventDefault();
        event.stopPropagation();
        props.onClick(event);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [props.onClick, props.autoFocus]);

  return (
    <button
      ref={buttonRef}
      className={`${
        browserLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
      } ${props?.className}`}
      type={props?.type || 'button'}
      onClick={props?.onClick}
      onKeyDown={handleKeyDown}
      autoFocus={props.autoFocus}
      disabled={props?.disabled}
    >
      {props?.children}
    </button>
  );
};

export default Button;
