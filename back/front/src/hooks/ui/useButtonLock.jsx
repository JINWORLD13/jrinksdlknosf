import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { preferenceForLockButton } from '../../utils/storage/tokenPreference';
import { localStorageForLockButton } from '../../utils/storage/tokenLocalStorage';

// 네이티브 플랫폼 여부 확인
const isNative = Capacitor.isNativePlatform();
const storageUtil = isNative
  ? preferenceForLockButton
  : localStorageForLockButton;

const useButtonLock = ({
  maxClicks = 5,
  particalLockDuration = 60 * 60 * 1000, // 1시간
  lockDuration = maxClicks * 60 * 60 * 1000, // 5시간
  uniqueId = undefined,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [partialUnlockTime, setPartialUnlockTime] = useState(0);
  const [partialRemainingTime, setPartialRemainingTime] = useState(0);

  const STORAGE_KEY = useMemo(
    () => (uniqueId ? `buttonLockData_${uniqueId}` : 'buttonLockData_default'),
    [uniqueId]
  );
  const transferRemainigTimeToClickCount = parsedData => {
    const remainigHour = parsedData.unlockTime / particalLockDuration;
    const remainigMinutes = parsedData.unlockTime % particalLockDuration;
    let transferedClickCount;
    if (remainigMinutes !== 0) transferedClickCount = 1 + remainigHour;
    if (remainigMinutes === 0) transferedClickCount = 0 + remainigHour;
    return transferedClickCount;
  };
  // 초기화: 로컬 스토리지에서 데이터 복원
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        const savedData = await storageUtil.getItem(STORAGE_KEY);
        const parsedData = savedData ? JSON.parse(savedData) : null;
        if (
          parsedData &&
          parsedData.unlockTime &&
          parsedData.unlockTime > Date.now()
        ) {
          //! 여기서 세부적으로 시간별로 나눌까?
          const clickedCount = transferRemainigTimeToClickCount(parsedData);
          setUnlockTime(parsedData.unlockTime);
          setClickCount(clickedCount || parsedData.clickCount || 0);
          if (
            parsedData.clickCount >= maxClicks &&
            parsedData.unlockTime > Date.now() + particalLockDuration * 4
          )
            setIsLocked(parsedData.isLocked || true);
        } else if (
          parsedData &&
          parsedData.unlockTime &&
          parsedData.unlockTime < Date.now()
        ) {
          setIsLocked(false);
          setUnlockTime(null);
          setClickCount(0);
          setRemainingTime(null);
          await storageUtil.removeItem(STORAGE_KEY);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Storage initialization error:', error);
        setIsInitialized(true);
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    };
    initialize();
  }, [STORAGE_KEY]);

  // 상태 저장
  useEffect(() => {
    if (!isInitialized) return;

    const saveData = async () => {
      try {
        if (isLocked || (clickCount >= 0 && unlockTime >= 0)) {
          await storageUtil.setItem(
            STORAGE_KEY,
            JSON.stringify({
              unlockTime,
              clickCount,
              isLocked,
            })
          );
        } else {
          await storageUtil.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save lock data:', error);
      }
    };
    saveData();
  }, [clickCount, isLocked, unlockTime, STORAGE_KEY, isInitialized]);

  // 클릭 핸들러(lock상태 설정 및 unlockTime 설정)
  // (그래서 광고 다 보고나서 실행됨)
  const handleClick = async () => {
    if (isLoading || isLocked) return; // 로딩 중이거나 잠금 상태면 클릭 무시

    const newCount = clickCount + 1;
    setClickCount(newCount);

    //! 여기서 클릭별로 세부적으로 나눌까?
    if (newCount >= 1) {
      if (newCount >= maxClicks && clickCount >= 4) setIsLocked(true);
      let unlockTimestamp;
      if (newCount === 1) {
        unlockTimestamp = Date.now() + particalLockDuration;
      } else {
        unlockTimestamp = unlockTime + particalLockDuration;
      }
      setUnlockTime(unlockTimestamp);
    }
  };

  // 타이머: 잠금 해제 시간 관리(remaining time 설정)
  useEffect(() => {
    let timer;

    //! unlockTime 말고 클릭으로 할까?
    if (unlockTime) {
      timer = setInterval(async () => {
        const timeLeft = unlockTime - Date.now();
        if (timeLeft <= 0) {
          setIsLocked(false);
          setUnlockTime(null);
          setClickCount(0);
          setRemainingTime(null);
          try {
            await storageUtil.removeItem(STORAGE_KEY);
          } catch (error) {
            console.error('Failed to remove lock data:', error);
          }
        } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          if (!(hours >= maxClicks) && !(hours === 4 && minutes > 0)) {
            setIsLocked(false);
          } else {
            setIsLocked(true);
          }
          setClickCount(() => {
            if (hours > 5) return 5;
            if (minutes <= 0) return hours;
            return hours + 1;
          });
          setRemainingTime(
            `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          );
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [unlockTime, STORAGE_KEY]);

  return {
    clickCount,
    isLocked,
    remainingTime,
    handleClick,
    isLoading, // 로딩 상태 반환
  };
};

export default useButtonLock;
