import React, { useEffect, useCallback, useState } from 'react';
import styles from './AdComponent.module.scss';
import Button from '../../components/common/Button';
import CancelButton from '../../components/common/CancelButton';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
  AdmobConsentStatus,
  AdmobConsentDebugGeography,
} from '@capacitor-community/admob';
import { useTranslation } from 'react-i18next';
import { initializeAdMob } from './initializeAdMob';
import { initializeAdSense } from './initializeAdsense';
import { getLocalizedContent } from './getLocalizedContent';
import { ADSENSE_IDS } from '@/config/adIds.example';
import { useSelectedTarotCards } from '@/hooks';
import {
  setAdsFree,
  getRewardForPreference,
  useRewardForPreference,
  getAdsFree,
} from '../../utils/storage/tokenPreference';
import { useLanguageChange } from '@/hooks';
import { tarotApi } from '../../api/tarotApi';
import { useDispatch } from 'react-redux';
import {
  setIsAnswered,
  setIsReadyToShowDurumagi,
  setIsWaiting,
} from '../../store/booleanStore';
import { isNormalAccount } from '../../lib/user/isNormalAccount';
import { useRewardFromPreference } from './hooks/useRewardFromPreference';
import { useButtonLock } from '@/hooks';
import AdLoadingComponent from './components/AdLoadingComponent';
import { isDevelopmentMode, isProductionMode } from '@/utils/constants';
import { Analytics } from '@/analytics';
import {
  resolveCombinedReadingConfig,
  hasRealCardStrings,
} from '@/lib/tarot/spread/resolveCombinedSpreadInfo';
import {
  buildOpaqueQuestionFromForm,
  buildOpaqueReadingFromForm,
  decodeOpaqueQuestionToObject,
  decodeOpaqueReadingToObject,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

// 광고 기반 제출 경로도 동일한 payload 추상화를 적용해 공개 코드에서 내부 키 노출을 최소화한다.
// 広告経由の送信経路にも同じ payload 抽象化を適用し、公開コードでの内部キー露出を最小化する。
// The ad-driven submit path applies the same payload abstraction to minimize internal key exposure in public source.
const isNative = Capacitor.isNativePlatform();

const AdComponentForButton = ({
  stateGroup,
  setStateGroup,
  userInfo,
}) => {
  const dispatch = useDispatch();
  const content = getLocalizedContent();
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const browserLanguage = useLanguageChange();
  const [isTarotAble, setTarotAble] = useState(false);
  const { clickCount, isLocked, remainingTime, handleClick } = useButtonLock({
    maxClicks: 5,
    particalLockDuration: 60 * 60 * 1000,
    lockDuration: 5 * 60 * 60 * 1000,
    uniqueId: userInfo?.email,
  });

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
    setDoneAnimationOfBackground,
    setAdmobReward,
    setIsInterpretationLoading,
    ...restOfSetStateGroup
  } = setStateGroup;

  const handleConfirm = useCallback(() => {
    // Firebase Analytics: 웹 광고 확인 버튼 클릭
    Analytics.ad_click('banner', 'adsense_web');
    setSelectedAdType(0);
    setWatchedAd(true);
    setWatchedAdForBlinkModal(true);
  }, [setSelectedAdType, setWatchedAd, setWatchedAdForBlinkModal]);

  const handleCancel = useCallback(
    e => {
      setSelectedAdType(0);
      setWatchedAd(false); // 예: 광고가 닫히면 시청 완료 상태를 false로 변경
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
    setShowInitialPrompt(false);
    setIsLoading(true);
  }, []);

  const [isCancelButtonClicked, setCancelButtonClicked] = useState(false);
  const handleInitialCancel = useCallback(
    e => {
      try {
        if (isCancelButtonClicked) return;
        setCancelButtonClicked(true);
        setSelectedAdType(0);
        setWatchedAd(false);
        setWatchedAdForBlinkModal(false);
        // 취소 시 모달 상태도 초기화하여 다음에 버튼 클릭 시 다시 모달이 표시되도록 함
        setShowInitialPrompt(true);
        setIsLoading(false);
      } catch (error) {
        if (isDevelopmentMode) {
          console.log(error);
        }
      } finally {
        setCancelButtonClicked(false);
      }
    },
    [setSelectedAdType, setWatchedAd, setWatchedAdForBlinkModal]
  );

  const selectedTarotCards = useSelectedTarotCards();

  const onSubmit = async () => {
    const updatedSelectedTarotCards = Array.isArray(selectedTarotCards)
      ? [...selectedTarotCards]
      : [];

    //! Preference에서 바로 reward 제거
    if (isNative) {
      if (selectedTarotMode === 2 || selectedTarotMode === 4)
        await useRewardFromPreference({
          userInfo,
          selectedAdType,
          selectedTarotMode,
          isVoucherModeOn,
          setAdmobReward,
        });
      //! 광고 프리 세팅(여기서 호출하니까 잘됨.)
      await setAdsFree(userInfo);
    }

    // Prefer the already-selected card strings stored in answerForm (free-mode unlock flow).
    // Fallback to Redux selected cards if needed.
    const cardsForSubmit =
      hasRealCardStrings(answerForm?.readingConfig?.[PK.c0])
        ? answerForm.readingConfig?.[PK.c0]
        : updatedSelectedTarotCards
            .map(elem => {
              const name = elem?.name;
              if (!name) return null;
              const dir = elem?.reversed === true ? 'reversed' : 'normal_direction';
              return `${name} (${dir})`;
            })
            .filter(Boolean);

    // Portfolio/public-source masking: schema-like keys are resolved via codec helpers.
    const questionData = decodeOpaqueQuestionToObject(
      buildOpaqueQuestionFromForm(questionForm, true)
    );
    const readingConfig = decodeOpaqueReadingToObject(
      buildOpaqueReadingFromForm(questionForm, cardsForSubmit)
    );
    const encodedQuestionData = buildOpaqueQuestionFromForm(questionData, true);
    const encodedReadingConfig = buildOpaqueReadingFromForm(
      readingConfig,
      readingConfig?.[PK.c0]
    );
    // ! 카페에선 공공와이파이 때문에 블락시키자.
    let result;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let tarotInfo = {
      questionData: encodedQuestionData,
      readingConfig: encodedReadingConfig,
      tarotSpreadVoucherPrice: tarotSpreadVoucherPrice,
      language: browserLanguage,
      time: answerForm?.timeOfCounselling,
      formattedTime: answerForm?.timeOfCounselling?.toLocaleString(
        ['ko-KR', 'ja-JP', 'en-US'].find(locale =>
          locale.startsWith(browserLanguage)
        ) || 'en-US',
        {
          timeZone:
            browserLanguage === 'ko'
              ? 'Asia/Seoul'
              : browserLanguage === 'ja'
              ? 'Asia/Tokyo'
              : userTimeZone,
        }
      ),
      isVoucherModeOn: isVoucherModeOn ?? true,
      // --- Additional-question chain context (critical for native normal-tarot free mode) ---
      additionalQuestionCount: answerForm?.additionalQuestionCount ?? 0,
      isAdditionalQuestion: answerForm?.isAdditionalQuestion === true,
      originalTarotId: answerForm?.originalTarotId || null,
      parentTarotId:
        answerForm?.parentTarotId ||
        (Array.isArray(answerForm?.questionChain) && answerForm.questionChain.length
          ? answerForm.questionChain[answerForm.questionChain.length - 1]?._id
          : null) ||
        null,
      questionChain: Array.isArray(answerForm?.questionChain)
        ? answerForm.questionChain
        : [],
      previousQuestionInfo:
        Array.isArray(answerForm?.questionChain) && answerForm.questionChain.length
          ? answerForm.questionChain[answerForm.questionChain.length - 1]?.questionData
          : null,
      previousAnswer:
        Array.isArray(answerForm?.questionChain) && answerForm.questionChain.length
          ? answerForm.questionChain[answerForm.questionChain.length - 1]?.interpretation
          : null,
      previousSpreadInfo:
        Array.isArray(answerForm?.questionChain) && answerForm.questionChain.length
          ? answerForm.questionChain[answerForm.questionChain.length - 1]?.readingConfig ?? null
          : null,
      isCustomInterpretationFromGeneralReading:
        answerForm?.isCustomInterpretationFromGeneralReading === true,
      combinedReadingConfig:
        (answerForm?.isAdditionalQuestion === true
          ? answerForm?.combinedReadingConfig
          : null) ?? {
          [PK.c0]: cardsForSubmit,
        },
    };
    if (selectedTarotMode === 2 && !isVoucherModeOn) {
      try {
        updateAnswerForm(prev => {
          return {
            ...prev,
            isWaiting: true, //! 이거 굉장히 중요
            isAnswered: false, //! 이거 굉장히 중요
            isSubmitted: true,
          };
        });
        // isNative 보통타로 무료모드에서도 AI 해석 대기 중 WiFi 주의 문구 표시
        setIsInterpretationLoading?.(true);
        result = await tarotApi.postQuestionForNormalForAnthropicAPI(tarotInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInterpretationLoading?.(false);
      }
    }

    if (result?.response !== undefined && result?.response !== null) {
      setSelectedCardPosition(prev => {
        return {
          isClicked: false,
          position: -1,
        };
      });
      const parsedObj = JSON.parse(result?.response?.interpretation);

      const isAdditionalQuestion = tarotInfo?.isAdditionalQuestion === true;
      const questionChain = Array.isArray(tarotInfo?.questionChain)
        ? tarotInfo.questionChain
        : [];
      const newId = result?.response?._id || result?.response?.id;
      const serverAdditionalCount = result?.response?.additionalQuestionCount;
      const resolvedAdditionalCount =
        typeof serverAdditionalCount === 'number'
          ? serverAdditionalCount
          : isAdditionalQuestion
          ? Math.min((answerForm?.additionalQuestionCount ?? 0) + 1, 2)
          : answerForm?.additionalQuestionCount ?? 0;
      const updatedQuestionChain = isAdditionalQuestion
        ? [
            ...questionChain,
            {
              questionData,
              answer: parsedObj || result?.response?.interpretation,
              _id: newId,
            },
          ]
        : questionChain;

      updateAnswerForm({
        // Keep tarot schema-ish fields aligned with AnswerModal expectations
        _id: newId || answerForm?._id,
        questionData,
        readingConfig,
        combinedReadingConfig: resolveCombinedReadingConfig(
          result?.response?.combinedReadingConfig ?? answerForm?.combinedReadingConfig,
          readingConfig
        ),
        answer: parsedObj || result?.response?.interpretation,
        language: tarotInfo?.language,
        timeOfCounselling: tarotInfo?.time,
        createdAt: result?.response.createdAt,
        updatedAt: result?.response.updatedAt,
        // Keep additional-question flow state consistent with server
        isAdditionalQuestion: isAdditionalQuestion,
        questionChain: updatedQuestionChain,
        additionalQuestionCount: resolvedAdditionalCount,
        hasAdditionalQuestion:
          result?.response?.hasAdditionalQuestion ??
          answerForm?.hasAdditionalQuestion ??
          false,
        originalTarotId:
          result?.response?.originalTarotId ?? answerForm?.originalTarotId ?? null,
        parentTarotId:
          result?.response?.parentTarotId ?? answerForm?.parentTarotId ?? null,
        tarotIdChain:
          result?.response?.tarotIdChain ?? answerForm?.tarotIdChain ?? [],
        isWaiting: false,
        isSubmitted: false,
        isAnswered: true,
      });
      dispatch(setIsWaiting(false));
      dispatch(setIsAnswered(true));
      // 애니메이션 순서: MagicCircle(6초) → setDoneAnimationOfBackground → ExplodingGlow → setReadyToShowDurumagi
      setWatchedAd(false);
      setSelectedAdType(0);
    }
  };
  let listeners = {};
  let cleanup = async () => {
    await AdMob.removeAllListeners();
  };

  let initialFunction;
  useEffect(() => {
    const initializeAd = async () => {
      if (!showInitialPrompt && isLoading && error === null) {
        try {
          if (isNative) {
            if (error !== null) return;
            if (!isTarotAble) {
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
                setTarotAble,
                onSubmit,
                handleClick,
                listeners,
              });
            }
            if (
              ![1, 2, 4]?.includes(selectedAdType) ||
              isVoucherModeOn ||
              error !== null
            )
              return;
          } else {
            await initializeAdSense(
              setError,
              setAdLoaded,
              setIsLoading,
              handleConfirm
            );
            if (!isVoucherModeOn) await onSubmit();
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
    showInitialPrompt,
    initializeAdMob,
    initializeAdSense,
    isLoading,
    selectedAdType,
    isVoucherModeOn,
    initialFunction,
    isTarotAble,
  ]);

  if (showInitialPrompt) {
    return (
      <div className={styles['backdrop']}>
        <div className={styles['backdrop-box']}>
          <div className={styles['ad-badge']}>{t(`ad.label`)}</div>
          <div className={styles['modal']}>
            <h2>{content?.initialPrompt.title}</h2>
            <div>
              <p>
                {isNative
                  ? content?.instructionForAd1ForAdMob
                  : content?.instructionForAd1}
              </p>
            </div>
            <div className={styles['btn-box']}>
              <Button onClick={handleInitialConfirm}>
                {isNative
                  ? content?.initialPrompt?.continueButtonForAdMob
                  : content?.initialPrompt?.continueButton}
              </Button>
              <CancelButton
                onClick={(e = null) => {
                  handleInitialCancel(e);
                }}
              >
                {content?.initialPrompt.cancelButton}
              </CancelButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['backdrop']}>
        <div className={styles['backdrop-box']}>
          <div className={styles['ad-badge']}>{t(`ad.label`)}</div>
          <div className={styles['modal']}>
            <h2>{content?.errorTitle}</h2>
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

  if (isLoading) {
    return (
      <AdLoadingComponent
        setIsLoading={setIsLoading}
        setSelectedAdType={setSelectedAdType}
        setWatchedAd={setWatchedAd}
      />
    );
  }

  return (
    <>
      {isNative ? (
        <AdLoadingComponent
          setIsLoading={setIsLoading}
          setSelectedAdType={setSelectedAdType}
          setWatchedAd={setWatchedAd}
        />
      ) : (
        <div className={styles['backdrop']}>
          <div className={styles['backdrop-box']}>
            <div className={styles['ad-badge']}>{t(`ad.label`)}</div>
            <div className={styles['modal']}>
              {adLoaded && ADSENSE_IDS.CLIENT && ADSENSE_IDS.SLOT && (
                <>
                  <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                    data-ad-client={ADSENSE_IDS.CLIENT}
                    data-ad-slot={ADSENSE_IDS.SLOT}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdComponentForButton;
