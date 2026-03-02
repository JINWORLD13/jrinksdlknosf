import React, { useEffect, useCallback, useState } from 'react';
import styles from './AdComponent.module.scss';
import { Capacitor } from '@capacitor/core';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { initializeAdMob } from './initializeAdMob';
import { initializeAdSense } from './initializeAdsense';
import { getLocalizedContent } from './getLocalizedContent';
import { ADSENSE_IDS } from '@/config/adIds.example';
import { useTranslation } from 'react-i18next';
import CancelButton from '../../components/common/CancelButton';
import Button from '../../components/common/Button';

const isNative = Capacitor.isNativePlatform();

//! 스피드 타로용
const AdComponentForInterstital = ({
  stateGroup,
  setStateGroup,
  userInfo,
}) => {
  const { t } = useTranslation();
  const content = getLocalizedContent();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    tarotSpreadPricePoint,
    tarotSpreadVoucherPrice,
    isVoucherModeOn,
    hasWatchedAd,
    selectedAdType,
    isChargeModalOpen,
    isInAppPurchaseOpen,
    selectedSpread,
    selectedCardPosition,
    isReadyToShowDurumagi,
    isDoneAnimationOfBackground,
    ...restOfStateGroup
  } = stateGroup;
  const {
    updateAnswerForm,
    updateCardForm,
    updateQuestionForm,
    updateModalForm,
    setSelectedTarotMode,
    setIsCSSInvisible,
    updateCountry,
    updateLoginBlinkModalOpen,
    updateChargeModalOpen,
    updateTarotSpreadPricePoint,
    updateTarotSpreadVoucherPrice,
    updateTarotManualModalOpen,
    setVoucherMode,
    setSelectedAdType,
    setWatchedAd,
    setInAppPurchaseOpen,
    setFilledInTheQuestion,
    setTarotModeUnavailable,
    setSelectedSpread,
    setSelectedCardPosition,
    setWatchedAdForBlinkModal,
    setReadyToShowDurumagi,
    setAdmobReward,
    ...restOfSetStateGroup
  } = setStateGroup;

  const handleConfirm = useCallback(() => {
    setSelectedAdType(0);
    setWatchedAd(true);
    setWatchedAdForBlinkModal(true);
  }, [setSelectedAdType, setWatchedAd, setWatchedAdForBlinkModal]);

  const handleCancel = useCallback(
    e => {
      setSelectedAdType(0);
      setWatchedAd(false); // 광고 실패/취소 시 결과를 보여주지 않음
      setWatchedAdForBlinkModal(false); // 추가적인 모달 상태 처리
      setIsLoading(false);
      setError(null);
    },
    [setSelectedAdType, setWatchedAd, setWatchedAdForBlinkModal]
  );

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleInitialConfirm = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleInitialCancel = useCallback(
    e => {
      setSelectedAdType(0);
      setWatchedAd(false);
      setWatchedAdForBlinkModal(false);
    },
    [setSelectedAdType, setWatchedAd, setWatchedAdForBlinkModal]
  );

  let listeners = {};
  let cleanup = async () => {
    await AdMob.removeAllListeners();
  };
  let initialFunction;
  useEffect(() => {
    const initializeAd = async () => {
      if (error === null) {
        try {
          if (isNative) {
            if (error !== null) {
              // TODO: 모달창?
              return;
            }
            initialFunction = await initializeAdMob({
              setError,
              setIsLoading,
              setAdmobReward,
              setWatchedAd,
              setWatchedAdForBlinkModal,
              setSelectedAdType,
              selectedAdType,
              selectedTarotMode,
              userInfo,
              content,
              listeners,
            });
          } else {
            await initializeAdSense(
              setError,
              setAdLoaded,
              setIsLoading,
              handleConfirm
            );
          }
        } catch (error) {
          console.error('Ad initialization error:', error);
          setError('AD_INIT_FAILED');
        }
      }
    };

    initializeAd();

    return () => {
      if (initialFunction) cleanup();
      if (initialFunction && Object.values(listeners).length > 0) {
        Object.values(listeners).forEach(listener => listener.remove());
        listeners = {};
      }
    };
  }, [
    error,
    initializeAdMob,
    initializeAdSense,
    selectedAdType,
    initialFunction,
  ]);

  if (error) {
    return (
      <div className={styles['backdrop']}>
        <div className={styles['backdrop-box']}>
          {/* <div className={styles['ad-badge']}>{t(`ad.label`)}</div> */}
          <div className={styles['modal']}>
            <h2>{content?.errorTitle}</h2>
            {/* <div>
                <p>{error}</p>
              </div> */}
            <div>
              <p>{content?.refreshSuggestion}</p>
            </div>
            <div className={styles['btn-box']}>
              <Button onClick={handleRefresh}>{content?.refreshButton}</Button>
              <CancelButton
                onClick={(e = null) => {
                  handleCancel(e);
                }}
              >
                {content?.cancelButton}
              </CancelButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isNative && adLoaded && ADSENSE_IDS.CLIENT && ADSENSE_IDS.SLOT ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          data-ad-client={ADSENSE_IDS.CLIENT}
          data-ad-slot={ADSENSE_IDS.SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </>
  );
};

export default AdComponentForInterstital;
