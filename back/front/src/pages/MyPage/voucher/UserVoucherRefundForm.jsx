/*eslint-disable*/
import React, { useState, useEffect, memo } from 'react';
import styles from './UserVoucherRefundForm.module.scss';
import { hasAccessToken } from '../../../utils/storage/tokenCookie.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguageChange } from '@/hooks';
import { UserVoucherRefund } from './UserVoucherRefund.jsx';
import { Capacitor } from '@capacitor/core';
import { chargeApi } from '../../../api/chargeApi.jsx';
const isNative = Capacitor.isNativePlatform();

const UserVoucherRefundForm = memo(
  ({
    userInfo,
    isClickedForVoucherMenu,
    setTotalPriceOfRefund,
    setTotalPriceOfRefundForUSD,
    bucketForRefund,
    setBucketForRefund,
    ...props
  }) => {
    const navigate = useNavigate();
    const browserLanguage = useLanguageChange();
    const [beginnerPackageOrderIds, setBeginnerPackageOrderIds] = useState([]);

    useEffect(() => {
      const handleOrientationChange = () => {
        if (window.screen.width < window.screen.height) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener('orientationchange', handleOrientationChange);

      return () => {
        window.removeEventListener(
          'orientationchange',
          handleOrientationChange
        );
      };
    }, []);

    // 초심자 패키지 orderId 조회
    useEffect(() => {
      const fetchBeginnerPackageOrderIds = async () => {
        if (userInfo?.purchased?.packageForNewbie) {
          try {
            const { response } = await chargeApi.getBeginnerPackageOrderIds();
            if (response && Array.isArray(response)) {
              setBeginnerPackageOrderIds(response);
            }
          } catch (error) {
            console.error('Failed to fetch beginner package order IDs:', error);
          }
        }
      };
      fetchBeginnerPackageOrderIds();
    }, [userInfo?.purchased?.packageForNewbie]);

    let defaultObj = {
      1: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      2: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      3: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      4: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      5: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      6: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      7: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      8: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      9: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      10: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      11: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      13: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    };
    let defaultArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let refundableVouchersObj = { ...defaultObj };
    if (
      userInfo?.vouchersInDetail !== undefined &&
      userInfo?.vouchersInDetail !== null &&
      Object.values(userInfo?.vouchersInDetail).flat(1)?.length >= 1
    ) {
      refundableVouchersObj = { ...userInfo?.vouchersInDetail } || {
        ...defaultObj,
      };
    } else {
      refundableVouchersObj = { ...defaultObj };
    }

    if (refundableVouchersObj[isClickedForVoucherMenu] === undefined)
      refundableVouchersObj[isClickedForVoucherMenu] = [[...defaultArr]];

    const [totalCountForRefund, setTotalCountForRefund] = useState({
      1: [0],
      2: [0],
      3: [0],
      4: [0],
      5: [0],
      6: [0],
      7: [0],
      8: [0],
      9: [0],
      10: [0],
      11: [0],
      13: [0],
    });
    const [totalPriceForRefundAsObj, setTotalPriceForRefundAsObj] = useState({
      1: [0],
      2: [0],
      3: [0],
      4: [0],
      5: [0],
      6: [0],
      7: [0],
      8: [0],
      9: [0],
      10: [0],
      11: [0],
      13: [0],
    });

    //! 여기에서 currency 분별해야 함... 브라우저 언어에 따라서;
    let maxLength = Object.values(refundableVouchersObj).reduce((max, arr) => {
      return arr?.length > max ? arr?.length : max;
    }, 0);
    //! 여기에서 currency 분별해야 함... 브라우저 언어에 따라서;
    let length;
    let currency;
    if (browserLanguage === 'ko') {
      length =
        refundableVouchersObj[isClickedForVoucherMenu]?.filter(
          elem => elem[7] === 'KRW' || elem[7] === 0
        )?.length ?? 0;
      currency = 'KRW';
    }
    if (browserLanguage === 'ja') {
      length =
        refundableVouchersObj[isClickedForVoucherMenu]?.filter(
          elem => elem[7] === 'USD' || elem[7] === 0
        )?.length ?? 0;
      currency = 'USD';
    }
    if (browserLanguage === 'en') {
      length =
        refundableVouchersObj[isClickedForVoucherMenu]?.filter(
          elem => elem[7] === 'USD' || elem[7] === 0
        )?.length ?? 0;
      currency = 'USD';
    }
    //! 아래는 refundableVouchersObj가 일반 변수로 선언(let refudnableVoucherObj;)되어 있어 React의 렌더링 사이클과 잘 맞지 않습니다. useState를 사용함으로써 이 객체의 변경이 컴포넌트의 리렌더링을 트리거할 수 있게 되었습니다. 읽기 전용 속성 문제를 해결할 수 있습니다. 상태 업데이트 함수를 통해 객체를 안전하게 수정할 수 있기 때문입니다.(읽기 전용이라는 건 해당 객체나 속성의 값을 변경할 수 없다는 의미입니다. React에서는 특히 props나 state를 직접 수정하는 것을 권장하지 않습니다.)
    //! 일반 변수: 컴포넌트 내에서 let 또는 const로 선언된 변수입니다. 이 변수들의 값이 변경되어도 React는 이를 감지하지 못하고 컴포넌트를 다시 렌더링하지 않습니다. React 상태(state): useState 훅으로 생성된 상태 변수입니다. 이 상태가 변경되면 React는 이를 감지하고 컴포넌트를 다시 렌더링합니다.
    //! 왜 일반 변수로 선언하면 안되는가: 반응성(Reactivity): 일반 변수를 사용하면 값이 변경되어도 React가 이를 감지하지 못해 UI가 업데이트되지 않습니다. 불변성(Immutability): React는 상태의 불변성을 유지하는 것을 권장합니다. 일반 변수를 직접 수정하는 것은 이 원칙을 위반할 수 있습니다. 최적화: React의 상태 관리 시스템을 사용하면 불필요한 렌더링을 방지하고 성능을 최적화할 수 있습니다.
    //! useState를 사용하는 이유:반응성: 상태가 변경될 때 자동으로 컴포넌트가 다시 렌더링됩니다. 불변성 유지: setState 함수를 통해 상태를 업데이트함으로써 불변성을 쉽게 유지할 수 있습니다. 생명주기 관리: 컴포넌트의 생명주기 동안 상태를 안전하게 관리할 수 있습니다.

    for (let i = 0; i < maxLength - length; i++) {
      refundableVouchersObj[isClickedForVoucherMenu] = [
        ...refundableVouchersObj[isClickedForVoucherMenu],
        [...defaultArr],
      ];
    }
    useEffect(() => {
      setTotalPriceOfRefund(prev => {
        return {
          ...prev,
          [isClickedForVoucherMenu]: totalPriceForRefundAsObj[
            isClickedForVoucherMenu
          ].reduce((acc, curr) => acc + curr, 0),
        };
      });
    }, [isClickedForVoucherMenu, totalPriceForRefundAsObj]);

    //! USD
    const [totalCountForRefundForUSD, setTotalCountForRefundForUSD] = useState({
      1: [0],
      2: [0],
      3: [0],
      4: [0],
      5: [0],
      6: [0],
      7: [0],
      8: [0],
      9: [0],
      10: [0],
      11: [0],
      13: [0],
    });
    const [totalPriceForRefundAsObjForUSD, setTotalPriceForRefundAsObjForUSD] =
      useState({
        1: [0],
        2: [0],
        3: [0],
        4: [0],
        5: [0],
        6: [0],
        7: [0],
        8: [0],
        9: [0],
        10: [0],
        11: [0],
        13: [0],
      });
    useEffect(() => {
      setTotalPriceOfRefundForUSD(prev => {
        return {
          ...prev,
          [isClickedForVoucherMenu]: totalPriceForRefundAsObjForUSD[
            isClickedForVoucherMenu
          ].reduce((acc, curr) => acc + curr, 0),
        };
      });
    }, [isClickedForVoucherMenu, totalPriceForRefundAsObjForUSD]);
    //! USD

    if (hasAccessToken() === false && isNative === false) return;

    return (
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['user-info-container-japanese']
            : styles['user-info-container']
        }`}
      >
        <div
          className={`${
            browserLanguage === 'ja'
              ? styles['user-info1-japanese']
              : styles['user-info1']
          }`}
        >
          {refundableVouchersObj[isClickedForVoucherMenu]
            .filter(elem => {
              // 화폐 필터링
              if (elem[7] !== currency && elem[7] !== 0) return false;
              // Google Play 인앱결제는 환불 불가 (paymentKey가 'NA'인 경우)
              if (elem[8] === 'NA') return false;
              // 보통 타로 3일 무료 이용권이 포함된 주문의 이용권은 환불 불가
              if (
                userInfo?.adsFreePass?.orderId &&
                elem[4] === userInfo.adsFreePass.orderId
              ) {
                return false;
              }
              // 초심자 패키지가 포함된 주문의 이용권은 환불 불가 (웹에서만)
              if (!isNative && beginnerPackageOrderIds.includes(elem[4])) {
                return false;
              }
              return true;
            })
            .map((refundableVoucher, i) => {
              return (
                <div
                  key={i} // 고유 key 값 추가
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['user-info1-box2-japanese']
                      : styles['user-info1-box2']
                  } ${refundableVoucher[0] === 0 && styles['invisible']}`}
                >
                  <UserVoucherRefund
                    userInfo={userInfo}
                    refundableVoucher={refundableVoucher}
                    isClickedForVoucherMenu={isClickedForVoucherMenu}
                    totalPriceForRefundAsObj={totalPriceForRefundAsObj}
                    setTotalPriceForRefundAsObj={setTotalPriceForRefundAsObj}
                    totalCountForRefund={totalCountForRefund}
                    setTotalCountForRefund={setTotalCountForRefund}
                    totalPriceForRefundAsObjForUSD={
                      totalPriceForRefundAsObjForUSD
                    }
                    setTotalPriceForRefundAsObjForUSD={
                      setTotalPriceForRefundAsObjForUSD
                    }
                    totalCountForRefundForUSD={totalCountForRefundForUSD}
                    setTotalCountForRefundForUSD={setTotalCountForRefundForUSD}
                    i={i}
                    bucketForRefund={bucketForRefund}
                    setBucketForRefund={setBucketForRefund}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);

export default UserVoucherRefundForm;
