import { useCallback, useRef, useEffect } from 'react';
import { LoopRepeat } from 'three';

const ANIMATION_DURATION = 2.5;

export const useWindowDoorAction = (
  initialActions,
  doorActionState,
  setDoorAction,
  doorClickState,
  setDoorClick,
  isLeftDoor
) => {
  const actionsRef = useRef(initialActions);

  // 컴포넌트가 마운트될 때 actions를 설정
  useEffect(() => {
    actionsRef.current = initialActions;
    return () => {
      actionsRef.current = null;
    };
  }, [initialActions]);

  const handleDoorAction = useCallback(
    e => {
      const actions = actionsRef.current;
      const actionName = isLeftDoor
        ? 'WindowLeftDoorMaterialAction'
        : 'WindowRightDoorMaterialAction';
      const action = actions?.[actionName];

      // action이 undefined인 경우 처리
      if (!action) {
        console.error(`Action ${actionName} not found`);
        return;
      }

      if (
        (doorActionState && doorClickState >= 0) ||
        (!doorActionState && doorClickState === 0)
      ) {
        action.timeScale = 1;
        action.setLoop(LoopRepeat, 1);
        action.clampWhenFinished = true;
        action.play();

        setDoorAction(false);

        if (action.time === 0) action.reset();
        if (action.time > 0 && action.time < ANIMATION_DURATION) {
          action.setLoop(LoopRepeat, 0);
        }
      } else if (!doorActionState && doorClickState >= 1) {
        action.timeScale = -1;
        action.clampWhenFinished = false;
        action.setLoop(LoopRepeat, 1);
        action.play();

        setDoorAction(true);

        if (action.time === ANIMATION_DURATION) action.reset();
        if (action.time > 0 && action.time < ANIMATION_DURATION) {
          action.setLoop(LoopRepeat, 0);
        }
      }
      setDoorClick(prev => prev + 1);
    },
    [doorActionState, setDoorAction, doorClickState, setDoorClick, isLeftDoor]
  );

  return handleDoorAction;
};

export const useWindowLeftDoorAction = (actions, ...args) =>
  useWindowDoorAction(actions, ...args, true);

export const useWindowRightDoorAction = (actions, ...args) =>
  useWindowDoorAction(actions, ...args, false);

//! 원래버전


//   initialActions,
//   doorActionState,
//   setDoorAction,
//   doorClickState,
//   setDoorClick,
//   isLeftDoor





//         setDoorAction(false);


//         setDoorAction(true);


//   return handleDoorAction;
// };


