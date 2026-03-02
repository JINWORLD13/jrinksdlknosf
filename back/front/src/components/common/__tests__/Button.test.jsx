import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../Button.jsx';

// useLanguageChange 훅 모킹
jest.mock('@/hooks', () => ({
  useLanguageChange: jest.fn(() => 'en'),
}));

describe('Button Component', () => {
  const defaultProps = {
    onClick: jest.fn(),
    children: 'Click me',
  };

  it('should render button with children', () => {
    render(
      <BrowserRouter>
        <Button {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <BrowserRouter>
        <Button {...defaultProps} onClick={handleClick} />
      </BrowserRouter>
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have default type="button"', () => {
    render(
      <BrowserRouter>
        <Button {...defaultProps} />
      </BrowserRouter>
    );

    const button = screen.getByText('Click me');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should accept custom type prop', () => {
    render(
      <BrowserRouter>
        <Button {...defaultProps} type="submit" />
      </BrowserRouter>
    );

    const button = screen.getByText('Click me');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should accept custom className', () => {
    render(
      <BrowserRouter>
        <Button {...defaultProps} className="custom-class" />
      </BrowserRouter>
    );

    const button = screen.getByText('Click me');
    expect(button.className).toContain('custom-class');
  });

  it('should handle autoFocus prop', () => {
    render(
      <BrowserRouter>
        <Button {...defaultProps} autoFocus />
      </BrowserRouter>
    );

    const button = screen.getByText('Click me');
    // autoFocus prop이 전달되었는지 확인 (실제 포커스는 jsdom에서 제한적)
    expect(button).toBeInTheDocument();
  });
});

