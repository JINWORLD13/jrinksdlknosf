import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  memo,
  useMemo,
} from 'react';

import { TOUCH } from 'three'; // 상단에 import 추가
import { OrbitControls, Stars, Float, Text3D } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useWindowSizeState } from '@/hooks';
import TalkBubbleForVertical from './Props/TalkBubbleForVertical.jsx';
import { detectHorizon } from '../../../../utils/device/detectHorizon.js';
import { isIOS } from '../../../../utils/device/isIOS.js';
import TalkBubble from './Props/TalkBubble.jsx';
import { GlowingSparkle } from '../../Effect/GlowingSparkle.jsx';
import { BigMagicCircle } from '../../Effect/BigMagicCircle.jsx';
import { ExplodingGlow } from '../../Effect/ExplodingGlow.jsx';
import { DynamicCamera } from '../../Camera/DynamicCamera.jsx';
import { MagicCircleGroupUsingBlenderForBackground } from '../../Effect/MagicCircleUsingBlenderForBackground.jsx';
import { MagicCircleUsingBlenderGroup } from '../../Effect/MagicCircleUsingBlender.jsx';
import { SceneResourceCleanUp } from '../../Utils/SceneResourceCleanUp.jsx';
import Model from './Props/Model.jsx';
import { Bloom, EffectComposer, Outline } from '@react-three/postprocessing';
import EnhancedStarField from '../../Effect/EnhancedStarField.jsx';

// Canvas 내부에서 첫 프레임 렌더 후 한 번만 onSceneReady 호출 (Three.js 씬 완전 로딩 신호)
// Canvas内で初回フレーム描画後に1回だけonSceneReady呼び出し（Three.jsシーン完全ロード通知）
// Call onSceneReady once after first frame render inside Canvas (Three.js scene fully loaded)
function SceneReadyNotifier({ onSceneReady }) {
  const calledRef = useRef(false);
  useFrame(() => {
    if (onSceneReady && !calledRef.current) {
      calledRef.current = true;
      onSceneReady();
    }
  });
  return null;
}

export default function TarotMasterScene({
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
}) {
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    isReadyToShowDurumagi,
    isDoneAnimationOfBackground,
    isVoucherModeOn,
    hasWatchedAd,
    isTarotManualModalOpen,
    readingTypeChoiceOpen,
    isYesNoModalOpen,
    generalReadingQuestionOpen,
    generalReadingSpreadChoiceOpen,
    isClientInfoModalOpen,
    ...rest
  } = stateGroup;
  const {
    handleAnsweredState,
    handleCardForm,
    handleQuestionForm,
    handleResetAll,
    handleResetDeck,
    handleSpreadValue,
    handleSelectedTarotMode,
    ...rest2
  } = handleStateGroup;
  const camera = useMemo(() => ({ position: [0, 1.7, 3], fov: 30 }), []);
  const [cleanUp, setCleanUp] = useState(() => 0);
  const [isTalkBubbleClosed, setTalkBubbleClosed] = useState(false);
  const { windowWidth, windowHeight } = useWindowSizeState();
  const [clickStatusForTalkBubble, setClickStatusForTalkBubble] =
    useState(true);
  //! 말풍선 글자 보이도록 함.(렌턴의 ambient light와 연계해서)
  const [isLightOn, setLightOn] = useState(true);
  const [visibleExceptDuringPlaying, setVisibleExceptDuringPlaying] =
    useState(true);
  const [visibleDuringPlaying, setVisibleDuringPlaying] = useState(false);
  const [visibleForExplosion, setVisibleForExplosion] = useState(false);

  //& 목적 : 광고보기 버튼 누를때에만 effect 나오게 하려고 한다.
  const notInitialAdsMode = !(
    selectedTarotMode === 2 &&
    !isVoucherModeOn &&
    !answerForm?.isWaiting &&
    answerForm?.isAnswered &&
    !isReadyToShowDurumagi &&
    !isDoneAnimationOfBackground &&
    answerForm?.interpretation?.length === 0
  );

  useEffect(() => {
    setTalkBubbleClosed(prev => {
      //! 다음 코드(if (!isReadyToShowDurumagi && !clickStatusForTalkBubble) return false;)는 종속성에 clickStatusForTalkBubble을 원래부터 넣지 않았기에 추가가 가능한 것.
      // if (!isReadyToShowDurumagi && !clickStatusForTalkBubble) return false;
      if (clickStatusForTalkBubble) return false;
      return true;
    });
  }, [windowWidth, isReadyToShowDurumagi]);

  useEffect(() => {
    setVisibleExceptDuringPlaying(prev => {
      if (!notInitialAdsMode) return prev;
      return (
        (!answerForm?.isWaiting && !answerForm?.isAnswered) ||
        (answerForm?.isAnswered &&
          isDoneAnimationOfBackground &&
          isReadyToShowDurumagi)
      );
    });
    setVisibleDuringPlaying(prev => {
      if (!notInitialAdsMode) return prev;
      return (
        answerForm?.isWaiting ||
        (answerForm?.isAnswered && !isReadyToShowDurumagi)
      );
    });
    setVisibleForExplosion(prev => {
      // if(!notInitialAdsMode) return prev;
      // 제너럴 리딩은 3D 폭발 애니메이션 없이 즉시 답변 모달만 띄우므로, 답변창을 닫을 때 ExplodingGlow가 재생되지 않도록 제외
      return (
        !!answerForm?.isAnswered &&
        !!isDoneAnimationOfBackground &&
        !answerForm?.isGeneralReadingResult
      );
    });
  }, [
    answerForm?.isWaiting,
    answerForm?.isAnswered,
    answerForm?.isGeneralReadingResult,
    isDoneAnimationOfBackground,
    isReadyToShowDurumagi,
  ]);

  //~ 답변 받기까지 상태 과정 :  answersForm.isWaiting => answersForm.isAnswered (answersForm.isWaiting은 false) => isDoneAnimationOfBackground => Exploding 애니메이션 진행 후(setTimeout) => isReadyToShowDurumagi => ExplodingGlow 내에서 visible state변수가 초기화됨. => 두루마기에서 취소 누르면 올 리셋.
  //~ 답변 받기 중요한 컴포넌트, MagicCircleGroupForBackground, ExplodingGlow

  const isIOSDevice = isIOS();
  // 모바일에서 그림자·과다 조명 시 프레임 드랍 방지
  const isMobileDevice = useMemo(
    () =>
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    [],
  );

  // Answer 카드 이미지 또는 Answer 두루마기 모달이 떠 있을 때 Three.js 애니메이션 일시 정지
  const isAnswerCardOrDurumagiModalVisible =
    answerForm?.isAnswered &&
    selectedTarotMode !== 1 &&
    !modalForm?.spread &&
    !modalForm?.tarot &&
    isDoneAnimationOfBackground &&
    isReadyToShowDurumagi;

  return (
    <>
      <Canvas
        id={'myCanvas'}
        shadows={!isMobileDevice}
        style={{ width: '100%', height: '100%' }}
        frameloop={
          modalForm?.spread ||
          modalForm?.tarot ||
          isClickedForTodayCard ||
          isTarotManualModalOpen ||
          isInviteOpen ||
          isAnswerCardOrDurumagiModalVisible ||
          readingTypeChoiceOpen ||
          isYesNoModalOpen ||
          generalReadingQuestionOpen ||
          generalReadingSpreadChoiceOpen ||
          isClientInfoModalOpen
            ? 'never'
            : 'always'
        }
        gl={{
          antialias: false,
          // ...(isIOSDevice ? { preserveDrawingBuffer: true } : {}), // iOS 회전 시 노이즈 발생 원인 제거
          preserveDrawingBuffer: false,
        }}
        camera={camera}
      >
        <SceneResourceCleanUp
          isWaiting={answerForm?.isWaiting}
          isAnswered={answerForm?.isAnswered}
          isReadyToShowDurumagi={isReadyToShowDurumagi}
          modalForm={modalForm}
          userInfo={userInfo}
          cleanUp={cleanUp}
        />
        <Suspense fallback={null}>
          <DynamicCamera
            isWaiting={answerForm?.isWaiting}
            isAnswered={answerForm?.isAnswered}
            answer={answerForm?.interpretation}
            isReadyToShowDurumagi={isReadyToShowDurumagi}
            isDoneAnimationOfBackground={isDoneAnimationOfBackground}
            selectedTarotMode={selectedTarotMode}
            isVoucherModeOn={isVoucherModeOn}
            enableOrbitControls={visibleExceptDuringPlaying}
            lookAtPositionWhenMagicCircleInvisible={[0, 1.5, 1]}
          />
          {!isIOSDevice && (
            <EffectComposer>
              <Bloom
                intensity={0.35}
                luminanceThreshold={0.01}
                luminanceSmoothing={10}
                height={300}
                radius={0.8}
              />
              {/* <Outline edgeStrength={10} edgeGlow={0} edgeThickness={1} /> */}
            </EffectComposer>
          )}
          <Model
            scale={0.03}
            stateGroup={stateGroup}
            setStateGroup={setStateGroup}
            toggleModalGroup={toggleModalGroup}
            handleStateGroup={handleStateGroup}
            setTalkBubbleClosed={setTalkBubbleClosed}
            setClickStatusForTalkBubble={setClickStatusForTalkBubble}
            updateTarotManualModalOpen={updateTarotManualModalOpen}
            isDoneAnimationOfBackground={isDoneAnimationOfBackground}
            visible={visibleExceptDuringPlaying}
            userInfo={userInfo}
            isClickedForTodayCard={isClickedForTodayCard}
            onOpenReadingTypeChoice={onOpenReadingTypeChoice}
          />
          {visibleExceptDuringPlaying && (
            <group>
              {/* <ambientLight intensity={1} color="#ffcc99" />{' '} */}
              {/* 따뜻한 주변광 */}
              <directionalLight
                position={[0.0, 1.2, -0.4]}
                intensity={0.5} // 강도를 낮춰 깊이감 감소
                color={0xffffff}
                castShadow={false} // 그림자 비활성화
              />
              <pointLight
                position={[0.0, 1.2, -0.4]} // 수정 구체 위치 근처
                intensity={0.1}
                color="#cc99ff" // 보라색 빛
                distance={1}
                decay={2}
              />
              <pointLight
                position={[0.0, 1.5, 1]} // 왼쪽 촛불 위치
                intensity={4}
                color="#ff9f50" // 따뜻한 주황색
                distance={10}
                decay={1.5}
              />
              <pointLight
                // position={[0.0, 1.2, -0.4]} // 얼굴과 수정구슬 사이
                position={[0.0, 1.26, -0.42]} // 얼굴과 수정구슬 사이
                intensity={0.2}
                color="#ff9f50"
                distance={1}
                decay={1.5}
              />
              <spotLight
                position={[0, 2, 0.08]} // 캐릭터 위에서 비추는 조명
                angle={0.8}
                penumbra={1}
                intensity={15}
                color="#ff9f50"
                // color="#cc99ff" // 보라색 빛
                castShadow={!isMobileDevice}
                target-position={[0, 0, 0]}
              />
              <pointLight
                position={[0.0, 1.2, -0.1]} // 수정 구체 위치 근처
                intensity={0.7}
                color="#cc99ff" // 보라색 빛
                distance={0.5}
                decay={2}
              />
              <spotLight
                position={[0.0, 2, -1]} // 캐릭터 위에서 비추는 조명
                angle={0.8}
                penumbra={1}
                intensity={1}
                color="#ff9f50"
                // color="#cc99ff" // 보라색 빛
                castShadow={!isMobileDevice}
                target-position={[0, 0, -1]}
              />
              {/* 배경 흰/검 음영용 키 라이트 (반원 상단에서 비춤, 모바일은 그림자 끔) */}
              <directionalLight
                position={[0, 2.8, 1.5]}
                intensity={1.4}
                color="#ffffff"
                castShadow={!isMobileDevice}
                shadow-mapSize={isMobileDevice ? [512, 512] : [2048, 2048]}
                shadow-bias={-0.0001}
              >
                <orthographicCamera
                  attach="shadow-camera"
                  args={[-2.2, 2.2, 2.2, -1.2, 0.1, 10]}
                />
              </directionalLight>
              {/* 반원 영역 흰 fill 조명 (3개) */}
              <group name="semicircularFillLights">
                {[
                  [-0.65, 2.18, 0.25],
                  [0, 2.38, 0.08],
                  [0.65, 2.18, 0.25],
                ].map((pos, i) => (
                  <pointLight
                    key={`semi-fill-${i}`}
                    position={pos}
                    intensity={0.35}
                    color="#ffffff"
                    distance={3.5}
                    decay={2}
                  />
                ))}
              </group>
            </group>
          )}
          {visibleForExplosion && (
            <ExplodingGlow
              isAnswered={answerForm?.isAnswered}
              isDoneAnimationOfBackground={isDoneAnimationOfBackground}
              isReadyToShowDurumagi={isReadyToShowDurumagi}
              setReadyToShowDurumagi={setReadyToShowDurumagi}
              visibleForExplosion={visibleForExplosion}
            />
          )}
          {visibleDuringPlaying && (
            <group>
              <ambientLight intensity={10} />
              <BigMagicCircle visible={visibleDuringPlaying} />
              <GlowingSparkle visible={visibleDuringPlaying} />
            </group>
          )}
          {visibleDuringPlaying && (
            <group>
              <MagicCircleGroupUsingBlenderForBackground
                setDoneAnimationOfBackground={setDoneAnimationOfBackground}
                visible={visibleDuringPlaying}
              />
              <MagicCircleUsingBlenderGroup visible={visibleDuringPlaying} />
            </group>
          )}
          {isTalkBubbleClosed === false &&
            !answerForm?.isWaiting &&
            !answerForm?.isAnswered && (
              <group>
                {/* Add your components here */}
                {detectHorizon() === true && (
                  <TalkBubble
                    size={[1, 1, 1]}
                    radius={0.1}
                    answerForm={answerForm}
                    stateGroup={stateGroup}
                    isLightOn={isLightOn}
                    userInfo={userInfo}
                  />
                )}
                {/* <PointLight position={[0, 0, 5]} intensity={1} color="white" />{' '} */}
                {detectHorizon() === false && (
                  <TalkBubbleForVertical
                    size={[1, 1, 1]}
                    radius={0.1}
                    answerForm={answerForm}
                    stateGroup={stateGroup}
                    isLightOn={isLightOn}
                    userInfo={userInfo}
                  />
                )}
              </group>
            )}
          <SceneReadyNotifier onSceneReady={onSceneReady} />
        </Suspense>
        <fogExp2 attach="fog" args={['#ff9f50', 0.02]} />
        <StartSpin />
        {/* <Float floatIntensity={1} speed={3}></Float> */}
        {visibleExceptDuringPlaying && (
          <OrbitControls
            target={[0, 1.5, 1]}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
            minAzimuthAngle={-Math.PI / 5} // -45도
            maxAzimuthAngle={Math.PI / 5} // 45도
            enableZoom={false}
            rotateSpeed={0.5} // 매우 천천히 회전 (0.5)
            touches={{
              ONE: TOUCH.ROTATE,
              TWO: TOUCH.NONE, // 두 손가락 터치 동작 비활성화(핀치 줌(두 손가락으로 확대/축소)을 시도할 때 OrbitControls가 이를 다른 종류의 조작으로 해석할 수 있습니다.)
            }}
            makeDefault
            enableDamping={true} // 부드럽게 움직이게 함.
            dampingFactor={0.03} // 감쇠 계수를 더 낮춰서(0.03) 더 묵직하고 천천히 멈추게 함
            enablePan={false} // 우클릭으로 카메리 이동 금지
            autoRotate={false} // 카메라 자동 공전 금지
          />
        )}
        {/* <axesHelper args={[10]} /> */}
      </Canvas>
    </>
  );
}

function StartSpin(props) {
  return (
    <>
      <EnhancedStarField count={1500} />
    </>
  );
}
