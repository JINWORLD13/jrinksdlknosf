/**
 * WebGLMonitor 테스트
 * Three.js와 WebGL 컨텍스트 모킹 필요
 */

import React from 'react';
import { render } from '@testing-library/react';
import { WebGLMonitor } from '../../components/ThreeScene/Utils/WebGLMonitor.jsx';

// @react-three/fiber 모킹
const mockGl = {
  domElement: document.createElement('canvas'),
};

jest.mock('@react-three/fiber', () => ({
  useThree: jest.fn(() => ({ gl: mockGl })),
}));

describe('WebGLMonitor', () => {
  beforeEach(() => {
    // 이벤트 리스너 초기화
    mockGl.domElement.removeEventListener = jest.fn();
    mockGl.domElement.addEventListener = jest.fn();
  });

  it('should set up WebGL context event listeners', () => {
    render(<WebGLMonitor />);

    expect(mockGl.domElement.addEventListener).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(mockGl.domElement.addEventListener).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = render(<WebGLMonitor />);
    
    unmount();

    expect(mockGl.domElement.removeEventListener).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(mockGl.domElement.removeEventListener).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );
  });

  it('should handle context lost event', () => {
    const { useThree } = require('@react-three/fiber');
    render(<WebGLMonitor />);

    // 이벤트 리스너 가져오기
    const addEventListenerCalls = mockGl.domElement.addEventListener.mock.calls;
    const contextLostHandler = addEventListenerCalls.find(
      call => call[0] === 'webglcontextlost'
    )[1];

    // 이벤트 시뮬레이션
    const mockEvent = { preventDefault: jest.fn() };
    const originalError = console.error;
    console.error = jest.fn();

    contextLostHandler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    console.error = originalError;
  });
});









