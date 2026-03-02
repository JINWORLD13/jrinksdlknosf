import { useState, useEffect } from 'react';
import { VersionCheckService } from '@/services/versionCheck';
import { Capacitor } from '@capacitor/core';
import { isDevelopmentMode } from '@/utils/constants';

/**
 * 앱 버전 체크 커스텀 훅
 * - 네이티브 플랫폼에서만 실행
 * - 개발 모드에서는 스킵 가능
 * - 앱 시작 시 자동으로 버전 체크
 *
 * @returns {Object} { isCheckingVersion, canUseApp }
 */
export const useVersionCheck = () => {
  const [isCheckingVersion, setIsCheckingVersion] = useState(true);
  const [canUseApp, setCanUseApp] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();

    const checkAppVersion = async () => {
      try {
        const isNative = Capacitor.isNativePlatform();

        // 웹 환경이면 바로 앱 사용 허용
        if (!isNative) {
          if (isDevelopmentMode) {
            console.log('[Version check] Web - skip');
          }
          if (!isCancelled) {
            setCanUseApp(true);
            setIsCheckingVersion(false);
          }
          return;
        }

        // 개발 모드에서는 버전 체크 스킵 (선택사항)
        if (isDevelopmentMode) {
          console.log('[Version check] Dev mode - skip');
          if (!isCancelled) {
            setCanUseApp(true);
            setIsCheckingVersion(false);
          }
          return;
        }

        // 네이티브 앱에서 버전 체크 실행
        if (isDevelopmentMode) {
          console.log('[Version Check] Native App - start version check');
        }
        const versionChecker = new VersionCheckService(abortController.signal);
        const updateRequired = await versionChecker.checkUpdateRequired();

        if (isCancelled) return; // 취소되었으면 중단

        if (updateRequired) {
          if (isDevelopmentMode) {
            console.log('[Version check] Update needed - show dialog');
          }
          // 업데이트 필요 - 다이얼로그 표시 후 앱 종료
          await versionChecker.showUpdateDialog();
          // 다이얼로그에서 앱 종료 처리됨
        } else {
          if (isDevelopmentMode) {
            console.log('[Version check] Latest - allow app');
          }
          // 업데이트 불필요 - 앱 사용 가능
          if (!isCancelled) {
            setCanUseApp(true);
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          if (isDevelopmentMode) {
            console.log('[Version Check] Cancelled');
          }
          return;
        }
        if (isDevelopmentMode) {
          console.error('[Version check] Error:', error);
        }
        // 네트워크 오류 시 앱 사용 허용 (사용자 경험 우선)
        if (!isCancelled) {
          setCanUseApp(true);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingVersion(false);
        }
      }
    };

    checkAppVersion();

    // 클린업 함수
    return () => {
      isCancelled = true;
      abortController.abort(); // fetch 취소
      if (isDevelopmentMode) {
        console.log('[Version check] Cleanup');
      }
    };
  }, []);

  return {
    isCheckingVersion,
    canUseApp,
  };
};

export default useVersionCheck;
