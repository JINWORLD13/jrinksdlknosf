import React, { useEffect, useId } from 'react';
import styles from './AlertModal.module.scss';
import Button from '../../components/common/Button.jsx';
import CancelButton from '../../components/common/CancelButton.jsx';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';

const AlertModal = ({ ...props }) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const titleId = useId();
  const descId = useId();

  const closeAlertModal = e => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    if (e?.stopImmediatePropagation) e.stopImmediatePropagation();
    if (props?.updateTarotAlertModalOpen)
      props?.updateTarotAlertModalOpen(false);
    if (props?.updateTarotAllAlertModalOpen)
      props?.updateTarotAllAlertModalOpen(false);
    if (props?.updateUserAlertModalOpen) props?.updateUserAlertModalOpen(false);
  };

  // Prevent background scroll while modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Avoid layout shift when scrollbar disappears (web)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  const handleConfirmClick = async e => {
    try {
      if (props?.handleDeleteTarotHistory && props?.tarotAndIndexInfo) {
        await props?.handleDeleteTarotHistory(props?.tarotAndIndexInfo);
      } else if (props?.deleteUserInfo) {
        await props?.deleteUserInfo(e);
      } else if (props?.handleDeleteAllTarotHistory) {
        await props?.handleDeleteAllTarotHistory();
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      // Add error handling logic here if needed
    } finally {
      closeAlertModal();
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.backdrop}
        onMouseDown={closeAlertModal}
        onTouchStart={closeAlertModal}
      />
      <div
        className={styles['modal-shell']}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>
          <header
            className={
              browserLanguage === 'ja'
                ? styles['title-japanese']
                : styles['title']
            }
          >
            <p id={titleId}>{t(`alert_modal.notice`)}</p>
          </header>
          <div
            id={descId}
            className={
              browserLanguage === 'ja'
                ? styles['modal-content-japanese']
                : styles['modal-content']
            }
          >
            <p>{props?.children}</p>
          </div>
          <footer className={styles['button-box']}>
            <Button
              className={styles['button']}
              onClick={handleConfirmClick}
              autoFocus={true}
            >
              {t(`button.confirm`)}
            </Button>
            <CancelButton
              className={styles['button']}
              onClick={(e = null) => {
                closeAlertModal(e);
              }}
            >
              {t(`button.close`)}
            </CancelButton>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
