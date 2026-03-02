import React, { createContext, useContext, useRef, useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const ModalBackHandlerContext = createContext(null);

export const ModalBackHandlerProvider = ({ children }) => {
  const modalStackRef = useRef([]);
  const backButtonListenerRef = useRef(null);
  const escKeyListenerRef = useRef(null);

  // 백 버튼 및 ESC 키 리스너 설정
  useEffect(() => {
    // ESC 키 핸들러
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        
        // 가장 최상위 모달의 핸들러 호출
        const topModal = modalStackRef.current[modalStackRef.current.length - 1];
        if (topModal && topModal.handler) {
          topModal.handler();
        }
      }
    };

    escKeyListenerRef.current = handleEscKey;
    window.addEventListener('keydown', handleEscKey, true);

    // Capacitor 백 버튼 핸들러
    if (Capacitor.isNativePlatform()) {
      const setupBackButtonListener = async () => {
        backButtonListenerRef.current = await App.addListener('backButton', () => {
          // 가장 최상위 모달의 핸들러 호출
          const topModal = modalStackRef.current[modalStackRef.current.length - 1];
          if (topModal && topModal.handler) {
            topModal.handler();
          }
        });
      };
      setupBackButtonListener();
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey, true);
      if (backButtonListenerRef.current) {
        backButtonListenerRef.current.remove();
      }
    };
  }, []);

  // 모달 등록
  const registerModal = (modalId, handler) => {
    modalStackRef.current.push({ id: modalId, handler });
  };

  // 모달 등록 해제
  const unregisterModal = (modalId) => {
    modalStackRef.current = modalStackRef.current.filter(
      (modal) => modal.id !== modalId
    );
  };

  return (
    <ModalBackHandlerContext.Provider
      value={{ registerModal, unregisterModal }}
    >
      {children}
    </ModalBackHandlerContext.Provider>
  );
};

export const useModalBackHandler = () => {
  const context = useContext(ModalBackHandlerContext);
  if (!context) {
    throw new Error(
      'useModalBackHandler must be used within ModalBackHandlerProvider'
    );
  }
  return context;
};

