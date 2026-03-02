import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SPREAD_OPTIONS,
  QUESTION_SPREAD_IDS,
  normalizeLanguage,
} from '@/lib/tarot/generalReading';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';
import { showInterstitialForGeneralReading } from '@/components/GoogleAd/showInterstitial';
import {
  getGeneralReadingAdState,
  advanceGeneralReadingAdState,
  setGeneralReadingAdTurnPending,
  getGeneralReadingAdCountKey,
} from '@/utils/storage/tokenPreference.jsx';
import { getDeviceId } from '@/utils/device/getDeviceId';
import Button from '@/components/common/Button';
import styles from './GeneralReadingSpreadChoiceModal.module.scss';

/** Fisher–Yates 셔플: 배열을 복사한 뒤 순서를 랜덤하게 섞음 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 제너럴 리딩: 질문 선택 후 1~5번 중 하나 선택
 * 모달이 열릴 때마다 1~5번에 배치되는 스프레드 순서를 랜덤하게 섞음
 * isNative: 1~5번 선택 시 광고 시청 확인 모달 표시
 */
const GeneralReadingSpreadChoiceModal = ({
  onClose,
  onSelectSpread,
  questionText,
  isNative = false,
  userInfo,
  onMarkAdConfirmShown,
}) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const { registerModal, unregisterModal } = useModalBackHandler();
  const lang = normalizeLanguage(browserLanguage);
  const [showAdConfirmModal, setShowAdConfirmModal] = useState(false);
  const [pendingSpreadId, setPendingSpreadId] = useState(null);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // 모달 마운트 시 한 번만 섞음 → 열 때마다 1~5번 순서가 바뀜
  const spreadOrder = useMemo(
    () => shuffleArray(QUESTION_SPREAD_IDS),
    [],
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // ESC 키·디바이스 뒤로가기 → 취소(닫기)와 동일
  useEffect(() => {
    const modalId = 'general-reading-spread-choice-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  const proceedWithSpread = spreadId => {
    onSelectSpread?.(spreadId);
    // onClose는 호출하지 않음 — 선택 시 handleGeneralReadingSpreadSelect가 모달을 닫고 /result로 navigate.
    // onClose를 호출하면 path가 아직 /spread라 navigate(/general-reading)가 결과 URL을 덮어씀.
  };

  const handleSelect = async spreadId => {
    // 네이티브: 1세트(10번)당 1번만 광고. 광고 턴에서는 반드시 시청해야만 진행(취소 후 다른 질문 눌러도 광고 필수).
    if (isNative) {
      const deviceId = userInfo?.email ? null : await getDeviceId();
      const userKey = getGeneralReadingAdCountKey(userInfo?.email, deviceId);
      if (!userKey) {
        proceedWithSpread(spreadId);
        return;
      }
      const state = await getGeneralReadingAdState(userKey);
      // 광고 턴에서 취소한 상태면 무조건 광고 모달 — 시청해야만 카운터 진행
      if (state.adTurnPending) {
        setPendingSpreadId(spreadId);
        setShowAdConfirmModal(true);
        return;
      }
      const nextPosition = state.countInCurrentSet + 1; // 1~10 (세트 내 순서)
      const shouldShowAd = nextPosition === state.adPositionInSet;
      if (shouldShowAd) {
        await setGeneralReadingAdTurnPending(userKey, true);
        setPendingSpreadId(spreadId);
        setShowAdConfirmModal(true);
        return;
      }
      await advanceGeneralReadingAdState(userKey);
      proceedWithSpread(spreadId);
      return;
    }
    proceedWithSpread(spreadId);
  };

  const handleAdConfirm = async () => {
    if (!pendingSpreadId) return;
    onMarkAdConfirmShown?.();
    setShowAdConfirmModal(false);
    setIsAdLoading(true);
    const deviceId = userInfo?.email ? null : await getDeviceId();
    const userKey = getGeneralReadingAdCountKey(userInfo?.email, deviceId);
    showInterstitialForGeneralReading(userInfo || {}, async wasShown => {
      setIsAdLoading(false);
      // 광고를 실제로 시청한 경우에만 세트 진행(기록) 후 결과 화면으로 진행
      if (wasShown) {
        if (userKey) await advanceGeneralReadingAdState(userKey);
        proceedWithSpread(pendingSpreadId);
        setPendingSpreadId(null);
      } else {
        // 로드 실패 시 광고 확인 모달 다시 표시 (재시도/취소 가능)
        setShowAdConfirmModal(true);
      }
    });
  };

  const handleAdCancel = () => {
    setShowAdConfirmModal(false);
    setPendingSpreadId(null);
    // 취소 시 리딩 진입 불가 — 스프레드 선택 화면에 머무름
  };

  return (
    <div
      className={`${styles.root} ${isAdLoading ? styles.rootAdLoading : ''}`.trim()}
    >
      <div
        className={styles.backdrop}
        onClick={onClose}
        onTouchStart={onClose}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="general-spread-choice-title"
        data-lang={lang}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="general-spread-choice-title" className={styles.title}>
          {t('generalReading.spreadTitle')}
        </h2>
        {questionText && (
          <p className={styles.questionSummary}>{questionText}</p>
        )}
        <div className={styles.cardGrid}>
          {spreadOrder.map((spreadId, index) => {
            const number = index + 1;
            const spread = SPREAD_OPTIONS.find(s => s.id === spreadId);
            const label = spread?.name?.[lang] || spread?.name?.ko || spreadId;
            return (
              <button
                key={`${spreadId}-${number}`}
                type="button"
                className={styles.card}
                onClick={() => handleSelect(spreadId)}
                aria-label={`${number}. ${label}`}
              >
                <span className={styles.cardNumber}>{number}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('common.close')}
        >
          {t('common.cancel')}
        </button>
      </div>
      {/* 광고 로딩 중: 확인 클릭 후 전면광고가 뜨기 전까지 클릭 차단 */}
      {isAdLoading && (
        <div
          className={styles.adLoadingOverlay}
          role="alert"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={styles.adLoadingBackdrop} aria-hidden="true" />
          <div className={styles.adLoadingContent}>
            <p className={styles.adLoadingText}>
              {t('generalReading.adLoading')}
            </p>
          </div>
        </div>
      )}
      {/* isNative: 1~5번 선택 시 광고 시청 확인 모달 (매번 표시) */}
      {showAdConfirmModal && (
        <div className={styles.adConfirmOverlay}>
          <div
            className={styles.adConfirmBackdrop}
            onClick={handleAdCancel}
            aria-hidden="true"
          />
          <div
            className={styles.adConfirmModal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ad-confirm-title"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="ad-confirm-title" className={styles.adConfirmTitle}>
              {t('generalReading.watchAdConfirmTitle')}
            </h3>
            <p className={styles.adConfirmText}>
              {t('generalReading.watchAdConfirm')}
            </p>
            <div className={styles.adConfirmBtnBox}>
              <Button onClick={handleAdConfirm} disabled={isAdLoading}>
                {isAdLoading ? '...' : t('button.view-ads')}
              </Button>
              <button
                type="button"
                className={styles.adConfirmCancel}
                onClick={handleAdCancel}
                disabled={isAdLoading}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralReadingSpreadChoiceModal;
