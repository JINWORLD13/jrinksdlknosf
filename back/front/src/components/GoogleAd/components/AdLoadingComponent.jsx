import React, { useState } from 'react';
import { X } from 'lucide-react';
import AdComponentStyles from '../AdComponent.module.scss';
import { useTranslation } from 'react-i18next';

const AdLoadingComponent = ({ ...props }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  // x 버튼 클릭 시 창 닫기
  const handleClose = () => {
    setIsVisible(false);
    if (props?.setIsLoading) props?.setIsLoading(false);
    if (props?.setSelectedAdType) props?.setSelectedAdType(0);
    if (props?.setWatchedAd) props?.setWatchedAd(false);
  };
  // 창이 보이지 않으면 아무것도 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div
      className={`${AdComponentStyles['backdrop']} ${AdComponentStyles['backdropAdLoading']}`}
    >
      <div className={AdComponentStyles['backdrop-box']}>
        <button
          className={AdComponentStyles['close-button']}
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className={AdComponentStyles['ad-badge']}>{t(`ad.label`)}</div>
        <div className={AdComponentStyles['modal']}>
          <h1>{t(`instruction.loading`)}</h1>
          <div>
            <p>{t(`instruction.network-warnings`)}</p>
          </div>
          <div className={AdComponentStyles['loading-indicator']}>
            <div className={AdComponentStyles['spinner']}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdLoadingComponent;
