import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import Button from '../../../components/common/Button';
import CancelButton from '../../../components/common/CancelButton';
import { isProductionMode } from '@/utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { StarIcon } from '../../PurchaseModal/InAppPurchase/components/StarIcon.jsx';
import { TicketIcon } from '../../PurchaseModal/InAppPurchase/components/TicketIcon.jsx';
const isNative = Capacitor.isNativePlatform();

export const BottomBox = ({
  styles,
  modalForm,
  selectedTarotMode,
  admobReward,
  isVoucherModeOn,
  setVoucherMode,
  toggleTarotModal,
  toggleSpreadModal,
  handleCancelSpreadModal,
  browserLanguage,
  isStarMode,
  setIsStarMode,
  ...propd
}) => {
  const { t } = useTranslation();
  const [transformedAdmobReward, setTransformedAdmobReward] = useState(0);
  useEffect(() => {
    const handleAdmobReward = async () => {
      try {
        if (admobReward instanceof Promise) {
          const result = await admobReward;
          setTransformedAdmobReward(result);
        } else {
          setTransformedAdmobReward(admobReward);
        }
      } catch (error) {
        console.error('Error processing admobReward:', error);
      }
    };

    handleAdmobReward();
  }, [admobReward]);

  return (
    <div className={styles['btn-box']}>
      {selectedTarotMode === 2 && isNative && (
        <Button
          className={`${
            browserLanguage === 'ja'
              ? styles['ads-btn-japanese']
              : styles['ads-btn']
          } ${isVoucherModeOn === true && styles['selected']}`}
          onClick={() => {
            if (isVoucherModeOn === false) {
              //& 이용권 모드로
              setVoucherMode(true);
              toggleTarotModal(false, '', '', '');
            }
            if (isVoucherModeOn === true) {
              //& 광고 모드로
              setVoucherMode(false);
            }
          }}
        >
          {isVoucherModeOn ? t(`button.vouchers`) : t(`button.ads`)}
        </Button>
      )}
      {/* 이용권/별 선택 스위치 (우측 하단): 보통타로+광고모드, 심층타로, 진지타로일 때만 */}
      {((selectedTarotMode === 2 && isVoucherModeOn) ||
        selectedTarotMode === 3 ||
        selectedTarotMode === 4) && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            onClick={() => {
              setIsStarMode(!isStarMode);
              toggleTarotModal(false, '', '', '');
            }}
            style={{
              width: '50px',
              height: '26px',
              backgroundColor: isStarMode ? '#FFD700' : '#666',
              borderRadius: '13px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              border: '2px solid ' + (isStarMode ? '#FFD700' : '#999'),
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '1px',
                left: isStarMode ? '26px' : '2px',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '1rem',
              color: '#FFD700',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            {isStarMode ? (
              <StarIcon
                width="25"
                height="25"
                style={{
                  color: '#FFD700',
                  verticalAlign: 'middle',
                  marginRight: '2px',
                }}
              />
            ) : (
              <TicketIcon
                width="28"
                height="28"
                style={{
                  color: '#FFD700',
                  verticalAlign: 'middle',
                  marginRight: '2px',
                }}
              />
            )}
          </span>
        </div>
      )}
      {modalForm?.spread && !modalForm?.tarot && (
        <CancelButton
          className={`${
            browserLanguage === 'ja'
              ? styles['cancel-btn-japanese']
              : styles['cancel-btn']
          }`}
          onClick={(e = null) => {
            if (typeof handleCancelSpreadModal === 'function') {
              handleCancelSpreadModal();
              return;
            }
            toggleSpreadModal(false, 0, '', 0);
          }}
        >
          {t(`button.cancel`)}
        </CancelButton>
      )}
      {selectedTarotMode === 2 && isNative && isVoucherModeOn === false && (
        <div
          className={`${
            browserLanguage === 'ja'
              ? styles['ads-reward-japanese']
              : styles['ads-reward']
          }`}
        >
          {/* {t(`ad.reward`) + ' : ' + transformedAdmobReward + ' '} */}
          {'◎' + ' : ' + transformedAdmobReward + ' '}
          {isProductionMode ? t(`unit.ea`) : 'C'}
        </div>
      )}
    </div>
  );
};
