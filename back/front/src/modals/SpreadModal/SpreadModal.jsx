import React, { useEffect, useState, useCallback } from 'react';
import Card from '../../components/common/Card.jsx';
import styles from './SpreadModal.module.scss';
import { useLanguageChange } from '@/hooks';
import { BottomBox } from './components/BottomBox.jsx';
import { SpreadModalTab } from './components/SpreadModalTab.jsx';
import { SpreadListForVoucher } from './components/SpreadListForVoucher.jsx';
import { SpreadListForPoint } from './components/SpreadListForPoint.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const isNative = Capacitor.isNativePlatform();

// 화면 방향 변경 감지 훅
const useOrientationKey = () => {
  const [orientationKey, setOrientationKey] = useState(0);

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientationKey(prev => prev + 1);
    };

    // orientation 변경 이벤트 및 resize 이벤트 모두 감지
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientationKey;
};

const SpreadModal = ({
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  userCacheForRedux,
  admobReward,
  userInfo,
  ...props
}) => {
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    isVoucherModeOn,
    isInAppPurchaseOpen,
    selectedSpread,
    isStarMode,
    ...rest
  } = stateGroup;

  const {
    updateAnswerForm,
    updateLoginBlinkModalOpen,
    updateChargeModalOpen,
    updateTarotSpreadPricePoint,
    updateTarotSpreadVoucherPrice,
    setVoucherMode,
    setSelectedAdType,
    setInAppPurchaseOpen,
    setTarotModeUnavailable,
    setSelectedSpread,
    setWatchedAd,
    setSpeedTarotUnavailable,
    setIsStarMode,
    ...rest2
  } = setStateGroup;

  // 화면 방향 변경 시 리렌더링을 위한 key
  const orientationKey = useOrientationKey();
  const { toggleSpreadModal, toggleTarotModal } = toggleModalGroup;
  const { handleSelectedTarotMode, handleCancelSpreadModal } = handleStateGroup;
  const browserLanguage = useLanguageChange();

  // 추가 질문 모드 확인
  const isAdditionalQuestionMode = answerForm?.isAdditionalQuestion === true;

  return (
    <Card className={styles.spreadModal} key={orientationKey}>
      <SpreadModalTab
        styles={styles}
        selectedTarotMode={selectedTarotMode}
        handleSelectedTarotMode={handleSelectedTarotMode}
        toggleTarotModal={toggleTarotModal}
        updateAnswerForm={updateAnswerForm}
        setWatchedAd={setWatchedAd}
        browserLanguage={browserLanguage}
        isAdditionalQuestionMode={isAdditionalQuestionMode}
        setSpeedTarotUnavailable={setSpeedTarotUnavailable}
      />
      <SpreadListForVoucher
        styles={styles}
        toggleTarotModal={toggleTarotModal}
        stateGroup={stateGroup}
        setStateGroup={setStateGroup}
        userCacheForRedux={userCacheForRedux}
        admobReward={admobReward}
        isStarMode={isStarMode}
      />
      {/* <SpreadListForPoint
        styles={styles}
        stateGroup={stateGroup}
        setStateGroup={setStateGroup}
        userCacheForRedux={userCacheForRedux}
        toggleTarotModal={toggleTarotModal}
        selectedTarotMode={selectedTarotMode}
      /> */}
      <BottomBox
        styles={styles}
        modalForm={modalForm}
        selectedTarotMode={selectedTarotMode}
        admobReward={admobReward}
        isVoucherModeOn={isVoucherModeOn}
        setVoucherMode={setVoucherMode}
        toggleTarotModal={toggleTarotModal}
        toggleSpreadModal={toggleSpreadModal}
        handleCancelSpreadModal={handleCancelSpreadModal}
        browserLanguage={browserLanguage}
        isStarMode={isStarMode}
        setIsStarMode={setIsStarMode}
      />
    </Card>
  );
};

export default SpreadModal;
