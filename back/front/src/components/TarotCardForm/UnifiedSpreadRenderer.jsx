/**
 * 통합 스프레드 렌더러
 *
 * 모든 스프레드를 일관된 방식으로 렌더링합니다.
 * mode에 따라 적절한 컴포넌트와 스타일을 적용합니다.
 *
 * @param {Object} props
 * @param {Object} props.spreadInfo - 스프레드 정보 { spreadListNumber, selectedTarotCardsArr, ... }
 * @param {string} props.mode - 'spread-modal' | 'answer-modal' | 'speed-tarot'
 * @param {Object} props.selectedCardPosition - 선택된 카드 위치
 * @param {Function} props.setSelectedCardPosition - 선택된 카드 위치 설정 함수
 * @param {Object} props.cardForm - 카드 폼 상태 (speed-tarot용)
 * @param {Function} props.updateCardForm - 카드 폼 업데이트 함수 (speed-tarot용)
 */
import React from 'react';
import {
  SingleCard,
  TwoCards,
  TwoCardsBinaryChoice,
  ThreeCards,
  ThreeCardsTime,
  ThreeCardsSolution,
  ThreeCardsADay,
  ThreeCardsThreeWayChoice,
  FourCards,
  FiveCardsRelationship,
  SixCardsSixPeriods,
  CelticCrossForAnswer,
  SingleCardForModal,
  TwoCardsForModal,
  TwoCardsBinaryChoiceForModal,
  ThreeCardsForModal,
  ThreeCardsTimeForModal,
  ThreeCardsSolutionForModal,
  ThreeCardsADayForModal,
  ThreeCardsThreeWayChoiceForModal,
  FourCardsForModal,
  FiveCardsRelationshipForModal,
  SixCardsTimesForModal,
  CelticCrossForModal,
} from './TarotCardTableForm.jsx';
import OneCardSpreadForm from './TarotCardSpreadForm/OneCardSpreadForm.jsx';
import TwoCardsSpreadForm from './TarotCardSpreadForm/TwoCardsSpreadForm.jsx';
import TwoCardsBinaryChoiceSpreadForm from './TarotCardSpreadForm/TwoCardsBinaryChoiceSpreadForm.jsx';
import ThreeCardsSpreadForm from './TarotCardSpreadForm/ThreeCardsSpreadForm.jsx';
import ThreeCardsTimeSpreadForm from './TarotCardSpreadForm/ThreeCardsTimeSpreadForm.jsx';
import ThreeCardsSolutionSpreadForm from './TarotCardSpreadForm/ThreeCardsSolutionSpreadForm.jsx';
import ThreeCardsADaySpreadForm from './TarotCardSpreadForm/ThreeCardsADaySpreadForm.jsx';
import ThreeCardsThreeWayChoiceSpreadForm from './TarotCardSpreadForm/ThreeCardsThreeWayChoiceSpreadForm.jsx';
import FourCardsSpreadForm from './TarotCardSpreadForm/FourCardsSpreadForm.jsx';
import FiveCardsRelationshipSpreadForm from './TarotCardSpreadForm/FiveCardsRelationshipSpreadForm.jsx';
import SixCardsTimeSpreadForm from './TarotCardSpreadForm/SixCardsTimeSpreadForm.jsx';
import CelticCrossSpreadForm from './TarotCardSpreadForm/CelticCrossSpreadForm.jsx';

const UnifiedSpreadRenderer = ({
  spreadInfo,
  mode = 'answer-modal',
  selectedCardPosition,
  setSelectedCardPosition,
  cardForm,
  updateCardForm,
}) => {
  const spreadListNumber = spreadInfo?.spreadListNumber;

  if (!spreadListNumber) {
    console.warn('UnifiedSpreadRenderer: spreadListNumber is required');
    return null;
  }

  // 공통 props
  const commonProps = {
    spreadInfo,
    selectedCardPosition,
    setSelectedCardPosition,
  };

  const className = mode === 'spread-modal' ? 'spread-modal' : 'answer-modal';

  // mode에 따라 적절한 컴포넌트 렌더링
  switch (mode) {
    case 'spread-modal':
      // SpreadModal 미리보기용 (뒷면만 표시)
      switch (spreadListNumber) {
        case 100:
          return <SingleCardForModal className={className} />;
        case 200:
          return <TwoCardsForModal className={className} />;
        case 201:
          return <TwoCardsBinaryChoiceForModal className={className} />;
        case 300:
          return <ThreeCardsForModal className={className} />;
        case 301:
          return <ThreeCardsTimeForModal className={className} />;
        case 302:
          return <ThreeCardsSolutionForModal className={className} />;
        case 303:
          return <ThreeCardsADayForModal className={className} />;
        case 304:
          return <ThreeCardsThreeWayChoiceForModal className={className} />;
        case 400:
          return <FourCardsForModal className={className} />;
        case 501:
          return <FiveCardsRelationshipForModal className={className} />;
        case 600:
        case 601:
        case 602:
          return <SixCardsTimesForModal className={className} />;
        case 1000:
          return <CelticCrossForModal className={className} />;
        default:
          return null;
      }

    case 'answer-modal':
      // AnswerModal용 (앞면 카드 표시)
      switch (spreadListNumber) {
        case 100:
          return <SingleCard className={className} {...commonProps} />;
        case 200:
          return <TwoCards className={className} {...commonProps} />;
        case 201:
          return (
            <TwoCardsBinaryChoice className={className} {...commonProps} />
          );
        case 300:
          return <ThreeCards className={className} {...commonProps} />;
        case 301:
          return <ThreeCardsTime className={className} {...commonProps} />;
        case 302:
          return <ThreeCardsSolution className={className} {...commonProps} />;
        case 303:
          return <ThreeCardsADay className={className} {...commonProps} />;
        case 304:
          return (
            <ThreeCardsThreeWayChoice className={className} {...commonProps} />
          );
        case 400:
          return <FourCards className={className} {...commonProps} />;
        case 501:
          return (
            <FiveCardsRelationship className={className} {...commonProps} />
          );
        case 600:
        case 601:
        case 602:
          return <SixCardsSixPeriods className={className} {...commonProps} />;
        case 1000:
          return (
            <CelticCrossForAnswer className={className} {...commonProps} />
          );
        default:
          return null;
      }

    case 'speed-tarot':
      // SpeedTarot용 (flip 기능 포함)
      const speedTarotProps = {
        cardForm,
        updateCardForm,
        selectedCardPosition,
        setSelectedCardPosition,
      };
      switch (spreadListNumber) {
        case 100:
          return <OneCardSpreadForm {...speedTarotProps} />;
        case 200:
          return <TwoCardsSpreadForm {...speedTarotProps} />;
        case 201:
          return <TwoCardsBinaryChoiceSpreadForm {...speedTarotProps} />;
        case 300:
          return <ThreeCardsSpreadForm {...speedTarotProps} />;
        case 301:
          return <ThreeCardsTimeSpreadForm {...speedTarotProps} />;
        case 302:
          return <ThreeCardsSolutionSpreadForm {...speedTarotProps} />;
        case 303:
          return <ThreeCardsADaySpreadForm {...speedTarotProps} />;
        case 304:
          return <ThreeCardsThreeWayChoiceSpreadForm {...speedTarotProps} />;
        case 400:
          return <FourCardsSpreadForm {...speedTarotProps} />;
        case 501:
          return <FiveCardsRelationshipSpreadForm {...speedTarotProps} />;
        case 600:
        case 601:
        case 602:
          return <SixCardsTimeSpreadForm {...speedTarotProps} />;
        case 1000:
          return <CelticCrossSpreadForm {...speedTarotProps} />;
        default:
          return null;
      }

    default:
      return null;
  }
};

export default UnifiedSpreadRenderer;
