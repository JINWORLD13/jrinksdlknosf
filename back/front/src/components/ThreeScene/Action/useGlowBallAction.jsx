import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

export let useGlowBallAction = (
  initialActions,
  isTarotAnswerWaitingState,
  isTarotAnsweredState,
  isReadyToShowDurumagiState
) => {
  let actionsRef = useRef(initialActions);

  useEffect(() => {
    actionsRef.current = initialActions;
    return () => {
      actionsRef.current = null;
    };
  }, [initialActions]);

  let glowBallAction = useCallback(() => {
    let actions = actionsRef.current;

    actions?.GlowBallAction?.play();
    actions?.GlowBallAction001?.play();
    actions?.GlowBallAction002?.play();
    actions?.GlowBallAction003?.play();
    actions?.GlowBallAction004?.play();
  }, [
    isTarotAnswerWaitingState,
    isTarotAnsweredState,
    isReadyToShowDurumagiState,
  ]);

  useEffect(() => {
    //! isTarotAnsweredState :  true 일 때 다시 크리스탈 보는 액션 시작해서 ...
    //! if 문 조건이 두 개다. 아래의 조건은 두번째 phase에서 이뤄지는데 다시 액션 초기화 되므로 다시 호출하지 않도록 함.
    if (!isReadyToShowDurumagiState && isTarotAnsweredState) return;
    glowBallAction();

  }, [glowBallAction]);

  return null;
};
