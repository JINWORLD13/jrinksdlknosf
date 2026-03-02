import React, { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import { spreadArrForPoint } from '../../../data/spreadList/spreadArr';
import { userApi } from '../../../api/userApi';
import { hasAccessTokenForPreference } from '../../../utils/storage/tokenPreference';
import { hasAccessToken } from '../../../utils/storage/tokenCookie';

const isNative = Capacitor.isNativePlatform();

//! 포인트제용 스프레드 리스트
export const SpreadListForPoint = ({
  styles,
  stateGroup,
  setStateGroup,
  userCacheForRedux,
  toggleTarotModal,
  selectedTarotMode,
  ...props
}) => {
  const { t } = useTranslation();
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
    ...rest
  } = setStateGroup;

  const [remainingPointsOfUser, setRemainingPointsOfUser] = useState(0);

  const spreadListForPoint = spreadArrForPoint();
  useEffect(() => {
    const fetchedRemainingPointsOfUser = async () => {
      const user = await userApi.get();
      const points = user.response.points ?? 0;
      setRemainingPointsOfUser(points);
    };
    fetchedRemainingPointsOfUser();
  }, [remainingPointsOfUser]);

  return (
    <div name={'list'} className={styles.list}>
      {spreadListForPoint.map((elem, i) => {
        return (
          <div
            name={'list_element'}
            className={styles['list-element']}
            keys={i}
            onClick={async e => {
              if (
                selectedTarotMode === 1 ||
                selectedTarotMode === 2 ||
                selectedTarotMode === 3 ||
                selectedTarotMode === 4
              ) {
                // & 로그인 감별
                if (hasAccessToken() === false && isNative === false) {
                  updateLoginBlinkModalOpen(true);
                  return;
                }
                const checkTokenInApp = await hasAccessTokenForPreference();
                if (isNative === true && checkTokenInApp === false) {
                  updateLoginBlinkModalOpen(true);
                  return;
                }
                //? 포인트 감별 normal
                if (
                  spreadListForPoint[i]?.listPointPriceForNormal >
                    remainingPointsOfUser &&
                  selectedTarotMode === 2
                ) {
                  updateChargeModalOpen(true);
                  return;
                }
                //& 포인트 감별 deep
                if (
                  spreadListForPoint[i]?.listPointPriceForDeep >
                    remainingPointsOfUser &&
                  selectedTarotMode === 3
                ) {
                  updateChargeModalOpen(true);
                  return;
                }
                //~ 포인트 감별 serious
                if (
                  spreadListForPoint[i]?.listPointPriceForSerious >
                    remainingPointsOfUser &&
                  selectedTarotMode === 4
                ) {
                  updateChargeModalOpen(true);
                  return;
                }
                //! 컨텐츠별 광고 감별
                if (
                  isNative === true &&
                  selectedTarotMode === 2 &&
                  isVoucherModeOn === false &&
                  hasWatchedAd === true &&
                  selectedAdType !== elem?.admobAds
                )
                  return;
                //? 포인트 있을 시, 보통 타로(2번)에서 고른 정가 업데이트. normal
                if (selectedTarotMode === 2) {
                  updateTarotSpreadPricePoint(
                    spreadListForPoint[i]?.listPointPriceForNormal
                  );
                }
                //& 포인트 있을 시, 심층 타로(3번)에서 고른 정가 업데이트. deep
                if (selectedTarotMode === 3) {
                  updateTarotSpreadPricePoint(
                    spreadListForPoint[i]?.listPointPriceForDeep
                  );
                }
                //~ 포인트 있을 시, 진지 타로(4번)에서 고른 정가 업데이트. serious
                if (selectedTarotMode === 4) {
                  updateTarotSpreadPricePoint(
                    spreadListForPoint[i]?.listPointPriceForSerious
                  );
                }
                e.preventDefault();
                toggleTarotModal(
                  true,
                  spreadListForPoint[i]?.spreadListNumber,
                  spreadListForPoint[i]?.title,
                  spreadListForPoint[i]?.count
                );
                return;
              }
              e.preventDefault();
              toggleTarotModal(
                true,
                spreadListForPoint[i]?.spreadListNumber,
                spreadListForPoint[i]?.title,
                spreadListForPoint[i]?.count
              );
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
                {/* <img src={`${spreadListForPoint[i]?.img}`} alt="spread-image" /> */}
                {spreadListForPoint[i]?.img}
              </div>
              <div
                name={'spread_description_box'}
                className={styles['spread-description-box']}
              >
                <div name={'spread_title'} className={styles['spread-title']}>
                  <p>{spreadListForPoint[i]?.title}</p>
                </div>
                <div
                  name={'spread_description'}
                  className={styles['spread-description']}
                >
                  <p>{spreadListForPoint[i]?.description}</p>
                </div>
                {selectedTarotMode === 1 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <p>{'  '}</p>
                  </div>
                ) : null}
                {selectedTarotMode === 2 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      <p>
                        &#9734;
                        {spreadListForPoint[i]?.salePercentageForNormal +
                          '% Off'}
                        &#9734;
                      </p>
                    </div>
                    <div>
                      <p>
                        {spreadListForPoint[i]?.listPointPriceForNormal +
                          ' P' +
                          ' / '}
                      </p>
                      <p>
                        {spreadListForPoint[i]?.originalPointPriceForNormal}
                      </p>
                      <p>{' P'}</p>
                    </div>
                  </div>
                ) : null}
                {selectedTarotMode === 3 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      <p>
                        &#9734;
                        {spreadListForPoint[i]?.salePercentageForDeep + '% Off'}
                        &#9734;
                      </p>
                    </div>
                    <div>
                      <p>
                        {spreadListForPoint[i]?.listPointPriceForDeep +
                          ' P' +
                          ' / '}
                      </p>
                      <p>{spreadListForPoint[i]?.originalPointPriceForDeep}</p>
                      <p>{' P'}</p>
                    </div>
                  </div>
                ) : null}
                {selectedTarotMode === 4 ? (
                  <div name={'spread_price'} className={styles['spread-price']}>
                    <div>
                      <p>
                        &#9734;
                        {spreadListForPoint[i]?.salePercentageForSerious +
                          '% Off'}
                        &#9734;
                      </p>
                    </div>
                    <div>
                      <p>
                        {spreadListForPoint[i]?.listPointPriceForSerious +
                          ' P' +
                          ' / '}
                      </p>
                      <p>
                        {spreadListForPoint[i]?.originalPointPriceForSerious}
                      </p>
                      <p>{' P'}</p>
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
