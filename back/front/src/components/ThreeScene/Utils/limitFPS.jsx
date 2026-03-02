export function limitFPS(callback, FPS = 20) {
  // 일정 간격으로만 프레임을 업데이트
  // FPS를 낮추는 것이 더 효과적입니다.
  // 100 FPS로 제한하게 되면 시스템은 계속해서 최대 프레임을 처리해야 하므로, 리소스가 많이 소모될 수 있습니다.
  // 반면, 30 FPS나 60 FPS로 제한하면 부하를 줄여 성능이 더 안정적으로 유지
  // FPS가 너무 낮으면 화면이 끊겨서 나옴.
  return (state, delta) => {
    // if (delta > 1 / FPS) return; // 20 FPS초과로 제한
    if (delta < 1 / FPS) {
      callback(state, delta);
    }
  };
}
