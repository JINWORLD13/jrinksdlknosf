import React, { useEffect } from 'react';
import Card from '../../components/common/Card.jsx';
import styles from './TarotSelectionModal.module.scss';
import { useTranslation } from 'react-i18next';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';

const TarotSelectionModal = ({ onClose, onSelectSpread, onSelectTheme }) => {
  const { t, i18n } = useTranslation();
  const { registerModal, unregisterModal } = useModalBackHandler();
  const currentLang = i18n.language;

  // ESC 키·디바이스 뒤로가기 → 닫기와 동일
  useEffect(() => {
    const modalId = 'tarot-selection-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  return (
    <Card className={styles.selectionModal} data-lang={currentLang}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('tarot.selection.title')}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        <button className={styles.choiceBtn} onClick={onSelectSpread}>
          <div className={styles.imgWrapper}>
            <img src="/assets/images/tarot/selection_spread.png" alt="Spread" />
          </div>
          <div className={styles.textWrapper}>
            <h3>{t('tarot.selection.spread_title')}</h3>
            <p>{t('tarot.selection.spread_desc')}</p>
          </div>
        </button>

        <button className={styles.choiceBtn} onClick={onSelectTheme}>
          <div className={styles.imgWrapper}>
            <img src="/assets/images/tarot/selection_theme.png" alt="Theme" />
          </div>
          <div className={styles.textWrapper}>
            <h3>{t('tarot.selection.theme_title')}</h3>
            <p>{t('tarot.selection.theme_desc')}</p>
          </div>
        </button>
      </div>
    </Card>
  );
};

export default TarotSelectionModal;
