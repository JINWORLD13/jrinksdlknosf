import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './InterpretationLoadingModal.module.scss';

const InterpretationLoadingModal = () => {
  const { t } = useTranslation();

  return (
    <div className={styles['modal-container']}>
      <div className={styles['message']}>
        {t('blink_modal.interpretation-loading')}
      </div>
    </div>
  );
};

export default InterpretationLoadingModal;
