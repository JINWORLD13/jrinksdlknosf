import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { X } from 'lucide-react';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';
import { tarotDeck } from '@/data/TarotCardDeck/TarotCardDeck';
import { tarotCardImageFilesPathList } from '@/data/images/images';
import { getYesNoPercent, THEME_KEYS } from '@/data/TarotCardDeck/yesNoByCard';
import {
  getYesNoInterstitialState,
  setYesNoInterstitialState,
} from '@/utils/storage/tokenPreference';
import { showInterstitialForYesNo } from '@/components/GoogleAd/showInterstitial';
import { YesNoButton } from './YesNoButton';
import styles from './YesNoButton.module.scss';

const isNative = Capacitor.isNativePlatform();

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function YesNo({
  modalForm,
  answerForm,
  isReadyToShowDurumagi,
  userInfo,
  isClickedForTodayCardFromHome,
  isTokenFromNavbar,
  onOpenChange,
  ...props
}) {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const isJa = browserLanguage === 'ja';
  const [isOpen, setOpen] = useState(false);
  const [drawn, setDrawn] = useState(null); // { card, reversed }
  const [selectedTheme, setSelectedTheme] = useState(null); // love | career | money | health | relationship | study
  const [isDrawInProgress, setDrawInProgress] = useState(false); // 광고 표시 중 중복 클릭 방지
  const { registerModal, unregisterModal } = useModalBackHandler();

  const isConditionMet = useMemo(
    () =>
      isTokenFromNavbar &&
      !modalForm?.spread &&
      !modalForm?.tarot &&
      !answerForm?.isWaiting &&
      !answerForm?.isAnswered &&
      !isReadyToShowDurumagi &&
      userInfo?.email &&
      Object.keys(userInfo || {}).length > 0,
    [
      isTokenFromNavbar,
      modalForm?.spread,
      modalForm?.tarot,
      answerForm?.isWaiting,
      answerForm?.isAnswered,
      isReadyToShowDurumagi,
      userInfo?.email,
      userInfo,
    ]
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    setDrawn(null);
    setSelectedTheme(null);
    setDrawInProgress(false);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setDrawn(null);
    setSelectedTheme(null);
    setDrawInProgress(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      registerModal('yesno-modal', handleClose);
      return () => unregisterModal('yesno-modal');
    }
  }, [isOpen, registerModal, unregisterModal, handleClose]);

  const doDraw = useCallback(() => {
    const shuffled = shuffleArray(tarotDeck);
    const card = shuffled[0];
    const reversed = Math.random() < 0.5;
    setDrawn({ card, reversed });
  }, []);

  const handleDraw = useCallback(async () => {
    if (isDrawInProgress) return;
    setDrawInProgress(true);

    const finish = () => setDrawInProgress(false);

    if (!isNative) {
      doDraw();
      finish();
      return;
    }
    if (!userInfo?.email) {
      doDraw();
      finish();
      return;
    }

    const state = await getYesNoInterstitialState(userInfo.email);
    const count = state.count + 1;
    const showAt = state.showAt;

    if (count >= showAt) {
      showInterstitialForYesNo(userInfo, wasShown => {
        doDraw();
        if (wasShown) {
          const nextShowAt = 5 + Math.floor(Math.random() * 6);
          setYesNoInterstitialState(userInfo.email, {
            count: 0,
            showAt: nextShowAt,
          });
        } else {
          setYesNoInterstitialState(userInfo.email, { count, showAt });
        }
        finish();
      });
    } else {
      doDraw();
      setYesNoInterstitialState(userInfo.email, { count, showAt });
      finish();
    }
  }, [doDraw, userInfo]);

  const cardImagePath = useMemo(() => {
    if (!drawn?.card || drawn.card.index == null) return null;
    const idx = drawn.card.index;
    if (idx < 0 || idx >= tarotCardImageFilesPathList.length) return null;
    return tarotCardImageFilesPathList[idx];
  }, [drawn]);                    

  const yesNo = useMemo(() => {
    if (!drawn?.card) return null;
    return getYesNoPercent(drawn.card.index, drawn.reversed, selectedTheme);
  }, [drawn, selectedTheme]);

  return (
    <>
      {isConditionMet && !isClickedForTodayCardFromHome && (
        <YesNoButton onOpen={handleOpen} disabled={!isConditionMet} />
      )}

      {isOpen && (
        <div className={styles['overlay']} onClick={handleClose}>
          <div
            className={`${styles['modal']} ${isJa ? styles['modalJa'] : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles['modalClose']}
              onClick={handleClose}
              aria-label={t('button.close') || 'Close'}
            >
              <X size={20} />
            </button>

            {!drawn ? (
              <>
                <h2 className={`${styles['title']} ${isJa ? styles['titleJa'] : ''}`}>
                  {t('yesno.title') || 'Yes / No 타로'}
                </h2>
                <p className={`${styles['subtitle']} ${isJa ? styles['subtitleJa'] : ''}`}>
                  {t('yesno.subtitle') ||
                    '테마를 선택하고 질문을 마음에 품고 카드를 뽑아보세요.'}
                </p>
                <p className={`${styles['themeLabel']} ${isJa ? styles['themeLabelJa'] : ''}`}>
                  {t('yesno.theme_select') || '테마 선택'}
                </p>
                <div className={styles['themeGrid']}>
                  {THEME_KEYS.map(key => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles['themeBtn']} ${styles[`themeBtn_${key}`]} ${
                        selectedTheme === key ? styles['themeBtn_active'] : ''
                      } ${isJa ? styles['themeBtnJa'] : ''}`}
                      onClick={() => setSelectedTheme(key)}
                    >
                      {t(`yesno.theme_${key}`)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={`${styles['drawBtn']} ${isJa ? styles['drawBtnJa'] : ''}`}
                  onClick={handleDraw}
                  disabled={!selectedTheme || isDrawInProgress}
                >
                  {t('yesno.draw') || '카드 뽑기'}
                </button>
              </>
            ) : (
              <div className={styles['resultWrap']}>
                <h2 className={`${styles['title']} ${isJa ? styles['titleJa'] : ''}`}>
                  {t('yesno.result_title') || '결과'}
                </h2>
                {selectedTheme && (
                  <span className={`${styles['themeBadge']} ${styles[`themeBadge_${selectedTheme}`]} ${isJa ? styles['themeBadgeJa'] : ''}`}>
                    {t(`yesno.theme_${selectedTheme}`)}
                  </span>
                )}
                <div className={styles['cardWrap']}>
                  <img
                    src={cardImagePath}
                    alt={drawn.card?.name}
                    className={`${styles['cardImg']} ${
                      drawn.reversed ? styles['reversed'] : ''
                    }`}
                  />
                </div>
                <p className={`${styles['cardName']} ${isJa ? styles['cardNameJa'] : ''}`}>
                  {drawn.reversed && (t('yesno.reversed') || '역방 ') + ' '}
                  {drawn.card?.name}
                </p>

                <div className={styles['dualBarWrap']}>
                  <div
                    className={`${styles['dualBarYes']} ${isJa ? styles['dualBarYesJa'] : ''}`}
                    style={{ width: `${yesNo.yesPercent}%` }}
                  >
                    {yesNo.yesPercent > 18 ? `Yes ${Math.round(yesNo.yesPercent)}%` : ''}
                  </div>
                  <div
                    className={`${styles['dualBarNo']} ${isJa ? styles['dualBarNoJa'] : ''}`}
                    style={{ width: `${yesNo.noPercent}%` }}
                  >
                    {yesNo.noPercent > 18 ? `No ${Math.round(yesNo.noPercent)}%` : ''}
                  </div>
                </div>

                <div className={styles['percentRow']}>
                  <span className={`${styles['percentLabel']} ${isJa ? styles['percentLabelJa'] : ''}`}>Yes</span>
                  <div className={styles['percentBarWrap']}>
                    <div
                      className={`${styles['percentBar']} ${styles['percentBarYes']}`}
                      style={{ width: `${yesNo.yesPercent}%` }}
                    />
                  </div>
                  <span className={`${styles['percentValue']} ${isJa ? styles['percentValueJa'] : ''}`}>
                    {Math.round(yesNo.yesPercent)}%
                  </span>
                </div>
                <div className={styles['percentRow']}>
                  <span className={`${styles['percentLabel']} ${isJa ? styles['percentLabelJa'] : ''}`}>No</span>
                  <div className={styles['percentBarWrap']}>
                    <div
                      className={`${styles['percentBar']} ${styles['percentBarNo']}`}
                      style={{ width: `${yesNo.noPercent}%` }}
                    />
                  </div>
                  <span className={`${styles['percentValue']} ${isJa ? styles['percentValueJa'] : ''}`}>
                    {Math.round(yesNo.noPercent)}%
                  </span>
                </div>

                <p className={`${styles['hint']} ${isJa ? styles['hintJa'] : ''}`}>
                  {t('yesno.hint') ||
                    '카드의 에너지는 참고만 하시고, 최종 선택은 당신에게 달려 있어요.'}
                </p>
                <button
                  type="button"
                  className={`${styles['closeBtn']} ${isJa ? styles['closeBtnJa'] : ''}`}
                  onClick={handleClose}
                >
                  {t('button.close') || '닫기'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
