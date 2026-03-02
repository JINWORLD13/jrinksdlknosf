export let cardPositionInfo = (
  selectedTarotMode,
  selectedCardPosition,
  spreadInfo,
  browserLanguage,
  t
) => {
  if (selectedTarotMode === 1) {
    if (browserLanguage === 'ja' || browserLanguage === 'ko') {
      return selectedCardPosition?.position + t(`blink_modal.card-position`);
    }
    if (browserLanguage === 'en') {
      let order;
      if (selectedCardPosition?.position === 1) order = '1st';
      if (selectedCardPosition?.position === 2) order = '2nd';
      if (selectedCardPosition?.position === 3) order = '3rd';
      if (selectedCardPosition?.position === 4) order = '4th';
      if (selectedCardPosition?.position === 5) order = '5th';
      if (selectedCardPosition?.position === 6) order = '6th';
      if (selectedCardPosition?.position === 7) order = '7th';
      if (selectedCardPosition?.position === 8) order = '8th';
      if (selectedCardPosition?.position === 9) order = '9th';
      if (selectedCardPosition?.position === 10) order = '10th';
      if (selectedCardPosition?.position === 11) order = '11th';
      if (selectedCardPosition?.position === 12) order = '12th';
      if (selectedCardPosition?.position === 13) order = '13th';
      return 'The' + ' ' + order + ' ' + 'Card';
    }
  }
  if (selectedTarotMode !== 1) {
    if (spreadInfo?.spreadListNumber >= 200) {
      if (browserLanguage === 'ja' || browserLanguage === 'ko') {
        return selectedCardPosition?.position + t(`blink_modal.card-position`);
      }
      if (browserLanguage === 'en') {
        let order;
        if (selectedCardPosition?.position === 1) order = '1st';
        if (selectedCardPosition?.position === 2) order = '2nd';
        if (selectedCardPosition?.position === 3) order = '3rd';
        if (selectedCardPosition?.position === 4) order = '4th';
        if (selectedCardPosition?.position === 5) order = '5th';
        if (selectedCardPosition?.position === 6) order = '6th';
        if (selectedCardPosition?.position === 7) order = '7th';
        if (selectedCardPosition?.position === 8) order = '8th';
        if (selectedCardPosition?.position === 9) order = '9th';
        if (selectedCardPosition?.position === 10) order = '10th';
        if (selectedCardPosition?.position === 11) order = '11th';
        if (selectedCardPosition?.position === 12) order = '12th';
        if (selectedCardPosition?.position === 13) order = '13th';
        return 'The' + ' ' + order + ' ' + 'Card';
      }
    }
  }
};
