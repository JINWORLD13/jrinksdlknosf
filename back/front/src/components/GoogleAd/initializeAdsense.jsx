import { Analytics } from '@/analytics';

export const initializeAdSense = async (
  setError,
  setAdLoaded,
  setIsLoading,
  handleConfirm
) => {
  const pushAd = () => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      if(setAdLoaded) {
        setAdLoaded(true);
        // Firebase Analytics: 웹 광고 노출
        Analytics.ad_impression('banner', 'adsense_web');
      }
      if(setIsLoading) setIsLoading(false);
      if(handleConfirm) handleConfirm();
      // setTimeout(() => setShowConfirmButton(true), 5000);
      //! 서버와 연결. 타로 이용권 1장 주기(all-pass-for-ad 이용권도 넣어야 함).
    } catch (e) {
      console.error('AdSense error:', e);
      setError(content?.errors?.AdSense_LOAD_FAILED);
      if(setIsLoading) setIsLoading(false);
      throw e;
    }
  };

  if (window.adsbygoogle) {
    pushAd();
    return () => {}; // 빈 클린업 함수 반환
  } else {
    let attempts = 0;
    const maxAttempts = 4; // 2초 동안 시도 (4 * 500ms)
    let timeoutId;

    const checkAdSense = async () => {
      while (attempts < maxAttempts) {
        // 최대 시도 횟수 초과하지 않을 경우, pushAd() 함수가 호출되고  AdSense가 로드(checkAdSense함수가 즉시 종료).
        if (window.adsbygoogle) {
          pushAd();
          return () => {
            if (timeoutId) clearTimeout(timeoutId);
          };
        }
        await new Promise(resolve => (timeoutId = setTimeout(resolve, 500)));
        attempts++;
      }
      // 최대 시도 횟수 초과할 경우, 에러 발생 및 에러를 throw하여 상위 컴포넌트에서 처리
      setError('AdSense_NOT_AVAILABLE');
      if(setIsLoading) setIsLoading(false);
      throw new Error('AdSense not available after maximum attempts');
    };

    return await checkAdSense();
  }
};

