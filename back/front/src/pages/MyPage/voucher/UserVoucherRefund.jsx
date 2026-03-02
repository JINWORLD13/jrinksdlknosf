import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserVoucherRefund.module.scss';
import { useLanguageChange } from '@/hooks';
import Button from '../../../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

export const UserVoucherRefund = ({
  userInfo,
  refundableVoucher,
  isClickedForVoucherMenu,
  totalPriceForRefundAsObj,
  setTotalPriceForRefundAsObj,
  totalCountForRefund,
  setTotalCountForRefund,
  totalPriceForRefundAsObjForUSD,
  setTotalPriceForRefundAsObjForUSD,
  totalCountForRefundForUSD,
  setTotalCountForRefundForUSD,
  bucketForRefund,
  setBucketForRefund,
  i,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const browserLanguage = useLanguageChange();
  const [isLandscape, setIsLandscape] = useState(
    window.screen.width > window.screen.height
  );
  const [countOfRequestToRefund, setCountOfRequestToRefund] = useState({
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
  const [eachTotalPriceOfRequestToRefund, setEachTotalPriceOfRequestToRefund] =
    useState(0);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.screen.width > window.screen.height);
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // 두 useEffect를 하나로 합쳐서 무한루프 방지
  useEffect(() => {
    const currentCount = countOfRequestToRefund[isClickedForVoucherMenu];
    const currentPrice = currentCount * refundableVoucher[1];

    // KRW 처리
    if (refundableVoucher[7] === 'KRW') {
      setTotalCountForRefund(prev => {
        const currentArray = prev[isClickedForVoucherMenu] || [];

        // 값이 실제로 변경되었을 때만 업데이트
        if (currentArray[i] === currentCount) return prev;

        const newArray = [...currentArray];
        // 배열 길이가 부족하면 확장
        while (newArray.length <= i) {
          newArray.push(0);
        }
        newArray[i] = currentCount;

        return {
          ...prev,
          [isClickedForVoucherMenu]: newArray,
        };
      });

      setTotalPriceForRefundAsObj(prev => {
        const currentArray = prev[isClickedForVoucherMenu] || [];

        // 값이 실제로 변경되었을 때만 업데이트
        if (currentArray[i] === currentPrice) return prev;

        const newArray = [...currentArray];
        // 배열 길이가 부족하면 확장
        while (newArray.length <= i) {
          newArray.push(0);
        }
        newArray[i] = currentPrice;

        return {
          ...prev,
          [isClickedForVoucherMenu]: newArray,
        };
      });
    }

    // USD 처리
    if (refundableVoucher[7] === 'USD') {
      setTotalCountForRefundForUSD(prev => {
        const currentArray = prev[isClickedForVoucherMenu] || [];

        // 값이 실제로 변경되었을 때만 업데이트
        if (currentArray[i] === currentCount) return prev;

        const newArray = [...currentArray];
        // 배열 길이가 부족하면 확장
        while (newArray.length <= i) {
          newArray.push(0);
        }
        newArray[i] = currentCount;

        return {
          ...prev,
          [isClickedForVoucherMenu]: newArray,
        };
      });

      setTotalPriceForRefundAsObjForUSD(prev => {
        const currentArray = prev[isClickedForVoucherMenu] || [];

        // 값이 실제로 변경되었을 때만 업데이트
        if (currentArray[i] === currentPrice) return prev;

        const newArray = [...currentArray];
        // 배열 길이가 부족하면 확장
        while (newArray.length <= i) {
          newArray.push(0);
        }
        newArray[i] = currentPrice;

        return {
          ...prev,
          [isClickedForVoucherMenu]: newArray,
        };
      });
    }
  }, [
    countOfRequestToRefund,
    isClickedForVoucherMenu,
    i,
    refundableVoucher,
    setTotalCountForRefund,
    setTotalCountForRefundForUSD,
    setTotalPriceForRefundAsObj,
    setTotalPriceForRefundAsObjForUSD,
  ]);

  const formatDate = (date, options = {}) => {
    if (!date) return 'Invalid Date';
    
    // 날짜가 "date" 문자열이거나 유효하지 않은 경우 처리
    const dateStr = typeof date === 'string' ? date : date.toString();
    if (dateStr === 'date' || dateStr === 'Date' || dateStr.trim() === '') {
      return 'Invalid Date';
    }

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // 유효한 날짜인지 확인
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }

      // 옵션이 있으면 toLocaleString 사용, 없으면 toLocaleDateString 사용
      if (Object.keys(options).length > 0) {
        return new Intl.DateTimeFormat(
          browserLanguage === 'en'
            ? 'en-US'
            : browserLanguage === 'ko'
            ? 'ko-KR'
            : 'ja-JP',
          options
        ).format(dateObj);
      } else {
        return dateObj.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // 구매일 포맷팅
  const purchaseDateValue = refundableVoucher[5];
  const purchaseDateObj = purchaseDateValue && purchaseDateValue !== 'date' && purchaseDateValue !== 'Date'
    ? new Date(purchaseDateValue)
    : null;
  
  const formattedDateOfPurchase = purchaseDateObj && !isNaN(purchaseDateObj.getTime())
    ? formatDate(purchaseDateObj, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: 'short',
      })
    : 'Invalid Date';

  const calculateRefundDate = useCallback(() => {
    const purchaseDateValue = refundableVoucher[5];
    
    // 유효하지 않은 날짜인 경우 현재 날짜 사용
    if (!purchaseDateValue || purchaseDateValue === 'date' || purchaseDateValue === 'Date') {
      return new Date();
    }

    const date = new Date(purchaseDateValue);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return new Date();
    }

    let yearOfRefund, monthOfRefund, dayOfRefund;
    const hoursOfRefund = date.getHours();
    const minutesOfRefund = date.getMinutes();
    const secondsOfRefund = date.getSeconds();

    if (
      refundableVoucher[9] === '계좌이체' ||
      refundableVoucher[9] === 'card'
    ) {
      yearOfRefund = date.getFullYear();
      monthOfRefund = date.getMonth() + 3;
      dayOfRefund = date.getDate();
    } else if (refundableVoucher[9] === '휴대폰') {
      yearOfRefund = date.getFullYear();
      monthOfRefund = date.getMonth();
      dayOfRefund = 0;
    } else {
      yearOfRefund = date.getFullYear() + 1;
      monthOfRefund = date.getMonth();
      dayOfRefund = date.getDate();
    }

    return new Date(
      yearOfRefund,
      monthOfRefund,
      dayOfRefund,
      hoursOfRefund,
      minutesOfRefund,
      secondsOfRefund
    );
  }, [refundableVoucher]);

  const refundDateObj = calculateRefundDate();
  const formattedDateOfRefund = !isNaN(refundDateObj.getTime())
    ? formatDate(refundDateObj, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: 'short',
      })
    : 'Invalid Date';

  const handleIncrement = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      const currentCount = countOfRequestToRefund[isClickedForVoucherMenu];
      const maxCount = refundableVoucher[0];

      // 이미 최대치에 도달했으면 리턴
      if (currentCount >= maxCount) return;

      setCountOfRequestToRefund(prev => ({
        ...prev,
        [isClickedForVoucherMenu]: Math.min(
          prev[isClickedForVoucherMenu] + 1,
          maxCount
        ),
      }));

      setEachTotalPriceOfRequestToRefund(prev =>
        Math.min(prev + refundableVoucher[1], maxCount * refundableVoucher[1])
      );

      setBucketForRefund(prev => ({
        ...prev,
        [isClickedForVoucherMenu]: [
          ...(prev[isClickedForVoucherMenu] || []),
          [
            1,
            refundableVoucher[1],
            refundableVoucher[2],
            refundableVoucher[3],
            refundableVoucher[4],
            refundableVoucher[5],
            refundableVoucher[6],
            refundableVoucher[7],
            refundableVoucher[8],
            refundableVoucher[9],
          ],
        ],
      }));
    },
    [
      isClickedForVoucherMenu,
      refundableVoucher,
      countOfRequestToRefund,
      setBucketForRefund,
    ]
  );

  const handleDecrement = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      const currentCount = countOfRequestToRefund[isClickedForVoucherMenu];

      // 이미 0이면 리턴
      if (currentCount <= 0) return;

      setCountOfRequestToRefund(prev => ({
        ...prev,
        [isClickedForVoucherMenu]: Math.max(
          prev[isClickedForVoucherMenu] - 1,
          0
        ),
      }));

      setEachTotalPriceOfRequestToRefund(prev =>
        Math.max(prev - refundableVoucher[1], 0)
      );

      setBucketForRefund(prev => {
        const currentArray = prev[isClickedForVoucherMenu] || [];
        if (currentArray.length === 0) return prev;

        return {
          ...prev,
          [isClickedForVoucherMenu]: currentArray.slice(0, -1),
        };
      });
    },
    [
      isClickedForVoucherMenu,
      refundableVoucher,
      setBucketForRefund,
      countOfRequestToRefund,
    ]
  );

  const handleTotal = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      const maxCount = refundableVoucher[0];
      const currentCount = countOfRequestToRefund[isClickedForVoucherMenu] || 0;
      const remainingCount = maxCount - currentCount;

      if (remainingCount <= 0) return;

      setCountOfRequestToRefund(prev => ({
        ...prev,
        [isClickedForVoucherMenu]: maxCount,
      }));

      setEachTotalPriceOfRequestToRefund(maxCount * refundableVoucher[1]);

      setBucketForRefund(prev => {
        const newArray = Array(remainingCount).fill([
          1,
          ...refundableVoucher.slice(1, 10),
        ]);

        return {
          ...prev,
          [isClickedForVoucherMenu]: [
            ...(prev[isClickedForVoucherMenu] || []),
            ...newArray,
          ],
        };
      });
    },
    [
      isClickedForVoucherMenu,
      refundableVoucher,
      countOfRequestToRefund,
      setBucketForRefund,
    ]
  );

  const containerStyle =
    browserLanguage === 'ja'
      ? styles['user-info1-body-japanese']
      : styles['user-info1-body'];
  const coreStyle =
    browserLanguage === 'ja'
      ? styles['user-info1-body-core-japanese']
      : styles['user-info1-body-core'];
  const bottomStyle =
    browserLanguage === 'ja'
      ? styles['user-info1-bottom-japanese']
      : styles['user-info1-bottom'];
  const inputContainerStyle =
    browserLanguage === 'ja'
      ? styles['input-container-japanese']
      : styles['input-container'];
  const h2Style = `${styles['h2']} ${
    browserLanguage === 'ja'
      ? styles['japanese-potta-font2']
      : styles['korean-dongle-font2']
  }`;
  const leftColumnStyle =
    browserLanguage === 'ja'
      ? styles['user-info1-body-left-japanese']
      : styles['user-info1-body-left'];
  const rightColumnStyle =
    browserLanguage === 'ja'
      ? styles['user-info1-body-right-japanese']
      : styles['user-info1-body-right'];

  return (
    <>
      <h2 className={h2Style}>{t(`refund.user-voucher-info`)}</h2>
      <div className={containerStyle}>
        <div className={coreStyle}>
          <div className={leftColumnStyle}>
            <p>{t(`refund.order-id`)}</p>
            <p>{t(`refund.voucher-name`)}</p>
            <p>{t(`refund.amount`)}</p>
            <p>{t(`refund.each-list-price`)}</p>
            <p>{t(`refund.purchase-date`)}</p>
            <p>{t(`refund.due-date`)}</p>
          </div>
          <div className={rightColumnStyle}>
            <p>: {refundableVoucher[4]}</p>
            <p>
              :{' '}
              {browserLanguage === 'en' && isClickedForVoucherMenu === 1
                ? `${isClickedForVoucherMenu}-Card Voucher`
                : `${isClickedForVoucherMenu}${t(`refund.unit`)}`}
            </p>
            <p>
              : {refundableVoucher[0] ?? 0}
              {t(`unit.ea`)}
            </p>
            <p>
              : {refundableVoucher[1]}
              {t(`refund.money`)}
            </p>
            <p>: {formattedDateOfPurchase}</p>
            <p>: {formattedDateOfRefund}</p>
          </div>
        </div>
        <div className={bottomStyle}>
          <div className={inputContainerStyle}>
            <div>
              <label>{t(`refund.quantity`)} : </label>
            </div>
            <div>
              <div>
                {refundableVoucher[7] === 'KRW' &&
                  (totalCountForRefund[isClickedForVoucherMenu]?.[i] ?? 0)}
                {refundableVoucher[7] === 'USD' &&
                  (totalCountForRefundForUSD[isClickedForVoucherMenu]?.[i] ??
                    0)}
              </div>
            </div>
          </div>
          <Button onClick={handleIncrement}>+</Button>
          <Button onClick={handleDecrement}>-</Button>
          <Button onClick={handleTotal}>{t(`refund.total`)}</Button>
        </div>
      </div>
    </>
  );
};
