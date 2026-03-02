import React from 'react';
import { render } from '@testing-library/react';
import LoadingForm from '../Loading/Loading.jsx';

describe('LoadingForm Component', () => {
  it('should render loading component', () => {
    const { container } = render(<LoadingForm />);
    // id="load" 요소가 있는지 확인
    const loadingElement = container.querySelector('#load');
    expect(loadingElement).toBeInTheDocument();
    // 기본적인 렌더링 확인
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with multiple div elements', () => {
    const { container } = render(<LoadingForm />);
    // 여러 div 요소가 렌더링되는지 확인
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });
});

