import React, { useEffect, useRef, useState } from 'react';
import styles from './PriceInfoModal.module.scss';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import CancelButton from '../../components/common/CancelButton.jsx';
import { spreadPriceObjForVoucher } from '../../data/spreadList/spreadPrice.jsx';
import { TicketIcon } from '../PurchaseModal/InAppPurchase/components/TicketIcon.jsx';
import GiftBoxIcon from '../PurchaseModal/InAppPurchase/components/GiftBoxIcon.jsx';
import { StarIcon } from '../PurchaseModal/InAppPurchase/components/StarIcon.jsx';

const PriceInfoModal = ({ ...props }) => {
  const browserLanguage = props?.browserLanguage || useLanguageChange();
  const { t } = useTranslation();

  const scrollContainerRef = useRef(null);
  const scrollAmount = 5;

  const handleScroll = event => {
    event.preventDefault();
    const delta = event.deltaY;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop +=
        delta > 0 ? scrollAmount : -scrollAmount;
    }
  };

  const closePriceInfoModal = () => {
    if (
      props?.updatePriceInfoModalOpen !== undefined &&
      props?.updatePriceInfoModalOpen !== null
    )
      props?.updatePriceInfoModalOpen(false);
  };

  return (
    <div>
      <div className={styles['backdrop']} onClick={props?.onConfirm} />
      <div className={styles['modal']}>
        <div
          className={`${
            browserLanguage === 'ja'
              ? styles['modal-content-japanese']
              : styles['modal-content']
          }`}
        >
          <div
            className={styles['content']}
            ref={scrollContainerRef}
            onWheel={e => {
              handleScroll(e);
            }}
          >
            {props?.voucherBox.map((elem, i) => {
              if (elem.count === 7) return;
              if (elem.count === 8) return;
              if (elem.count === 9) return;
              if (elem.count === 11) return;
              if (elem.count === 13) return;
              return (
                <>
                  {browserLanguage === 'ja' && (
                    <>
                      <div className={styles['price-list-item-japanese']}>
                        <div className={styles['voucher-title']}>
                          <div>{'カード' + elem.count + '枚券'}</div>
                          <div className={styles['sparkle']}>
                            &#9733;
                            {spreadPriceObjForVoucher[elem.count][
                              'salePercentageForUSD'
                            ] + '% Off'}
                            &#9733;
                          </div>
                        </div>
                        <div className={styles['voucher-main']}>
                          <div className={styles['voucher-logo']}>
                            <span>{elem.name}</span>
                          </div>
                          <div className={styles['voucher-price']}>
                            <span>
                              <span>
                                {
                                  spreadPriceObjForVoucher[elem.count]
                                    ?.listPriceForUSD
                                }
                              </span>
                              <span>{' USD' + ' / '}</span>
                              <span>
                                {spreadPriceObjForVoucher[elem.count]
                                  ?.originalPriceForUSD + ' USD'}
                              </span>
                            </span>{' '}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {browserLanguage === 'ko' && (
                    <>
                      <div className={styles['price-list-item']}>
                        <div className={styles['voucher-title']}>
                          <div>{'카드' + elem.count + '장권'}</div>
                          <div className={styles['sparkle']}>
                            &#9733;
                            {spreadPriceObjForVoucher[elem.count][
                              'salePercentage'
                            ] + '% Off'}
                            &#9733;
                          </div>
                        </div>
                        <div className={styles['voucher-main']}>
                          <div className={styles['voucher-logo']}>
                            <span>{elem.name}</span>
                          </div>
                          <div className={styles['voucher-price']}>
                            <span>
                              <span>
                                {
                                  spreadPriceObjForVoucher[elem.count]
                                    ?.listPrice
                                }
                              </span>
                              <span>{' 원' + ' / '}</span>
                              <span>
                                {spreadPriceObjForVoucher[elem.count]
                                  ?.originalPrice + ' 원'}
                              </span>
                            </span>{' '}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {browserLanguage === 'en' && (
                    <>
                      <div className={styles['price-list-item']}>
                        <div className={styles['voucher-title']}>
                          {i === 0 ? (
                            <div>
                              {elem.count + ' ' + 'Card' + ' ' + 'Voucher'}
                            </div>
                          ) : (
                            <div>
                              {elem.count + ' ' + 'Cards' + ' ' + 'Voucher'}
                            </div>
                          )}
                          <div className={styles['sparkle']}>
                            &#9733;
                            {spreadPriceObjForVoucher[elem.count][
                              'salePercentageForUSD'
                            ] + '% Off'}
                            &#9733;
                          </div>
                        </div>
                        <div className={styles['voucher-main']}>
                          <div className={styles['voucher-logo']}>
                            <span>{elem.name}</span>
                          </div>
                          <div className={styles['voucher-price']}>
                            <span>
                              <span>
                                {
                                  spreadPriceObjForVoucher[elem.count]
                                    ?.listPriceForUSD
                                }
                              </span>
                              <span>{' USD' + ' / '}</span>
                              <span>
                                {spreadPriceObjForVoucher[elem.count]
                                  ?.originalPriceForUSD + ' USD'}
                              </span>
                            </span>{' '}
                          </div>
                        </div>
                      </div>
                      {/* <div className={styles['price-list-item']}>
                        <div className={styles['voucher-title']}>
                          {i === 0 ? (
                            <div>
                              {elem.count + ' ' + 'Card' + ' ' + 'Voucher'}
                            </div>
                          ) : (
                            <div>
                              {elem.count + ' ' + 'Cards' + ' ' + 'Voucher'}
                            </div>
                          )}

                          <div className={styles['sparkle']}>
                            &#9733;
                            {spreadPriceObjForVoucher[elem.count][
                              'salePercentage'
                            ] + '% Off'}
                            &#9733;
                          </div>
                        </div>
                        <div className={styles['voucher-main']}>
                          <div className={styles['voucher-logo']}>
                            <span>{elem.name}</span>
                          </div>
                          <div className={styles['voucher-price']}>
                            <span>
                              <span>
                                {
                                  spreadPriceObjForVoucher[elem.count]
                                    ?.listPrice
                                }
                              </span>
                              <span>{' KRW' + ' / '}</span>
                              <span>
                                {spreadPriceObjForVoucher[elem.count]
                                  ?.originalPrice + ' KRW'}
                              </span>
                            </span>{' '}
                          </div>
                        </div>
                      </div> */}
                    </>
                  )}
                </>
              );
            })}

            {/* 패키지 가격 정보 */}
            {[
              {
                key: 'newbie',
                number: null,
                name: t('product.cosmos_vouchers_bundle_package_newbie_title'),
                color: '#EF4444',
                ribbonColor: '#FBBF24',
              },
              {
                key: '1',
                number: 1,
                name: t('product.cosmos_vouchers_bundle_package_1_title'),
                color: '#10B981',
                ribbonColor: '#F59E0B',
              },
              {
                key: '2',
                number: 2,
                name: t('product.cosmos_vouchers_bundle_package_2_title'),
                color: '#3B82F6',
                ribbonColor: '#EF4444',
              },
              {
                key: '3',
                number: 3,
                name: t('product.cosmos_vouchers_bundle_package_3_title'),
                color: '#F97316',
                ribbonColor: '#A855F7',
              },
              {
                key: '4',
                number: 4,
                name: t('product.cosmos_vouchers_bundle_package_4_title'),
                color: '#14B8A6',
                ribbonColor: '#F472B6',
              },
              {
                key: '5',
                number: 5,
                name: t('product.cosmos_vouchers_bundle_package_5_title'),
                color: '#6366F1',
                ribbonColor: '#FCD34D',
              },
              {
                key: '6',
                number: 6,
                name: t('product.cosmos_vouchers_bundle_package_6_title'),
                color: '#EC4899',
                ribbonColor: '#10B981',
              },
              {
                key: '10',
                number: 10,
                name: t('product.cosmos_vouchers_bundle_package_10_title'),
                color: '#8B5CF6',
                ribbonColor: '#84CC16',
              },
            ].map(pkg => {
              const basePrice =
                pkg.key === 'newbie'
                  ? browserLanguage === 'ko'
                    ? 500
                    : 0.05
                  : browserLanguage === 'ko'
                  ? spreadPriceObjForVoucher[pkg.number]['listPrice'] * 10
                  : spreadPriceObjForVoucher[pkg.number]['listPriceForUSD'] *
                    10;
              const salePrice =
                pkg.key === 'newbie'
                  ? basePrice // 초심자 패키지는 할인 없음
                  : basePrice * 0.9;

              return (
                <div
                  key={pkg.key}
                  className={
                    browserLanguage === 'ja'
                      ? `${styles['price-list-item-japanese']} ${styles['package-item']}`
                      : `${styles['price-list-item']} ${styles['package-item']}`
                  }
                >
                  <div className={styles['voucher-title']}>
                    <div>{pkg.name}</div>
                    {pkg.key === 'newbie' ? (
                      <div className={styles['sparkle']}>
                        &#9733; Event &#9733;
                      </div>
                    ) : (
                      <div className={styles['sparkle']}>
                        &#9733; 10% Off &#9733;
                      </div>
                    )}
                  </div>
                  <div className={styles['voucher-main']}>
                    <div className={styles['voucher-logo']}>
                      <GiftBoxIcon
                        size={32}
                        color={pkg.color}
                        ribbonColor={pkg.ribbonColor}
                      />
                    </div>
                    <div className={styles['voucher-price']}>
                      {pkg.key === 'newbie' ? (
                        // 초심자 패키지는 할인 없음
                        <span>
                          <span>
                            {browserLanguage === 'ko'
                              ? Math.round(salePrice)
                              : salePrice.toFixed(2)}
                          </span>
                          <span>
                            {browserLanguage === 'ko' ? ' 원' : ' USD'}
                          </span>
                        </span>
                      ) : (
                        <span>
                          <span>
                            {browserLanguage === 'ko'
                              ? Math.round(salePrice)
                              : salePrice.toFixed(1)}
                          </span>
                          <span>
                            {browserLanguage === 'ko' ? ' 원 / ' : ' USD / '}
                          </span>
                          <span style={{ textDecoration: 'line-through' }}>
                            {browserLanguage === 'ko'
                              ? Math.round(basePrice)
                              : basePrice.toFixed(1)}
                          </span>
                          <span>
                            {browserLanguage === 'ko' ? ' 원' : ' USD'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 별 패키지 가격 정보 */}
            <div
              className={
                browserLanguage === 'ja'
                  ? `${styles['price-list-item-japanese']} ${styles['package-item']}`
                  : `${styles['price-list-item']} ${styles['package-item']}`
              }
            >
              <div className={styles['voucher-title']}>
                <div>{t('product.cosmos_star_50_title')}</div>
                <div className={styles['sparkle']}>&#9733; Sale &#9733;</div>
              </div>
              <div className={styles['voucher-main']}>
                <div className={styles['voucher-logo']}>
                  <StarIcon
                    width="32"
                    height="32"
                    style={{ color: '#FFD700' }}
                  />
                </div>
                <div className={styles['voucher-price']}>
                  <span>
                    <span>{browserLanguage === 'ko' ? '8000' : '5.5'}</span>
                    <span>
                      {browserLanguage === 'ko' ? ' 원 / ' : ' USD / '}
                    </span>
                    <span style={{ textDecoration: 'line-through' }}>
                      {browserLanguage === 'ko' ? '10000' : '7'}
                    </span>
                    <span>{browserLanguage === 'ko' ? ' 원' : ' USD'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 보통 타로 3일 무료 이용권 가격 정보 */}
            <div
              className={
                browserLanguage === 'ja'
                  ? `${styles['price-list-item-japanese']} ${styles['package-item']}`
                  : `${styles['price-list-item']} ${styles['package-item']}`
              }
            >
              <div className={styles['voucher-title']}>
                <div
                  className={
                    browserLanguage === 'ja'
                      ? styles['free-pass-title-japanese']
                      : styles['free-pass-title']
                  }
                >
                  {t('product.normal_tarot_3day_free_pass_title')}
                </div>
                <div className={styles['sparkle']}>&#9733; 40% Off &#9733;</div>
              </div>
              <div className={styles['voucher-main']}>
                <div className={styles['voucher-logo']}>
                  <TicketIcon
                    width="32"
                    height="32"
                    style={{
                      color: '#DC2626',
                    }}
                  />
                </div>
                <div className={styles['voucher-price']}>
                  <span>
                    <span>{browserLanguage === 'ko' ? '1800' : '1.8'}</span>
                    <span>
                      {browserLanguage === 'ko' ? ' 원 / ' : ' USD / '}
                    </span>
                    <span style={{ textDecoration: 'line-through' }}>
                      {browserLanguage === 'ko' ? '3000' : '3.0'}
                    </span>
                    <span>{browserLanguage === 'ko' ? ' 원' : ' USD'}</span>
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '0.9em',
                  color: '#DC2626',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  width: '100%',
                }}
              >
                {browserLanguage === 'ko'
                  ? '※ 환불 불가'
                  : t('product.normal_tarot_3day_free_pass_non_refundable')}
              </div>
            </div>
          </div>
          <footer className={styles['button-box']}>
            <CancelButton
              className={styles['button']}
              onClick={(e = null) => {
                closePriceInfoModal();
              }}
            >
              {t(`button.close`)}
            </CancelButton>
          </footer>
        </div>
        {/* footer는 div지만 명시적으로 아래에 있는 div로 설정. 그리고 width는 자동으로 100%; */}
      </div>
    </div>
  );
};

export default PriceInfoModal;
