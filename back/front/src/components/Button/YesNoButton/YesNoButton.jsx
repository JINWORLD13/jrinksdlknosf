import React from 'react';
import { Circle, Slash, X } from 'lucide-react';
import styles from './YesNoButton.module.scss';

export const YesNoButton = ({ onOpen, disabled, ...props }) => {
  const handleClick = e => {
    if (disabled) return;
    onOpen?.();
  };

  return (
    <div
      className={styles['yesno']}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      aria-label="O/X Tarot"
      aria-disabled={disabled ? 'true' : 'false'}
      {...props}
    >
      <span className={styles['yesnoIconRow']} aria-hidden="true">
        <Circle size={18} strokeWidth={2.6} />
        <Slash size={16} strokeWidth={2.6} />
        <X size={18} strokeWidth={2.6} />
      </span>
    </div>
  );
};
