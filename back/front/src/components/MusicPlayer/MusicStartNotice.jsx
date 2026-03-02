import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';

const MusicStartNotice = () => {
  const { t } = useTranslation();
  const [showNotice, setShowNotice] = useState(false);
  const isMusicPlaying = useSelector(
    state => state.booleanStore.isMusicPlaying
  );
  const musicVolume = useSelector(state => state.booleanStore.musicVolume);

  useEffect(() => {
    // 네이티브 앱에서는 안내 메시지를 표시하지 않음
    if (Capacitor.isNativePlatform()) {
      return;
    }

    // 음악이 켜져있고 볼륨이 0보다 크면
    if (isMusicPlaying && musicVolume > 0) {
      // localStorage에서 이전에 상호작용한 적이 있는지 확인
      const hasInteracted = localStorage.getItem('hasInteractedWithMusic');

      if (!hasInteracted) {
        // 처음 방문이면 안내 메시지 표시
        setShowNotice(true);
      }
    }
  }, [isMusicPlaying, musicVolume]);

  useEffect(() => {
    if (showNotice) {
      // 아무 곳이나 클릭하면 안내 메시지 숨기기
      const handleInteraction = () => {
        setShowNotice(false);
        localStorage.setItem('hasInteractedWithMusic', 'true');
      };

      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, {
        once: true,
      });

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [showNotice]);

  if (!showNotice) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'gold',
        padding: '12px 24px',
        borderRadius: '8px',
        border: '2px solid goldenrod',
        zIndex: 100002,
        fontSize: '1rem',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        animation: 'fadeInBounce 0.5s ease-out',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => {
        setShowNotice(false);
        localStorage.setItem('hasInteractedWithMusic', 'true');
      }}
    >
      {t('music.startNotice')}
      <style>
        {`
          @keyframes fadeInBounce {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            60% {
              opacity: 1;
              transform: translateX(-50%) translateY(5px);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default MusicStartNotice;
