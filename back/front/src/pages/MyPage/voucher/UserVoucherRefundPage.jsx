/*eslint-disable*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './UserVoucherRefundPage.module.scss';
import { hasAccessToken } from '../../../utils/storage/tokenCookie.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../../api/userApi.jsx';
import RefundNotificationForm from './RefundNotificationForm.jsx';
import UserVoucherRefundForm from './UserVoucherRefundForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import RefundVoucherMenuForm from './RefundVoucherMenuForm.jsx';
import { useLanguageChange } from '@/hooks';
import { getPathWithLang } from '@/config/route/UrlPaths';
import { chargeApi } from '../../../api/chargeApi.jsx';
import Button from '../../../components/common/Button.jsx';
import { Capacitor } from '@capacitor/core';
import { setUserInfoForRefundAction } from '../../../store/userInfoStore.jsx';
import { isDevelopmentMode } from '@/utils/constants';
import { BlinkModalSet } from '../../../components/BlinkModals/BlinkModalSet.jsx';
const isNative = Capacitor.isNativePlatform();

const UserVoucherRefundPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const fetchedUserInfo = location?.state?.userInfo ?? {};
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(fetchedUserInfo);
  const [isRefunding, setIsRefunding] = useState(false);
  const browserLanguage = useLanguageChange();
  const [isMinimumAmountBlinkModalOpen, setMinimumAmountBlinkModalOpen] =
    useState(false);

  const scrollContainerRef = useRef(null);
  const scrollAmount = 5;

  const handleScroll = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop +=
        delta > 0 ? scrollAmount : -scrollAmount;
    }
  }, []);

  const [isClickedForRefunding, setClickedForRefunding] = useState(false);
  const [isClickedForFoldingMenu, setClickedForFoldingMenu] = useState(false);
  const [isClickedForVoucherMenu, setClickedForVoucherMenu] = useState(1);
  const [bucketForRefund, setBucketForRefund] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    13: [],
  });
  const [refinedBucketForRefund, setRefinedBucketForRefund] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    13: [],
  });

  const [totalPriceOfRefund, setTotalPriceOfRefund] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    13: 0,
  });
  const [finalTotalPriceOfRefund, setFinalTotalPriceOfRefund] = useState(0);
  useEffect(() => {
    const calculatedFinalTotalPriceOfRefund =
      Object.values(totalPriceOfRefund)
        ?.flat()
        .reduce((acc, cur) => acc + cur, 0) || 0;
    setFinalTotalPriceOfRefund(calculatedFinalTotalPriceOfRefund);
  }, [totalPriceOfRefund]);

  //! USD
  const [totalPriceOfRefundForUSD, setTotalPriceOfRefundForUSD] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    13: 0,
  });
  const [finalTotalPriceOfRefundForUSD, setFinalTotalPriceOfRefundForUSD] =
    useState(0);
  useEffect(() => {
    const calculatedFinalTotalPriceOfRefundForUSD =
      Object.values(totalPriceOfRefundForUSD)
        ?.flat()
        .reduce((acc, cur) => acc + cur, 0) || 0;
    setFinalTotalPriceOfRefundForUSD(calculatedFinalTotalPriceOfRefundForUSD);
  }, [totalPriceOfRefundForUSD]);
  //! USD

  if (hasAccessToken() === false && isNative === false) return null;

  //& bucketForRefund을 서버에 보내서 처리.
  //& {1 : [[1, 9개요소], [1, 9개요소], ...], 2 : [[1, 9개 요소], ~],...}을
  //& {1 : [[10개요소], [10개요소], ...], 2 : [[10개 요소], ~],...}로 합쳐서 보내기
  useEffect(() => {
    const reconstructedbucketForRefund = {};
    for (const key in bucketForRefund) {
      let newArray = [];
      bucketForRefund[key].forEach(array => {
        let foundArray = newArray.find(
          preArray => preArray[4] === array[4] && preArray[5] === array[5],
        );
        if (foundArray) {
          foundArray[0] += 1;
        } else {
          newArray.push([...array]);
        }
      });
      reconstructedbucketForRefund[key] = newArray;
    }
    setRefinedBucketForRefund(reconstructedbucketForRefund);
  }, [bucketForRefund]);

  const submitRefundInfo = useCallback(async () => {
    if (isClickedForRefunding === true) return;
    if (browserLanguage === 'ko' && finalTotalPriceOfRefund < 5000) {
      if (isDevelopmentMode) {
        console.log('Amount below minimum');
      }
      setMinimumAmountBlinkModalOpen(true);
      return;
    }
    if (browserLanguage === 'en' && finalTotalPriceOfRefundForUSD < 3) {
      if (isDevelopmentMode) {
        console.log('Amount below minimum');
      }
      setMinimumAmountBlinkModalOpen(true);
      return;
    }
    if (browserLanguage === 'ja' && finalTotalPriceOfRefundForUSD < 3) {
      if (isDevelopmentMode) {
        console.log('Amount below minimum');
      }
      setMinimumAmountBlinkModalOpen(true);
      return;
    }
    setClickedForRefunding(true);
    try {
      const { response, cleanup } = await chargeApi.postPartialCancelForToss({
        ...refinedBucketForRefund,
      });
      const result = response;
      // console.log('result.data.message : ', result.data.message);
      if (
        result.data.message === 'response' ||
        result.data.message === 'both'
      ) {
        setIsRefunding(true);
      }
    } catch (error) {
      console.error('submit refund info error : ', error);
    } finally {
    }
  }, [
    isClickedForRefunding,
    browserLanguage,
    finalTotalPriceOfRefund,
    finalTotalPriceOfRefundForUSD,
    refinedBucketForRefund,
  ]);
  //! 상위 컴포넌트 혹은 state 건네 받은 컴포넌트에서 이미 종속성으로 선언했기에 자식 컴포넌트나 state(혹은 props)를 변경하는건 바람직하지 않나보다;;
  const userInfoForRefund = useSelector(
    state => state.userInfoStore.userInfoForRefund,
  );
  useEffect(() => {
    const fetchUserInfo = async () => {
      const { response, cleanup } = await userApi.getForSub();
      const fetchedUserInfo = response;
      setUserInfo({ ...fetchedUserInfo });
      dispatch(setUserInfoForRefundAction({ ...fetchedUserInfo }));
    };
    if (Object.keys(userInfoForRefund)?.length === 0 && isRefunding === false) {
      fetchUserInfo();
      setIsRefunding(false);
    }
    if (Object.keys(userInfoForRefund)?.length !== 0 && isRefunding === true) {
      fetchUserInfo();
      setIsRefunding(false);
      if (typeof window !== 'undefined') window.location.reload();
    } else {
      setUserInfo({ ...userInfoForRefund });
    }
  }, [isRefunding]);
  return (
    <>
      <div
        className={`${styles['container']}`}
        ref={scrollContainerRef}
        onWheel={handleScroll}
      >
        <div
          className={`${
            isClickedForFoldingMenu === false
              ? styles['container-box1']
              : styles['container-box1-folded']
          }`}
        >
          <RefundNotificationForm
            isClickedForFoldingMenu={isClickedForFoldingMenu}
            setClickedForFoldingMenu={setClickedForFoldingMenu}
          />
        </div>
        <div
          className={`${
            isClickedForFoldingMenu === false
              ? styles['container-box1']
              : styles['container-box1-folded']
          }`}
        >
          <RefundVoucherMenuForm
            isClickedForFoldingMenu={isClickedForFoldingMenu}
            isClickedForVoucherMenu={isClickedForVoucherMenu}
            setClickedForVoucherMenu={setClickedForVoucherMenu}
          />
        </div>
        <div
          className={`${
            isClickedForFoldingMenu === false
              ? styles['container-box1']
              : styles['container-box1-folded']
          }`}
        >
          <div className={styles['menu-folding-button-box']}>
            {isClickedForFoldingMenu === false ? (
              <button
                className={styles['menu-folding-button']}
                onClick={e => setClickedForFoldingMenu(prev => !prev)}
              >
                ▲
              </button>
            ) : (
              <button
                className={styles['menu-folding-button']}
                onClick={e => setClickedForFoldingMenu(prev => !prev)}
              >
                ▼
              </button>
            )}
          </div>
        </div>
        <div className={styles['container-box2']}>
          <UserVoucherRefundForm
            userInfo={userInfo}
            isClickedForVoucherMenu={isClickedForVoucherMenu}
            setTotalPriceOfRefund={setTotalPriceOfRefund}
            setTotalPriceOfRefundForUSD={setTotalPriceOfRefundForUSD}
            bucketForRefund={bucketForRefund}
            setBucketForRefund={setBucketForRefund}
          />
        </div>
        {browserLanguage === 'ja' ? (
          <div className={styles['total-price-info-container-japanese']}>
            <div>{t(`refund.caution`)}</div>
            <div>
              <div>{t(`refund.total-price`)}</div>
              <div>{' : '}</div>
              <div>
                {finalTotalPriceOfRefundForUSD}
                {t(`refund.money`)}
              </div>
            </div>
            <div className={styles['btn-box']}>
              <Button
                onClick={() => {
                  navigate(getPathWithLang(browserLanguage).P13);
                }}
              >
                {t(`button.mypage`)}
              </Button>
              <Button
                onClick={() => {
                  submitRefundInfo();
                }}
              >
                {isClickedForRefunding
                  ? t(`button.refunding`)
                  : t(`button.apply`)}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={styles['total-price-info-container']}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div>{t(`refund.caution`)}</div>
            <div>
              <div>{t(`refund.total-price`)}</div>
              <div>{' : '}</div>
              <div>
                {browserLanguage === 'ko'
                  ? finalTotalPriceOfRefund
                  : finalTotalPriceOfRefundForUSD}
                {t(`refund.money`)}
              </div>
            </div>
            <div className={styles['btn-box']}>
              <Button
                onClick={() => {
                  navigate(getPathWithLang(browserLanguage).P13);
                }}
              >
                {t(`button.mypage`)}
              </Button>
              <Button
                onClick={() => {
                  submitRefundInfo();
                }}
              >
                {isClickedForRefunding
                  ? t(`button.refunding`)
                  : t(`button.apply`)}
              </Button>
            </div>
          </div>
        )}
      </div>
      <BlinkModalSet
        stateGroup={{
          isMinimumAmountBlinkModalOpen,
        }}
        setStateGroup={{
          updateMinimumAmountBlinkModalOpen: setMinimumAmountBlinkModalOpen,
        }}
        styles={styles}
      />
    </>
  );
};

export default UserVoucherRefundPage;

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

