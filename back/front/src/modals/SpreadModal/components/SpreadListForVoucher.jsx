import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { hasAccessTokenForPreference } from '../../../utils/storage/tokenPreference';
import { hasAccessToken } from '../../../utils/storage/tokenCookie';
import { spreadArr } from '../../../data/spreadList/spreadArr';
import { isProductionMode } from '@/utils/constants';
import { StarIcon } from '../../PurchaseModal/InAppPurchase/components/StarIcon.jsx';
// Firebase Analytics는 실제 타로 결과를 받았을 때만 추적됨 (onSubmit에서 처리)

const isNative = Capacitor.isNativePlatform();

export const SpreadListForVoucher = ({
  styles,
  toggleTarotModal,
  stateGroup,
  setStateGroup,
  userCacheForRedux,
  admobReward,
  isStarMode,
  ...props
}) => {
  const { t } = useTranslation();
  //! spreadArr()가 타로 모달창의 스프레드 리스트 정보들임.
  const spreadList = spreadArr();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    isVoucherModeOn,
    hasWatchedAd,
    selectedAdType,
    isChargeModalOpen,
    isInAppPurchaseOpen,
    selectedSpread,
    isSpeedTarotNotificationOn,
    ...rest1
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
    setSelectedSpread,
    setWatchedAdForBlinkModal,
    setSpeedTarotNotificationOn,
    setRequiredVoucherInfo,
    setWatchedAd,
    ...rest2
  } = setStateGroup;

  const userInfoInRedux = useSelector(state => state.userInfoStore.userInfo);
  const [remainingVouchersOfUser, setRemainingVouchersOfUser] = useState({
    'one-card': 0,
    'two-cards': 0,
    'three-cards': 0,
    'four-cards': 0,
    'five-cards': 0,
    'six-cards': 0,
    'seven-cards': 0,
    'eight-cards': 0,
    'nine-cards': 0,
    'ten-cards': 0,
    'eleven-cards': 0,
    'thirteen-cards': 0,
  });

  // 별 잔액 가져오기
  const [userStars, setUserStars] = useState(0);

  useEffect(() => {
    const stars = userInfoInRedux?.stars ?? 0;
    setUserStars(stars);
  }, [userInfoInRedux]);

  useEffect(() => {
    const fetchedRemainingVouchersOfUser = async () => {
      //! 리덕스 이용
      const vouchers = userInfoInRedux?.vouchers ?? {
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
      };

      //! api 다시 이용

      // setRemainingVouchersOfUser(prev => {
      //   if (
      //     userCacheForRedux !== null &&
      //     userCacheForRedux !== undefined &&
      //     JSON.stringify(vouchers) ===
      //       JSON.stringify({
      //         1: 0,
      //         2: 0,
      //         3: 0,
      //         4: 0,
      //         5: 0,
      //         6: 0,
      //         7: 0,
      //         8: 0,
      //         9: 0,
      //         10: 0,
      //         11: 0,
      //         13: 0,
      //       })
      //   ) {
      //     return { ...userCacheForRedux?.vouchers };
      //   } else if (
      //     JSON.stringify(userInfoInRedux) != '{}' &&
      //     JSON.stringify(vouchers) ===
      //       JSON.stringify({
      //         1: 0,
      //         2: 0,
      //         3: 0,
      //         4: 0,
      //         5: 0,
      //         6: 0,
      //         7: 0,
      //         8: 0,
      //         9: 0,
      //         10: 0,
      //         11: 0,
      //         13: 0,
      //       })
      //   ) {
      //     return { ...userInfoInRedux?.vouchers };
      //   } else if (
      //     userCacheForRedux.size !== 0 &&
      //     JSON.stringify(vouchers) ===
      //       JSON.stringify({
      //         1: 0,
      //         2: 0,
      //         3: 0,
      //         4: 0,
      //         5: 0,
      //         6: 0,
      //         7: 0,
      //         8: 0,
      //         9: 0,
      //         10: 0,
      //         11: 0,
      //         13: 0,
      //       })
      //   ) {
      //     return { ...userCacheForRedux?.vouchers };
      //   } else {
      //     return {
      //       'one-card': vouchers[1],
      //       'two-cards': vouchers[2],
      //       'three-cards': vouchers[3],
      //       'four-cards': vouchers[4],
      //       'five-cards': vouchers[5],
      //       'six-cards': vouchers[6],
      //       'seven-cards': vouchers[7],
      //       'eight-cards': vouchers[8],
      //       'nine-cards': vouchers[9],
      //       'ten-cards': vouchers[10],
      //       'eleven-cards': vouchers[11],
      //       'thirteen-cards': vouchers[13],
      //     };
      //   }
      // });
      //! 만료기한 지난 이용권은 전부 제거후 카운트해주기
      setRemainingVouchersOfUser(prev => {
        let originalVouchers;
        let vouchersInDetail;

        // 1. 기존 로직으로 원본 쿠폰 개수와 상세정보 가져오기
        if (
          userCacheForRedux !== null &&
          userCacheForRedux !== undefined &&
          JSON.stringify(vouchers) ===
            JSON.stringify({
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
            })
        ) {
          originalVouchers = { ...userCacheForRedux?.vouchers };
          vouchersInDetail = userCacheForRedux?.vouchersInDetail;
        } else if (
          JSON.stringify(userInfoInRedux) != '{}' &&
          JSON.stringify(vouchers) ===
            JSON.stringify({
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
            })
        ) {
          originalVouchers = { ...userInfoInRedux?.vouchers };
          vouchersInDetail = userInfoInRedux?.vouchersInDetail;
        } else if (
          userCacheForRedux.size !== 0 &&
          JSON.stringify(vouchers) ===
            JSON.stringify({
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
            })
        ) {
          originalVouchers = { ...userCacheForRedux?.vouchers };
          vouchersInDetail = userCacheForRedux?.vouchersInDetail;
        } else {
          originalVouchers = { ...vouchers };
          vouchersInDetail =
            userInfoInRedux?.vouchersInDetail ||
            userCacheForRedux?.vouchersInDetail;
        }

        // 2. 각 타입별로 만료된 쿠폰 개수 세서 빼기
        if (vouchersInDetail) {
          const now = new Date();

          Object.entries(vouchersInDetail).forEach(([type, arr]) => {
            if (arr && Array.isArray(arr)) {
              // 이 타입에서 만료된 쿠폰 개수 세기
              const expiredCount = arr?.filter(voucher => {
                const expire = voucher[10]; // 만료일
                if (
                  expire &&
                  expire !== 'NA' &&
                  expire !== 'N.A' &&
                  expire.toString().trim() !== ''
                ) {
                  const expireDate = new Date(expire);
                  return !isNaN(expireDate.getTime()) && expireDate < now; // 만료됨
                }
                return false; // 만료일 없으면 만료 안됨
              }).length;

              // 원본에서 만료 개수 빼기
              const typeNum = parseInt(type);
              if (originalVouchers[typeNum] !== undefined) {
                originalVouchers[typeNum] = Math.max(
                  0,
                  originalVouchers[typeNum] - expiredCount
                );
              }
            }
          });
        }

        // 3. 문자열 키로 변환해서 반환
        return {
          'one-card': originalVouchers[1] || 0,
          'two-cards': originalVouchers[2] || 0,
          'three-cards': originalVouchers[3] || 0,
          'four-cards': originalVouchers[4] || 0,
          'five-cards': originalVouchers[5] || 0,
          'six-cards': originalVouchers[6] || 0,
          'seven-cards': originalVouchers[7] || 0,
          'eight-cards': originalVouchers[8] || 0,
          'nine-cards': originalVouchers[9] || 0,
          'ten-cards': originalVouchers[10] || 0,
          'eleven-cards': originalVouchers[11] || 0,
          'thirteen-cards': originalVouchers[13] || 0,
        };
      });
    };
    fetchedRemainingVouchersOfUser();
  }, [
    modalForm?.spread,
    modalForm?.tarot,
    answerForm?.isAnswered,
    answerForm?.isWaiting,
  ]); //&  이거 때문에.. 대역폭 늚. 무한 업데이트.

  const remainingVouchers = {
    2: {
      'one-card': remainingVouchersOfUser['one-card'],
      'two-cards': remainingVouchersOfUser['two-cards'],
      'three-cards': remainingVouchersOfUser['three-cards'],
      'four-cards': remainingVouchersOfUser['four-cards'],
      'five-cards': remainingVouchersOfUser['five-cards'],
      'six-cards': remainingVouchersOfUser['six-cards'],
      'seven-cards': remainingVouchersOfUser['seven-cards'],
      'eight-cards': remainingVouchersOfUser['eight-cards'],
      'nine-cards': remainingVouchersOfUser['nine-cards'],
      'ten-cards': remainingVouchersOfUser['ten-cards'],
      'eleven-cards': remainingVouchersOfUser['eleven-cards'],
      'thirteen-cards': remainingVouchersOfUser['thirteen-cards'],
    },
    3: {
      'one-card': remainingVouchersOfUser['one-card'],
      'two-cards': remainingVouchersOfUser['two-cards'],
      'three-cards': remainingVouchersOfUser['three-cards'],
      'four-cards': remainingVouchersOfUser['four-cards'],
      'five-cards': remainingVouchersOfUser['five-cards'],
      'six-cards': remainingVouchersOfUser['six-cards'],
      'seven-cards': remainingVouchersOfUser['seven-cards'],
      'eight-cards': remainingVouchersOfUser['eight-cards'],
      'nine-cards': remainingVouchersOfUser['nine-cards'],
      'ten-cards': remainingVouchersOfUser['ten-cards'],
      'eleven-cards': remainingVouchersOfUser['eleven-cards'],
      'thirteen-cards': remainingVouchersOfUser['thirteen-cards'],
    },
    4: {
      'one-card': remainingVouchersOfUser['one-card'],
      'two-cards': remainingVouchersOfUser['two-cards'],
      'three-cards': remainingVouchersOfUser['three-cards'],
      'four-cards': remainingVouchersOfUser['four-cards'],
      'five-cards': remainingVouchersOfUser['five-cards'],
      'six-cards': remainingVouchersOfUser['six-cards'],
      'seven-cards': remainingVouchersOfUser['seven-cards'],
      'eight-cards': remainingVouchersOfUser['eight-cards'],
      'nine-cards': remainingVouchersOfUser['nine-cards'],
      'ten-cards': remainingVouchersOfUser['ten-cards'],
      'eleven-cards': remainingVouchersOfUser['eleven-cards'],
      'thirteen-cards': remainingVouchersOfUser['thirteen-cards'],
    },
  };

  const checkRemainingVouchers = (
    selectedTarotMode,
    spreadList,
    i,
    remainingVouchers
  ) => {
    if (selectedTarotMode === 1) return true;
    const selectedTarotModeToPrice = {
      2: 'voucherToPayForNormal',
      3: 'voucherToPayForDeep',
      4: 'voucherToPayForSerious',
    };

    const countToRemainingVouchers = {
      1: 'one-card',
      2: 'two-cards',
      3: 'three-cards',
      4: 'four-cards',
      5: 'five-cards',
      6: 'six-cards',
      7: 'seven-cards',
      8: 'eight-cards',
      9: 'nine-cards',
      10: 'ten-cards',
      11: 'eleven-cards',
      13: 'thirteen-cards',
    };

    const count = spreadList[i]?.count;
    const price = spreadList[i][selectedTarotModeToPrice[selectedTarotMode]][1];
    const remaining =
      remainingVouchers[selectedTarotMode][countToRemainingVouchers[count]] ||
      0;
    if (price <= remaining) {
      return true;
    }

    // Star Fallback Check
    const stars = userInfoInRedux?.stars || 0;
    if (stars >= 1) {
      return true;
    }

    //! 필요이용권 이름 spreadList[i][selectedTarotModeToPrice[selectedTarotMode]][0] 및 수량 price
    //! 필요이용권 보유 수량 remaining
    setRequiredVoucherInfo(prev => {
      return {
        name: spreadList[i][selectedTarotModeToPrice[selectedTarotMode]][0],
        requiredAmount: price,
        remainingAmount: remaining,
      };
    });

    return false;
  };

  const handleTarotClick = useCallback(
    async (e, i) => {
      try {
        //! 로그인 체크(브라우저)
        if (!hasAccessToken() && !isNative) {
          updateLoginBlinkModalOpen(true);
          return;
        }
        //! 로그인 체크(모바일앱)
        const checkTokenInApp = await hasAccessTokenForPreference();
        if (isNative && !checkTokenInApp) {
          updateLoginBlinkModalOpen(true);
          return;
        }

        //! 별 모드일 때 별 잔액 확인
        if (isStarMode && isVoucherModeOn) {
          // 필요한 별 개수 가져오기
          const starPrices = {
            2: spreadList[i]?.starToPayForNormal || 1,
            3: spreadList[i]?.starToPayForDeep || 2,
            4: spreadList[i]?.starToPayForSerious || 4,
          };
          const requiredStars = starPrices[selectedTarotMode] || 1;

          if (userStars < requiredStars) {
            // 별이 부족하면 필요 별 정보 설정 후 구매 모달 표시
            setRequiredVoucherInfo({
              name: 'star',
              requiredAmount: requiredStars,
              remainingAmount: userStars,
            });
            setSelectedAdType(0);
            isNative ? setInAppPurchaseOpen(true) : updateChargeModalOpen(true);
            return;
          }
          // 별이 충분하면 계속 진행 (실제 차감은 백엔드에서)
        }

        //! 이용권 감별 (별 모드가 아닐 때만)
        let hasEnoughVoucher = true;
        if (!isStarMode) {
          hasEnoughVoucher = checkRemainingVouchers(
            selectedTarotMode,
            spreadList,
            i,
            remainingVouchers
          );


          //! (admob용 말고) 일반 이용권 없을 시
          if (!hasEnoughVoucher) {
            if (selectedTarotMode === 2 && !isVoucherModeOn) {
              // TODO: 1시간 10회 제한 광고 처리하기?
              setSelectedAdType(spreadList[i]?.admobAds);
              setWatchedAdForBlinkModal(true); //~ (1-1) 광고 시청후 컨텐츠 클릭시, 스프레드 이름 모달창 나오도록 함.
            } else {
              setSelectedAdType(0);
              isNative
                ? setInAppPurchaseOpen(true)
                : updateChargeModalOpen(true);
              return;
            }
          }
        }

        //! (admob용 말고) 일반 이용권 있을 시, 타로 타입에 따른 필요 이용권 수 처리
        // 이용권 있을 때, 타로 타입별 처리
        const voucherPrices = {
          2: spreadList[i]?.voucherToPayForNormal,
          3: spreadList[i]?.voucherToPayForDeep,
          4: spreadList[i]?.voucherToPayForSerious,
        };

        if (selectedTarotMode === 2 && !isVoucherModeOn) {
          // TODO: 1시간 10회 제한 광고 처리하기?
          setSelectedAdType(spreadList[i]?.admobAds);
          setWatchedAdForBlinkModal(true); //~ 광고 후 스프레드 이름 모달 표시
        } else if ([2, 3, 4].includes(selectedTarotMode)) {
          setSelectedAdType(0);
          updateTarotSpreadVoucherPrice(voucherPrices[selectedTarotMode]);
        }

        //! 안정적인 흐름을 위해 추가
        setWatchedAd(false);
        updateAnswerForm(prev => {
          // IMPORTANT:
          // - Backend routes to additional-question handler ONLY when `isAdditionalQuestion === true` (strict).
          // - Normalize to a real boolean and preserve additional-question chain context across spread selection.
          const normalizedIsAdditionalQuestion =
            prev?.isAdditionalQuestion === true ||
            prev?.isAdditionalQuestion === 'true' ||
            prev?.isAdditionalQuestion === 1;

          return {
            ...prev,
            isSubmitted: false,
            isWaiting: false,
            isAnswered: false,
            // 추가 질문 모드 플래그 유지 (항상 boolean으로)
            isAdditionalQuestion: normalizedIsAdditionalQuestion,
            // Keep linking fields stable (do not accidentally wipe them via falsy coercion)
            originalTarotId: prev?.originalTarotId ?? null,
            parentTarotId: prev?.parentTarotId ?? null,
            tarotIdChain: Array.isArray(prev?.tarotIdChain)
              ? prev.tarotIdChain
              : [],
            questionChain: Array.isArray(prev?.questionChain)
              ? prev.questionChain
              : [],
            additionalQuestionCount:
              typeof prev?.additionalQuestionCount === 'number'
                ? prev.additionalQuestionCount
                : 0,
          };
        });

        // Firebase Analytics: 실제 타로 결과를 받았을 때만 추적됨 (onSubmit에서 처리)

        // 모달 열기
        toggleTarotModal(
          true,
          spreadList[i]?.spreadListNumber,
          spreadList[i]?.title,
          spreadList[i]?.count
        );
        // 어떤 스프레드인지 나타내는 모달창 팝업하기
        if (selectedTarotMode !== 1) {
          setSelectedSpread(true);
        }
      } catch (error) {
        console.error('Error in handleTarotClick:', error);
        // 에러 처리 로직 (예: 사용자에게 에러 메시지 표시)
      }
    },
    [
      hasAccessToken,
      hasAccessTokenForPreference,
      isNative,
      isVoucherModeOn,
      hasWatchedAd,
      selectedTarotMode,
      spreadList,
      remainingVouchers,
      isChargeModalOpen,
      isInAppPurchaseOpen,
      updateLoginBlinkModalOpen,
      updateTarotSpreadVoucherPrice,
      toggleTarotModal,
      setSelectedAdType,
      checkRemainingVouchers,
    ]
  );
  const browserLanguage = useLanguageChange();

  return (
    <div name={'list'} className={styles.list}>
      {spreadList.map((elem, i) => {
        if (elem.spreadListNumber === 201 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 301 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 302 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 303 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 304 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 601 && selectedTarotMode === 1) return;
        if (elem.spreadListNumber === 602 && selectedTarotMode === 1) return;
        return (
          <div
            key={i}
            name={'list_element'}
            className={styles['list-element']}
            onClick={async e => {
              e.preventDefault();
              if ([1, 2, 3, 4].includes(selectedTarotMode)) {
                await handleTarotClick(e, i);
              } else {
                // Firebase Analytics: 실제 타로 결과를 받았을 때만 추적됨 (onSubmit에서 처리)

                toggleTarotModal(
                  true,
                  spreadList[i]?.spreadListNumber,
                  spreadList[i]?.title,
                  spreadList[i]?.count
                );
              }
              if (selectedTarotMode === 1) {
                //! 모달창
                setSelectedSpread(true); // 스피드 타로에서 스프레드 모달창 나오지 않않도록 하려면 여기 지우기
                setSpeedTarotNotificationOn(true);
              }
            }}
          >
            <div
              name={'spread_box'}
              className={`${
                selectedTarotMode === 2 ||
                selectedTarotMode === 3 ||
                selectedTarotMode === 4
                  ? styles['spread-box-purchase']
                  : styles['spread-box']
              }`}
            >
              <div name={'spread_image'} className={styles['spread-image']}>
                {/* <img src={`${spreadList[i]?.img}`} alt="spread-image" /> */}
                {spreadList[i]?.img}
              </div>
              <div
                name={'spread_description_box'}
                className={styles['spread-description-box']}
              >
                <div name={'spread_title'} className={styles['spread-title']}>
                  {selectedTarotMode === 1 ? (
                    <p
                      className={`${
                        browserLanguage === 'ja'
                          ? styles['title-japanese']
                          : styles['title']
                      }`}
                    >
                      {spreadList[i]?.titleSpeedMode}
                    </p>
                  ) : (
                    <p
                      className={`${
                        browserLanguage === 'ja'
                          ? styles['title-japanese']
                          : styles['title']
                      }`}
                    >
                      {spreadList[i]?.title}
                    </p>
                  )}
                </div>
                <div
                  name={'spread_description'}
                  className={styles['spread-description']}
                >
                  {selectedTarotMode === 1 ? (
                    <p
                      className={`${
                        browserLanguage === 'ja'
                          ? styles['description-japanese']
                          : styles['description']
                      }`}
                    >
                      {spreadList[i]?.descriptionSpeedMode}
                    </p>
                  ) : (
                    <p
                      className={`${
                        browserLanguage === 'ja'
                          ? styles['description-japanese']
                          : styles['description']
                      }`}
                    >
                      {spreadList[i]?.description}
                    </p>
                  )}
                </div>
                {/* 해시태그 표시 */}
                {(() => {
                  // 스피드 타로 모드일 때 tagsSpeedMode 사용, 없으면 일반 tags 사용
                  const tagsToShow =
                    selectedTarotMode === 1
                      ? spreadList[i]?.tagsSpeedMode || spreadList[i]?.tags
                      : spreadList[i]?.tags;

                  return (
                    tagsToShow &&
                    Array.isArray(tagsToShow) && (
                      <div className={styles['spread-tags']}>
                        {tagsToShow.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={
                              browserLanguage === 'ja'
                                ? styles['tag-japanese']
                                : styles['tag']
                            }
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )
                  );
                })()}
                {selectedTarotMode === 1 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <p>{'  '}</p>
                  </div>
                ) : null}
                {selectedTarotMode === 2 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      {isVoucherModeOn === true ? (
                        isStarMode ? (
                          <p>{spreadList[i]?.starForNormal}</p>
                        ) : (
                          <p>{spreadList[i]?.voucherForNormal}</p>
                        )
                      ) : (
                        <p>{'  '}</p>
                      )}
                      {/* {isVoucherModeOn === false && isNative ? (
                        <p>
                          <span className={styles['ads-cards']}>
                            ◎ x 1{t(`unit.ea`)}
                          </span>
                        </p>
                      ) : null} */}
                    </div>
                  </div>
                ) : null}
                {selectedTarotMode === 3 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      {isStarMode ? (
                        <p>{spreadList[i]?.starForDeep}</p>
                      ) : (
                        <p>{spreadList[i]?.voucherForDeep}</p>
                      )}
                    </div>
                  </div>
                ) : null}
                {selectedTarotMode === 4 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      {isStarMode ? (
                        <p>{spreadList[i]?.starForSerious}</p>
                      ) : (
                        <p>{spreadList[i]?.voucherForSerious}</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
