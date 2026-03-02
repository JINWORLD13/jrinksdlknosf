// ! Text(@react-three/drei). - R3F 트리에서 렌더가 안됨. 이유는, troika 사용하기 때문.
import React, {
  memo,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Float, Html, useFont } from '@react-three/drei';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Shape, ShapeGeometry } from 'three';

export default memo(function TalkBubbleForVertical(props) {
  const balloonRef = useRef();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
  } = props?.stateGroup;
  // question.cardCount가 잘 전달되더니 submit 후 리셋됨. 나머진 그대로인데;

  useEffect(() => {
    return () => {
      // group 내 모든 메쉬 정리
      if (balloonRef.current) {
        balloonRef.current.traverse(object => {
          if (object.isMesh) {
            object.geometry.dispose(); // 지오메트리 정리
            object.material.dispose(); // 머티리얼 정리
          }
        });
      }
      // 참조 제거
      // balloonRef는 Three.js의 group 객체를 참조합니다. 단순히 null로 설정하는 것은 참조를 끊을 뿐, group 내의 메쉬, 지오메트리, 머티리얼 등의 리소스를 정리하지 않기에, 명시적으로 위에서 dispose 처리함.
      balloonRef.current = null;
    };
  }, []);

  return (
    <>
      <group name="TalkBubbleForVertical" ref={balloonRef} {...props}>
        {props?.answerForm?.isWaiting === true ? (
          <WaitingTalk
            selectedTarotMode={selectedTarotMode}
            spreadListNumber={questionForm?.spreadListNumber}
            isLightOn={props?.isLightOn}
          />
        ) : (
          <GreetingTalk
            isLightOn={props?.isLightOn}
            userInfo={props?.userInfo}
          />
        )}
        {/* <mesh name="TalkBubbleMaterial2" position={[-0.295, 1.65, 0]}>
          <circleGeometry args={[0.05, 120]} />
          <meshPhongMaterial color={'black'} />
        </mesh>
        <mesh name="TalkBubbleMaterial2_1" position={[-0.3, 1.65, -0.05]}>
          <circleGeometry args={[0.06, 120]} />
          <meshPhongMaterial color={'#4E064E'} />
        </mesh>
        <mesh name="TalkBubbleMaterial3" position={[-0.27, 1.55, 0]}>
          <circleGeometry args={[0.03, 120]} />
          <meshPhongMaterial color={'black'} />
        </mesh>
        <mesh name="TalkBubbleMaterial3_1" position={[-0.275, 1.55, -0.05]}>
          <circleGeometry args={[0.04, 120]} />
          <meshPhongMaterial color={'#4E064E'} />
        </mesh> */}
        {/* <mesh name="TalkBubbleMaterial2" position={[-0.295, 1.55, 0]}>
          <circleGeometry args={[0.05, 120]} />
          <meshPhongMaterial color={'black'} />
        </mesh>
        <mesh name="TalkBubbleMaterial2_1" position={[-0.3, 1.55, -0.05]}>
          <circleGeometry args={[0.06, 120]} />
          <meshPhongMaterial color={'#4E064E'} />
        </mesh>
        <mesh name="TalkBubbleMaterial3" position={[-0.27, 1.45, 0]}>
          <circleGeometry args={[0.03, 120]} />
          <meshPhongMaterial color={'black'} />
        </mesh>
        <mesh name="TalkBubbleMaterial3_1" position={[-0.275, 1.45, -0.05]}>
          <circleGeometry args={[0.04, 120]} />
          <meshPhongMaterial color={'#4E064E'} />
        </mesh> */}
      </group>
    </>
  );
});

const WaitingTalk = memo(
  ({ selectedTarotMode, spreadListNumber, isLightOn, ...props }) => {
    const { t } = useTranslation();
    const browserLanguage = useLanguageChange();
    const meshRefs = useRef([]); // 메쉬 참조 저장
    const textRef = useRef(); // Text 컴포넌트 참조

    useEffect(() => {
      return () => {
        // 메쉬 리소스 정리
        meshRefs.current.forEach(mesh => {
          if (mesh) {
            mesh.geometry.dispose();
            mesh.material.dispose();
            mesh.current = null;
          }
        });
        meshRefs.current = [];

        // Text 컴포넌트 리소스 정리
        if (textRef.current) {
          textRef.current.geometry?.dispose();
          textRef.current.material?.dispose();
          textRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      return () => {
        if (roundedRectShape) roundedRectShape.dispose();
        if (roundedRectShapeForOutter) roundedRectShapeForOutter.dispose();
      };
    }, []);

    const roundedRectShape = useMemo(() => {
      const shape = new Shape();
      const width = 0.67;
      const height = 0.5;
      const radius = 0.1; // 모서리의 반지름

      shape.moveTo(0, radius);
      shape.lineTo(0, height - radius);
      shape.quadraticCurveTo(0, height, radius, height);
      shape.lineTo(width - radius, height);
      shape.quadraticCurveTo(width, height, width, height - radius);
      shape.lineTo(width, radius);
      shape.quadraticCurveTo(width, 0, width - radius, 0);
      shape.lineTo(radius, 0);
      shape.quadraticCurveTo(0, 0, 0, radius);

      return new ShapeGeometry(shape);
    }, []);

    const roundedRectShapeForOutter = useMemo(() => {
      const shape = new Shape();
      const width = 0.7;
      const height = 0.55;
      const radius = 0.1; // 모서리의 반지름

      shape.moveTo(0, radius);
      shape.lineTo(0, height - radius);
      shape.quadraticCurveTo(0, height, radius, height);
      shape.lineTo(width - radius, height);
      shape.quadraticCurveTo(width, height, width, height - radius);
      shape.lineTo(width, radius);
      shape.quadraticCurveTo(width, 0, width - radius, 0);
      shape.lineTo(radius, 0);
      shape.quadraticCurveTo(0, 0, 0, radius);

      return new ShapeGeometry(shape);
    }, []);

    return (
      <>
        {isLightOn === true && (
          <Text
            ref={textRef}
            color={'gold'}
            font={`${
              browserLanguage === 'ja'
                ? '/assets/font/Kosugi_Maru/KosugiMaru-Regular.ttf'
                : '/assets/font/Dongle/Dongle-Regular.ttf'
            }`}
            fontSize={`${browserLanguage === 'ja' ? 0.045 : 0.072}`}
            fontWeight={800}
            position={[0.0, 1.9, -0.14]}
            lineHeight={`${browserLanguage === 'ja' ? 1.2 : 0.9}`}
          >
            {`\t${t(
              `talk.time_${
                selectedTarotMode === 2
                  ? 'normal_vertical'
                  : selectedTarotMode === 3
                  ? spreadListNumber === 0
                    ? 'deep_one_vertical'
                    : 'deep_vertical'
                  : spreadListNumber === 0
                  ? 'serious_one_vertical'
                  : 'serious_vertical'
              }`
            )}\n${t(`talk.you_know_vertical`)}\n${t(
              `talk.tarot1_vertical`
            )}\n${t(`talk.tarot2_vertical`)}`}
          </Text>
        )}
        <mesh
          name="TalkBubbleMaterial1"
          position={[-0.335, 1.65, -0.19]}
          ref={el => (meshRefs.current[0] = el)}
        >
          <primitive object={roundedRectShape} />
          <meshPhongMaterial color={'#1e1b4b'} flatShading />
        </mesh>
        <mesh
          name="TalkBubbleMaterial1_1"
          position={[-0.35, 1.63, -0.24]}
          ref={el => (meshRefs.current[1] = el)}
        >
          <primitive object={roundedRectShapeForOutter} />
          <meshPhongMaterial color={'#6d28d9'} flatShading />
        </mesh>
      </>
    );
  }
);

const GreetingTalk = memo(({ isLightOn, userInfo, ...props }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const meshRefs = useRef([]); // 메쉬 참조 저장
  const textRef = useRef(); // Text 컴포넌트 참조

  useEffect(() => {
    return () => {
      // 메쉬 리소스 정리
      meshRefs.current.forEach(mesh => {
        if (mesh) {
          mesh.geometry.dispose();
          mesh.material.dispose();
          mesh.current = null;
        }
      });
      meshRefs.current = [];

      // Text 컴포넌트 리소스 정리
      if (textRef.current) {
        textRef.current.geometry?.dispose();
        textRef.current.material?.dispose();
        textRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (roundedRectShape) roundedRectShape.dispose();
      if (roundedRectShapeForOutter) roundedRectShapeForOutter.dispose();
    };
  }, []);

  const roundedRectShape = useMemo(() => {
    const shape = new Shape();
    const width = browserLanguage === 'ja' ? 0.715 : 0.69;
    const height = browserLanguage === 'ja' ? 0.27 : 0.29;
    const radius = 0.1; // 모서리의 반지름
    const number = browserLanguage === 'en' ? -0.04 : -0.02;

    shape.moveTo(number, radius);
    shape.lineTo(number, height - radius);
    shape.quadraticCurveTo(number, height, radius + number, height);
    shape.lineTo(width - radius, height);
    shape.quadraticCurveTo(width, height, width, height - radius);
    shape.lineTo(width, radius);
    shape.quadraticCurveTo(width, 0, width - radius, 0);
    shape.lineTo(radius, 0);
    shape.quadraticCurveTo(number, 0, number, radius);

    return new ShapeGeometry(shape);
  }, [browserLanguage]);

  const roundedRectShapeForOutter = useMemo(() => {
    const shape = new Shape();
    const width = browserLanguage === 'ja' ? 0.745 : 0.72;
    const height = browserLanguage === 'ja' ? 0.29 : 0.32;
    const radius = 0.1; // 모서리의 반지름
    const number = browserLanguage === 'en' ? -0.04 : -0.02;

    shape.moveTo(number, radius);
    shape.lineTo(number, height - radius);
    shape.quadraticCurveTo(number, height, radius + number, height);
    shape.lineTo(width - radius, height);
    shape.quadraticCurveTo(width, height, width, height - radius);
    shape.lineTo(width, radius);
    shape.quadraticCurveTo(width, 0, width - radius, 0);
    shape.lineTo(radius, 0);
    shape.quadraticCurveTo(number, 0, number, radius);

    return new ShapeGeometry(shape);
  }, [browserLanguage]);

  return (
    <>
      {isLightOn === true && (
        <Text
          ref={textRef}
          color={'gold'}
          font={`${
            browserLanguage === 'ja'
              ? '/assets/font/Kosugi_Maru/KosugiMaru-Regular.ttf'
              : '/assets/font/Dongle/Dongle-Regular.ttf'
          }`}
          fontSize={`${browserLanguage === 'ja' ? 0.045 : 0.072}`}
          fontWeight={800}
          position={
            userInfo?.email
              ? browserLanguage === 'ja'
                ? [0.015, 1.86, -0.14]
                : browserLanguage === 'en'
                ? [0.0, 1.87, -0.14]
                : [0.0, 1.87, -0.14]
              : browserLanguage === 'ja'
              ? [0.01, 1.87, -0.14]
              : [0.01, 1.87, -0.14]
          }
          // position={[0.0, 1.9, 0.01]}
          lineHeight={`${browserLanguage === 'ja' ? 1.2 : 0.9}`}
          textAlign={userInfo?.email ? 'center' : 'left'}
          anchorX={userInfo?.email ? 'center' : 'center'}
          anchorY="middle"
        >
          {userInfo?.email
            ? `${t('talk.welcome_vertical')}\n${t(
                'talk.click_instruction_vertical'
              )}`
            : t('talk.welcome_guest')}
          {/* {`${t('talk.welcome_vertical')}\n${t(
            'talk.click_instruction_vertical'
          )}\n${t('talk.choose_spread_vertical')}\n${t('talk.usage_vertical')}`} */}
        </Text>
      )}
      <mesh
        name="TalkBubbleMaterial1"
        position={
          browserLanguage === 'en'
            ? [-0.32, 1.725, -0.19]
            : browserLanguage === 'ja'
            ? [-0.345, 1.723, -0.19]
            : [-0.335, 1.725, -0.19]
        }
        ref={el => (meshRefs.current[0] = el)}
      >
        <primitive object={roundedRectShape} />
        <meshPhongMaterial color={'#1a0a2e'} flatShading />
      </mesh>
      <mesh
        name="TalkBubbleMaterial1_1"
        position={
          browserLanguage === 'en'
            ? [-0.335, 1.715, -0.24]
            : browserLanguage === 'ja'
            ? [-0.36, 1.713, -0.24]
            : [-0.35, 1.715, -0.24]
        }
        ref={el => (meshRefs.current[1] = el)}
      >
        <primitive object={roundedRectShapeForOutter} />
        <meshPhongMaterial color={'#8b5cf6'} flatShading />
      </mesh>
    </>
  );
});


//     answerForm,
//     cardForm,
//     questionForm,
//     modalForm,
//     selectedTarotMode,
//     isCSSInvisible,
//     country,
//   } = props?.stateGroup;











// //! Text

//     answerForm,
//     cardForm,
//     questionForm,
//     modalForm,
//     selectedTarotMode,
//     isCSSInvisible,
//     country,
//   } = props?.stateGroup;





import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { useLanguageChange } from '@/hooks';
import { limitFPS } from '../../../Utils/limitFPS.jsx';
import { Mesh } from 'three';
import { MeshBasicMaterial } from 'three';

const CustomText = () => {
  const textRef = useRef();

  useEffect(() => {
    const loadFont = async () => {
      const loader = new FontLoader();
      loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        const geometry = new TextGeometry('Hello!', {
          font: font,
          size: 1,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        // Set position, rotation, scale, etc., if needed
        geometry.computeBoundingBox();
        geometry.center();

        // Create a mesh and add it to the scene
        const textMesh = new Mesh(
          geometry,
          new MeshBasicMaterial({ color: 0xffffff })
        );
        textRef.current = textMesh;
      });
    };

    loadFont();
  }, []);

  useFrame(() => {
    if (textRef.current) {
      // Example: Update the position of the text
      textRef.current.position.x = 0.07; // Adjust as needed
      textRef.current.position.y = 1.07; // Adjust as needed
      textRef.current.position.z = 0.1; // Adjust as needed
    }
  });

  return <primitive object={textRef} />;
};
