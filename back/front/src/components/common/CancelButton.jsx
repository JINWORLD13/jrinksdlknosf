import React, { useRef, useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import styles from './Button.module.scss';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';

const isNative = Capacitor.isNativePlatform();

const CancelButton = ({
  className = '',
  autoFocus = false,
  onClick,
  type = 'button',
  children = '',
  ...restProps
}) => {
  const browserLanguage = useLanguageChange();
  const buttonRef = useRef(null);
  const { registerModal, unregisterModal } = useModalBackHandler();
  const buttonId = React.useId();

  useEffect(() => {
    if (onClick) {
      registerModal(buttonId, () => {
        // 버튼이 실제로 DOM에서 보이는지 확인 (동일 모달 내 여러 버튼 대응)
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(buttonRef.current);
          const isVisible =
            rect.width > 0 &&
            rect.height > 0 &&
            computedStyle.display !== 'none' &&
            computedStyle.visibility !== 'hidden';

          if (isVisible) {
            onClick(null);
          }
        }
      });
    }

    return () => {
      if (onClick) {
        unregisterModal(buttonId);
      }
    };
  }, [onClick, registerModal, unregisterModal, buttonId]);

  const handleClick = e => {
    if (onClick) {
      e.preventDefault();
      // Prevent click-through when the modal closes/unmounts on click.
      // Without this, the same click event can bubble to underlying UI and trigger unintended actions.
      if (typeof e?.stopPropagation === 'function') e.stopPropagation();
      if (typeof e?.stopImmediatePropagation === 'function')
        e.stopImmediatePropagation();
      onClick(e);
    }
  };

  const buttonClass = `${
    browserLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
  } ${className}`.trim();

  return (
    <button
      ref={buttonRef}
      className={buttonClass}
      type={type}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default CancelButton;
