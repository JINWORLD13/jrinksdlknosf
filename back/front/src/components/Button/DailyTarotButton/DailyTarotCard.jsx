// 시나리오 1: 사용자가 11:59에 앱을 백그라운드로 → 12:30에 다시 실행
// → appStateChange 리스너가 날짜 변경을 감지

// 시나리오 2: 앱이 활성 상태에서 자정 넘김
// → setInterval과 setTimeout이 정확한 시점 감지

// 시나리오 3: 화면 잠금 후 다음날 앱 실행
// → 포그라운드 복귀 시 모든 리스너가 작동하여 확실히 감지

import React, { useEffect, useState, useRef, useCallback } from 'react';
import TarotCardChoiceForm from '../../TarotCardForm/TarotCardChoiceForm';
import OneCardSpreadForm from '../../TarotCardForm/TarotCardSpreadForm/OneCardSpreadForm';
import DailyTarotFortune from './DailyTarotFortune';
import { DailyCardButton } from './DailyCardButton';
import { getTodayCardForNative } from '../../../utils/storage/tokenPreference';
import { getTodayCard } from '../../../utils/storage/tokenLocalStorage';
import { Capacitor } from '@capacitor/core';
// 네이티브 앱용 - 앱이 포그라운드로 돌아올 때 체크
import { App } from '@capacitor/app';
import { isDevelopmentMode } from '@/utils/constants';
import dailyTarotStyles from './DailyTarotFortune.module.scss';

const isNative = Capacitor.isNativePlatform();

const DailyTarotCard = ({
  modalForm,
  answerForm,
  isReadyToShowDurumagi,
  userInfo,
  cardForm,
  todayCardIndexInLocalStorage,
  setTodayCardIndexInLocalStorage,
  styles,
  handleStateGroup,
  updateCardForm,
  stateGroup,
  setStateGroup,
  setClickedForTodayCardFromHome,
  isTokenFromNavbar,
}) => {
  const [isClickedForTodayCard, setClickedForTodayCard] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [forceUpdate, setForceUpdate] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setClickedForTodayCardFromHome(isClickedForTodayCard);
  }, [isClickedForTodayCard]);

  // 조건 체크 함수 - Navbar의 로그인 감지 기능(useAuth) 사용
  const isConditionMet = () => {
    return (
      isTokenFromNavbar &&
      !modalForm?.spread &&
      !modalForm?.tarot &&
      !answerForm?.isWaiting &&
      !answerForm?.isAnswered &&
      !isReadyToShowDurumagi &&
      userInfo?.email !== '' &&
      userInfo?.email !== undefined &&
      userInfo?.email !== null &&
      Object.keys(userInfo || {}).length > 0 // userInfo 자체가 비어있는지 체크
    );
  };

  // 조건 체크 함수
  const isCardChoiceConditionMet = () => {
    return isClickedForTodayCard && isConditionMet();
  };

  const checkIfNewDay = async userInfo => {
    if (!userInfo?.email || !userInfo?.id) return false;

    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      const result = await getTodayCardForNative(userInfo);
      return result === null;
    } else {
      const result = getTodayCard(userInfo);
      return result === null;
    }
  };

  // Refs for stable access in effects/callbacks
  const updateCardFormRef = useRef(updateCardForm);
  const setTodayCardIndexInLocalStorageRef = useRef(
    setTodayCardIndexInLocalStorage
  );
  const setClickedForTodayCardRef = useRef(setClickedForTodayCard);
  const userInfoRef = useRef(userInfo);

  // Update refs when props change
  useEffect(() => {
    updateCardFormRef.current = updateCardForm;
    setTodayCardIndexInLocalStorageRef.current =
      setTodayCardIndexInLocalStorage;
    setClickedForTodayCardRef.current = setClickedForTodayCard;
    userInfoRef.current = userInfo;
  }, [
    updateCardForm,
    setTodayCardIndexInLocalStorage,
    setClickedForTodayCard,
    userInfo,
  ]);

  // 날짜 변경을 처리하는 함수
  const handleDateChange = useCallback(async () => {
    const email = userInfoRef.current?.email;
    if (!email) return;

    if (isDevelopmentMode) {
      console.log('Date changed. Resetting state.');
    }

    // 모든 관련 상태 초기화
    setClickedForTodayCardRef.current(false);
    updateCardFormRef.current(prevCardForm => ({
      ...prevCardForm,
      shuffle: 0,
      isReadyToShuffle: false,
      isShuffleFinished: false,
      spread: false,
      flippedIndex: [],
      selectedCardIndexList: [],
    }));

    // 오늘의 카드 인덱스도 초기화 (새로운 날에는 새 카드를 뽑을 수 있도록)
    if (setTodayCardIndexInLocalStorageRef.current) {
      setTodayCardIndexInLocalStorageRef.current(null);
    }

    // 강제 리렌더링
    setForceUpdate(prev => prev + 1);
  }, []); // Empty dependencies as we use refs

  // 실시간 날짜 감시
  useEffect(() => {
    if (!userInfo?.email) return;

    // 현재 시간을 기준으로 다음 자정까지의 시간 계산
    const scheduleNextMidnightCheck = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // 정확히 자정

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      // 자정 후 즉시 체크하는 타이머 (50ms 후)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const newDate = new Date().toDateString();
        if (isDevelopmentMode) {
          console.log(
            `자정 체크: ${new Date().toLocaleTimeString()} - 날짜 변경: ${
              currentDate !== newDate
            }`
          );
        }
        if (currentDate !== newDate) {
          setCurrentDate(newDate);
          handleDateChange();
        }
        // 다음 자정을 위해 다시 스케줄링
        scheduleNextMidnightCheck();
      }, timeUntilMidnight + 50); // 자정 + 50ms

      // console.log(
      //   `다음 자정 체크: ${tomorrow.toLocaleString()}, ${Math.round(
      //     timeUntilMidnight / 1000
      //   )}초 후`
      // );
    };

    // 1초마다 날짜 체크 (더 정확한 감지)
    const startPeriodicCheck = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const newDate = new Date().toDateString();
        if (currentDate !== newDate) {
          if (isDevelopmentMode) {
            console.log(
              `주기적 체크에서 날짜 변경 감지: ${new Date().toLocaleTimeString()}`
            );
          }
          setCurrentDate(newDate);
          handleDateChange();
        }
      }, 1000); // 1초마다 체크 (자정 전후 정확한 감지)
    };

    scheduleNextMidnightCheck();
    startPeriodicCheck();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [userInfo?.email, currentDate, handleDateChange]);

  useEffect(() => {
    let stateChangeListener;

    const setupListener = async () => {
      if (Capacitor.isNativePlatform()) {
        stateChangeListener = await App.addListener(
          'appStateChange',
          ({ isActive }) => {
            if (isActive) {
              const newDate = new Date().toDateString();
              // Access currentDate from state inside closure or ref?
              // Ideally we check Date.now() vs stored date, but here we can just update if changed.
              // Note: listeners should not depend on unstable 'currentDate' variable if possible.
              // Logic check:
              // This listener effect depends on currentDate.
              // If currentDate changes, listener is removed/added.
              // currentDate changes once a day. This is fine.
              // However, handleDateChange is now stable (empty deps).
              // So this effect is STABLE.
              if (currentDate !== newDate) {
                setCurrentDate(newDate);
                handleDateChange();
              }
            }
          }
        );
      }
    };

    setupListener();

    return () => {
      if (stateChangeListener) {
        stateChangeListener.remove();
      }
    };
  }, [currentDate, handleDateChange]);

  // 앱이 다시 활성화될 때도 체크 (모바일용)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const newDate = new Date().toDateString();
        if (currentDate !== newDate) {
          if (isDevelopmentMode) {
            console.log('Date change detected on app activate');
          }
          setCurrentDate(newDate);
          handleDateChange();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentDate, handleDateChange]);

  // ============================================
  // ESC 키 및 모바일 뒤로가기 버튼 처리
  // ============================================
  // 모달이 열린 상태에서 ESC 키(데스크톱) 또는 뒤로가기 버튼(모바일)을 누르면 모달 닫기
  useEffect(() => {
    if (!isClickedForTodayCard) return; // 모달이 열린 상태가 아니면 리스너 등록 안 함

    let backButtonListener;

    // ESC 키 이벤트 핸들러 (데스크톱)
    const handleEscKey = event => {
      if (event.key === 'Escape' && isClickedForTodayCard) {
        event.preventDefault();
        event.stopPropagation();
        setClickedForTodayCardRef.current(false);
        updateCardFormRef.current(prevCardForm => ({
          ...prevCardForm,
          shuffle: 0,
          isReadyToShuffle: false,
          isShuffleFinished: false,
          spread: false,
          flippedIndex: [],
          selectedCardIndexList: [],
        }));
      }
    };

    // 모바일 뒤로가기 버튼 핸들러
    const handleBackButton = async event => {
      // Access ref instead of closure variable
      // Wait, isClickedForTodayCard is boolean.
      // If we use ref for it, we can check it.
      // But dependency includes isClickedForTodayCard.
      // If isClickedForTodayCard changes (false -> true), listener is added.
      // If true -> false, listener removed.
      // This is correct behavior.
      // The issue was updateCardForm changing.

      // Checking local variable or ref?
      // Since effect depends on isClickedForTodayCard, 'isClickedForTodayCard' is true here.
      // So no need to check ref inside.

      setClickedForTodayCardRef.current(false);
      updateCardFormRef.current(prevCardForm => ({
        ...prevCardForm,
        shuffle: 0,
        isReadyToShuffle: false,
        isShuffleFinished: false,
        spread: false,
        flippedIndex: [],
        selectedCardIndexList: [],
      }));
    };

    // 리스너 설정
    const setupListeners = async () => {
      if (isNative) {
        // 네이티브 플랫폼: 뒤로가기 버튼 처리
        backButtonListener = await App.addListener('backButton', e => {
          handleBackButton(e);
          return false; // 기본 뒤로가기 동작 방지
        });
      } else {
        // 웹 플랫폼: ESC 키 처리
        if (typeof window !== 'undefined') {
          // capture phase에서 먼저 처리하도록 true 설정 (다른 리스너보다 우선)
          window.addEventListener('keydown', handleEscKey, true);
        }
      }
    };

    setupListeners();

    // 클린업
    return () => {
      if (isNative && backButtonListener) {
        backButtonListener.remove();
      } else if (!isNative) {
        if (typeof window !== 'undefined') {
          window.removeEventListener('keydown', handleEscKey, true);
        }
      }
    };
  }, [isClickedForTodayCard]); // Only depend on isClickedForTodayCard. Stabilized!

  return (
    <div key={forceUpdate}>
      {isConditionMet() && (
        <DailyCardButton
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
          setClickedForTodayCard={setClickedForTodayCard}
          checkIfNewDay={checkIfNewDay}
          userInfo={userInfo}
          isTokenFromNavbar={isTokenFromNavbar}
        />
      )}
      {isCardChoiceConditionMet() && (
        <div className={styles['background']}>
          {todayCardIndexInLocalStorage === null ||
          todayCardIndexInLocalStorage === undefined ? (
            <TarotCardChoiceForm
              stateGroup={stateGroup}
              setStateGroup={setStateGroup}
              handleStateGroup={handleStateGroup}
              userInfo={userInfo}
              from={1}
              todayCardIndex={todayCardIndexInLocalStorage}
              isClickedForTodayCard={isClickedForTodayCard}
              onCardSaved={setTodayCardIndexInLocalStorage}
            />
          ) : (
            <div className={dailyTarotStyles['daily-tarot-wrapper']}>
              <div className={dailyTarotStyles['daily-tarot-card-section']}>
                <OneCardSpreadForm
                  cardForm={cardForm}
                  updateCardForm={updateCardForm}
                  userInfo={userInfo}
                  from={1}
                  todayCardIndex={todayCardIndexInLocalStorage}
                />
              </div>
              <div className={dailyTarotStyles['daily-tarot-fortune-section']}>
                <DailyTarotFortune
                  cardForm={cardForm}
                  userInfo={userInfo}
                  todayCardIndex={todayCardIndexInLocalStorage}
                  checkIfNewDay={checkIfNewDay}
                  from={1}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyTarotCard;
