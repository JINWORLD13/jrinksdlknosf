import React, { useEffect } from 'react';
import Card from '../../components/common/Card.jsx';
import styles from './TarotThemeModal.module.scss';
import { useTranslation } from 'react-i18next';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';

const TarotThemeModal = ({ onClose, onSelectTheme }) => {
  const { t, i18n } = useTranslation();
  const { registerModal, unregisterModal } = useModalBackHandler();
  const currentLang = i18n.language;

  // ESC 키·디바이스 뒤로가기 → 닫기와 동일
  useEffect(() => {
    const modalId = 'tarot-theme-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  const themes = [
    {
      id: 'inner_feelings',
      title: t('tarot.theme.inner_feelings_title'),
      desc: t('tarot.theme.inner_feelings_desc'),
      img: '/assets/images/tarot/theme_inner.png',
      listNumber: 5, // Example list number for "Inner Feelings" spread
      spreadTitle: 'Inner Feelings',
      cardCount: 3,
    },
    {
      id: 'future_results',
      title: t('tarot.theme.future_results_title'),
      desc: t('tarot.theme.future_results_desc'),
      img: '/assets/images/tarot/theme_future.png',
      listNumber: 6, // Example list number for "Results" spread
      spreadTitle: 'Future Results',
      cardCount: 3,
    },
  ];

  return (
    <Card className={styles.themeModal} data-lang={currentLang}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('tarot.theme.title')}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        {themes.map(theme => (
          <button
            key={theme.id}
            className={styles.themeBtn}
            onClick={() => onSelectTheme(theme.id)}
          >
            <div className={styles.imgWrapper}>
              <img src={theme.img} alt={theme.title} />
              <div className={styles.overlay}>
                <span>{t('tarot.theme.select')}</span>
              </div>
            </div>
            <div className={styles.textWrapper}>
              <h3>{theme.title}</h3>
              <p>{theme.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default TarotThemeModal;
