import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Browser } from '@capacitor/browser';
import { isDevelopmentMode } from '@/utils/constants';
import i18n from '@/locales/i18n';

/**
 * 버전 정보 인터페이스
 * @typedef {Object} VersionInfo
 * @property {string} latestVersion - 최신 버전
 * @property {string} minimumVersion - 최소 지원 버전
 * @property {Object} updateUrl - 스토어 URL
 * @property {string} updateUrl.ios - iOS 앱스토어 URL
 * @property {string} updateUrl.android - Android 플레이스토어 URL
 */

export class VersionCheckService {
  constructor(abortSignal = null) {
    this.serverUrl = import.meta.env.VITE_SERVER_URL;
    this.currentVersion = null;
    this.abortSignal = abortSignal;
  }

  /**
   * 현재 앱 버전 정보 가져오기 (Capacitor App 플러그인 사용)
   */
  async getCurrentVersion() {
    try {
      const appInfo = await App.getInfo();
      this.currentVersion = appInfo.version;
      return this.currentVersion;
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Failed to get app version:', error);
      }
      // 웹 환경이거나 에러 시 package.json 버전 사용
      return null;
    }
  }

  /**
   * 서버에서 최신 버전 정보 가져오기
   * @returns {Promise<VersionInfo>}
   */
  async fetchLatestVersion() {
    try {
      const fetchOptions = {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 (중요!)
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        ...(this.abortSignal && { signal: this.abortSignal }),
      };

      const response = await fetch(
        `${this.serverUrl}/version/check`,
        fetchOptions
      );

      if (!response.ok) {
        throw new Error('버전 정보를 가져올 수 없습니다.');
      }
      return await response.json();
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Version check API failed:', error);
      }
      throw error;
    }
  }

  /**
   * 버전 비교 (semantic versioning)
   * @param {string} current - 현재 버전 (예: "1.3.79")
   * @param {string} minimum - 최소 버전 (예: "1.3.0")
   * @returns {boolean} true면 현재 버전이 최소 버전 이상, false면 업데이트 필요
   */
  compareVersions(current, minimum) {
    const currentParts = current.split('.').map(Number);
    const minimumParts = minimum.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const currentPart = currentParts[i] || 0;
      const minimumPart = minimumParts[i] || 0;

      if (currentPart > minimumPart) return true;
      if (currentPart < minimumPart) return false;
    }
    return true; // 같은 버전
  }

  /**
   * 업데이트 필요 여부 확인
   * @returns {Promise<boolean>} true면 업데이트 필요, false면 정상
   */
  async checkUpdateRequired() {
    try {
      // 현재 앱 버전 가져오기
      const currentVersion = await this.getCurrentVersion();
      if (!currentVersion) {
        if (isDevelopmentMode) {
          console.warn('Cannot get current version, skipping version check.');
        }
        return false;
      }

      // 서버에서 최신 버전 정보 가져오기
      const versionInfo = await this.fetchLatestVersion();

      // 버전 비교
      const isVersionOk = this.compareVersions(
        currentVersion,
        versionInfo.minimumVersion
      );

      return !isVersionOk; // 버전이 낮으면 true (업데이트 필요)
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Version check error:', error);
      }
      // 네트워크 오류 등의 경우 앱 사용 허용
      return false;
    }
  }

  /**
   * 앱 스토어로 이동
   * @param {VersionInfo} versionInfo
   */
  async openStore(versionInfo) {
    try {
      const info = await App.getInfo();
      const platform = info.platform;

      const url =
        platform === 'ios'
          ? versionInfo.updateUrl.ios
          : versionInfo.updateUrl.android;

      // Capacitor Browser 플러그인 사용 (외부 브라우저로 열기)
      await Browser.open({ url });
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Failed to open store:', error);
      }
      // 폴백: window.open 사용
      const info = await App.getInfo();
      const platform = info.platform;
      const url =
        platform === 'ios'
          ? versionInfo.updateUrl.ios
          : versionInfo.updateUrl.android;
      window.open(url, '_system');
    }
  }

  /**
   * 업데이트 다이얼로그 표시 및 앱 종료
   */
  async showUpdateDialog() {
    try {
      const versionInfo = await this.fetchLatestVersion();

      const { value } = await Dialog.confirm({
        title: i18n.t('versionCheck.updateRequired.title'),
        message: i18n.t('versionCheck.updateRequired.message'),
        okButtonTitle: i18n.t('versionCheck.updateRequired.okButton'),
        cancelButtonTitle: i18n.t('versionCheck.updateRequired.cancelButton'),
      });

      if (value) {
        // 업데이트 버튼 클릭 - 스토어로 이동
        await this.openStore(versionInfo);
        // 스토어로 이동 후 앱 종료
        await App.exitApp();
      } else {
        // 취소 버튼 클릭 시 앱 종료
        await Dialog.alert({
          title: i18n.t('versionCheck.appExit.title'),
          message: i18n.t('versionCheck.appExit.message'),
          buttonTitle: i18n.t('versionCheck.appExit.okButton'),
        });
        await App.exitApp();
      }
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Update dialog error:', error);
      }
      // 에러 발생 시에도 앱 종료 (보안상)
      await App.exitApp();
    }
  }
}
