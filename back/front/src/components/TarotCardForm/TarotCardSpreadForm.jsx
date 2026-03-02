import React from 'react';
import SpreadRenderer from './SpreadRendererMain.jsx';

//! 스피드 타로에서 타로 스프레드(뒤집은 카드들)
const TarotCardSpreadForm = props => {
  const spreadInfo = {
    spreadListNumber: props?.questionForm?.spreadListNumber,
  };

  return (
    <SpreadRenderer
      spreadInfo={spreadInfo}
      mode="speed-tarot"
      cardForm={props?.cardForm}
      updateCardForm={props?.updateCardForm}
      selectedCardPosition={props?.selectedCardPosition}
      setSelectedCardPosition={props?.setSelectedCardPosition}
    />
  );
};

export default TarotCardSpreadForm;
