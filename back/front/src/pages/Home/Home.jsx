import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useTransition,
  Suspense,
  useCallback,
  useRef,
} from 'react';
import styles from './Home.module.scss';
import { resolveCombinedCardsArr } from '@/lib/tarot/spread/resolveCombinedSpreadInfo';
import SpreadModal from '../../modals/SpreadModal/SpreadModal.jsx';
import TarotModal from '../../modals/TarotModal/TarotModal.jsx';
import { useTranslation } from 'react-i18next';
import {
  useAnswerFormState,
  useQuestionFormState,
  useModalFormState,
  useCardFormState,
  useSelectedTarotModeState,
  useIsCSSInvisibleState,
  useCountryState,
  useBlinkModalState,
  useChargeModalState,
  useTarotSpreadPricePointState,
  useTarotManualModalState,
  useRefundPolicyState,
  usePriceInfoModalState,
  useTarotSpreadVoucherPriceState,
  useAuth,
} from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { resetAllTarotCards } from '../../store/tarotCardStore.jsx';
import {
  setIsAnswered,
  setIsWaiting,
  setIsDoneAnimationOfBackground,
  setIsReadyToShowDurumagi,
} from '../../store/booleanStore.jsx';
import AnswerModalView from '../../modals/AnswerModal/AnswerModalView.jsx';
import TarotManualModal from '../../modals/TarotManualModal/TarotManualModal.jsx';
import {
  usePreventModalBackgroundScroll,
  useFetchUserAndTarotDataWithRedux,
  userCacheForRedux,
} from '@/hooks';
import { useLanguageChange } from '@/hooks';
import { getPathWithLang } from '../../config/route/UrlPaths.jsx';
import { isProductionMode, isDevelopmentMode } from '@/utils/constants';
import { tarotApi } from '../../api/tarotApi.jsx';
import { log } from '@/analytics';
import { useFirebaseAnalytics } from '../../hooks/useFirebaseAnalytics';
import { userApi } from '../../api/userApi.jsx';
import { hasAccessToken } from '../../utils/storage/tokenCookie.jsx';
import {
  getRewardForPreference,
  hasAccessTokenForPreference,
} from '../../utils/storage/tokenPreference.jsx';
import AdComponentForButton from '../../components/GoogleAd/AdComponentForButton.jsx';
import { createCancelToken } from '../../api/api.jsx';
import ChargeModal from '../../modals/PurchaseModal/TossPurchase/ChargeModal.jsx';
import InAppPurchase from '../../modals/PurchaseModal/InAppPurchase/InAppPurchase.jsx';
import { checkViolationInGoogleInAppRefund } from '../../utils/validation/checkViolation.jsx';
import isComDomain from '../../utils/validation/isComDomain.jsx';
import { BlinkModalSet } from '../../components/BlinkModals/BlinkModalSet.jsx';
import TarotQuestionInstructionModal from '../../modals/TarotQuestionInstructionModal/TarotQuestionInstructionModal.jsx';
import { getTodayCard } from '../../utils/storage/tokenLocalStorage.jsx';
import { getTodayCardForNative } from '../../utils/storage/tokenPreference.jsx';
//! capacitor용
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { AdMob } from '@capacitor-community/admob';
import {
  getStoreReviewUrl,
  getReviewRequestPrefKey,
} from '../../utils/reviewRequest.js';
import ReviewRequestModal from '../../modals/ReviewRequestModal/ReviewRequestModal.jsx';
const isNative = Capacitor.isNativePlatform();
import AdComponentForInterstital from '../../components/GoogleAd/AdComponentForInterstital.jsx';
import { isNormalAccount } from '../../lib/user/isNormalAccount.js';
import { isAdsFreePassValid } from '../../lib/user/isAdsFreePassValid.jsx';
import { useTotalCardsNumber } from '@/hooks';
import {
  useOutletContext,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import DailyTarotCard from '../../components/Button/DailyTarotButton/DailyTarotCard.jsx';
import Login from '../../components/Button/LoginButton/Login.jsx';
import LoadingForm from '../../components/Loading/Loading.jsx';
import Spread from '../../components/Button/SpreadButton/Spread.jsx';
import MyPage from '../../components/Button/MyPageButton/MyPage.jsx';
import NoticePopup from '../../components/NoticePopup/NoticePopup.jsx';
import HomeWelcomePhrase from '../../components/HomeWelcomePhrase/HomeWelcomePhrase.jsx';
import AnswerModal from '../../modals/AnswerModal/AnswerModal.jsx';
import TarotManual from '../../components/Button/TarotManual/TarotManual.jsx';
import Invite from '../../components/Button/InviteButton/Invite.jsx';
import YesNo from '../../components/Button/YesNoButton/YesNo.jsx';
import ReadingTypeChoiceModal from '../../modals/ReadingTypeChoiceModal/ReadingTypeChoiceModal.jsx';
import ClientInfoModal from '../../modals/ClientInfoModal/ClientInfoModal.jsx';
import GeneralReadingQuestionModal from '../../modals/GeneralReadingQuestionModal/GeneralReadingQuestionModal.jsx';
import { UserCircle } from 'lucide-react';
import GeneralReadingSpreadChoiceModal from '../../modals/GeneralReadingSpreadChoiceModal/GeneralReadingSpreadChoiceModal.jsx';
import {
  getPreparedCards,
  SPREAD_OPTIONS,
  getSpreadImageUrl,
  normalizeLanguage,
  GENERAL_READING_SPREAD_LIST_NUMBER,
  QUESTION_SPREAD_IDS,
  GENERAL_READING_QUESTIONS,
} from '../../lib/tarot/generalReading';
import {
  encodeQuestionDataOpaque,
  encodeReadingConfigOpaque,
  createEmptyQuestionData,
  createEmptyQuestionForm,
  createEmptyReadingConfig,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

// 홈 화면의 커스텀 리딩 요청도 같은 추상 포맷으로 보내서 공개 코드에서 스키마 유추를 줄인다.
// ホーム画面のカスタムリーディング送信も同じ抽象フォーマットを使い、公開コードでのスキーマ推測を減らす。
// Custom reading requests from Home also use the same abstract format to reduce schema inference from public source.
// Three.js 씬을 lazy loading으로 분리하여 초기 로딩 속도 개선
const TarotHomeScene = React.lazy(
  () => import('../../components/ThreeScene/TarotHomeScene.jsx'),
);
import InterpretationLoadingModal from '../../modals/InterpretationLoadingModal/InterpretationLoadingModal.jsx';

const VALID_QUESTION_IDS = GENERAL_READING_QUESTIONS.ko.map(q => q.id);
const VALID_SPREAD_IDS = [...QUESTION_SPREAD_IDS];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const {
    setSelectedTarotModeForApp,
    setIsVoucherModeOnForApp,
    setWatchedAdForApp,
    setAnswerFormForApp,
    setModalFormForApp,
    setIsDurumagiModalWithInterpretationOpen,
  } = useOutletContext();
  const dispatch = useDispatch();
  const {
    trackAdditionalQuestionButtonClick,
    trackAdditionalQuestionAbandoned,
    trackNavigation,
  } = useFirebaseAnalytics();
  const { t, i18n } = useTranslation();
  const browserLanguage = useLanguageChange();
  const normalizedPathname =
    location.pathname !== '/' && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname;
  const isHomeRoute =
    normalizedPathname === '/' || normalizedPathname === `/${browserLanguage}`;

  // Navbar와 동일한 로그인 감지 기능 사용
  const { isToken, isCheckingToken } = useAuth();

  // 개별 CancelToken source 생성
  const sourceRef = useRef(createCancelToken());
  const [isPending, startTransition] = useTransition();
  const [userInfo, setUserInfo] = useState({});
  const resultOfHasUserEmail = useMemo(() => {
    return userInfo?.email ? isComDomain(userInfo?.email) : false;
  }, [userInfo?.email]);
  const [answerForm, updateAnswerForm] = useAnswerFormState();
  const [isReadyToShowDurumagi, setReadyToShowDurumagi] = useState(false);
  const [isDoneAnimationOfBackground, setDoneAnimationOfBackground] =
    useState(false);
  const [cardForm, updateCardForm] = useCardFormState();
  const [questionForm, updateQuestionForm] = useQuestionFormState();
  const [modalForm, updateModalForm] = useModalFormState();
  const [selectedTarotMode, setSelectedTarotMode] = useSelectedTarotModeState();
  const [isCSSInvisible, setIsCSSInvisible] = useIsCSSInvisibleState();
  const [country, updateCountry] = useCountryState();
  const [isVoucherModeOn, setVoucherMode] = useState(() => {
    if (isNative) return false; //! 광고모드부터 보여주기
    if (!isNative) return true;
  }); //& 광고모드를 먼저 내보내냐 아니면 바우처모드를 먼저 내보냐 결정함.
  const [hasWatchedAd, setWatchedAd] = useState(false); //! isAnswered true일때 false로 되돌려야 함.
  const [hasWatchedAdForBlinkModal, setWatchedAdForBlinkModal] =
    useState(false);
  const [selectedAdType, setSelectedAdType] = useState(0); //! 0번이 none, 1번이 전면형, 2번이 보상형, 4번이 전면보상형 (애드몹 - 애드센스엔 영향 x)
  const [isInviteOpen, setIsInviteOpen] = useState(false); // Invite 모달 상태 (frameloop 제어용)
  //~ start
  const [admobReward, setAdmobReward] = useState(null); // 초기값은 null 또는 기본값
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showWelcomePhrase, setShowWelcomePhrase] = useState(true);
  const handleWelcomePhraseDone = useCallback(
    () => setShowWelcomePhrase(false),
    [],
  );

  // 웹 진입 시 URL의 ?ref=를 보존 (로그인 후 자동 청구용)
  useEffect(() => {
    const saveReferralCode = async () => {
      try {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
          if (isNative) {
            await Preferences.set({ key: 'pending_referrer_id', value: ref });
          } else {
            localStorage.setItem('pending_referrer_id', ref);
          }
        }
      } catch (_) {}
    };
    saveReferralCode();
  }, []);

  // DB에 reviewRequestShown이 있으면 로컬 Preferences에도 동기화 (다른 기기/재설치 시, 이메일별 키)
  useEffect(() => {
    if (!isNative || !userInfo?.reviewRequestShown) return;
    (async () => {
      try {
        const key = getReviewRequestPrefKey(userInfo?.email);
        await Preferences.set({ key, value: 'true' });
      } catch (_) {}
    })();
  }, [isNative, userInfo?.reviewRequestShown, userInfo?.email]);

  useEffect(() => {
    setSelectedTarotModeForApp(selectedTarotMode);
    setIsVoucherModeOnForApp(isVoucherModeOn);
    setWatchedAdForApp(hasWatchedAd);
    setAnswerFormForApp(answerForm);
    setModalFormForApp(modalForm);
  }, [
    selectedTarotMode,
    isVoucherModeOn,
    hasWatchedAd,
    answerForm.isWaiting,
    answerForm.isAnswered,
    answerForm.isSubmitted,
    answerForm.answer,
    answerForm.questionData.question,
    modalForm.spread,
    modalForm.tarot,
  ]);

  useEffect(() => {
    let isMounted = true;

    const fetchReward = async () => {
      try {
        let type =
          isProductionMode && isNormalAccount(userInfo) ? 'Voucher' : 'coins';
        const rewardAmount = await getRewardForPreference(
          type,
          userInfo?.email,
        );
        if (isMounted) {
          setAdmobReward(rewardAmount);
        }
      } catch (error) {
        if (error.name === 'AbortError') return; // 요청 취소 시 무시
        console.error('Failed to fetch reward:', error);
      }
    };

    fetchReward();

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트 방지
    };
  }, [userInfo]); // userInfo가 변경될 때마다 실행
  //~ end

  const [isLoginBlinkModalOpen, updateLoginBlinkModalOpen] =
    useBlinkModalState();
  const [isCopyBlinkModalOpen, updateCopyBlinkModalOpen] = useBlinkModalState();
  const [isSaveBlinkModalOpen, updateSaveBlinkModalOpen] = useBlinkModalState();
  const [isChargeModalOpen, updateChargeModalOpen] = useChargeModalState();
  const [isInAppPurchaseOpen, setInAppPurchaseOpen] = useState(false);
  const [isTarotManualModalOpen, updateTarotManualModalOpen] =
    useTarotManualModalState();
  const [tarotSpreadPricePoint, updateTarotSpreadPricePoint] =
    useTarotSpreadPricePointState();
  const [tarotSpreadVoucherPrice, updateTarotSpreadVoucherPrice] =
    useTarotSpreadVoucherPriceState();
  //^ 환불약관 및 가격정보 모달 state
  const [isRefundPolicyOpen, updateRefundPolicyOpen] =
    useRefundPolicyState(false);
  const [isPriceInfoModalOpen, updatePriceInfoModalOpen] =
    usePriceInfoModalState(false);
  //~ 타로 질문 설명 모달 state
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const [isInterpretationLoading, setIsInterpretationLoading] = useState(false);
  /** Three.js 씬(WebGL + 첫 프레임·모델) 완전 로딩 시 true — 로딩 오버레이 해제 */
  const [isThreeSceneReady, setIsThreeSceneReady] = useState(false);

  /** 모바일 등에서 onSceneReady가 안 오면 일정 시간 후 강제로 문구 표시 */
  useEffect(() => {
    if (isThreeSceneReady) return;
    const fallback = setTimeout(() => setIsThreeSceneReady(true), 10000);
    return () => clearTimeout(fallback);
  }, [isThreeSceneReady]);

  //& KRW, USD 충전용 모달 state
  const [isChargingKRWBlinkModalOpen, setChargingKRWBlinkModalOpen] =
    useBlinkModalState(false);
  const [isChargingUSDBlinkModalOpen, setChargingUSDBlinkModalOpen] =
    useBlinkModalState(false);
  //~ tarot modal question field 채우기 state
  const [isFilledInTheQuestion, setFilledInTheQuestion] = useState(true);
  //~ tarot modal question field 글자수 오버 state
  const [isQuestionOverLimit, setQuestionOverLimit] = useState(false);
  //~ 이용불가 이용권 state
  const [isUnavailableVoucher, setUnavailableVoucher] = useState(false);
  //~ 이용불가 타로모드 state
  const [isTarotModeUnavailable, setTarotModeUnavailable] = useState(false);
  //~ 스피드 타로모드 해석 없다는 안내창 state
  const [isSpeedTarotNotificationOn, setSpeedTarotNotificationOn] =
    useState(false);
  //~ 스피드 타로 선택 불가 state (추가 질문 모드일 때)
  const [isSpeedTarotUnavailable, setSpeedTarotUnavailable] = useState(false);
  //~ 맞춤 리딩 별/이용권 부족 토스트
  const [
    isCustomReadingInsufficientBlinkModalOpen,
    updateCustomReadingInsufficientBlinkModalOpen,
  ] = useBlinkModalState();
  //~ 스프레드 선택 state
  const [selectedSpread, setSelectedSpread] = useState(false);
  //~ 카드 정보 state
  const [selectedCardPosition, setSelectedCardPosition] = useState({
    isClicked: false,
    position: -1,
  });
  //! 1이 심플, 2가 상세입력 모드
  const [questionMode, setQuestionMode] = useState(1);
  //? 필요 이용권명 및 수량, 그리고 해당 이용권 보유 수량.
  const [requiredVoucherInfo, setRequiredVoucherInfo] = useState({
    name: 0,
    requiredAmount: 0,
    remainingAmount: 0,
  });

  // 별 사용 모드 상태 (이용권 모드에서만 사용)
  const [isStarMode, setIsStarMode] = useState(false);

  // 별 사용 모드 상태 불러오기
  useEffect(() => {
    const fetchStoredMode = async () => {
      if (!userInfo?.email) return;

      const storageKey = `isStarMode_${userInfo.email}`;
      let storedValue;

      if (isNative) {
        const { value } = await Preferences.get({ key: storageKey });
        storedValue = value;
      } else {
        storedValue = localStorage.getItem(storageKey);
      }

      if (storedValue !== null) {
        setIsStarMode(storedValue === 'true');
      }
    };

    fetchStoredMode();
  }, [userInfo?.email]);

  // 별 사용 모드 상태 저장하기
  useEffect(() => {
    const saveStoredMode = async () => {
      if (!userInfo?.email) return;

      const storageKey = `isStarMode_${userInfo.email}`;
      const valueToStore = String(isStarMode);

      if (isNative) {
        await Preferences.set({ key: storageKey, value: valueToStore });
      } else {
        localStorage.setItem(storageKey, valueToStore);
      }
    };

    saveStoredMode();
  }, [isStarMode, userInfo?.email]);

  // --- Additional Question flow state (must be declared before any callbacks that reference it) ---
  const [questionKind, setQuestionKind] = useState(0);
  const [isClickedForTodayCard, setClickedForTodayCard] = useState(false);
  // 추가 질문 카운트 상태 (0부터 시작, 최대 2)
  const [additionalQuestionCount, setAdditionalQuestionCount] = useState(0);
  // 추가 질문 모드 상태
  const [isAdditionalQuestionMode, setIsAdditionalQuestionMode] =
    useState(false);
  // 원본 타로 정보 (추가 질문 체인 추적용)
  const [originalTarot, setOriginalTarot] = useState(null); // 추가질문용
  // 추가 질문 진입 직전 answerForm 스냅샷 (스프레드 취소 시 복원용)
  // NOTE: state로 두면 useCallback deps에서 TDZ(선언 전 접근) 문제가 생길 수 있어 ref로 유지한다.
  const answerFormBeforeAdditionalQuestionRef = useRef(null);
  // 추가 질문 진입 직전 "두루마기/애니메이션" 플래그 스냅샷 (스프레드 취소 시 복원용)
  // NOTE: answerForm만 복원하면 3D 씬이 (isAnswered=true && isReadyToShowDurumagi=false) 상태로 남아
  // '기다림/진행중' 애니메이션이 다시 켜질 수 있어 별도 보관한다.
  const durumagiFlagsBeforeAdditionalQuestionRef = useRef(null);
  // 추가 질문 진입 경로:
  // - 'durumagi': 홈에서 두루마기(답변 화면)에서 추가질문 버튼으로 진입
  // - 'mypage': 마이페이지에서 추가질문으로 홈으로 이동하여 자동으로 스프레드가 열린 케이스
  const additionalQuestionOriginRef = useRef(null);
  // 스프레드 모달 "취소" 직후 click-through로 submit/AI요청이 튀는 케이스 방지용 (짧은 시간만 차단)
  const suppressSubmitUntilRef = useRef(0);
  // 맞춤리딩 / 제너럴리딩 선택 창
  const [readingTypeChoiceOpen, setReadingTypeChoiceOpen] = useState(false);
  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);
  const [generalReadingQuestionOpen, setGeneralReadingQuestionOpen] =
    useState(false);
  const [generalReadingSpreadChoiceOpen, setGeneralReadingSpreadChoiceOpen] =
    useState(false);
  const [
    generalReadingSelectedQuestionId,
    setGeneralReadingSelectedQuestionId,
  ] = useState(null);
  const [
    generalReadingSelectedQuestionText,
    setGeneralReadingSelectedQuestionText,
  ] = useState('');
  const [hasShownGeneralReadingAdConfirm, setHasShownGeneralReadingAdConfirm] =
    useState(false);
  const [generalReadingSpreadChoiceKey, setGeneralReadingSpreadChoiceKey] =
    useState(0);
  // 제너럴 리딩 스프레드 선택 직후 → 맞춤 해석만 표시 (추가질문 숨김). 모달 닫기/리셋 시 false.
  const [isGeneralReadingFirstView, setIsGeneralReadingFirstView] =
    useState(false);
  const [isClientInfoModalOpen, setClientInfoModalOpen] = useState(false);
  const generalReadingClosingRef = useRef(false);
  const [isResultModalClosing, setIsResultModalClosing] = useState(false);

  // 제너럴 리딩 서브 라우트 동기화: /general-reading | /general-reading/spread | /general-reading/result/:questionId/:spreadId
  useEffect(() => {
    const path = location.pathname;
    const state = location.state || {};
    const urlQuestionId = params.questionId;
    const urlSpreadId = params.spreadId;

    if (generalReadingClosingRef.current) {
      if (!path.includes('general-reading')) {
        generalReadingClosingRef.current = false;
      }
      return;
    }

    if (path.includes('general-reading/result')) {
      setGeneralReadingQuestionOpen(false);
      setGeneralReadingSpreadChoiceOpen(false);
      const hasValidParams =
        urlQuestionId &&
        urlSpreadId &&
        VALID_QUESTION_IDS.includes(urlQuestionId) &&
        VALID_SPREAD_IDS.includes(urlSpreadId);
      if (!hasValidParams) {
        navigate(getPathWithLang(browserLanguage).P0);
        return;
      }
      // 직접 진입(새로고침/북마크): URL에서 로드하여 answerForm 설정
      if (
        !answerForm?.isGeneralReadingResult ||
        answerForm?.readingConfig?.generalReadingSpreadId !== urlSpreadId
      ) {
        const language = normalizeLanguage(i18n.language || 'ko');
        const qText =
          GENERAL_READING_QUESTIONS[language]?.find(q => q.id === urlQuestionId)
            ?.text ||
          GENERAL_READING_QUESTIONS.ko.find(q => q.id === urlQuestionId)
            ?.text ||
          '';
        const answer = '';
        const spreadOption = SPREAD_OPTIONS.find(s => s.id === urlSpreadId);
        const spreadName =
          spreadOption?.name?.[language] ||
          spreadOption?.name?.ko ||
          urlSpreadId;
        const spreadImageUrl = getSpreadImageUrl(urlSpreadId);
        const selectedTarotCardsArr =
          getPreparedCards(urlQuestionId, urlSpreadId) || [];
        const spreadListNumber =
          GENERAL_READING_SPREAD_LIST_NUMBER[urlSpreadId] ?? 302;
        updateAnswerForm(prev => ({
          ...prev,
          _id: null,
          id: null,
          createdAt: '',
          updatedAt: '',
          isGeneralReadingResult: true,
          questionData: { ...prev?.questionData, question: qText },
          readingConfig: {
            [PK.r0]: '제너럴 리딩',
            [PK.r1]: selectedTarotCardsArr.length,
            [PK.c0]: selectedTarotCardsArr,
            [PK.r2]: spreadListNumber,
            generalReadingSpreadId: urlSpreadId,
            generalReadingSpreadName: spreadName,
            generalReadingSpreadImageUrl: spreadImageUrl,
          },
          answer,
          language,
          timeOfCounselling: new Date().toISOString(),
          isAnswered: true,
        }));
        dispatch(setIsAnswered(true));
        dispatch(setIsReadyToShowDurumagi(true));
        setReadyToShowDurumagi(true);
        setDoneAnimationOfBackground(true);
      }
    } else if (path.includes('general-reading/spread')) {
      setGeneralReadingQuestionOpen(false);
      const { questionId, questionText } = state;
      if (questionId && questionText) {
        setGeneralReadingSelectedQuestionId(questionId);
        setGeneralReadingSelectedQuestionText(questionText);
        setGeneralReadingSpreadChoiceOpen(true);
      } else {
        navigate(getPathWithLang(browserLanguage).P2);
      }
    } else if (path.includes('general-reading')) {
      setGeneralReadingQuestionOpen(true);
      setGeneralReadingSpreadChoiceOpen(false);
    } else {
      // 홈 등 general-reading 외 경로: 모든 제너럴 리딩 모달 강제 닫기 (취소 1번에 닫히도록)
      setGeneralReadingQuestionOpen(false);
      setGeneralReadingSpreadChoiceOpen(false);
    }
  }, [
    location.pathname,
    location.state,
    params.questionId,
    params.spreadId,
    answerForm?.isGeneralReadingResult,
    answerForm?.readingConfig?.generalReadingSpreadId,
    navigate,
    browserLanguage,
    i18n.language,
    updateAnswerForm,
    dispatch,
  ]);
  useEffect(() => {
    if (!answerForm?.isAnswered) setIsResultModalClosing(false);
  }, [answerForm?.isAnswered]);
  // 로그인 후 버튼들(개인정보/YesNo/Invite 등)이 한꺼번에 보이도록, 레이아웃 완료 후에만 표시
  const [tokenButtonsVisible, setTokenButtonsVisible] = useState(false);
  useLayoutEffect(() => {
    if (!isToken) {
      setTokenButtonsVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTokenButtonsVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [isToken]);

  //! useState 변수 선언(ex : const [questionForm, updateQuestionForm] )은 컴포넌트 body부분에서 해야 함.
  //! state변수나 setState함수는 함수 안에서 호출 가능.
  //! 대신 실행컨텍스트를 공유하고 있거나 그렇지 않으면 인자로 전달해야 함.
  const toggleSpreadModal = useCallback(
    (value, list_number, spread_title, card_count) => {
      // 추가 질문 모드이거나 isWaiting이 false일 때 스프레드 모달 열기/닫기 허용
      const isAdditionalQuestionMode =
        answerForm?.isAdditionalQuestion === true;
      if (answerForm?.isWaiting === false || isAdditionalQuestionMode) {
        // Firebase Analytics: 스프레드 모달 열기/닫기 추적
        log('modal_open', {
          modal_name: 'spread_modal',
          action: value ? 'open' : 'close',
          spread_type: spread_title || 'unknown',
        });
        updateModalForm({ ...modalForm, spread: value });
        updateQuestionForm(prev => ({
          ...prev,
          [PK.r0]: spread_title,
          [PK.r1]: card_count,
          [PK.r2]: list_number,
        }));
      }
    },
    [answerForm, modalForm, updateModalForm, updateQuestionForm], // 의존성 배열
  );

  const toggleTarotModal = useCallback(
    (value, list_number, spread_title, card_count) => {
      updateModalForm(prev => {
        return { ...prev, tarot: value };
      });
      updateQuestionForm(prev => {
        return {
          ...prev,
          [PK.r0]: spread_title,
          [PK.r1]: card_count,
          [PK.r2]: list_number,
        };
      });
    },
  );

  // 제너럴 리딩: 스프레드(1~5) 선택 시 해당 번호의 카드 조합 + 질문·스프레드에 매칭된 미리 작성 해석으로 답변 표시
  const handleGeneralReadingSpreadSelect = useCallback(
    spreadId => {
      setIsGeneralReadingFirstView(true);
      setGeneralReadingSpreadChoiceOpen(false);
      const questionId = generalReadingSelectedQuestionId;
      const questionText = generalReadingSelectedQuestionText;
      if (!questionId) return;
      const language = normalizeLanguage(i18n.language || 'ko');
      const answer = '';
      const spreadOption = SPREAD_OPTIONS.find(s => s.id === spreadId);
      const spreadName =
        spreadOption?.name?.[language] || spreadOption?.name?.ko || spreadId;
      const spreadImageUrl = getSpreadImageUrl(spreadId);
      const selectedTarotCardsArr =
        getPreparedCards(questionId, spreadId) || [];
      const spreadListNumber =
        GENERAL_READING_SPREAD_LIST_NUMBER[spreadId] ?? 302;
      const cardCount = selectedTarotCardsArr.length;
      updateAnswerForm(prev => ({
        ...prev,
        _id: null,
        id: null,
        createdAt: '',
        updatedAt: '',
        isGeneralReadingResult: true,
        questionData: { ...prev?.questionData, question: questionText },
        readingConfig: {
          [PK.r0]: '제너럴 리딩',
          [PK.r1]: cardCount,
          [PK.c0]: selectedTarotCardsArr,
          [PK.r2]: spreadListNumber,
          generalReadingSpreadId: spreadId,
          generalReadingSpreadName: spreadName,
          generalReadingSpreadImageUrl: spreadImageUrl,
        },
        answer,
        language,
        timeOfCounselling: new Date().toISOString(),
        isAnswered: true,
      }));
      setGeneralReadingSelectedQuestionId(null);
      setGeneralReadingSelectedQuestionText('');
      dispatch(setIsAnswered(true));
      // 제너럴 리딩(하드코딩 결과)은 3D 대기/폭발 애니메이션 없이 즉시 답변 모달을 띄운다.
      // AnswerModalView 렌더 조건이 Home 로컬 상태(isReadyToShowDurumagi, isDoneAnimationOfBackground)를 보기 때문에
      // redux dispatch만으로는 애니메이션을 건너뛸 수 없다.
      dispatch(setIsReadyToShowDurumagi(true));
      setReadyToShowDurumagi(true);
      setDoneAnimationOfBackground(true);
      navigate(
        getPathWithLang(browserLanguage).P4.replace(
          ':questionId',
          questionId
        ).replace(':spreadId', spreadId),
      );
    },
    [
      generalReadingSelectedQuestionId,
      generalReadingSelectedQuestionText,
      i18n.language,
      updateAnswerForm,
      dispatch,
      setDoneAnimationOfBackground,
      setReadyToShowDurumagi,
      browserLanguage,
      navigate,
    ],
  );

  // 제너럴 리딩: 질문 선택 시 스프레드 선택 모달로 (1~5번에 매핑될 스프레드는 매번 랜덤)
  const handleGeneralReadingSelect = useCallback(
    (questionId, questionText) => {
      setGeneralReadingQuestionOpen(false);
      setGeneralReadingSelectedQuestionId(questionId);
      setGeneralReadingSelectedQuestionText(questionText || '');
      setGeneralReadingSpreadChoiceKey(prev => prev + 1);
      setGeneralReadingSpreadChoiceOpen(true);
      navigate(getPathWithLang(browserLanguage).P3, {
        state: { questionId, questionText: questionText || '' },
      });
    },
    [browserLanguage, navigate],
  );

  const handleCardForm = useCallback(e => {
    e.preventDefault();
    const { name, value } = e.target; // input 태그의 name속성(name을 state명이랑 같게 해야) 및 value속성을 뽑음
    updateCardForm(prev => ({
      ...prev, // state(객체형) 변경법
      [name]: value, // 표현법이 신기(대괄호 붙임)
    }));
  });

  const handleQuestionForm = useCallback(e => {
    e.preventDefault();
    const { name, value } = e.target;
    updateQuestionForm(prev => ({
      ...prev,
      [name]: value,
    }));
  });

  const handleSelectedTarotMode = useCallback(
    number => {
      setSelectedTarotMode(number);
      // Firebase Analytics: 타로 모드 변경은 실제 타로를 본 경우에만 추적됨 (onSubmit에서 처리)
      if (number === 2 && isVoucherModeOn === false) {
      }
    },
    [isVoucherModeOn],
  );

  const handleAnsweredState = useCallback(() => {
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(true));
    updateAnswerForm(prev => {
      return {
        ...prev,
        isSubmitted: false,
        isWaiting: false,
        isAnswered: true,
      };
    });
  });

  const handleNotAnsweredState = useCallback(async () => {
    setIsGeneralReadingFirstView(false);
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(false));
    dispatch(setIsDoneAnimationOfBackground(false));
    dispatch(setIsReadyToShowDurumagi(false));
    setDoneAnimationOfBackground(false);
    setReadyToShowDurumagi(false);
    // 두루마기 모달 상태도 초기화
    setIsDurumagiModalWithInterpretationOpen(false);
    updateAnswerForm(prev => {
      return {
        ...prev,
        isGeneralReadingResult: false,
        isSubmitted: false,
        isWaiting: false,
        isAnswered: false,
      };
    });
    setWatchedAd(false); //! 두루마기 모달 닫을 때 광고 시청 상태 리셋하여 배너가 뜨지 않도록 함
    if (location.pathname.includes('general-reading')) {
      generalReadingClosingRef.current = true;
      navigate(getPathWithLang(browserLanguage).P0);
    }

    //! 네이티브 앱에서 배너 광고 명시적으로 제거
    if (isNative) {
      try {
        await AdMob.removeBanner();
        await AdMob.removeAllListeners();
      } catch (error) {
        console.warn('Banner remove error:', error);
      }
    }
  }, [browserLanguage, dispatch, navigate, location.pathname, isNative]);

  const handleResetAll = useCallback(async () => {
    dispatch(resetAllTarotCards());
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(false));
    dispatch(setIsDoneAnimationOfBackground(false));
    dispatch(setIsReadyToShowDurumagi(false));
    setDoneAnimationOfBackground(false);
    setReadyToShowDurumagi(false);
    // 두루마기 모달 상태도 초기화
    setIsDurumagiModalWithInterpretationOpen(false);

    //! 네이티브 앱에서 배너 광고 명시적으로 제거
    if (isNative) {
      try {
        await AdMob.removeBanner();
        await AdMob.removeAllListeners();
      } catch (error) {
        console.warn('Banner remove error:', error);
      }
    }

    // 추가 질문 관련 상태 초기화
    setAdditionalQuestionCount(0);
    setIsAdditionalQuestionMode(false);
    setOriginalTarot(null);
    answerFormBeforeAdditionalQuestionRef.current = null;

    updateAnswerForm(prev => {
      return {
        ...prev,
        isGeneralReadingResult: false,
        questionData: createEmptyQuestionData(),
        readingConfig: createEmptyReadingConfig(),
        answer: '',
        language: '',
        timeOfCounselling: '',
        createdAt: '',
        updatedAt: '',
        isSubmitted: false,
        isWaiting: false,
        isAnswered: false,
        // 추가 질문 관련 필드 초기화
        isAdditionalQuestion: false,
        originalTarotId: null,
        questionChain: [],
        additionalQuestionCount: 0,
      };
    });
    updateQuestionForm(prev => {
      return {
        ...prev,
        ...createEmptyQuestionForm(),
      };
    });
    updateCardForm(prev => {
      return {
        ...prev,
        shuffle: 0,
        isReadyToShuffle: false,
        isShuffleFinished: false,
        spread: false,
        flippedIndex: [],
        selectedCardIndexList: [],
      };
    });
    setIsCSSInvisible(false);
    setDoneAnimationOfBackground(false);
    setReadyToShowDurumagi(false);
    setSelectedCardPosition(prev => {
      return {
        ...prev,
        isClicked: false,
        position: -1,
      };
    });
    if (location.pathname.includes('general-reading')) {
      generalReadingClosingRef.current = true;
      navigate(getPathWithLang(browserLanguage).P0);
    }
  }, [
    dispatch,
    isNative,
    updateAnswerForm,
    updateQuestionForm,
    updateCardForm,
    browserLanguage,
    navigate,
    location.pathname,
  ]);

  // 타로 답변창을 닫은 뒤, 네이티브에서 처음이면 리뷰 요청창 표시 (로컬 + DB 둘 다 확인, 이메일별 키)
  // shouldShowReview: 보통타로 무료모드에서는 "자세한 해석 보기"를 눌렀을 때만 true, 그 외 모드는 항상 true
  const onAnswerModalClose = useCallback(
    (shouldShowReview = true) => {
      if (!isNative) return;
      if (userInfo?.reviewRequestShown) return;
      if (shouldShowReview === false) return;
      (async () => {
        try {
          const key = getReviewRequestPrefKey(userInfo?.email);
          const { value } = await Preferences.get({ key });
          if (value !== 'true') setShowReviewModal(true);
        } catch (_) {}
      })();
    },
    [userInfo?.reviewRequestShown, userInfo?.email],
  );

  const handleReviewModalClose = useCallback(async () => {
    try {
      const key = getReviewRequestPrefKey(userInfo?.email);
      await Preferences.set({ key, value: 'true' });
      // DB user 컬렉션에도 저장 (로그인 사용자)
      if (userInfo?.id) {
        try {
          await userApi.modify({
            reviewRequestShown: true,
            reviewRequestShownAt: new Date().toISOString(),
          });
        } catch (_) {}
      }
    } finally {
      setShowReviewModal(false);
    }
  }, [userInfo?.id, userInfo?.email]);

  const handleWriteReview = useCallback(async () => {
    try {
      await Browser.open({ url: getStoreReviewUrl() });
    } catch (_) {}
  }, []);

  // 스프레드 모달 취소: 추가 질문 "진행 모드"면 체인/플래그가 남지 않도록 원상복구
  const clearAdditionalQuestionJumpStorage = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;
      if (isNative) {
        await Preferences.remove({ key: 'isAdditionalQuestionMode' });
        await Preferences.remove({ key: 'originalTarot' });
        return;
      }
      localStorage.removeItem('isAdditionalQuestionMode');
      localStorage.removeItem('originalTarot');
    } catch (error) {
      console.warn('Failed to clear additional-question storage:', error);
    }
  }, []);

  const handleCancelSpreadModal = useCallback(async () => {
    // 취소 직후(짧은 시간) submit을 무시하여 의도치 않은 AI 요청/애니메이션 트리거를 차단
    suppressSubmitUntilRef.current = Date.now() + 700;
    // 먼저 스프레드 모달 닫기
    toggleSpreadModal(false, 0, '', 0);

    // "추가 질문 진행 모드" 판별:
    // - 추가 질문 버튼을 눌러 answerForm을 비워둔 상태(해석 전)에서만 리셋
    const isAdditionalAttempt =
      answerForm?.isAdditionalQuestion === true &&
      answerForm?.isAnswered === false &&
      answerForm?.isSubmitted === false &&
      ((answerForm?.interpretation ?? '').trim?.() ?? '').length === 0;

    if (!isAdditionalAttempt) return;

    await clearAdditionalQuestionJumpStorage();

    const snapshot = answerFormBeforeAdditionalQuestionRef.current;
    const origin = additionalQuestionOriginRef.current;

    // 마이페이지에서 추가질문으로 진입한 경우: 취소 시 "초기 홈 화면"으로 리셋
    if (origin === 'mypage') {
      setIsAdditionalQuestionMode(false);
      setAdditionalQuestionCount(0);
      setOriginalTarot(null);
      answerFormBeforeAdditionalQuestionRef.current = null;
      durumagiFlagsBeforeAdditionalQuestionRef.current = null;
      additionalQuestionOriginRef.current = null;
      // 초기 화면으로(답변/대기 애니메이션/체인 모두 초기화)
      await handleResetAll();
      return;
    }

    // 추가 질문 진행 모드 종료
    setIsAdditionalQuestionMode(false);
    setAdditionalQuestionCount(snapshot?.additionalQuestionCount ?? 0);
    setOriginalTarot(null);

    // 진입 직전 상태로 복원 (없으면 최소한 체인/플래그만 제거)
    if (snapshot) {
      const flagSnapshot = durumagiFlagsBeforeAdditionalQuestionRef.current;
      updateAnswerForm({
        ...snapshot,
        isSubmitted: false,
        isWaiting: false,
        isAnswered: true,
      });
      // 추가 질문 진입 직전의 씬/두루마기 플래그 복원 (없으면 안전하게 false)
      setDoneAnimationOfBackground(!!flagSnapshot?.isDoneAnimationOfBackground);
      setReadyToShowDurumagi(!!flagSnapshot?.isReadyToShowDurumagi);
    } else {
      updateAnswerForm(prev => ({
        ...prev,
        isSubmitted: false,
        isWaiting: false,
        isAnswered: false,
        isAdditionalQuestion: false,
        originalTarotId: null,
        parentTarotId: null,
        tarotIdChain: [],
        questionChain: [],
        additionalQuestionCount: 0,
        hasAdditionalQuestion: false,
        combinedReadingConfig: { [PK.c0]: [] },
      }));
      // 스냅샷이 없으면 최소한 애니메이션 플래그는 내려서 '대기 애니메이션'이 켜지지 않게 한다.
      setDoneAnimationOfBackground(false);
      setReadyToShowDurumagi(false);
    }

    answerFormBeforeAdditionalQuestionRef.current = null;
    durumagiFlagsBeforeAdditionalQuestionRef.current = null;
    additionalQuestionOriginRef.current = null;
  }, [
    toggleSpreadModal,
    answerForm,
    clearAdditionalQuestionJumpStorage,
    updateAnswerForm,
    handleResetAll,
  ]);

  const handleResetDeck = useCallback(() => {
    dispatch(resetAllTarotCards());
    updateCardForm(prev => {
      return {
        ...prev,
        shuffle: 0,
        isReadyToShuffle: false,
        isShuffleFinished: false,
        spread: false,
        flippedIndex: [],
        selectedCardIndexList: [],
      };
    });
  });

  // 추가 질문 핸들러
  const handleAdditionalQuestion = useCallback(
    currentAnswerForm => {
      try {
        // answerForm에서 현재 카운트 가져오기 (최신 상태)
        const currentCount = answerForm?.additionalQuestionCount ?? 0;

        // 추가 질문 카운트 증가 (최대 2)
        if (currentCount >= 2) {
          return; // 이미 2번 추가 질문을 했으면 더 이상 불가
        }

        // Firebase Analytics: 추가 질문 버튼 클릭
        trackAdditionalQuestionButtonClick('durumagi');

        // 스프레드 모달에서 취소할 경우를 대비해 "진입 직전 상태" 저장
        answerFormBeforeAdditionalQuestionRef.current = currentAnswerForm;
        // 스프레드 취소 시 원래 화면(두루마기/완료 상태)로 정확히 복귀하기 위해 플래그도 저장
        durumagiFlagsBeforeAdditionalQuestionRef.current = {
          isDoneAnimationOfBackground,
          isReadyToShowDurumagi,
        };
        additionalQuestionOriginRef.current = 'durumagi';

        // 원본 타로 정보 저장 (첫 번째 추가 질문인 경우)
        if (currentCount === 0) {
          setOriginalTarot(currentAnswerForm);
        }

        // 추가 질문 모드 활성화
        setIsAdditionalQuestionMode(true);

        // 상태 초기화: isAnswered, isWaiting, hasWatchedAd, isReadyToShowDurumagi, isDoneAnimationOfBackground
        setWatchedAd(false);
        setReadyToShowDurumagi(false);
        setDoneAnimationOfBackground(false);

        // 스프레드 모달 열기
        updateModalForm(prev => ({ ...prev, spread: true }));

        // 추가 질문 모드일 때 덱과 질문 폼이 표시되도록 상태 초기화
        updateCardForm(prev => ({
          ...prev,
          shuffle: 0,
          isReadyToShuffle: false,
          isShuffleFinished: false,
          spread: false,
          flippedIndex: [],
          selectedCardIndexList: [],
        }));

        // answerForm에 추가 질문 정보 저장 및 덱 표시를 위한 상태 설정
        const resolvedOriginalTarotId =
          currentAnswerForm?.originalTarotId ||
          currentAnswerForm?._id ||
          currentAnswerForm?.id ||
          null;
        const resolvedCombinedCardsArr =
          resolveCombinedCardsArr(
            currentAnswerForm?.combinedReadingConfig?.[PK.c0],
            currentAnswerForm?.readingConfig?.[PK.c0],
          ) || [];

        updateAnswerForm(prev => ({
          ...prev,
          _id: null,
          id: null,
          createdAt: '',
          updatedAt: '',
          answer: '',
          isAdditionalQuestion: true,
          originalTarotId: resolvedOriginalTarotId,
          parentTarotId:
            currentAnswerForm?._id || currentAnswerForm?.id || null,
          additionalQuestionCount: currentCount, // 현재 카운트 저장
          combinedReadingConfig: {
            [PK.c0]: resolvedCombinedCardsArr,
          },
          tarotIdChain: currentAnswerForm?.tarotIdChain || [],
          // 덱이 표시되도록 필요한 상태 설정
          isSubmitted: false, // 추가 질문 모드에서는 false로 설정하여 질문 입력 폼이 표시되도록
          isWaiting: false,
          isAnswered: false, // 추가 질문을 위해 false로 설정
          questionChain:
            currentCount === 0
              ? [
                  {
                    questionData: currentAnswerForm?.questionData,
                    answer: currentAnswerForm?.interpretation,
                    _id: currentAnswerForm?._id || currentAnswerForm?.id,
                  },
                ]
              : [
                  ...(prev?.questionChain || []),
                  {
                    questionData: currentAnswerForm?.questionData,
                    answer: currentAnswerForm?.interpretation,
                    _id: currentAnswerForm?._id || currentAnswerForm?.id,
                  },
                ],
        }));
      } catch (error) {
        console.error('Error handling additional question:', error);
      }
    },
    [
      answerForm?.additionalQuestionCount,
      updateModalForm,
      updateAnswerForm,
      updateCardForm,
      isDoneAnimationOfBackground,
      isReadyToShowDurumagi,
      trackAdditionalQuestionButtonClick,
    ],
  );

  // 제너럴 리딩 맞춤 해석: 스프레드 모달 없이 바로 AI 요청 (평상시 타로 제출처럼)
  const handleCustomInterpretation = useCallback(
    async currentAnswerForm => {
      // 비로그인: 맞춤 리딩(제너럴 → 맞춤 해석)도 잠금 처리
      if (isCheckingToken || !(isToken && resultOfHasUserEmail)) {
        updateLoginBlinkModalOpen(true);
        return;
      }

      const cardCountForCheck =
        currentAnswerForm?.readingConfig?.[PK.r1] ??
        (
          resolveCombinedCardsArr(
            currentAnswerForm?.combinedReadingConfig?.[PK.c0],
            currentAnswerForm?.readingConfig?.[PK.c0],
          ) || []
        ).length;
      const requiredCount = 2;
      const userStars = userInfo?.stars ?? 0;
      const userVouchers = userInfo?.vouchers ?? {};
      const voucherCount = userVouchers?.[cardCountForCheck] ?? 0;
      const hasEnoughStars = userStars >= requiredCount;
      const hasEnoughVouchers = voucherCount >= requiredCount;

      if (!hasEnoughStars && !hasEnoughVouchers) {
        updateCustomReadingInsufficientBlinkModalOpen(true);
        return;
      }

      const resolvedCombinedCardsArr =
        resolveCombinedCardsArr(
          currentAnswerForm?.combinedReadingConfig?.[PK.c0],
          currentAnswerForm?.readingConfig?.[PK.c0],
        ) || [];
      const readingConfigOrig = currentAnswerForm?.readingConfig ?? {};
      const questionDataOrig = currentAnswerForm?.questionData ?? {};
      const trim = v => (v && typeof v === 'string' ? v.trim() : '') || '';
      const questionData = {
        [PK.q0]: trim(questionDataOrig?.[PK.q0]),
        [PK.q1]: trim(questionDataOrig?.[PK.q1]),
        [PK.q2]: trim(questionDataOrig?.[PK.q2]),
        [PK.q3]: trim(questionDataOrig?.[PK.q3]),
        [PK.q4]: trim(questionDataOrig?.[PK.q4]),
        [PK.q5]: trim(questionDataOrig?.[PK.q5]),
        [PK.q6]: trim(questionDataOrig?.[PK.q6]),
        [PK.q7]: trim(questionDataOrig?.[PK.q7]),
        [PK.o0]: trim(questionDataOrig?.[PK.o0]),
        [PK.o1]: trim(questionDataOrig?.[PK.o1]),
        [PK.o2]: trim(questionDataOrig?.[PK.o2]),
      };
      const cardCount =
        readingConfigOrig?.[PK.r1] ?? resolvedCombinedCardsArr.length;
      const readingConfig = {
        [PK.r0]: readingConfigOrig?.[PK.r0] ?? '제너럴 리딩',
        [PK.r1]: cardCount,
        [PK.r2]: readingConfigOrig?.[PK.r2] ?? 302,
        [PK.c0]: resolvedCombinedCardsArr,
      };

      // 심층 타로: 별 2개 필요 [cardCount타입, 2]
      const deepTarotVoucherPrice = [cardCount, 2];

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const tarotInfo = {
        questionData: encodeQuestionDataOpaque(
          [
            questionData?.[PK.q0],
            questionData?.[PK.q1],
            questionData?.[PK.q2],
            questionData?.[PK.q3],
            questionData?.[PK.q4],
            questionData?.[PK.q5],
            questionData?.[PK.q6],
            questionData?.[PK.q7],
          ],
          [
            questionData?.[PK.o0],
            questionData?.[PK.o1],
            questionData?.[PK.o2],
          ]
        ),
        readingConfig: encodeReadingConfigOpaque(
          [
            readingConfig?.[PK.r0],
            readingConfig?.[PK.r1],
            readingConfig?.[PK.r2],
          ],
          readingConfig?.[PK.c0]
        ),
        tarotSpreadVoucherPrice: deepTarotVoucherPrice,
        language: browserLanguage,
        time: now,
        formattedTime: now.toLocaleString(
          ['ko-KR', 'ja-JP', 'en-US'].find(locale =>
            locale.startsWith(browserLanguage),
          ) || 'en-US',
          {
            timeZone:
              browserLanguage === 'ko'
                ? 'Asia/Seoul'
                : browserLanguage === 'ja'
                  ? 'Asia/Tokyo'
                  : userTimeZone,
          },
        ),
        isVoucherModeOn: true,
        isStarMode: !!isStarMode,
        additionalQuestionCount: 0,
        isAdditionalQuestion: true,
        originalTarotId: null,
        parentTarotId: null,
        questionChain: [
          {
            questionData: questionDataOrig,
            answer: currentAnswerForm?.interpretation,
            readingConfig: readingConfigOrig,
          },
        ],
        previousQuestionInfo: questionDataOrig,
        previousAnswer: currentAnswerForm?.interpretation,
        previousSpreadInfo: readingConfigOrig,
        isCustomInterpretationFromGeneralReading: true,
        combinedReadingConfig: {
          [PK.c0]: resolvedCombinedCardsArr,
        },
      };

      try {
        updateAnswerForm(prev => ({
          ...prev,
          isWaiting: true,
          isAnswered: false,
          isSubmitted: true,
        }));
        setIsInterpretationLoading(true);

        const result =
          await tarotApi.postQuestionForDeepForAnthropicAPI(tarotInfo);

        if (result?.response) {
          const parsedObj = JSON.parse(result.response.interpretation);
          const newId = result.response?._id || result.response?.id;

          updateAnswerForm(prev => ({
            ...prev,
            _id: newId,
            id: newId,
            answer: parsedObj ?? result.response?.answer,
            createdAt: result.response?.createdAt ?? '',
            updatedAt: result.response?.updatedAt ?? '',
            isGeneralReadingResult: true,
            readingConfig: {
              ...readingConfigOrig,
              [PK.c0]:
                (resolvedCombinedCardsArr?.length > 0
                  ? resolvedCombinedCardsArr
                  : readingConfigOrig?.[PK.c0]) ?? [],
            },
            combinedReadingConfig: {
              [PK.c0]:
                (resolvedCombinedCardsArr?.length > 0
                  ? resolvedCombinedCardsArr
                  : readingConfigOrig?.[PK.c0]) ?? [],
            },
            questionData,
            isWaiting: false,
            isSubmitted: false,
            isAnswered: true,
            hasInterpretedRecord: true,
          }));
          dispatch(setIsWaiting(false));
          dispatch(setIsAnswered(true));
          dispatch(setIsReadyToShowDurumagi(true));
          setDoneAnimationOfBackground(true);
          setReadyToShowDurumagi(true);
        }
      } catch (error) {
        updateAnswerForm(prev => ({
          ...prev,
          isWaiting: false,
          isSubmitted: false,
        }));
        dispatch(setIsWaiting(false));
        if (isDevelopmentMode) {
          console.error('Error handling custom interpretation:', error);
        }
      } finally {
        setIsInterpretationLoading(false);
      }
    },
    [
      updateAnswerForm,
      browserLanguage,
      tarotSpreadVoucherPrice,
      isStarMode,
      dispatch,
      userInfo,
      setDoneAnimationOfBackground,
      setReadyToShowDurumagi,
      updateCustomReadingInsufficientBlinkModalOpen,
      isCheckingToken,
      isToken,
      resultOfHasUserEmail,
      updateLoginBlinkModalOpen,
    ],
  );

  const handleSpreadValue = useCallback(value => {
    updateCardForm(prev => {
      return { ...prev, spread: value };
    });
  });

  const handleReadyToShuffleValue = useCallback(value => {
    updateCardForm(prev => {
      return { ...prev, isReadyToShuffle: value };
    });
  });

  const handleSuffleFinishValue = useCallback(value => {
    updateCardForm(prev => {
      return { ...prev, isShuffleFinished: value };
    });
  });

  // Redux store에서 tarotHistory 가져오기 (stateGroup보다 먼저 정의)
  const userInfoForRedux = useSelector(state => state?.userInfoStore?.userInfo);
  const tarotHistoryForRedux = useSelector(
    state => state?.tarotHistoryStore?.tarotHistory,
  );

  const stateGroup = useMemo(
    () => ({
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
      hasWatchedAdForBlinkModal,
      selectedAdType,
      isChargeModalOpen,
      isInAppPurchaseOpen,
      selectedSpread,
      selectedCardPosition,
      isReadyToShowDurumagi,
      isDoneAnimationOfBackground,
      admobReward,
      questionMode,
      suppressSubmitUntilRef,
      isSpeedTarotNotificationOn,
      isSpeedTarotUnavailable,
      isLoginBlinkModalOpen,
      isCopyBlinkModalOpen,
      isSaveBlinkModalOpen,
      isChargingKRWBlinkModalOpen,
      isChargingUSDBlinkModalOpen,
      isFilledInTheQuestion,
      isUnavailableVoucher,
      isTarotModeUnavailable,
      requiredVoucherInfo,
      isPending,
      isQuestionOverLimit,
      isTarotManualModalOpen,
      tarotHistoryForRedux,
      isInterpretationLoading,
      isStarMode,
      readingTypeChoiceOpen,
      isYesNoModalOpen,
      generalReadingQuestionOpen,
      generalReadingSpreadChoiceOpen,
      isClientInfoModalOpen,
    }),
    [
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
      hasWatchedAdForBlinkModal,
      selectedAdType,
      isChargeModalOpen,
      isInAppPurchaseOpen,
      selectedSpread,
      selectedCardPosition,
      isReadyToShowDurumagi,
      isDoneAnimationOfBackground,
      admobReward,
      questionMode,
      suppressSubmitUntilRef,
      isSpeedTarotNotificationOn,
      isSpeedTarotUnavailable,
      isLoginBlinkModalOpen,
      isCopyBlinkModalOpen,
      isSaveBlinkModalOpen,
      isChargingKRWBlinkModalOpen,
      isChargingUSDBlinkModalOpen,
      isFilledInTheQuestion,
      isUnavailableVoucher,
      isTarotModeUnavailable,
      requiredVoucherInfo,
      isPending,
      isQuestionOverLimit,
      isTarotManualModalOpen,
      tarotHistoryForRedux,
      isInterpretationLoading,
      isStarMode,
      isCustomReadingInsufficientBlinkModalOpen,
      readingTypeChoiceOpen,
      isYesNoModalOpen,
      generalReadingQuestionOpen,
      generalReadingSpreadChoiceOpen,
      isClientInfoModalOpen,
    ],
  );

  // 상태 업데이트 함수 그룹: useMemo로 메모이제이션
  const setStateGroup = useMemo(
    () => ({
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
      setQuestionMode,
      setSpeedTarotNotificationOn,
      setSpeedTarotUnavailable,
      updateCopyBlinkModalOpen,
      updateSaveBlinkModalOpen,
      setChargingKRWBlinkModalOpen,
      setChargingUSDBlinkModalOpen,
      setUnavailableVoucher,
      setRequiredVoucherInfo,
      startTransition,
      setQuestionOverLimit,
      setIsInterpretationLoading,
      setIsStarMode,
      updateCustomReadingInsufficientBlinkModalOpen,
    }),
    [
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
      setQuestionMode,
      setSpeedTarotNotificationOn,
      setSpeedTarotUnavailable,
      updateCopyBlinkModalOpen,
      updateSaveBlinkModalOpen,
      setChargingKRWBlinkModalOpen,
      setChargingUSDBlinkModalOpen,
      setUnavailableVoucher,
      setRequiredVoucherInfo,
      startTransition,
      setQuestionOverLimit,
      setIsInterpretationLoading,
      setIsStarMode,
      updateCustomReadingInsufficientBlinkModalOpen,
    ],
  );

  // 모달 토글 함수 그룹: useMemo로 메모이제이션
  const toggleModalGroup = useMemo(
    () => ({
      toggleSpreadModal,
      toggleTarotModal,
    }),
    [toggleSpreadModal, toggleTarotModal],
  );

  // 상태 처리 함수 그룹: useMemo로 메모이제이션
  const handleStateGroup = useMemo(
    () => ({
      handleAnsweredState,
      handleCardForm,
      handleQuestionForm,
      handleCancelSpreadModal,
      handleResetAll,
      handleResetDeck,
      handleSpreadValue,
      handleReadyToShuffleValue,
      handleSuffleFinishValue,
      handleSelectedTarotMode,
    }),
    [
      handleAnsweredState,
      handleCardForm,
      handleQuestionForm,
      handleCancelSpreadModal,
      handleResetAll,
      handleResetDeck,
      handleSpreadValue,
      handleReadyToShuffleValue,
      handleSuffleFinishValue,
      handleSelectedTarotMode,
    ],
  );

  //& redux 용(mypage에서 쓸 예정)
  const { getUserAndTarot, clearCaches, cleanupInterceptorArr } =
    useFetchUserAndTarotDataWithRedux(tarotApi, userApi, dispatch);
  const saveUserAndTarotInRedux = async () => {
    // cancelToken을 전달하여 요청 취소 가능하도록 함
    const cancelToken = sourceRef.current?.token;

    if (hasAccessToken() === true && isNative === false)
      await getUserAndTarot(cancelToken);
    const checkTokenInApp =
      isNative === true ? await hasAccessTokenForPreference() : false;
    if (isNative === true && checkTokenInApp === true)
      await getUserAndTarot(cancelToken);
  };
  useEffect(() => {
    //& 야래 조건문으로 이용권 사용시 갱신하게 만듦.
    if (answerForm?.isWaiting === false && answerForm?.isAnswered === true) {
      saveUserAndTarotInRedux();

      //? 여기서 배제적으로 광고 시청 상태 리셋
      setWatchedAd(false);
    } else {
      saveUserAndTarotInRedux();
    }
    return () => {
      if (
        cleanupInterceptorArr &&
        Array.isArray(cleanupInterceptorArr) &&
        cleanupInterceptorArr?.length > 0
      ) {
        cleanupInterceptorArr.forEach(cleanup => {
          cleanup();
        });
      }
      clearCaches();
      if (sourceRef.current) {
        sourceRef.current.cancel('Cancelled all requests');
        sourceRef.current = createCancelToken(); // 새로운 source 생성
      }
    };
  }, [answerForm?.isWaiting, answerForm?.isAnswered]);
  //& 여기까지

  // 두루마기 모달(AI 해석 포함)이 열렸는지 감지하여 App.jsx에 알림
  useEffect(() => {
    // 두루마기 모달이 AI 해석과 함께 열리는 조건:
    // 1. 이용권 모드에서 두루마기가 준비되었을 때
    // 2. 광고 모드에서 광고를 보고 AI 해석이 나왔을 때
    const isModalWithInterpretationOpen =
      answerForm?.isAnswered &&
      selectedTarotMode !== 1 &&
      !modalForm?.tarot &&
      !modalForm?.spread &&
      isDoneAnimationOfBackground &&
      isReadyToShowDurumagi;

    setIsDurumagiModalWithInterpretationOpen(isModalWithInterpretationOpen);

    // Home 컴포넌트가 언마운트될 때 (마이페이지 등으로 이동 시) 상태 초기화
    return () => {
      setIsDurumagiModalWithInterpretationOpen(false);
    };
  }, [
    answerForm?.isAnswered,
    selectedTarotMode,
    modalForm?.tarot,
    modalForm?.spread,
    isDoneAnimationOfBackground,
    isReadyToShowDurumagi,
  ]);

  // 모든 모달 상태 자동 추적을 위한 이전 상태 저장
  const prevModalStates = useRef({
    tarot: false,
    spread: false,
    chargeModal: false,
    inAppPurchase: false,
    tarotManual: false,
    blinkLogin: false,
    blinkCopy: false,
    blinkSave: false,
    blinkChargingKRW: false,
    blinkChargingUSD: false,
    refundPolicy: false,
    priceInfo: false,
    answerDurumagi: false,
    instruction: false,
    answerCardImages: false,
  });

  // 모든 모달 상태 자동 추적
  useEffect(() => {
    // TarotModal 추적
    if (modalForm?.tarot !== prevModalStates.current.tarot) {
      if (modalForm?.tarot) {
        log('modal_open', {
          modal_name: 'tarot_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'tarot_modal',
          action: 'close',
        });
      }
      prevModalStates.current.tarot = modalForm?.tarot;
    }

    // SpreadModal은 toggleSpreadModal에서 이미 추적하므로 여기서는 닫기만 추적
    if (modalForm?.spread !== prevModalStates.current.spread) {
      if (!modalForm?.spread && prevModalStates.current.spread) {
        // 닫힐 때만 추가 추적 (열 때는 toggleSpreadModal에서 이미 추적됨)
        log('modal_close', {
          modal_name: 'spread_modal',
          action: 'close',
        });
      }
      prevModalStates.current.spread = modalForm?.spread;
    }

    // ChargeModal 추적
    if (isChargeModalOpen !== prevModalStates.current.chargeModal) {
      if (isChargeModalOpen) {
        log('modal_open', {
          modal_name: 'charge_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'charge_modal',
          action: 'close',
        });
      }
      prevModalStates.current.chargeModal = isChargeModalOpen;
    }

    // InAppPurchase 추적
    if (isInAppPurchaseOpen !== prevModalStates.current.inAppPurchase) {
      if (isInAppPurchaseOpen) {
        log('modal_open', {
          modal_name: 'in_app_purchase_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'in_app_purchase_modal',
          action: 'close',
        });
      }
      prevModalStates.current.inAppPurchase = isInAppPurchaseOpen;
    }

    // TarotManualModal 추적
    if (isTarotManualModalOpen !== prevModalStates.current.tarotManual) {
      if (isTarotManualModalOpen) {
        log('modal_open', {
          modal_name: 'tarot_manual_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'tarot_manual_modal',
          action: 'close',
        });
      }
      prevModalStates.current.tarotManual = isTarotManualModalOpen;
    }

    // BlinkModal - Login 추적
    if (isLoginBlinkModalOpen !== prevModalStates.current.blinkLogin) {
      if (isLoginBlinkModalOpen) {
        log('modal_open', {
          modal_name: 'blink_modal_login',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'blink_modal_login',
          action: 'close',
        });
      }
      prevModalStates.current.blinkLogin = isLoginBlinkModalOpen;
    }

    // BlinkModal - Copy 추적
    if (isCopyBlinkModalOpen !== prevModalStates.current.blinkCopy) {
      if (isCopyBlinkModalOpen) {
        log('modal_open', {
          modal_name: 'blink_modal_copy',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'blink_modal_copy',
          action: 'close',
        });
      }
      prevModalStates.current.blinkCopy = isCopyBlinkModalOpen;
    }

    // BlinkModal - Save 추적
    if (isSaveBlinkModalOpen !== prevModalStates.current.blinkSave) {
      if (isSaveBlinkModalOpen) {
        log('modal_open', {
          modal_name: 'blink_modal_save',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'blink_modal_save',
          action: 'close',
        });
      }
      prevModalStates.current.blinkSave = isSaveBlinkModalOpen;
    }

    // BlinkModal - Charging KRW 추적
    if (
      isChargingKRWBlinkModalOpen !== prevModalStates.current.blinkChargingKRW
    ) {
      if (isChargingKRWBlinkModalOpen) {
        log('modal_open', {
          modal_name: 'blink_modal_charging_krw',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'blink_modal_charging_krw',
          action: 'close',
        });
      }
      prevModalStates.current.blinkChargingKRW = isChargingKRWBlinkModalOpen;
    }

    // BlinkModal - Charging USD 추적
    if (
      isChargingUSDBlinkModalOpen !== prevModalStates.current.blinkChargingUSD
    ) {
      if (isChargingUSDBlinkModalOpen) {
        log('modal_open', {
          modal_name: 'blink_modal_charging_usd',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'blink_modal_charging_usd',
          action: 'close',
        });
      }
      prevModalStates.current.blinkChargingUSD = isChargingUSDBlinkModalOpen;
    }

    // RefundPolicyModal 추적
    if (isRefundPolicyOpen !== prevModalStates.current.refundPolicy) {
      if (isRefundPolicyOpen) {
        log('modal_open', {
          modal_name: 'refund_policy_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'refund_policy_modal',
          action: 'close',
        });
      }
      prevModalStates.current.refundPolicy = isRefundPolicyOpen;
    }

    // PriceInfoModal 추적
    if (isPriceInfoModalOpen !== prevModalStates.current.priceInfo) {
      if (isPriceInfoModalOpen) {
        log('modal_open', {
          modal_name: 'price_info_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'price_info_modal',
          action: 'close',
        });
      }
      prevModalStates.current.priceInfo = isPriceInfoModalOpen;
    }

    // AnswerDurumagiModal 추적 (조건부 모달)
    const isAnswerDurumagiOpen =
      answerForm?.isAnswered &&
      selectedTarotMode !== 1 &&
      !modalForm?.tarot &&
      !modalForm?.spread &&
      isDoneAnimationOfBackground &&
      isReadyToShowDurumagi;

    if (isAnswerDurumagiOpen !== prevModalStates.current.answerDurumagi) {
      if (isAnswerDurumagiOpen) {
        log('modal_open', {
          modal_name: 'answer_durumagi_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'answer_durumagi_modal',
          action: 'close',
        });
      }
      prevModalStates.current.answerDurumagi = isAnswerDurumagiOpen;
    }

    // TarotQuestionInstructionModal 추적
    if (isInstructionOpen !== prevModalStates.current.instruction) {
      if (isInstructionOpen) {
        log('modal_open', {
          modal_name: 'tarot_question_instruction_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'tarot_question_instruction_modal',
          action: 'close',
        });
      }
      prevModalStates.current.instruction = isInstructionOpen;
    }

    // AnswerCardImagesModal 추적 (조건부 모달)
    const isAnswerCardImagesOpen =
      answerForm?.isAnswered &&
      selectedTarotMode !== 1 &&
      !modalForm?.tarot &&
      !modalForm?.spread;

    if (isAnswerCardImagesOpen !== prevModalStates.current.answerCardImages) {
      if (isAnswerCardImagesOpen) {
        log('modal_open', {
          modal_name: 'answer_card_images_modal',
          action: 'open',
        });
      } else {
        log('modal_close', {
          modal_name: 'answer_card_images_modal',
          action: 'close',
        });
      }
      prevModalStates.current.answerCardImages = isAnswerCardImagesOpen;
    }
  }, [
    modalForm?.tarot,
    modalForm?.spread,
    isChargeModalOpen,
    isInAppPurchaseOpen,
    isTarotManualModalOpen,
    isLoginBlinkModalOpen,
    isCopyBlinkModalOpen,
    isSaveBlinkModalOpen,
    isChargingKRWBlinkModalOpen,
    isChargingUSDBlinkModalOpen,
    isRefundPolicyOpen,
    isPriceInfoModalOpen,
    isInstructionOpen,
    answerForm?.isAnswered,
    selectedTarotMode,
    isDoneAnimationOfBackground,
    isReadyToShowDurumagi,
  ]);

  useEffect(() => {
    if (
      (typeof userInfoForRedux === 'object' &&
        Object.keys(userInfoForRedux)?.length === 0) ||
      userInfoForRedux === undefined ||
      userInfoForRedux === null
    ) {
      setUserInfo({});
    } else {
      setUserInfo(userInfoForRedux);
    }
    saveUserAndTarotInRedux();
    return () => {
      if (sourceRef.current) {
        sourceRef.current.cancel('Cancelled all requests');
        sourceRef.current = createCancelToken(); // 새로운 source 생성
      }
    };
  }, [
    userInfoForRedux,
    isChargeModalOpen,
    isTarotManualModalOpen,
    modalForm?.spread,
  ]);

  // 추가 질문 카운트 동기화 (answerForm에서 업데이트된 카운트를 상태로 반영)
  useEffect(() => {
    if (answerForm?.additionalQuestionCount !== undefined) {
      setAdditionalQuestionCount(answerForm.additionalQuestionCount);
    }
  }, [answerForm?.additionalQuestionCount]);

  usePreventModalBackgroundScroll(isChargeModalOpen, isTarotManualModalOpen);

  checkViolationInGoogleInAppRefund(userInfo);

  const isAdmobOn =
    isNative &&
    selectedAdType !== 0 && //! 이게 바뀌어서 렌더가 되고 안되고 함.
    hasWatchedAd === false &&
    !isAdsFreePassValid(userInfo) &&
    ((!isVoucherModeOn && answerForm?.isAnswered && selectedTarotMode === 2) || //~ 첫째조건
      (isVoucherModeOn && isInAppPurchaseOpen) || //~ 둘째조건(결제창)
      (!isVoucherModeOn && isInAppPurchaseOpen && selectedTarotMode !== 2)); //~셋째조건(결제창)

  const totalCardsNumber = useTotalCardsNumber();
  const isAdmobInterstitialOn =
    isNative &&
    selectedAdType === 1 && //! 이게 바뀌어서 렌더가 되고 안되고 함(TarotDisplacementForm에서 바꿈).
    hasWatchedAd === false &&
    selectedTarotMode === 1 &&
    !isAdsFreePassValid(userInfo) &&
    cardForm?.selectedCardIndexList.length === totalCardsNumber && //! Displacement 창 나올 때임.
    modalForm.tarot; //! Home에선, tarot 모달창이 팝업된 상태에서 보는거지(보통무료 타로모달창 띄었다가 => 스피드모드 변경시 일단 광고 막기 가능).

  const RenderTarotModal =
    modalForm?.tarot && userInfo?.email !== '' && userInfo?.email !== undefined;

  const initialAdsMode =
    //! 보통타로 무료모드에서 입력후 모달창 나오는 단계(광고 시청전 혹은 무료이용권 지불 전)
    selectedTarotMode === 2 &&
    !isVoucherModeOn &&
    !answerForm?.isWaiting &&
    answerForm?.isAnswered &&
    !isReadyToShowDurumagi &&
    !isDoneAnimationOfBackground &&
    answerForm?.interpretation?.length === 0 &&
    !isAdsFreePassValid(userInfo);

  useEffect(() => {
    const initializeReward = async () => {
      try {
        if (!userInfo || Object.keys(userInfo)?.length === 0) return;
        let type =
          isProductionMode && isNormalAccount(userInfo) ? 'Voucher' : 'coins';
        if (userInfo?.email) {
          const rewardAmount = await getRewardForPreference(
            type,
            userInfo?.email,
          );
          if (rewardAmount > 0) setAdmobReward(rewardAmount);
          if (rewardAmount === 0) setAdmobReward(0);
          return rewardAmount;
        }
      } catch (error) {
        console.error('error while initializing admobReward :', error);
        // setAdmobReward(0); // 오류 발생 시 0으로 설정
      }
    };
    initializeReward();
  }, [
    selectedTarotMode,
    isVoucherModeOn,
    hasWatchedAd,
    admobReward,
    selectedAdType,
    userInfo,
    userInfo?.email,
    userInfoForRedux,
  ]);

  //! BlinkModalSet : 로그인 안된 상태에서 스피드 타로 접근시 호출 안됨.

  const [todayCardIndexInLocalStorage, setTodayCardIndexInLocalStorage] =
    useState(() => {
      if (!isNative) return getTodayCard(userInfo); //! 카드 인덱스나 null 반환
      if (isNative) return null;
    });
  useEffect(() => {
    const fetchTodayCard = async () => {
      try {
        let index;
        if (isNative) {
          index = await getTodayCardForNative(userInfo);
        } else {
          index = getTodayCard(userInfo);
        }

        // localStorage와 state를 항상 동기화
        // 날짜가 바뀌어서 localStorage가 null이면 state도 null로 업데이트
        if (index !== null && index !== undefined) {
          setTodayCardIndexInLocalStorage(index);
        } else {
          // localStorage에 오늘의 카드가 없으면 state도 null로 동기화
          setTodayCardIndexInLocalStorage(null);
        }
      } catch (error) {
        console.error("Error fetching today's card:", error);
      }
    };

    // userInfo가 준비되면 항상 localStorage와 동기화
    if (
      userInfo?.email !== '' &&
      userInfo?.email !== undefined &&
      userInfo?.id !== '' &&
      userInfo?.id !== undefined
    )
      fetchTodayCard();
  }, [isNative, userInfo?.email, userInfo?.id]);

  // 마이페이지에서 추가 질문 버튼 클릭 시 홈화면으로 이동한 경우 처리
  useEffect(() => {
    let isCancelled = false;

    const getStoredValue = async key => {
      if (typeof window === 'undefined') return null;
      if (isNative) {
        const { value } = await Preferences.get({ key });
        return value ?? null;
      }
      return localStorage.getItem(key);
    };

    const removeStoredValue = async key => {
      if (typeof window === 'undefined') return;
      if (isNative) {
        await Preferences.remove({ key });
        return;
      }
      localStorage.removeItem(key);
    };

    const run = async () => {
      try {
        const isAdditionalModeStr = await getStoredValue(
          'isAdditionalQuestionMode',
        );
        const isAdditionalMode = isAdditionalModeStr === 'true';
        const originalTarotStr = await getStoredValue('originalTarot');

        if (!isAdditionalMode || !originalTarotStr) return;

        // 마이페이지에서 선택한 타로(원본일 수도/추가타로일 수도 있음)
        const baseTarot = JSON.parse(originalTarotStr);

        // 추가 질문 카운트 가져오기 (원본 타로에서)
        const currentCount = baseTarot?.additionalQuestionCount ?? 0;

        // 이미 2번 추가 질문을 했으면 처리하지 않음
        if (currentCount >= 2) {
          await removeStoredValue('isAdditionalQuestionMode');
          await removeStoredValue('originalTarot');
          return;
        }

        // 원본 타로 id 정규화:
        // - baseTarot가 "추가타로"라면 baseTarot.originalTarotId가 진짜 원본 id
        // - baseTarot가 "원본타로"라면 baseTarot._id가 원본 id
        const resolvedOriginalTarotId =
          baseTarot?.originalTarotId || baseTarot?._id || baseTarot?.id || null;

        // 누적 카드 정규화:
        // - 추가타로에서 시작하면 combinedReadingConfig에 누적 카드가 들어있음
        // - 원본타로에서 시작하면 readingConfig가 누적 카드(원본 카드)임
        const resolvedCombinedCardsArr =
          resolveCombinedCardsArr(
            baseTarot?.combinedReadingConfig?.[PK.c0],
            baseTarot?.readingConfig?.[PK.c0],
          ) || [];

        if (isCancelled) return;

        // 스프레드 취소 시 원래(마이페이지에서 선택한) 타로로 복원할 수 있도록 저장
        answerFormBeforeAdditionalQuestionRef.current = baseTarot;
        additionalQuestionOriginRef.current = 'mypage';

        // State 업데이트
        setIsAdditionalQuestionMode(true);
        setOriginalTarot(baseTarot);
        setAdditionalQuestionCount(currentCount);

        // 스프레드 모달 자동 열기 (다른 모달이 열려있지 않을 때만)
        if (!modalForm?.spread && !modalForm?.tarot) {
          updateModalForm(prev => ({ ...prev, spread: true }));
        }

        // answerForm에 추가 질문 정보 저장
        updateAnswerForm(prev => ({
          ...prev,
          isAdditionalQuestion: true,
          originalTarotId: resolvedOriginalTarotId,
          parentTarotId: baseTarot?._id || baseTarot?.id || null,
          additionalQuestionCount: currentCount,
          isSubmitted: false,
          isWaiting: false,
          isAnswered: false,
          combinedReadingConfig: {
            [PK.c0]: resolvedCombinedCardsArr,
          },
          tarotIdChain: baseTarot?.tarotIdChain || [],
          questionChain:
            currentCount === 0
              ? [
                  {
                    question: baseTarot?.questionData?.question || '',
                    answer: baseTarot?.interpretation || '',
                  },
                ]
              : baseTarot?.questionChain || [],
        }));

        // 스토리지 정리 (한 번만 실행되도록)
        await removeStoredValue('isAdditionalQuestionMode');
        await removeStoredValue('originalTarot');
      } catch (error) {
        console.error('Error handling additional question mode:', error);
        // 에러 발생 시 스토리지 정리
        await removeStoredValue('isAdditionalQuestionMode');
        await removeStoredValue('originalTarot');
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className={styles['container']}>
      {/* 홈 진입 시 5초간 정가운데 감성 문구 (로그인 여부 무관) */}
      {/* 로딩폼 때부터 문구 표시 (문구는 로딩 위에 겹쳐 보이고, 4초 타이머는 로딩 끝난 뒤에만 시작) */}
      {showWelcomePhrase && isHomeRoute && (
        <HomeWelcomePhrase
          onDone={handleWelcomePhraseDone}
          startTimerWhen={isThreeSceneReady}
        />
      )}
      {/* 이벤트공지창 - 아이디별로 로컬스토리지에 팝업 표시 여부 설정 */}
      {/* {new Date() < new Date('2025-08-26') && isNative && userInfo?.email && (
        <NoticePopup email={userInfo?.email} />
      )}
      {new Date() < new Date('2025-08-26') &&
        isNative &&
        (!userInfo || userInfo?.email === '' || !userInfo?.email) && (
          <NoticePopup email={'user@user.com'} />
        )} */}
      {/* 로그인 전 나타남 */}
      {!isToken && (
        <Login
          userInfo={userInfo}
          isTokenFromNavbar={isToken}
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
        />
      )}
      {/* 로그인 후 나타남 - 레이아웃 완료 후 한꺼번에 페이드인하여 개인정보 버튼만 먼저 보이는 현상 방지 */}
      {isToken && (
        <div
          style={{
            opacity: tokenButtonsVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-out',
            pointerEvents: tokenButtonsVisible ? 'auto' : 'none',
          }}
        >
          <DailyTarotCard
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            setTodayCardIndexInLocalStorage={setTodayCardIndexInLocalStorage}
            styles={styles}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            setClickedForTodayCardFromHome={setClickedForTodayCard}
            isTokenFromNavbar={isToken}
          />
          {/* 내담자 정보 버튼 (아이콘) - Yes/No/Invite/Spread와 동일 조건에서만 표시(스프레드·타로 모달·AI 해석 대기·해석 표시 시 숨김) */}
          {!modalForm?.spread &&
            !modalForm?.tarot &&
            !answerForm?.isWaiting &&
            !answerForm?.isAnswered &&
            !isReadyToShowDurumagi &&
            !isClickedForTodayCard &&
            userInfo?.email &&
            Object.keys(userInfo || {}).length > 0 && (
              <button
                type="button"
                className={styles.clientInfoButton}
                onClick={() => setClientInfoModalOpen(true)}
                aria-label={t('clientInfo.buttonLabel', '내 정보')}
              >
                <UserCircle size={32} strokeWidth={1.8} aria-hidden />
              </button>
            )}
          {/* Yes/No Tarot button - above Invite (share) */}
          <YesNo
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            isClickedForTodayCardFromHome={isClickedForTodayCard}
            isTokenFromNavbar={isToken}
            onOpenChange={setYesNoModalOpen}
          />
          {/* Invite button and modal on Home - shown only when logged in */}
          <Invite
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            isClickedForTodayCardFromHome={isClickedForTodayCard}
            isTokenFromNavbar={isToken}
            setIsInviteOpen={setIsInviteOpen}
            updateCopyBlinkModalOpen={updateCopyBlinkModalOpen}
          />
          <Spread
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            isClickedForTodayCardFromHome={isClickedForTodayCard}
            isTokenFromNavbar={isToken}
            onSpreadClick={() => setReadingTypeChoiceOpen(true)}
          />
          <MyPage
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            isClickedForTodayCardFromHome={isClickedForTodayCard}
            isTokenFromNavbar={isToken}
          />
          <TarotManual
            modalForm={modalForm}
            answerForm={answerForm}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            userInfo={userInfo}
            cardForm={cardForm}
            todayCardIndexInLocalStorage={todayCardIndexInLocalStorage}
            handleStateGroup={handleStateGroup}
            updateCardForm={updateCardForm}
            stateGroup={stateGroup}
            updateTarotManualModalOpen={updateTarotManualModalOpen}
            isClickedForTodayCardFromHome={isClickedForTodayCard}
            isTokenFromNavbar={isToken}
          />
        </div>
      )}

      <BlinkModalSet
        stateGroup={stateGroup}
        setStateGroup={setStateGroup}
        styles={styles}
      />
      {isChargeModalOpen && !isNative && resultOfHasUserEmail && (
        <ChargeModal
          updateChargeModalOpen={updateChargeModalOpen}
          isRefundPolicyOpen={isRefundPolicyOpen}
          updateRefundPolicyOpen={updateRefundPolicyOpen}
          isPriceInfoModalOpen={isPriceInfoModalOpen}
          updatePriceInfoModalOpen={updatePriceInfoModalOpen}
          setChargingKRWBlinkModalOpen={setChargingKRWBlinkModalOpen}
          setChargingUSDBlinkModalOpen={setChargingUSDBlinkModalOpen}
          userInfoFromMyPage={userInfo}
          setUnavailableVoucher={setUnavailableVoucher}
          requiredVoucherInfo={requiredVoucherInfo}
          isStarMode={requiredVoucherInfo?.name === 'star'}
        >
          {t(`charge_modal.out-of-voucher`)}
        </ChargeModal>
      )}
      {isInAppPurchaseOpen && isNative && resultOfHasUserEmail && (
        <InAppPurchase
          updateRefundPolicyOpen={updateRefundPolicyOpen}
          updatePriceInfoModalOpen={updatePriceInfoModalOpen}
          userInfoFromMyPage={userInfo}
          isPriceInfoModalOpen={isPriceInfoModalOpen}
          isInAppPurchaseOpen={isInAppPurchaseOpen}
          setInAppPurchaseOpen={setInAppPurchaseOpen}
          stateGroup={stateGroup}
          setUnavailableVoucher={setUnavailableVoucher}
          setSelectedAdType={setSelectedAdType}
          admobReward={admobReward}
          setWatchedAd={setWatchedAd}
          setAdmobReward={setAdmobReward}
          isStarMode={requiredVoucherInfo?.name === 'star'}
        >
          {t(`charge_modal.out-of-voucher`)}
        </InAppPurchase>
      )}
      {isTarotManualModalOpen && (
        <TarotManualModal
          updateTarotManualModalOpen={updateTarotManualModalOpen}
        />
      )}
      {/* //! 보통 타로용 */}
      {isAdmobOn && (
        <AdComponentForButton
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
          userInfo={userInfo}
        />
      )}
      {/* //! 스피드 타로용 */}
      {isAdmobInterstitialOn && (
        <AdComponentForInterstital
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
          userInfo={userInfo}
        />
      )}
      {/* Canvas 태그(TarotMaster태그에 포함됨)를 배치 및 크기를 지정하고 싶을 땐 부모 div를 씌어주어 스타일 주자. 
        Canvas 태그에는 스타일을 주는게 아니다. 속성으로 정하기. */}

      {/* JavaScript가 비활성화된 경우를 위한 noscript 태그 */}
      <noscript>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#1a1a2e',
            color: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>{t('meta.title')}</h2>
          <p style={{ marginBottom: '2rem', maxWidth: '600px' }}>
            {t('meta.description')}
          </p>
          <div style={{ maxWidth: '800px', textAlign: 'left' }}>
            <h2 style={{ marginBottom: '1rem' }}>
              {t('home.js_required_title', {
                defaultValue: 'JavaScript Required',
              })}
            </h2>
            <p>
              {t('home.js_required_message', {
                defaultValue:
                  'This application requires JavaScript to display the interactive 3D tarot experience. Please enable JavaScript in your browser settings to continue.',
              })}
            </p>
          </div>
        </div>
      </noscript>

      <div className={styles['tarot-master-container']}>
        {!isThreeSceneReady && (
          <div
            className={styles['threeSceneLoadingOverlay']}
            aria-hidden="true"
          >
            <LoadingForm />
          </div>
        )}
        <Suspense fallback={<LoadingForm />}>
          <TarotHomeScene
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            toggleModalGroup={toggleModalGroup}
            handleStateGroup={handleStateGroup}
            setReadyToShowDurumagi={setReadyToShowDurumagi}
            updateTarotManualModalOpen={updateTarotManualModalOpen}
            setDoneAnimationOfBackground={setDoneAnimationOfBackground}
            userInfo={userInfo}
            isClickedForTodayCard={isClickedForTodayCard}
            isInviteOpen={isInviteOpen}
            onOpenReadingTypeChoice={() => setReadingTypeChoiceOpen(true)}
            onSceneReady={() => setIsThreeSceneReady(true)}
          />
        </Suspense>
        {isInstructionOpen && (
          <TarotQuestionInstructionModal
            setInstructionOpen={setInstructionOpen}
            questionKind={questionKind}
          />
        )}
        {isClientInfoModalOpen && (
          <ClientInfoModal
            isOpen={isClientInfoModalOpen}
            onClose={() => setClientInfoModalOpen(false)}
            userEmail={userInfo?.email ?? ''}
          />
        )}
        {readingTypeChoiceOpen && (
          <ReadingTypeChoiceModal
            onClose={() => setReadingTypeChoiceOpen(false)}
            isCustomLocked={
              isCheckingToken || !(isToken && resultOfHasUserEmail)
            }
            onSelectCustomLocked={() => {
              // 비로그인: 맞춤 리딩은 잠금 처리 + 기존 로그인 블링크 모달 호출
              updateLoginBlinkModalOpen(true);
            }}
            onSelectCustom={() => {
              // 안전장치: 혹시 상태가 꼬여도 비로그인 상태에선 맞춤 리딩 진입 금지
              if (isCheckingToken || !(isToken && resultOfHasUserEmail)) {
                updateLoginBlinkModalOpen(true);
                return;
              }
              setReadingTypeChoiceOpen(false);
              updateModalForm(prev => ({ ...prev, spread: true }));
            }}
            onSelectGeneral={() => {
              setReadingTypeChoiceOpen(false);
              navigate(getPathWithLang(browserLanguage).P2);
            }}
          />
        )}
        {generalReadingQuestionOpen && (
          <GeneralReadingQuestionModal
            onClose={() => {
              generalReadingClosingRef.current = true;
              setGeneralReadingQuestionOpen(false);
              if (location.pathname.includes('general-reading')) {
                navigate(getPathWithLang(browserLanguage).P0);
              }
            }}
            onSelectQuestion={handleGeneralReadingSelect}
          />
        )}
        {generalReadingSpreadChoiceOpen && (
          <GeneralReadingSpreadChoiceModal
            key={generalReadingSpreadChoiceKey}
            onClose={() => {
              generalReadingClosingRef.current = true;
              setGeneralReadingSpreadChoiceOpen(false);
              setGeneralReadingSelectedQuestionId(null);
              setGeneralReadingSelectedQuestionText('');
              if (location.pathname.includes('general-reading')) {
                navigate(getPathWithLang(browserLanguage).P0);
              }
            }}
            onSelectSpread={handleGeneralReadingSpreadSelect}
            questionText={generalReadingSelectedQuestionText}
            isNative={isNative}
            userInfo={userInfo}
            onMarkAdConfirmShown={() =>
              setHasShownGeneralReadingAdConfirm(true)
            }
          />
        )}
        <Suspense fallback={null}>
          {modalForm?.spread &&
            userInfo?.email !== '' &&
            userInfo?.email !== undefined && (
              <SpreadModal
                stateGroup={stateGroup}
                setStateGroup={setStateGroup}
                toggleModalGroup={toggleModalGroup}
                handleStateGroup={handleStateGroup}
                userCacheForRedux={userCacheForRedux}
                admobReward={admobReward}
                userInfo={userInfo}
              />
            )}
        </Suspense>
        <Suspense fallback={null}>
          {RenderTarotModal && (
            <TarotModal
              stateGroup={stateGroup}
              setStateGroup={setStateGroup}
              toggleModalGroup={toggleModalGroup}
              handleStateGroup={handleStateGroup}
              userInfo={userInfo}
              setAdmobReward={setAdmobReward}
              isInstructionOpen={isInstructionOpen}
              setInstructionOpen={setInstructionOpen}
              setQuestionKind={setQuestionKind}
            />
          )}
        </Suspense>
        {answerForm?.isAnswered &&
        !isResultModalClosing &&
        (answerForm?.isGeneralReadingResult || selectedTarotMode !== 1) &&
        !modalForm?.tarot &&
        !modalForm?.spread &&
        (initialAdsMode ||
          (isDoneAnimationOfBackground && isReadyToShowDurumagi)) ? (
          <AnswerModalView
            stateGroup={{ answerForm, selectedCardPosition }}
            answerForm={answerForm}
            isGeneralReadingFirstView={isGeneralReadingFirstView}
            isCustomReadingLockedForLogin={
              isCheckingToken || !(isToken && resultOfHasUserEmail)
            }
            selectedCardPosition={selectedCardPosition}
            setSelectedCardPosition={setSelectedCardPosition}
            questionForm={questionForm}
            updateAnswerForm={updateAnswerForm}
            tarotSpreadVoucherPrice={tarotSpreadVoucherPrice}
            handleNotAnsweredState={handleNotAnsweredState}
            handleResetAll={handleResetAll}
            updateSaveBlinkModalOpen={updateSaveBlinkModalOpen}
            updateCopyBlinkModalOpen={updateCopyBlinkModalOpen}
            selectedTarotMode={selectedTarotMode}
            selectedAdType={selectedAdType}
            setSelectedAdType={setSelectedAdType}
            admobReward={admobReward}
            setAdmobReward={setAdmobReward}
            isVoucherModeOn={isVoucherModeOn}
            userInfo={userInfo}
            setWatchedAd={setWatchedAd}
            onAdditionalQuestion={handleAdditionalQuestion}
            onCustomInterpretation={handleCustomInterpretation}
            additionalQuestionCount={additionalQuestionCount}
            onAnswerModalClose={onAnswerModalClose}
            setDoneAnimationOfBackground={setDoneAnimationOfBackground}
            setReadyToShowDurumagi={setReadyToShowDurumagi}
            onResultModalCloseRequest={() => setIsResultModalClosing(true)}
          />
        ) : null}
        {showReviewModal && (
          <ReviewRequestModal
            onClose={handleReviewModalClose}
            onWriteReview={handleWriteReview}
            isJapanese={browserLanguage === 'ja'}
          />
        )}
      </div>
      {/* /* 이런 건 검색엔진이 처벌할 수 있어요 */}
      {/* display: none;           /* 아예 숨김 */}
      {/* opacity: 0; pointer-events: none;  /* 보이지 않게 */}
      {/* color: white;            /* 배경색과 같은 색 */}
      {/* font-size: 0;            /* 글씨 크기 0 */}

      <noscript>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t('page.threejs.noscript.title')}</h2>
          <p>{t('page.threejs.noscript.message1')}</p>
          <p>{t('page.threejs.noscript.message2')}</p>
        </div>
      </noscript>

      {/* Interpretation Loading Modal */}
      {isInterpretationLoading && <InterpretationLoadingModal />}
    </div>
  );
};
export default Home;
