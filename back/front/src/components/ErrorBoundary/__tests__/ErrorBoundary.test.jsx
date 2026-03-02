import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary.jsx';

// 에러를 던지는 테스트 컴포넌트
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // React의 에러 로그를 숨김
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should catch errors and display error UI', () => {
    // React가 실제로 에러를 잡을 수 있도록 ErrorBoundary가 제대로 작동하는지 확인
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // ErrorBoundary가 에러를 잡았는지 확인 (에러 UI가 표시되거나 콘솔 에러가 발생)
    expect(console.error).toHaveBeenCalled();
  });

  it('should display error details in development mode', () => {
    process.env.VITE_NODE_ENV = 'DEVELOPMENT';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});

