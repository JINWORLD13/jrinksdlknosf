import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 메뉴 열고 닫기 및 외부 클릭 감지를 처리하는 커스텀 훅
 * @returns {Object} 메뉴 상태와 ref, 핸들러 함수들
 */
const useMenuManager = () => {
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isIconMenuOpen, setIconMenuOpen] = useState(false);
  const [isMusicMenuOpen, setMusicMenuOpen] = useState(false);

  const browserLanguageRef = useRef(null);
  const browserIconRef = useRef(null);
  const browserDropBoxRef = useRef(null);
  const browserMusicRef = useRef(null);
  const browserMusicBoxRef = useRef(null); // 볼륨 조절창 ref

  // ref 정리
  useEffect(() => {
    return () => {
      browserLanguageRef.current = null;
      browserIconRef.current = null;
      browserDropBoxRef.current = null;
      browserMusicRef.current = null;
      browserMusicBoxRef.current = null;
    };
  }, []);

  // 외부 클릭 시 닫기 (아이콘 메뉴)
  const handleIconMenuClose = useCallback(
    e => {
      if (!isIconMenuOpen) return;

      const clickedInIcon =
        browserIconRef.current && browserIconRef.current.contains(e.target);
      const clickedInBox =
        browserDropBoxRef.current &&
        browserDropBoxRef.current.contains(e.target);

      if (!clickedInIcon && !clickedInBox) {
        setIconMenuOpen(false);
      }
    },
    [isIconMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleIconMenuClose);
    return () => document.removeEventListener('click', handleIconMenuClose);
  }, [handleIconMenuClose]);

  // 외부 클릭 시 닫기 (언어 메뉴)
  const handleMenuClose = useCallback(
    e => {
      if (!isLanguageMenuOpen) return;

      const clickedInMenu =
        browserLanguageRef.current &&
        browserLanguageRef.current.contains(e.target);

      if (!clickedInMenu) {
        setLanguageMenuOpen(false);
      }
    },
    [isLanguageMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleMenuClose);
    return () => document.removeEventListener('click', handleMenuClose);
  }, [handleMenuClose]);

  // 외부 클릭 시 닫기 (음악 메뉴)
  const handleMusicMenuClose = useCallback(
    e => {
      if (!isMusicMenuOpen) return;

      const clickedInIcon =
        browserMusicRef.current && browserMusicRef.current.contains(e.target);
      const clickedInBox =
        browserMusicBoxRef.current &&
        browserMusicBoxRef.current.contains(e.target);

      if (!clickedInIcon && !clickedInBox) {
        setMusicMenuOpen(false);
      }
    },
    [isMusicMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleMusicMenuClose);
    return () => document.removeEventListener('click', handleMusicMenuClose);
  }, [handleMusicMenuClose]);

  return {
    isLanguageMenuOpen,
    setLanguageMenuOpen,
    isIconMenuOpen,
    setIconMenuOpen,
    isMusicMenuOpen,
    setMusicMenuOpen,
    browserLanguageRef,
    browserIconRef,
    browserDropBoxRef,
    browserMusicRef,
    browserMusicBoxRef,
  };
};

export default useMenuManager;
