import React from 'react';
import { render } from '@testing-library/react';
import { measureRenderTime } from '../../../__tests__/performance.test.js';
import LoadingForm from '../../Loading/Loading.jsx';

describe('Component Render Performance', () => {
  it('should render Loading component within acceptable time', () => {
    const renderFn = () => {
      render(<LoadingForm />);
    };

    const result = measureRenderTime(renderFn, 5);

    // 렌더링이 100ms 이내에 완료되어야 함 (일반적인 기준)
    expect(parseFloat(result.average)).toBeLessThan(100);
    expect(parseFloat(result.max)).toBeLessThan(200);
  });

  it('should have consistent render times', () => {
    const renderFn = () => {
      render(<LoadingForm />);
    };

    const result = measureRenderTime(renderFn, 10);

    // 최대값과 최소값의 차이가 너무 크지 않아야 함 (일관성)
    const variance = parseFloat(result.max) - parseFloat(result.min);
    expect(variance).toBeLessThan(50); // 50ms 이내의 차이
  });
});









