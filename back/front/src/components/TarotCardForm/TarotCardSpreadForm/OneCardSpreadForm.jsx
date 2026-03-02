import React, { useEffect, useState } from 'react';
import styles from './OneCardSpreadForm.module.scss';
import {
  tarotCardImageFilesList,
  tarotCardImageFilesPathList,
} from '../../../data/images/images.jsx';
import { tarotDeck } from '../../../data/TarotCardDeck/TarotCardDeck.jsx';
import {
  useSelectedTarotCards,
  useTotalCardsNumber,
  useTarotCardDeck,
} from '@/hooks';
import { getTodayCard } from '../../../utils/storage/tokenLocalStorage.jsx';
import { getTodayCardForNative } from '../../../utils/storage/tokenPreference.jsx';
//! capacitor용
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

const OneCardSpreadForm = props => {
  const selectedTarotCards = useSelectedTarotCards();
  const totalCardsNumber = useTotalCardsNumber();
  const tarotCardDeck = useTarotCardDeck();
  const [todayCardIndexInLocalStorage, setTodayCardIndexInLocalStorage] =
    useState(() => {
      if (props?.todayCardIndex) {
        return props?.todayCardIndex;
      }
      if (!isNative) {
        const webCard = getTodayCard(props?.userInfo);
        return webCard;
      }
      if (isNative) {
        return null;
      }
    });
  // props.todayCardIndex가 변경되면 내부 state 동기화
  useEffect(() => {
    if (props?.todayCardIndex !== null && props?.todayCardIndex !== undefined) {
      setTodayCardIndexInLocalStorage(props?.todayCardIndex);
    }
  }, [props?.todayCardIndex]);

  useEffect(() => {
    const fetchTodayCard = async () => {
      try {
        const index = await getTodayCardForNative(props?.userInfo);

        // 이미 저장된 오늘의 카드가 있는 경우에만 state 업데이트
        // handleDrawCard에서 이미 저장했으므로 여기서는 가져오기만 함
        if (index !== null && index !== undefined) {
          setTodayCardIndexInLocalStorage(index);
        }
      } catch (error) {
        // 오류 발생 시 조용히 처리
      }
    };

    if (
      props?.from === 1 &&
      isNative &&
      props?.userInfo?.email !== '' &&
      props?.userInfo?.email !== undefined &&
      todayCardIndexInLocalStorage === null // 이미 값이 있으면 fetch 안함!
    ) {
      fetchTodayCard();
    }

    if (
      props?.from === 1 &&
      !isNative &&
      props?.userInfo?.email !== '' &&
      props?.userInfo?.email !== undefined
    ) {
      const storedIndex = getTodayCard(props?.userInfo);
      if (storedIndex !== null && storedIndex !== undefined) {
        setTodayCardIndexInLocalStorage(storedIndex);
      }
    }
  }, [
    isNative,
    props?.from,
    props?.userInfo?.email,
    todayCardIndexInLocalStorage,
  ]);

  const imagePath = index => {
    // 오늘의 타로 (from === 1): todayCardIndexInLocalStorage 사용
    if (
      props?.from === 1 &&
      todayCardIndexInLocalStorage !== null &&
      todayCardIndexInLocalStorage !== undefined
    ) {
      // 고유 인덱스로 원본 덱에서 카드 정보 가져오기
      const selectedCard = tarotDeck?.[todayCardIndexInLocalStorage];
      if (selectedCard) {
        const foundIndex = tarotCardImageFilesList.findIndex(
          elem => elem.split('.')[0] === selectedCard.file_name
        );
        return tarotCardImageFilesPathList[foundIndex];
      }
      // 카드를 찾지 못하면 인덱스 그대로 사용 (fallback)
      return tarotCardImageFilesPathList[todayCardIndexInLocalStorage];
    }

    // 일반 스프레드: selectedTarotCards 사용
    if (selectedTarotCards?.length !== 0) {
      const foundIndex = tarotCardImageFilesList.findIndex(
        elem =>
          elem.split('.')[0] === selectedTarotCards?.[index]?.['file_name']
      );
      return tarotCardImageFilesPathList[foundIndex];
    }
  };

  const handleFlip = selectedCardIndex => {
    props?.updateCardForm({
      ...props?.cardForm,
      flippedIndex: [...props?.cardForm?.flippedIndex, selectedCardIndex],
    });
  };

  const isCardClicked = selectedCardIndex =>
    props?.cardForm?.flippedIndex?.includes(selectedCardIndex) &&
    selectedTarotCards?.length === totalCardsNumber;

  let totalCardsNumberList = [];

  if (props?.from !== 1) {
    for (let i = 0; i < totalCardsNumber; i++) {
      totalCardsNumberList.push(i);
    }
  } else {
    // 오늘의 카드: todayCardIndexInLocalStorage만 사용 (selectedCardIndexList는 배열 위치이므로 사용 금지)
    if (
      todayCardIndexInLocalStorage !== null &&
      todayCardIndexInLocalStorage !== undefined
    ) {
      totalCardsNumberList.push(todayCardIndexInLocalStorage);
    }
  }

  return (
    <>
      <div
        className={
          props?.from === 1
            ? styles['card-single-today']
            : styles['card-single-speed']
        }
      >
        {totalCardsNumberList.map((elem, index) => {
          return (
            <div
              key={`tarot-card-${elem}-${index}`}
              className={`${styles['flip']} ${
                isCardClicked(selectedTarotCards[elem]?.index) ||
                (props?.from === 1 &&
                  todayCardIndexInLocalStorage !== null &&
                  todayCardIndexInLocalStorage !== undefined)
                  ? styles['flip-click']
                  : ''
              }`}
              onClick={() => {
                if (selectedTarotCards?.length === totalCardsNumber) {
                  handleFlip(selectedTarotCards[elem]?.index);
                }
              }}
            >
              {selectedTarotCards?.length >= elem ||
              (props?.from === 1 &&
                todayCardIndexInLocalStorage !== null &&
                todayCardIndexInLocalStorage !== undefined) ? (
                <>
                  <div
                    className={`${styles['front']} ${
                      selectedTarotCards[elem]?.reversed
                        ? styles['front-reversed']
                        : ''
                    }`}
                  >
                    <img src={imagePath(elem)} alt="front" draggable={false} />
                  </div>
                  <div className={styles['back']}>
                    <img
                      src={'/assets/images/tarot_card_back.jpg'}
                      alt="back"
                      draggable={false}
                    />
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OneCardSpreadForm;
