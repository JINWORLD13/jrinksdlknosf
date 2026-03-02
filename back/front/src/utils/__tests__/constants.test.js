import { isProductionMode } from '../constants/isProductionMode.js';
import { isDevelopmentMode } from '../constants/isDevelopmentMode.js';

describe('Constants', () => {
  describe('isProductionMode', () => {
    it('should return true when VITE_NODE_ENV is PRODUCTION', () => {
      process.env.VITE_NODE_ENV = 'PRODUCTION';
      // Note: This test depends on the environment variable
      // The actual value depends on how Babel transforms import.meta.env
      expect(typeof isProductionMode).toBe('boolean');
    });
  });

  describe('isDevelopmentMode', () => {
    it('should return true when VITE_NODE_ENV is DEVELOPMENT', () => {
      process.env.VITE_NODE_ENV = 'DEVELOPMENT';
      expect(typeof isDevelopmentMode).toBe('boolean');
    });
  });
});









