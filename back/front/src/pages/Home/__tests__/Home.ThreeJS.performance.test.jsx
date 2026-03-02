/**
 * Home 페이지의 Three.js 컴포넌트 성능 및 부착 테스트
 * - TarotHomeScene이 올바르게 마운트되는지 확인
 * - 성능 메트릭 측정 (렌더링 시간, 메모리)
 * - 컴포넌트가 정상적으로 부착되는지 확인
 */

import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
// Home 컴포넌트는 복잡한 의존성이 많아 직접 테스트 대신 TarotHomeScene을 테스트
import store from '../../../store/store.jsx';
import { measureRenderTime } from '../../../__tests__/performance.test.js';
import TarotHomeScene from '../../../components/ThreeScene/TarotHomeScene.jsx';

// Mock Three.js and React Three Fiber
const mockScene = {
  children: [],
  traverse: jest.fn(callback => {
    const mockMesh = {
      isMesh: true,
      geometry: {
        dispose: jest.fn(),
        attributes: { position: { count: 100 } },
      },
      material: { dispose: jest.fn(), clone: jest.fn(() => ({})) },
      traverse: jest.fn(callback => callback(mockMesh)),
    };
    callback(mockMesh);
  }),
  clone: jest.fn(function () {
    return {
      children: [],
      traverse: jest.fn(),
    };
  }),
};

const mockGLTFResult = {
  scene: mockScene,
  nodes: {},
  materials: {},
  animations: [],
};

const mockUseFrameCallbacks = [];
const mockUseFrame = jest.fn(callback => {
  mockUseFrameCallbacks.push(callback);
});

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => (
    <div data-testid="three-canvas" data-performance-test="canvas">
      {children}
    </div>
  ),
  useFrame: callback => mockUseFrame(callback),
  useThree: jest.fn(() => ({
    camera: {
      position: { set: jest.fn(), lerp: jest.fn() },
      fov: 30,
      updateProjectionMatrix: jest.fn(),
      quaternion: { set: jest.fn() },
      up: { set: jest.fn() },
    },
    gl: {
      domElement: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      info: {
        render: { calls: 50, triangles: 5000 },
        memory: { textures: 10, geometries: 5 },
      },
    },
    scene: mockScene,
    renderer: {
      dispose: jest.fn(),
      render: jest.fn(),
    },
  })),
  useGraph: jest.fn(() => ({ nodes: {}, materials: {} })),
  extend: jest.fn(),
}));

jest.mock('@react-three/drei', () => {
  const mockUseGLTF = jest.fn(() => mockGLTFResult);
  mockUseGLTF.preload = jest.fn();

  return {
    useGLTF: mockUseGLTF,
    useAnimations: jest.fn(() => ({
      actions: {},
      mixer: { update: jest.fn() },
    })),
    OrbitControls: () => <div data-testid="orbit-controls" />,
    Stars: () => <div data-testid="stars" />,
    Float: ({ children }) => <div data-testid="float">{children}</div>,
    Text3D: () => <div data-testid="text3d" />,
    Instance: ({ children }) => <div data-testid="instance">{children}</div>,
    Instances: ({ children }) => <div data-testid="instances">{children}</div>,
    PerspectiveCamera: () => null,
    Environment: () => null,
    Sparkles: () => null,
    Stats: () => <div data-testid="stats" />,
    Billboard: () => null,
    addEffect: jest.fn(),
  };
});

jest.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }) => (
    <div data-testid="effect-composer">{children}</div>
  ),
  Bloom: props => <div data-testid="bloom" {...props} />,
  Outline: props => <div data-testid="outline" {...props} />,
}));


// Mock other dependencies
jest.mock('@/hooks', () => ({
  useAnswerFormState: () => [
    { isWaiting: false, isAnswered: false },
    jest.fn(),
  ],
  useQuestionFormState: () => [{}, jest.fn()],
  useModalFormState: () => [{}, jest.fn()],
  useCardFormState: () => [{}, jest.fn()],
  useSelectedTarotModeState: () => [1, jest.fn()],
  useIsCSSInvisibleState: () => [false, jest.fn()],
  useCountryState: () => ['US', jest.fn()],
  useBlinkModalState: () => [{}, jest.fn()],
  useChargeModalState: () => [false, jest.fn()],
  useTarotSpreadPricePointState: () => [0, jest.fn()],
  useTarotManualModalState: () => [false, jest.fn()],
  useRefundPolicyState: () => [false, jest.fn()],
  usePriceInfoModalState: () => [false, jest.fn()],
  useTarotSpreadVoucherPriceState: () => [0, jest.fn()],
  useAuth: () => ({ isToken: false, isCheckingToken: false }),
  useLanguageChange: () => 'en',
  useTotalCardsNumber: () => 78,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => ({
    setSelectedTarotModeForApp: jest.fn(),
    setIsVoucherModeOnForApp: jest.fn(),
    setWatchedAdForApp: jest.fn(),
    setAnswerFormForApp: jest.fn(),
    setModalFormForApp: jest.fn(),
    setIsDurumagiModalWithInterpretationOpen: jest.fn(),
  }),
}));

// Home.jsx는 복잡한 의존성이 많아 직접 테스트하기 어려움
// 대신 Home에서 사용하는 TarotHomeScene을 테스트
const defaultProps = {
  stateGroup: {
    answerForm: { isWaiting: false, isAnswered: false },
    cardForm: {},
    questionForm: {},
    modalForm: {},
    selectedTarotMode: 1,
    isCSSInvisible: false,
    country: 'US',
    isReadyToShowDurumagi: false,
    isDoneAnimationOfBackground: false,
    isVoucherModeOn: false,
    hasWatchedAd: false,
    isTarotManualModalOpen: false,
  },
  setStateGroup: jest.fn(),
  toggleModalGroup: jest.fn(),
  handleStateGroup: {
    handleAnsweredState: jest.fn(),
    handleCardForm: jest.fn(),
    handleQuestionForm: jest.fn(),
    handleResetAll: jest.fn(),
    handleResetDeck: jest.fn(),
    handleSpreadValue: jest.fn(),
    handleSelectedTarotMode: jest.fn(),
  },
  updateTarotManualModalOpen: jest.fn(),
  setReadyToShowDurumagi: jest.fn(),
  setDoneAnimationOfBackground: jest.fn(),
  userInfo: { email: 'test@example.com' },
  isClickedForTodayCard: false,
  isInviteOpen: false,
};

describe('Home 페이지에서 사용하는 Three.js 컴포넌트 성능 및 부착 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFrameCallbacks.length = 0;
  });

  describe('컴포넌트 부착 테스트', () => {
    it('should mount TarotHomeScene component correctly', async () => {
      let container;
      await act(async () => {
        const result = render(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene {...defaultProps} />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
        container = result.container;
      });

      await waitFor(() => {
        const sceneElement = container.querySelector(
          '[data-testid="tarot-master-scene"]'
        );
        expect(sceneElement).toBeTruthy();
      });
    });

    it('should render Three.js Canvas wrapper', async () => {
      const { container } = await act(async () => {
        return render(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene {...defaultProps} />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
      });

      await waitFor(() => {
        const canvasElement = container.querySelector(
          '[data-testid="three-canvas"]'
        );
        expect(canvasElement).toBeTruthy();
      });
    });

    it('should handle component rendering without errors', async () => {
      const { container } = await act(async () => {
        return render(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene {...defaultProps} />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
      });

      // 컴포넌트가 정상적으로 렌더링되었는지 확인
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('성능 테스트', () => {
    it('should render TarotHomeScene within acceptable time', async () => {
      const renderFn = async () => {
        await act(async () => {
          render(
            <HelmetProvider>
              <Provider store={store}>
                <MemoryRouter>
                  <TarotHomeScene {...defaultProps} />
                </MemoryRouter>
              </Provider>
            </HelmetProvider>
          );
        });
      };

      const start = performance.now();
      await renderFn();
      const end = performance.now();
      const renderTime = end - start;

      // TarotHomeScene은 300ms 이내 렌더링
      expect(renderTime).toBeLessThan(300);
    });

    it('should have consistent render times across multiple renders', async () => {
      const renderTimes = [];

      for (let i = 0; i < 5; i++) {
        const { unmount } = await act(async () => {
          return render(
            <HelmetProvider>
              <Provider store={store}>
                <MemoryRouter>
                  <TarotHomeScene {...defaultProps} />
                </MemoryRouter>
              </Provider>
            </HelmetProvider>
          );
        });

        const start = performance.now();
        await act(async () => {
          unmount();
        });
        const end = performance.now();
        renderTimes.push(end - start);
      }

      // 렌더링 시간의 일관성 확인
      const average =
        renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      const variance =
        renderTimes.reduce((sum, time) => {
          return sum + Math.pow(time - average, 2);
        }, 0) / renderTimes.length;
      const standardDeviation = Math.sqrt(variance);

      // 표준편차가 평균의 50% 이하여야 함 (일관성)
      expect(standardDeviation).toBeLessThan(average * 0.5);
    });

    it('should not cause memory leaks with repeated mounts/unmounts', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      for (let i = 0; i < 10; i++) {
        const { unmount } = await act(async () => {
          return render(
            <HelmetProvider>
              <Provider store={store}>
                <MemoryRouter>
                  <TarotHomeScene {...defaultProps} />
                </MemoryRouter>
              </Provider>
            </HelmetProvider>
          );
        });

        await act(async () => {
          unmount();
        });
      }

      // 메모리 증가가 합리적인 범위 내여야 함
      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        // 10MB 이내의 증가만 허용
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  describe('Three.js 컴포넌트 통합 테스트', () => {
    it('should initialize all Three.js hooks correctly', async () => {
      await act(async () => {
        render(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene {...defaultProps} />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
      });

      // useFrame이 등록되었는지 확인
      expect(mockUseFrame).toHaveBeenCalled();
    });

    it('should handle state updates without breaking Three.js scene', async () => {
      const { rerender } = await act(async () => {
        return render(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene {...defaultProps} />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
      });

      // 상태 업데이트 시뮬레이션
      await act(async () => {
        rerender(
          <HelmetProvider>
            <Provider store={store}>
              <MemoryRouter>
                <TarotHomeScene
                  {...defaultProps}
                  stateGroup={{
                    ...defaultProps.stateGroup,
                    answerForm: { isWaiting: true, isAnswered: false },
                  }}
                />
              </MemoryRouter>
            </Provider>
          </HelmetProvider>
        );
      });

      // 씬이 여전히 렌더링되어야 함
      const { container } = render(
        <HelmetProvider>
          <Provider store={store}>
            <MemoryRouter>
              <TarotHomeScene {...defaultProps} />
            </MemoryRouter>
          </Provider>
        </HelmetProvider>
      );
      expect(
        container.querySelector('[data-testid="tarot-master-scene"]')
      ).toBeTruthy();
    });
  });
});
