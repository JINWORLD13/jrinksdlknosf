import React from 'react';
import { render } from '@testing-library/react';
import { SceneResourceCleanUp } from '../SceneResourceCleanUp.jsx';

// Mock Three.js objects
const mockMesh = {
  isMesh: true,
  geometry: {
    attributes: {
      position: { buffer: { dispose: jest.fn() } }
    },
    dispose: jest.fn()
  },
  material: {
    dispose: jest.fn(),
    map: null
  }
};

const mockObject = {
  isMesh: false,
  isLight: false,
  isCamera: false
};

const mockScene = {
  traverse: jest.fn((callback) => {
    callback(mockObject);
    callback(mockMesh);
  }),
  clear: jest.fn()
};

const mockGl = {
  domElement: document.createElement('canvas'),
  setPixelRatio: jest.fn(),
  setClearColor: jest.fn(),
  dispose: jest.fn(),
  getContext: jest.fn()
};

const mockRenderer = {
  dispose: jest.fn(),
  forceContextLoss: jest.fn(),
  renderLists: {
    dispose: jest.fn()
  },
  info: {
    reset: jest.fn()
  },
  clear: jest.fn()
};

const mockCamera = {
  clear: jest.fn()
};

jest.mock('@react-three/fiber', () => ({
  useThree: jest.fn(() => ({
    scene: mockScene,
    gl: mockGl,
    renderer: mockRenderer,
    camera: mockCamera
  }))
}));

jest.mock('three', () => ({
  Cache: {
    clear: jest.fn()
  }
}));

describe('SceneResourceCleanUp', () => {
  const defaultProps = {
    isWaiting: false,
    isAnswered: false,
    isReadyToShowDurumagi: false,
    userInfo: { email: 'test@example.com' },
    cleanUp: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks
    mockScene.traverse.mockClear();
    mockScene.clear.mockClear();
    mockGl.setPixelRatio.mockClear();
    mockGl.setClearColor.mockClear();
  });

  it('should set up WebGL context event listeners', () => {
    const addEventListenerSpy = jest.spyOn(mockGl.domElement, 'addEventListener');
    
    render(<SceneResourceCleanUp {...defaultProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it('should configure renderer settings', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 2
    });

    render(<SceneResourceCleanUp {...defaultProps} />);

    expect(mockGl.setPixelRatio).toHaveBeenCalled();
    expect(mockGl.setClearColor).toHaveBeenCalledWith('#000000');
  });

  it('should clean up resources on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(mockGl.domElement, 'removeEventListener');
    const { unmount } = render(<SceneResourceCleanUp {...defaultProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );

    // Cleanup functions should be called
    expect(mockScene.traverse).toHaveBeenCalled();
    
    removeEventListenerSpy.mockRestore();
  });

  it('should handle scene cleanup', () => {
    const { unmount } = render(<SceneResourceCleanUp {...defaultProps} />);

    unmount();

    // Scene should be traversed for cleanup
    expect(mockScene.traverse).toHaveBeenCalled();
  });

  it('should return null (no visual output)', () => {
    const { container } = render(<SceneResourceCleanUp {...defaultProps} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle missing domElement gracefully', () => {
    const mockGlWithoutDom = {
      ...mockGl,
      domElement: null
    };

    const { useThree } = require('@react-three/fiber');
    useThree.mockReturnValueOnce({
      scene: mockScene,
      gl: mockGlWithoutDom,
      renderer: mockRenderer,
      camera: mockCamera
    });

    // Should not throw error
    expect(() => {
      render(<SceneResourceCleanUp {...defaultProps} />);
    }).not.toThrow();
  });
});









