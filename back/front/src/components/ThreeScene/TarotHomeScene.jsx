// components/ThreeScene/TarotHomeScene.jsx
import React from 'react';
import TarotMasterScene from './Model/TarotMasterSceneFirstEdition/TarotMasterScene.jsx';

const TarotHomeScene = ({
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  updateTarotManualModalOpen,
  setReadyToShowDurumagi,
  setDoneAnimationOfBackground,
  userInfo,
  isClickedForTodayCard,
  isInviteOpen,
  onOpenReadingTypeChoice,
  onSceneReady,
  ...props
}) => {
  return (
    <>
      <TarotMasterScene
        position={[0, 0, 0]}
        stateGroup={stateGroup}
        setStateGroup={setStateGroup}
        toggleModalGroup={toggleModalGroup}
        handleStateGroup={handleStateGroup}
        setReadyToShowDurumagi={setReadyToShowDurumagi}
        updateTarotManualModalOpen={updateTarotManualModalOpen}
        setDoneAnimationOfBackground={setDoneAnimationOfBackground}
        userInfo={userInfo}
        isClickedForTodayCard={isClickedForTodayCard}
        isInviteOpen={isInviteOpen}
        onOpenReadingTypeChoice={onOpenReadingTypeChoice}
        onSceneReady={onSceneReady}
      />
    </>
  );
};

export default TarotHomeScene;
