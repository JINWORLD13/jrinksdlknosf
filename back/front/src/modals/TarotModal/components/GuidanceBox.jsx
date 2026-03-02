import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { detectComputer } from '../../../utils/device/detectComputer';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

export const GuidanceBox = ({
  styles,
  isCSSInvisible,
  selectedTarotMode,
  ...props
}) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return (
    <h2
      className={`${
        browserLanguage === 'ja'
          ? fontStyles['japanese-font-small-title']
          : fontStyles['korean-font-small-title']
      } ${
        isCSSInvisible === true && selectedTarotMode === 1
          ? styles['invisible']
          : null
      } ${styles['h2']}`}
    >
      {selectedTarotMode === 1 &&
        (isNative || !detectComputer()
          ? t(`instruction.speed_modal_card_not_computer`)
          : t(`instruction.speed_modal_card`))}
      {selectedTarotMode !== 1 &&
        (isNative || !detectComputer()
          ? t(`instruction.tarot_modal_card_not_computer`)
          : t(`instruction.tarot_modal_card`))}
    </h2>
  );
};
