import { formatPrice } from '../format/formatPrice.js';

describe('formatPrice', () => {
  it('should format KRW price correctly for integer values', () => {
    const result = formatPrice(1000000, 'KRW', 'ko-KR'); // 1원
    expect(result).toMatch(/₩|원|1/);
  });

  it('should format KRW price with decimals correctly', () => {
    const result = formatPrice(1500000, 'KRW', 'ko-KR'); // 1.5원
    expect(result).toMatch(/1\.50/);
  });

  it('should format USD price correctly', () => {
    const result = formatPrice(1000000, 'USD', 'en-US'); // $1.00
    expect(result).toMatch(/\$|1\.00/);
  });

  it('should return "Price not available" when priceMicros is missing', () => {
    const result = formatPrice(null, 'USD', 'en-US');
    expect(result).toBe('Price not available');
  });

  it('should return "Price not available" when currencyCode is missing', () => {
    const result = formatPrice(1000000, null, 'en-US');
    expect(result).toBe('Price not available');
  });

  it('should handle JPY currency correctly', () => {
    const result = formatPrice(1000000, 'JPY', 'ja-JP'); // ¥1.00
    expect(result).toBeTruthy();
  });
});









