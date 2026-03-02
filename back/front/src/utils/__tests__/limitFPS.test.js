import { limitFPS } from '../../components/ThreeScene/Utils/limitFPS.jsx';

describe('limitFPS', () => {
  let callback;
  let limitedCallback;

  beforeEach(() => {
    callback = jest.fn();
    limitedCallback = limitFPS(callback, 20); // 20 FPS 제한
  });

  it('should call callback when delta is less than 1/FPS', () => {
    const state = {};
    const delta = 0.04; // 1/25 = 0.04 (25 FPS, should pass)
    limitedCallback(state, delta);
    expect(callback).toHaveBeenCalledWith(state, delta);
  });

  it('should not call callback when delta is greater than 1/FPS', () => {
    const state = {};
    const delta = 0.06; // 1/16.67 = 0.06 (16 FPS, should fail)
    limitedCallback(state, delta);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should work with different FPS values', () => {
    const callback30 = jest.fn();
    const limited30 = limitFPS(callback30, 30);
    
    // 30 FPS = 1/30 ≈ 0.033
    limited30({}, 0.03); // should pass
    expect(callback30).toHaveBeenCalled();
    
    callback30.mockClear();
    limited30({}, 0.04); // should fail
    expect(callback30).not.toHaveBeenCalled();
  });
});

