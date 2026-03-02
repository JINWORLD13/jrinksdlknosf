import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { InviteButton } from './InviteButton';
import { buildReferralLink } from '../../../utils/share/buildReferralLink';
import { inviteShare } from '../../../utils/share/inviteShare';
import { shareInstagramStory } from '../../../utils/share/shareInstagramStory';
import { shareLine } from '../../../utils/share/shareLine';
import { shareWhatsApp } from '../../../utils/share/shareWhatsApp';
import { copyInviteLink } from '../../../utils/share/copyInviteLink';
import { buildInviteContent } from '../../../utils/share/buildInviteContent';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '../../../contexts/ModalBackHandlerContext';
import { X } from 'lucide-react';
import styles from './InviteButton.module.scss';

const isNative = Capacitor.isNativePlatform();

export default function Invite({
  modalForm,
  answerForm,
  isReadyToShowDurumagi,
  userInfo,
  cardForm,
  todayCardIndexInLocalStorage,
  isClickedForTodayCardFromHome,
  isTokenFromNavbar,
  setIsInviteOpen,
  updateCopyBlinkModalOpen,
  ...props
}) {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const [isClickedForInvite, setClickedForInvite] = useState(false);
  const [isConditionMet, setConditionMet] = useState(false);
  const { registerModal, unregisterModal } = useModalBackHandler();

  // 조건 체크 useEffect - Spread와 동일한 로직
  useEffect(() => {
    // Navbar의 로그인 감지 기능(useAuth) 사용
    if (!isTokenFromNavbar) {
      setConditionMet(false);
      return;
    }
    setConditionMet(
      !modalForm?.spread &&
        !modalForm?.tarot &&
        !answerForm?.isWaiting &&
        !answerForm?.isAnswered &&
        !isReadyToShowDurumagi &&
        userInfo?.email !== '' &&
        userInfo?.email !== undefined &&
        userInfo?.email !== null &&
        Object.keys(userInfo || {}).length > 0
    );
  }, [
    userInfo?.email,
    modalForm?.spread,
    modalForm?.tarot,
    answerForm?.isWaiting,
    answerForm?.isAnswered,
    isReadyToShowDurumagi,
    isTokenFromNavbar,
  ]);

  // Invite modal state
  const [isInviteOpen, setInviteOpen] = useState(false);
  const handleOpenInvite = () => {
    setInviteOpen(true);
    setIsInviteOpen?.(true); // 외부 상태도 동시에 업데이트
  };
  const handleCloseInvite = useCallback(() => {
    setInviteOpen(false);
    setIsInviteOpen?.(false); // 외부 상태도 동시에 업데이트
  }, [setIsInviteOpen]);

  // ESC 키 및 디바이스 백 버튼 핸들러 등록
  useEffect(() => {
    if (isInviteOpen) {
      const modalId = 'invite-modal';
      registerModal(modalId, handleCloseInvite);

      return () => {
        unregisterModal(modalId);
      };
    }
  }, [isInviteOpen, registerModal, unregisterModal, handleCloseInvite]);

  // Build share URL
  const buildShareUrl = () =>
    buildReferralLink({ userId: userInfo?.id, lang: browserLanguage });

  // Share handlers
  const handleShareViaInstagram = async () => {
    const shareUrl = buildShareUrl();
    const { text } = buildInviteContent({
      t,
      includeNotice: isNative,
      includeDownload: false,
    });

    await shareInstagramStory({
      text: text,
      url: shareUrl,
      t,
      logoUrl: '/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png',
    });
  };

  const handleShareInviteOriginal = async () => {
    const shareUrl = buildShareUrl();
    const { text } = buildInviteContent({
      t,
      includeNotice: isNative,
      includeDownload: isNative,
    });

    if (isNative) {
      await inviteShare({
        text,
        url: shareUrl,
        t,
      });
      return;
    }

    // Web: Copy full message (text + url) to clipboard
    try {
      const copied = await copyInviteLink({
        text,
        url: shareUrl,
        t,
      });
      if (!isNative && copied) {
        // Then attempt to open the native share sheet if available
        if (
          typeof navigator !== 'undefined' &&
          typeof navigator.share === 'function'
        ) {
          const inviteUrlLabel = t(`share.invite_url_label`);
          await navigator.share({
            text: `${text}\n\n${inviteUrlLabel}\n${shareUrl}`,
          });
        }
      }
    } catch (_) {}
  };

  const handleShareViaLine = () => {
    const shareUrl = buildShareUrl();
    const { text } = buildInviteContent({
      t,
      includeNotice: isNative,
      includeDownload: isNative,
    });
    shareLine({ text: text, url: shareUrl, t });
  };

  const handleShareViaWhatsApp = () => {
    const shareUrl = buildShareUrl();
    const { text } = buildInviteContent({
      t,
      includeNotice: isNative,
      includeDownload: isNative,
    });
    shareWhatsApp({ text: text, url: shareUrl, t });
  };

  const handleCopyLink = async () => {
    const shareUrl = buildShareUrl();
    const { text } = buildInviteContent({
      t,
      includeNotice: isNative,
      includeDownload: isNative,
    });

    const ok = await copyInviteLink({
      text,
      url: shareUrl,
      t,
    });
    if (!isNative && ok && typeof updateCopyBlinkModalOpen === 'function')
      updateCopyBlinkModalOpen(true);
  };

  return (
    <>
      {isConditionMet && !isClickedForTodayCardFromHome && (
        <InviteButton
          isToken={isTokenFromNavbar}
          isClickedForInvite={isClickedForInvite}
          setClickedForInvite={setClickedForInvite}
          onOpenInvite={handleOpenInvite}
        />
      )}

      {/* Invite Modal */}
      {isInviteOpen && (
        <div
          className={styles['inviteModalOverlay']}
          onClick={handleCloseInvite}
        >
          <div
            className={`${styles['inviteModal']} ${
              browserLanguage === 'ja' ? styles['inviteModalJa'] : ''
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div
              className={`${styles['inviteTitle']} ${
                browserLanguage === 'ja' ? styles['inviteTitleJa'] : ''
              }`}
            >
              {t('share.invite_title') || 'Cosmos Tarot'}
            </div>
            <div
              className={`${styles['inviteDesc']} ${
                browserLanguage === 'ja' ? styles['inviteDescJa'] : ''
              } ${browserLanguage === 'en' ? styles['inviteDescEn'] : ''}`}
            >
              {t('share.invite_desc') ||
                'Share your invite link or copy it to send to friends.'}
            </div>
            <div
              className={`${styles['inviteDesc']} ${
                browserLanguage === 'ja' ? styles['inviteDescJa'] : ''
              } ${browserLanguage === 'en' ? styles['inviteDescEn'] : ''}`}
              style={{ marginTop: -6 }}
            >
              {t('share.reward_notice') ||
                'Complete login via this invite and receive a 1 C.V voucher.'}
            </div>
            <div
              className={`${styles['inviteButtons']} ${
                browserLanguage === 'ja' ? styles['inviteButtonsJa'] : ''
              }`}
            >
              <button onClick={handleShareInviteOriginal}>
                {t('share.invite_button') || '친구 초대'}
              </button>
              {/* {!isNative && (
                <button onClick={handleShareViaInstagram}>
                  {t('share.instagram') || 'Instagram'}
                </button>
              )} */}
              {!isNative && (
                <button onClick={handleShareViaLine}>
                  {t('share.line') || 'LINE'}
                </button>
              )}
              {!isNative && (
                <button onClick={handleShareViaWhatsApp}>
                  {t('share.whatsapp') || 'WhatsApp'}
                </button>
              )}
              <button onClick={handleCopyLink}>
                {t('button.copy') || 'Copy'}
              </button>
            </div>
            <button
              className={styles['inviteClose']}
              onClick={handleCloseInvite}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
