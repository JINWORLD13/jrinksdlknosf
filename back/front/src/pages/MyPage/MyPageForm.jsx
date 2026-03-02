/*eslint-disable*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './MyPageForm.module.scss';
import {
  hasAccessToken,
  removeAccessTokens,
  removeRefreshTokens,
} from '../../utils/storage/tokenCookie.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { tarotApi } from '../../api/tarotApi.jsx';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../api/userApi.jsx';
import MyPageSideMenuForm from './components/MyPageSideMenuForm.jsx';
import {
  P9, P10, P13, P14, P15, P16, P17, P18, P19, P23,
} from '../../config/route/UrlPaths.jsx';
import {
  useAlertModalState,
  useAnswerFormState,
  useBlinkModalState,
  useChargeModalState,
  useRefundPolicyState,
  useTarotAndIndexInfoState,
  useTarotHistoryState,
} from '@/hooks';
import AnswerModalView from '../../modals/AnswerModal/AnswerModalView.jsx';
import ChartInfoForm from '../../components/Chart/ChartInfoForm.jsx';
import UserInfoForm from './user/UserInfoForm.jsx';
import AlertModal from '../../modals/AlertModal/AlertModal.jsx';
import BlinkModal from '../../modals/BlinkModal/BlinkModal.jsx';
import ChargeModal from '../../modals/PurchaseModal/TossPurchase/ChargeModal.jsx';
import InAppPurchase from '../../modals/PurchaseModal/InAppPurchase/InAppPurchase.jsx';
import { usePreventModalBackgroundScroll } from '@/hooks';
import { usePriceInfoModalState } from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserAndTarotDataWithRedux } from '@/hooks';
import TarotReadingInfoForm from './tarot/TarotReadingInfoForm.jsx';
import UserInfoWithdrawalForm from './user/UserInfoWithdrawalForm.jsx';
import { setTarotHistoryAction } from '../../store/tarotHistoryStore.jsx';
import {
  getRewardForPreference,
  hasAccessTokenForPreference,
  removeAccessTokensForPreference,
  removeRefreshTokensForPreference,
} from '../../utils/storage/tokenPreference.jsx';
import { checkViolationInGoogleInAppRefund } from '../../utils/validation/checkViolation.jsx';
import { cardPositionInfo } from '../../lib/tarot/card/cardPositionInfo.jsx';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import isComDomain from '../../utils/validation/isComDomain.jsx';
import AdComponentForShop from '../../components/GoogleAd/AdComponentForShop.jsx';
import { BlinkModalSet } from '../../components/BlinkModals/BlinkModalSet.jsx';
import { isBot } from '../../utils/validation/isBot.js';
import { isNormalAccount } from '../../lib/user/isNormalAccount.js';
import { createCancelToken } from '../../api/api.jsx';
import HomePage from '../../components/Button/HomePageButton/HomePage.jsx';
import { isDevelopmentMode, isProductionMode } from '@/utils/constants';
import { useFirebaseAnalytics } from '../../hooks/useFirebaseAnalytics';

const isNative = Capacitor.isNativePlatform();

const MyPageForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    trackAdditionalQuestionButtonClick,
    trackHistoryAdditionalQuestionStart,
    trackStatisticsTabClick,
    trackChartTypeChange,
    trackPeriodStatisticsClick,
    trackHistoryItemClick,
    trackHistoryDelete,
    trackWithdrawalButtonClick,
    trackTermsOfServiceView,
    trackBusinessInfoView,
  } = useFirebaseAnalytics();

  const handleAddQuestion = useCallback(
    async tarot => {
      try {
        if (typeof window === 'undefined') return;

        // Firebase Analytics: 히스토리에서 추가 질문 시작
        const tarotId = tarot?._id || tarot?.id || 'unknown';
        trackHistoryAdditionalQuestionStart(tarotId);
        trackAdditionalQuestionButtonClick('mypage');

        // Home에서 "추가질문 모드"로 진입할 수 있도록 플래그/원본 타로를 저장
        // - Web: localStorage
        // - Native: Capacitor Preferences
        const baseTarotStr = JSON.stringify(tarot ?? null);
        if (isNative) {
          await Preferences.set({
            key: 'isAdditionalQuestionMode',
            value: 'true',
          });
          await Preferences.set({
            key: 'originalTarot',
            value: baseTarotStr,
          });
        } else {
          localStorage.setItem('isAdditionalQuestionMode', 'true');
          localStorage.setItem('originalTarot', baseTarotStr);
        }

        // 홈으로 이동하여 스프레드 선택 모달을 열도록 함
        navigate('/');
      } catch (error) {
        console.error('Error while preparing additional question:', error);
      }
    },
    [
      navigate,
      trackAdditionalQuestionButtonClick,
      trackHistoryAdditionalQuestionStart,
    ]
  );

  // 개별 CancelToken source 생성
  const sourceRef = useRef(createCancelToken());
  // tarotHistory[0]?.userInfo == ObjId가 나옴.
  const myPageFormRef = useRef(null);
  useEffect(() => {
    return () => {
      myPageFormRef.current = null;
    };
  }, []);
  const { t } = useTranslation();
  const [tarotHistory, updateTarotHistory] = useTarotHistoryState();
  const [userInfo, setUserInfo] = useState({});
  const [pathName, setPathName] = useState('');
  const [isAnswerModalOpen, setAnswerModalOpen] = useState(false);
  const [answerForm, updateAnswerForm] = useAnswerFormState();
  //! ChartInfoForm용
  const [statistics, setStatistics] = useState('');
  const [theme, setTheme] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(t(`chart.statistics-total`));
  const [questionTopic, setQuestionTopic] = useState('');
  const [questionOfTopic, setQuestionOfTopic] = useState(
    t(`chart.statistics-total`)
  );
  const [question, setQuestion] = useState(t(`chart.statistics-total`));
  //~ 이용불가 이용권 state
  const [isUnavailableVoucher, setUnavailableVoucher] = useState(false);
  //* 이용권 결제용 모달 state
  const [isChargeModalOpen, updateChargeModalOpen] = useChargeModalState();
  const [isInAppPurchaseOpen, setInAppPurchaseOpen] = useState(false);
  //^ 환불약관 및 가격정보 모달 state
  const [isRefundPolicyOpen, updateRefundPolicyOpen] =
    useRefundPolicyState(false);
  const [isPriceInfoModalOpen, updatePriceInfoModalOpen] =
    usePriceInfoModalState(false);
  //& KRW, USD 충전용 모달 state
  const [isChargingKRWBlinkModalOpen, setChargingKRWBlinkModalOpen] =
    useState(false);
  const [isChargingUSDBlinkModalOpen, setChargingUSDBlinkModalOpen] =
    useState(false);
  //& 복사, 저장용 모달 state
  const [isCopyBlinkModalOpen, updateCopyBlinkModalOpen] = useBlinkModalState();
  const [isSaveBlinkModalOpen, updateSaveBlinkModalOpen] = useBlinkModalState();
  //& 삭제 진행 중 알림용 모달 state
  const [
    isDeleteInProgressBlinkModalOpen,
    updateDeleteInProgressBlinkModalOpen,
  ] = useBlinkModalState();
  //? 회원탈퇴용 모달을 위한 state
  const [isUserAlertModalOpen, updateUserAlertModalOpen] = useAlertModalState();
  //! 타로상담기록 삭제용 모달을 위한 state
  const [isDeleteTarotClicked, setDeleteTarotClicked] = useState(false);
  const [isTarotAlertModalOpen, updateTarotAlertModalOpen] =
    useAlertModalState();
  const [tarotAndIndexInfo, updateTarotAndIndexInfo] =
    useTarotAndIndexInfoState();
  const [isClickedForInvisible, setClickedForInvisible] = useState([]);
  //! 타로상담기록 전체 삭제용 모달을 위한 state
  const [isTarotAllAlertModalOpen, updateTarotAllAlertModalOpen] =
    useAlertModalState();
  //~ 카드 정보 state
  const [selectedCardPosition, setSelectedCardPosition] = useState({
    isClicked: false,
    position: -1,
  });
  //! 광고용
  const [selectedAdType, setSelectedAdType] = useState(0);
  const [hasWatchedAd, setWatchedAd] = useState(false);
  const [admobReward, setAdmobReward] = useState(0);

  const browserLanguage = useLanguageChange();

  if (hasAccessToken() === false && isNative === false && !isBot()) return;
  if (hasAccessTokenForPreference() === false && isNative === true && !isBot())
    return;
  //? 회원탈퇴 삭제용 모달을 위한 삭제 함수
  const deleteUserInfo = async e => {
    e.stopPropagation();
    const { response, cleanup } = await userApi.withdraw();
    const statusCode = response;
    if (statusCode === 204) {
      if (isNative) {
        removeAccessTokensForPreference();
        removeRefreshTokensForPreference();
      } else {
        removeAccessTokens();
        removeRefreshTokens();
      }
      navigate('/');
      window.location.reload();
    }
  };

  //! 타로상담기록 삭제용 모달을 위한 삭제 함수
  const handleDeleteTarotHistory = async tarotAndIndexInfo => {
    if (isDeleteTarotClicked) {
      // 이미 삭제 진행 중이면 알림 모달 표시
      updateDeleteInProgressBlinkModalOpen(true);
      return;
    }
    setDeleteTarotClicked(true);
    const { tarot, index } = tarotAndIndexInfo;
    try {
      const { response, cleanup } = await tarotApi.deleteHistory(tarot);
      const result = response;
      if (result === 'success') {
        setClickedForInvisible(prev => {
          //& 원래 코드... 기록 삭제시 그 다음 기록까지 안보여지게 되는 에러 나오니 index 없앰 if (!prev.includes(index)) return [...prev, index];
          if (!prev.includes(index)) return [...prev];
          return prev;
        });

        //! 여기서 필요한 상태 업데이트를 수행합니다.
        updateTarotHistory(currentHistorys => {
          const filteredArray = currentHistorys?.filter(tarotHistory => {
            // tarot만 tarot.questionData.question와 같이 2중으로 된건 ''로 나옴.
            return tarotHistory?.createdAt !== tarot?.createdAt;
          });
          dispatch(setTarotHistoryAction([...filteredArray]));
          return filteredArray;
        });
      } else {
        // 삭제 실패 처리
        console.error('Failed to delete tarot history');
      }
    } catch (error) {
      console.error('Error deleting tarot history:', error);
      // 에러 처리 로직 (예: 사용자에게 에러 메시지 표시)
    } finally {
      setDeleteTarotClicked(false);
    }
  };
  //! 현재 언어의 모든 타로상담기록 삭제용 모달을 위한 삭제 함수
  const handleDeleteAllTarotHistory = async () => {
    if (isDeleteTarotClicked) {
      // 이미 삭제 진행 중이면 알림 모달 표시
      updateDeleteInProgressBlinkModalOpen(true);
      return;
    }
    setDeleteTarotClicked(true);

    try {
      // 전체 삭제: 배열 보내지 않고 플래그와 언어만 전달 (백엔드에서 MongoDB deleteMany 직접 실행)
      const { response, cleanup } = await tarotApi.deleteAllHistoryByLanguage(
        browserLanguage
      );
      const result = response;

      if (result === 'success') {
        // 현재 언어의 기록을 제외한 나머지만 유지
        updateTarotHistory(currentHistorys => {
          const filteredArray =
            currentHistorys?.filter(
              tarot => tarot?.language !== browserLanguage
            ) || [];
          dispatch(setTarotHistoryAction([...filteredArray]));
          return filteredArray;
        });
      } else {
        console.error('Failed to delete all tarot history');
      }
    } catch (error) {
      console.error('Error deleting all tarot history:', error);
    } finally {
      setDeleteTarotClicked(false);
    }
  };

  //!
  const userInfoForRedux = useSelector(state => state?.userInfoStore?.userInfo);
  const tarotHistoryForRedux = useSelector(
    state => state?.tarotHistoryStore?.tarotHistory
  );

  const {
    getUserAndTarot: getUserAndTarotForRedux,
    clearCaches,
    cleanupInterceptorArr,
  } = useFetchUserAndTarotDataWithRedux(tarotApi, userApi, dispatch);

  const saveUserAndTarotInRedux = async () => {
    try {
      // cancelToken을 전달하여 요청 취소 가능하도록 함
      const cancelToken = sourceRef.current?.token;

      // 더 엄격한 조건으로 변경 - 정말 필요할 때만 호출
      if (
        !userInfoForRedux ||
        !userInfoForRedux.email ||
        Object.keys(userInfoForRedux)?.length === 0 ||
        !tarotHistoryForRedux ||
        !Array.isArray(tarotHistoryForRedux)
      ) {
        await getUserAndTarotForRedux(cancelToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // deleteTarotHistoryOver3MonthsData();
    if (
      (Array.isArray(tarotHistoryForRedux) &&
        tarotHistoryForRedux?.length === 0) ||
      tarotHistoryForRedux === undefined ||
      tarotHistoryForRedux === null
    ) {
      updateTarotHistory([]);
    } else {
      if (!isBot()) updateTarotHistory(tarotHistoryForRedux);
    }
    if (
      (typeof userInfoForRedux === 'object' &&
        Object.keys(userInfoForRedux)?.length === 0) ||
      userInfoForRedux === undefined ||
      userInfoForRedux === null
    ) {
      setUserInfo({});
    } else {
      if (!isBot()) setUserInfo(userInfoForRedux);
    }

    // 최초 마운트 시에만 데이터 가져오기
    if (
      !isBot() &&
      (!userInfoForRedux ||
        !userInfoForRedux.email ||
        !tarotHistoryForRedux ||
        !Array.isArray(tarotHistoryForRedux))
    ) {
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
  }, [
    // 의존성 배열 최적화 - 불필요한 재호출 방지
    userInfoForRedux?.email, // 사용자 Email만 체크
    !!tarotHistoryForRedux, // 배열 존재 여부만 체크
    // isUserAlertModalOpen 제거 - 모달 상태 변경으로 인한 불필요한 API 호출 방지
  ]);

  //! URL 경로 기반 페이지 판단 (도메인에 관계없이 작동)
  useEffect(() => {
    const pathname = location.pathname;

    // URL 경로에서 현재 페이지 판단
    if (pathname.includes(`/${P13}/${P14}`)) {
      setPathName(P14);
    } else if (pathname.includes(`/${P13}/${P15}/${P16}`)) {
      setPathName(`${P15}/${P16}`);
    } else if (pathname.includes(`/${P13}/${P15}/${P18}`)) {
      setPathName(P18);
    } else if (pathname.includes(`/${P13}/${P15}/${P17}`)) {
      setPathName(P17);
    } else if (pathname.includes(`/${P13}/${P19}`)) {
      setPathName(P19);
    } else if (pathname.includes(`/${P13}/${P15}/${P23}`)) {
      setPathName(P23);
    } else if (pathname.endsWith(`/${P13}`)) {
      setPathName('');
    } else {
      setPathName('');
    }
  }, [location.pathname]); // browserLanguage 의존성 제거로 경쟁 상태 방지

  usePreventModalBackgroundScroll(
    isChargeModalOpen,
    isCopyBlinkModalOpen,
    isSaveBlinkModalOpen,
    isUserAlertModalOpen,
    isTarotAlertModalOpen,
    isRefundPolicyOpen
  );

  checkViolationInGoogleInAppRefund(userInfo);

  let [resultOfHasUserEmail, setResultOfHasUserEmail] = useState(false);
  useEffect(() => {
    setResultOfHasUserEmail(() => {
      return userInfo?.email ? isComDomain(userInfo?.email) : false;
    });
  }, [userInfo?.email]);

  useEffect(() => {
    const initializeReward = async () => {
      try {
        if (!userInfo || Object.keys(userInfo)?.length === 0) return;
        let type =
          isProductionMode && isNormalAccount(userInfo) ? 'Voucher' : 'coins';
        if (userInfo?.email) {
          const rewardAmount = await getRewardForPreference(
            type,
            userInfo?.email
          );
          if (rewardAmount > 0) setAdmobReward(rewardAmount);
          if (rewardAmount === 0) setAdmobReward(0);
          return rewardAmount;
        }
      } catch (error) {
        console.error('error while initializing admobReward :', error);
        setAdmobReward(0); // 오류 발생 시 0으로 설정
      }
    };
    initializeReward();
  }, [
    admobReward,
    selectedAdType,
    isInAppPurchaseOpen,
    userInfo,
    userInfo?.email,
  ]);

  return (
    <div
      className={`${styles['container']} ${
        isAnswerModalOpen ? styles['no-scroll'] : ''
      }`}
      ref={myPageFormRef}
    >
      <HomePage
        answerForm={answerForm}
        userInfo={userInfo}
        isAnswerModalOpen={isAnswerModalOpen}
        isTokenFromNavbar={true}
      />
      {isTarotAlertModalOpen === true ? (
        <AlertModal
          updateTarotAlertModalOpen={updateTarotAlertModalOpen}
          tarotAndIndexInfo={tarotAndIndexInfo}
          handleDeleteTarotHistory={handleDeleteTarotHistory}
        >
          {t(`alert_modal.delete_tarot_history`)}
        </AlertModal>
      ) : null}
      {isTarotAllAlertModalOpen === true ? (
        <AlertModal
          updateTarotAllAlertModalOpen={updateTarotAllAlertModalOpen}
          handleDeleteAllTarotHistory={handleDeleteAllTarotHistory}
        >
          {t(`alert_modal.delete_all_tarot_history`)}
        </AlertModal>
      ) : null}
      {isUserAlertModalOpen === true ? (
        <AlertModal
          updateUserAlertModalOpen={updateUserAlertModalOpen}
          deleteUserInfo={deleteUserInfo}
          handleDeleteAllTarotHistory={handleDeleteAllTarotHistory}
        >
          {t(`alert_modal.delete_user`)}
        </AlertModal>
      ) : null}
      <BlinkModalSet
        stateGroup={{
          answerForm,
          isCopyBlinkModalOpen,
          isSaveBlinkModalOpen,
          isChargingKRWBlinkModalOpen,
          isChargingUSDBlinkModalOpen,
          isDeleteInProgressBlinkModalOpen,
          isUnavailableVoucher,
          selectedCardPosition,
          isAnswerModalOpen,
        }}
        setStateGroup={{
          updateCopyBlinkModalOpen,
          updateSaveBlinkModalOpen,
          setChargingKRWBlinkModalOpen,
          setChargingUSDBlinkModalOpen,
          updateDeleteInProgressBlinkModalOpen,
          setUnavailableVoucher,
          setSelectedCardPosition,
        }}
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
        >
          {t(`charge_modal.purchase`)}
        </ChargeModal>
      )}
      {isInAppPurchaseOpen && resultOfHasUserEmail && (
        <InAppPurchase
          updateRefundPolicyOpen={updateRefundPolicyOpen}
          updatePriceInfoModalOpen={updatePriceInfoModalOpen}
          userInfoFromMyPage={userInfo}
          isPriceInfoModalOpen={isPriceInfoModalOpen}
          isInAppPurchaseOpen={isInAppPurchaseOpen}
          setInAppPurchaseOpen={setInAppPurchaseOpen}
          setUnavailableVoucher={setUnavailableVoucher}
          setSelectedAdType={setSelectedAdType}
          setWatchedAd={setWatchedAd}
          admobReward={admobReward}
          setAdmobReward={setAdmobReward}
        >
          {t(`charge_modal.purchase`)}
        </InAppPurchase>
      )}
      {/* {isChargeModalOpen && !isNative && resultOfHasUserEmail && (
        <InAppPurchase
          updateRefundPolicyOpen={updateRefundPolicyOpen}
          updatePriceInfoModalOpen={updatePriceInfoModalOpen}
          userInfoFromMyPage={userInfo}
          isPriceInfoModalOpen={isPriceInfoModalOpen}
          isInAppPurchaseOpen={isInAppPurchaseOpen}
          setInAppPurchaseOpen={setInAppPurchaseOpen}
          setUnavailableVoucher={setUnavailableVoucher}
          setSelectedAdType={setSelectedAdType}
          setWatchedAd={setWatchedAd}
          admobReward={admobReward}
          setAdmobReward={setAdmobReward}
        >
          {t(`charge_modal.purchase`)}
        </InAppPurchase>
      )} */}
      {!hasWatchedAd && selectedAdType !== 0 && (
        <AdComponentForShop
          selectedAdType={selectedAdType}
          setSelectedAdType={setSelectedAdType}
          setWatchedAd={setWatchedAd}
          setAdmobReward={setAdmobReward}
          userInfo={userInfo}
        />
      )}
      <div className={styles['container-box1']}>
        <MyPageSideMenuForm
          setPathName={setPathName}
          setAnswerModalOpen={setAnswerModalOpen}
        />
      </div>
      <div className={styles['container-box2']}>
        {pathName === '' ? (
          <UserInfoForm
            userInfo={userInfo}
            tarotHistory={tarotHistory}
            setAnswerModalOpen={setAnswerModalOpen}
            updateAnswerForm={updateAnswerForm}
            updateTarotAlertModalOpen={updateTarotAlertModalOpen}
            updateTarotAndIndexInfo={updateTarotAndIndexInfo}
            updateUserAlertModalOpen={updateUserAlertModalOpen}
            updateChargeModalOpen={updateChargeModalOpen}
            isInAppPurchaseOpen={isInAppPurchaseOpen}
            setInAppPurchaseOpen={setInAppPurchaseOpen}
            isClickedForInvisible={isClickedForInvisible}
            resultOfHasUserEmail={resultOfHasUserEmail}
          />
        ) : null}
        {isAnswerModalOpen &&
          typeof document !== 'undefined' &&
          createPortal(
            <AnswerModalView
              stateGroup={{ answerForm, selectedCardPosition }}
              answerForm={answerForm}
              selectedCardPosition={selectedCardPosition}
              setSelectedCardPosition={setSelectedCardPosition}
              setAnswerModalOpen={setAnswerModalOpen}
              updateSaveBlinkModalOpen={updateSaveBlinkModalOpen}
              updateCopyBlinkModalOpen={updateCopyBlinkModalOpen}
              onAdditionalQuestion={handleAddQuestion}
              isVoucherModeOn={true}
            />,
            document.body
          )}
        {pathName === P14 ? (
          <TarotReadingInfoForm
            userInfo={userInfo}
            tarotHistory={tarotHistory}
            updateTarotHistory={updateTarotHistory}
            setAnswerModalOpen={setAnswerModalOpen}
            updateAnswerForm={updateAnswerForm}
            updateTarotAlertModalOpen={updateTarotAlertModalOpen}
            updateTarotAndIndexInfo={updateTarotAndIndexInfo}
            updateUserAlertModalOpen={updateUserAlertModalOpen}
            updateChargeModalOpen={updateChargeModalOpen}
            isClickedForInvisible={isClickedForInvisible}
            handleDeleteAllTarotHistory={handleDeleteAllTarotHistory}
            updateTarotAllAlertModalOpen={updateTarotAllAlertModalOpen}
            handleAddQuestion={handleAddQuestion}
          />
        ) : null}
        {pathName === `${P15}/${P16}` ||
        pathName === P17 ||
        pathName === P18 ||
        pathName === P23 ? (
          <ChartInfoForm
            userInfo={userInfo}
            tarotHistory={tarotHistory}
            pathName={pathName}
            setPathName={setPathName}
            statistics={statistics}
            setStatistics={setStatistics}
            theme={theme}
            setTheme={setTheme}
            subject={subject}
            setSubject={setSubject}
            date={date}
            setDate={setDate}
            questionTopic={questionTopic}
            setQuestionTopic={setQuestionTopic}
            questionOfTopic={questionOfTopic}
            setQuestionOfTopic={setQuestionOfTopic}
            question={question}
            setQuestion={setQuestion}
            updateSaveBlinkModalOpen={updateSaveBlinkModalOpen}
            updateCopyBlinkModalOpen={updateCopyBlinkModalOpen}
          />
        ) : null}
        {pathName === P19 ? (
          <UserInfoWithdrawalForm
            userInfo={userInfo}
            tarotHistory={tarotHistory}
            setAnswerModalOpen={setAnswerModalOpen}
            updateAnswerForm={updateAnswerForm}
            updateTarotAlertModalOpen={updateTarotAlertModalOpen}
            updateTarotAndIndexInfo={updateTarotAndIndexInfo}
            updateUserAlertModalOpen={updateUserAlertModalOpen}
            updateChargeModalOpen={updateChargeModalOpen}
            isClickedForInvisible={isClickedForInvisible}
          />
        ) : null}
      </div>
      {/* 숨겨진 SEO 콘텐츠 */}
    </div>
  );
};

export default MyPageForm;

// withCredentials: true는 서버에 요청 시에 인증 정보를 함께 보내도록 하는 옵션일 것입니다. 보통 쿠키를 사용하는 세션 기반 인증에서 필요한 옵션입니다.
// data.user._json은 일반적으로 OAuth 인증을 통해 얻은 사용자 정보에서 사용자의 추가 정보(사용자의 이메일, 이름, 프로필 사진 URL 등)를 담고 있는 객체
// 언더스코어(_)는 객체의 프로퍼티 이름. 즉,  _json은 단순히 객체의 속성 이름
// 추출한 userInfo 객체의 _json 속성
// _json이라는 이름의 속성은 주로 OAuth 인증 프로세스에서 사용됩니다. 일반적으로 OAuth 공급자로부터 반환되는 사용자 정보가 JSON 형식으로 제공되는데, 이 정보는 _json이라는 속성에 담겨 있을 수 있습니다.
// {
//   "login": "example_user",
//   "id": 123456,
//   "name": "John Doe",
//   "email": "john@example.com"
//   // ... 기타 사용자 정보
// }
// 이런식으로 나옴.

