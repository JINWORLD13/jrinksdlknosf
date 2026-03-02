import { useCallback } from 'react';

/**
 * 애니메이션 전환 로직을 관리하는 훅
 *
 * 주요 기능:
 * - 3D 모델의 각 부위별 애니메이션 전환 처리
 * - 기존 애니메이션 페이드아웃 및 새 애니메이션 시작
 * - 시간 스케일 조정 지원
 */
export const useAnimationTransitions = () => {
  /**
   * 애니메이션 전환을 처리하는 함수
   * @param {Object} actions - 애니메이션 액션 객체들
   * @param {string} targetAction - 대상 액션 이름
   * @param {number} timeScale - 시간 스케일 (재생 속도)
   * @param {Array<string>} fadeOutActions - 페이드아웃할 액션들
   */
  const transitionAnimation = useCallback(
    (actions, targetAction, timeScale, fadeOutActions) => {
      const parts = [
        'Head',
        'Body',
        'LeftArm',
        'LeftLeg',
        'RightArm',
        'RightLeg',
      ];

      parts.forEach(part => {
        // 기존 애니메이션 페이드아웃
        fadeOutActions.forEach(actionType => {
          const action = actions?.[`${actionType}${part}`];
          if (action) action.fadeOut(1);
        });

        // 새로운 애니메이션 시작
        const action = actions?.[`${targetAction}${part}`];
        if (action) {
          action.timeScale = timeScale;
          action.reset().fadeIn(2).play();
        }
      });
    },
    []
  );

  return {
    transitionAnimation,
  };
};
