import React, { useEffect, useState } from 'react';
import { Billboard } from '@react-three/drei';
import { LayerMaterial, Depth } from 'lamina';
import { useSpring, animated } from '@react-spring/three';
import {
  AddEquation,
  CustomBlending,
  DstAlphaFactor,
  SrcAlphaFactor,
} from 'three';

export function ExplodingGlow({
  finalScale,
  isAnswered,
  isDoneAnimationOfBackground,
  isReadyToShowDurumagi,
  setReadyToShowDurumagi,
  visibleForExplosion,
  ...props
}) {
  const [invisible, setInvisible] = useState(false);
  // console.log('check invisible : ', invisible)
  return (
    <>
      <group
        position={[0.005, 1.25, 0.85]}
        visible={visibleForExplosion && !invisible}
      >
        <mesh>
          <Glow
            finalScale={finalScale}
            isAnswered={isAnswered}
            isDoneAnimationOfBackground={isDoneAnimationOfBackground}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            setReadyToShowDurumagi={setReadyToShowDurumagi}
            visibleForExplosion={visibleForExplosion}
            setInvisible={setInvisible}
          />
        </mesh>
      </group>
    </>
  );
}

//! animatedScale의 scale은 0.3에서 2000ms 동안 finalScale로 애니메이션처럼 자연스럽게 변한다.
const Glow = ({
  color = 'white',
  initialLayerScale = 0.3,
  initialScale = 0.3,
  finalScale = 20,
  animationDuration = 2000,
  animationStartTime = 0,
  near = -2, // Depth 컴포넌트에서 깊이 기반 색상 그라데이션의 범위를 정의(그라데이션이 시작되는 가까운 지점을 정의. 이 거리보다 가까운 부분은 colorA로 지정된 색상으로 렌더링)
  far = 1.4, // Depth 컴포넌트에서 깊이 기반 색상 그라데이션의 범위를 정의(그라데이션이 끝나는 먼 지점을 정의. 이 거리보다 먼 부분은 colorB로 지정된 색상으로 렌더링)
  setReadyToShowDurumagi,
  isAnswered,
  isDoneAnimationOfBackground,
  isReadyToShowDurumagi,
  visibleForExplosion,
  setInvisible,
}) => {
  // 변경: useSpring 훅의 사용 방식을 수정
  const [{ scale }, api] = useSpring(() => ({
    from: { scale: initialScale },
    to: { scale: finalScale }, // 처음엔 같은 값
    config: {
      mass: 1,
      tension: 300,
      friction: 60,
    },
  }));

  // layerScale은 여전히 필요할 수 있으므로 유지
  const [layerScale, setLayerScale] = useSpring(() => ({
    scale: initialLayerScale,
  }));

  // useEffect 훅을 사용하여 컴포넌트가 마운트된 직후 애니메이션을 시작
  useEffect(() => {
    // animationDuration/1000 초 후에 애니메이션 시작
    const timer = setTimeout(() => {
      api.start({
        scale: finalScale,
        config: { duration: animationDuration },
      });
    }, animationStartTime);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [finalScale, animationDuration, animationStartTime, api]);

  let timerForDurumagi;
  useEffect(() => {
    if (isDoneAnimationOfBackground) {
      timerForDurumagi = setTimeout(() => {
        setReadyToShowDurumagi(true);
      }, animationDuration + 500);
    }

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearTimeout(timerForDurumagi);
    };
  }, [isDoneAnimationOfBackground, animationDuration, setReadyToShowDurumagi]);

  useEffect(() => {
    // ExplodingGlow 사라지게 하기 위함.
    if (isReadyToShowDurumagi) {
      setInvisible(true);
    }
    // 답변 모달을 닫을 때 isAnswered가 false로 바뀌면 setInvisible(false)를 호출하지 않음.
    // 호출하면 언마운트 직전 한 프레임 동안 빛이 다시 보이는 플래시가 발생함.
    // 다음 리딩 시에는 컴포넌트가 새로 마운트되므로 초기 state(invisible=false)로 시작함.
    return () => {};
  }, [isReadyToShowDurumagi, setInvisible]);

  //! Billboard 컴포넌트를 사용하여 항상 카메라를 향하도록 합니다.
  //! animated.mesh를 사용하여 scale 애니메이션을 적용합니다.
  //! LayerMaterial을 사용하여 복잡한 재질을 생성합니다.
  //! 세 개의 Depth 레이어를 사용하여 깊이감과 발광 효과를 만듭니다.
  //~ 컴포넌트가 마운트되면 작은 원형으로 시작하여 scale 애니메이션이 시작되어 원형이 급격히 확장되고 LayerMaterial의 설정으로 인해 가장자리로 갈수록 투명해지는 발광 효과가 생깁니다.
  //~ 첫 번째 레이어: 기본적인 깊이 효과를 생성합니다.
  //~ 두 번째 레이어: 추가적인 발광 효과를 더합니다 (mode="add").
  //~ 세 번째 레이어: 더 강한 중심부 발광을 만듭니다 (mode="add").
  //~ near와 far 값에 initialScale을 곱하는 것은, 오브젝트의 크기가 변할 때 그라데이션 효과도 함께 스케일되도록 하기 위함.
  return (
    <Billboard>
      <animated.mesh scale={scale}>
        <circleGeometry args={[0.2, 100]} />
        <LayerMaterial
          transparent
          depthWrite={false}
          blending={CustomBlending}
          blendEquation={AddEquation}
          blendSrc={SrcAlphaFactor}
          blendDst={DstAlphaFactor}
        >
          <Depth
            colorA={color}
            colorB="black"
            alpha={1}
            mode="normal"
            near={near * layerScale.scale}
            far={far * layerScale.scale}
            origin={[0, 0, 0]}
          />
          <Depth
            colorA={color}
            colorB="black"
            alpha={1}
            mode="add"
            near={-15 * layerScale.scale}
            far={far * 0.7 * layerScale.scale}
            origin={[0, 0, 0]}
          />
          <Depth
            colorA={color}
            colorB="black"
            alpha={1}
            mode="add"
            near={-10 * layerScale.scale}
            far={far * 0.68 * layerScale.scale}
            origin={[0, 0, 0]}
          />
        </LayerMaterial>
      </animated.mesh>
    </Billboard>
  );
};
