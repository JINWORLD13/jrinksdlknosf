/**
 * Firebase Analytics 서비스 - 완전 무료, 용량 무제한 분석
 * Firebase Analyticsサービス - 完全無料・無制限分析
 * Firebase Analytics service - free, unlimited analytics
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserProperties,
  setUserId,
} from 'firebase/analytics';
import { Capacitor } from '@capacitor/core';
import { isDevelopmentMode } from '../utils/constants/isDevelopmentMode';

const isNative = Capacitor.isNativePlatform();

// Analytics 수집 제외 이메일 (.env의 VITE_ANALYTICS_EXCLUDE_EMAIL만 사용)
// Analytics収集除外メール（.envのVITE_ANALYTICS_EXCLUDE_EMAILのみ使用）
// Email to exclude from analytics (use VITE_ANALYTICS_EXCLUDE_EMAIL in .env only)
const ANALYTICS_EXCLUDE_EMAIL = (
  import.meta.env.VITE_ANALYTICS_EXCLUDE_EMAIL || ''
)
  .trim()
  .toLowerCase();

// Firebase 설정 (.env에서 로드)
// Firebase設定（.envから読み込み）
// Firebase config (loaded from .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Firebase Analytics 인스턴스
// Firebase Analyticsインスタンス
// Firebase Analytics instance
let analytics = null;
let initialized = false;

// 웹에서만 초기화 (네이티브는 별도 플러그인 사용)
// Webのみ初期化（ネイティブは別プラグイン使用）
// Initialize on web only (native uses separate plugin)
if (!isNative && typeof window !== 'undefined') {
  try {
    // 이미 초기화된 앱이 있는지 확인
    // 既に初期化済みアプリがあるか確認
    // Check if app is already initialized
    const existingApps = getApps();
    const app =
      existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);

    analytics = getAnalytics(app);
    initialized = true;
    console.log('Firebase Analytics init success (firebaseAnalytics.js)');

    // 개발 환경: DebugView(Developer traffic)로 이벤트가 들어가도록 debug_mode 활성화
    // (GA4 측 "Developer traffic" data filter로 제외 가능)
    if (isDevelopmentMode && firebaseConfig.measurementId && window.gtag) {
      try {
        window.gtag('config', firebaseConfig.measurementId, {
          debug_mode: true,
        });
      } catch (e) {
        console.warn('Firebase Analytics debug_mode set failed:', e);
      }
    }
  } catch (error) {
    console.error('Firebase init failed:', error);
  }
}

class FirebaseAnalyticsService {
  constructor() {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.collectionEnabled = true;
  }

  /**
   * 한글: 특정 이메일 계정은 Analytics 수집 제외
   */
  applyEmailFilter(email) {
    const normalized = String(email || '')
      .trim()
      .toLowerCase();

    const shouldDisable =
      normalized.length > 0 && normalized === ANALYTICS_EXCLUDE_EMAIL;
    this.setCollectionEnabled(!shouldDisable);

    if (isDevelopmentMode && normalized) {
      console.log('Firebase Analytics Email Filter:', {
        email: normalized,
        excluded: shouldDisable,
      });
    }
  }

  /**
   * 한글: Analytics 수집 on/off (웹 전용)
   */
  setCollectionEnabled(enabled) {
    this.collectionEnabled = !!enabled;
    if (initialized && analytics) {
      try {
        setAnalyticsCollectionEnabled(analytics, this.collectionEnabled);
      } catch (e) {
        console.warn('Firebase Analytics collectionEnabled set failed:', e);
      }
    }
  }

  /**
   * 한글: 세션 ID 생성
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 한글: 사용자 ID 설정
   */
  setUser(userId) {
    this.userId = userId;

    if (initialized && analytics) {
      setUserId(analytics, userId);
      console.log('Firebase set user ID:', userId);
    }
  }

  /**
   * 한글: 사용자 속성 설정
   */
  setUserProps(properties) {
    if (initialized && analytics) {
      setUserProperties(analytics, properties);
      console.log('Firebase set user properties:', properties);
    }
  }

  /**
   * 한글: 이벤트 추적
   */
  trackEvent(eventName, params = {}) {
    if (!this.collectionEnabled) return;

    // Firebase 이벤트 이름 규칙: 40자 이하, 영문+숫자+언더스코어만
    const cleanEventName = eventName
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .substring(0, 40);

    if (initialized && analytics) {
      logEvent(analytics, cleanEventName, params);
      if (isDevelopmentMode) {
        console.log(`Firebase event: ${cleanEventName}`, params);
      }
    } else {
      if (isDevelopmentMode) {
        console.debug('Firebase not initialized, event:', cleanEventName);
      }
    }
  }

  // ==================== 타로 앱 특화 이벤트 ====================

  /**
   * 한글: 페이지 뷰
   */
  trackPageView(pageName, pagePath = '') {
    this.trackEvent('page_view', {
      page_name: pageName,
      page_path: pagePath,
    });
  }

  /**
   * 한글: 타로 점 시작
   */
  trackTarotReading(spreadType, cardCount, hasQuestion = false) {
    this.trackEvent('tarot_reading_start', {
      spread_type: spreadType,
      card_count: cardCount,
      has_question: hasQuestion,
    });
  }

  /**
   * 한글: 타로 스프레드 선택
   */
  trackSpreadSelection(spreadType, spreadMode = 'normal') {
    this.trackEvent('spread_selected', {
      spread_type: spreadType,
      spread_mode: spreadMode, // 'quick', 'detailed', 'normal'
    });
  }

  /**
   * 한글: 카드 선택
   */
  trackCardSelection(cardName, cardNumber, position, isReversed = false) {
    this.trackEvent('card_selected', {
      card_name: cardName,
      card_number: cardNumber,
      position: position,
      is_reversed: isReversed,
    });
  }

  /**
   * 한글: 타로 점 완료
   */
  trackTarotComplete(spreadType, duration) {
    this.trackEvent('tarot_reading_complete', {
      spread_type: spreadType,
      duration_seconds: Math.floor(duration / 1000),
    });
  }

  /**
   * 한글: 타로 결과 공유
   */
  trackTarotShare(platform, spreadType) {
    this.trackEvent('share', {
      method: platform, // Firebase 표준 파라미터
      content_type: 'tarot_reading',
      spread_type: spreadType,
    });
  }

  /**
   * 한글: 결제 시작
   */
  trackPurchaseStart(productId, price, currency = 'KRW') {
    this.trackEvent('begin_checkout', {
      // Firebase 표준 이벤트
      currency: currency,
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productId,
          price: price,
        },
      ],
    });
  }

  /**
   * 한글: 결제 완료
   */
  trackPurchase(productId, price, currency = 'KRW', transactionId = null) {
    this.trackEvent('purchase', {
      // Firebase 표준 이벤트
      currency: currency,
      value: price,
      transaction_id: transactionId || `txn_${Date.now()}`,
      items: [
        {
          item_id: productId,
          item_name: productId,
          price: price,
          quantity: 1,
        },
      ],
    });
  }

  /**
   * 한글: 상품 조회
   */
  trackViewItem(productId, productName, price, currency = 'KRW') {
    this.trackEvent('view_item', {
      // Firebase 표준 이벤트
      currency: currency,
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  }

  /**
   * 한글: 광고 클릭
   */
  trackAdClick(adType, adId, adPosition = '') {
    this.trackEvent('ad_click', {
      ad_type: adType,
      ad_id: adId,
      ad_position: adPosition,
    });
  }

  /**
   * 한글: 광고 노출
   */
  trackAdImpression(adType, adId) {
    this.trackEvent('ad_impression', {
      ad_type: adType,
      ad_id: adId,
    });
  }

  /**
   * 한글: 검색
   */
  trackSearch(searchTerm) {
    this.trackEvent('search', {
      // Firebase 표준 이벤트
      search_term: searchTerm,
    });
  }

  /**
   * 한글: 로그인
   */
  trackLogin(method = 'google') {
    this.trackEvent('login', {
      // Firebase 표준 이벤트
      method: method,
    });
  }

  /**
   * 한글: 회원가입
   */
  trackSignUp(method = 'google') {
    this.trackEvent('sign_up', {
      // Firebase 표준 이벤트
      method: method,
    });
  }

  /**
   * 한글: 튜토리얼 시작
   */
  trackTutorialBegin() {
    this.trackEvent('tutorial_begin'); // Firebase 표준 이벤트
  }

  /**
   * 한글: 튜토리얼 완료
   */
  trackTutorialComplete() {
    this.trackEvent('tutorial_complete'); // Firebase 표준 이벤트
  }

  /**
   * 한글: 레벨 업 (사용자 등급 변경)
   */
  trackLevelUp(tier, level = 1) {
    this.trackEvent('level_up', {
      // Firebase 표준 이벤트
      level: level,
      character: tier, // 'free', 'premium', etc.
    });
  }

  /**
   * 한글: 앱 실행
   */
  trackAppOpen() {
    this.trackEvent('app_open');
  }

  /**
   * 한글: 화면 체류 시간
   */
  trackEngagement(screenName, duration) {
    this.trackEvent('user_engagement', {
      engagement_time_msec: duration,
      screen_name: screenName,
    });
  }

  /**
   * 한글: 설정 변경
   */
  trackSettingChange(settingName, newValue) {
    this.trackEvent('setting_changed', {
      setting_name: settingName,
      new_value: String(newValue),
    });
  }

  /**
   * 한글: 에러 추적
   */
  trackError(errorType, errorMessage) {
    this.trackEvent('app_error', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // 100자 제한
    });
  }

  /**
   * 한글: 모달 열기
   */
  trackModalOpen(modalName, trigger = '') {
    this.trackEvent('modal_opened', {
      modal_name: modalName,
      trigger: trigger,
    });
  }

  /**
   * 한글: 모달 닫기
   */
  trackModalClose(modalName, action = 'close') {
    this.trackEvent('modal_closed', {
      modal_name: modalName,
      action: action, // 'close', 'confirm', 'cancel'
    });
  }

  /**
   * 한글: 버튼 클릭
   */
  trackButtonClick(buttonName, screen = '', action = '') {
    this.trackEvent('button_click', {
      button_name: buttonName,
      screen: screen,
      action: action,
    });
  }

  /**
   * 한글: 앱 업데이트
   */
  trackAppUpdate(oldVersion, newVersion) {
    this.trackEvent('app_update', {
      old_version: oldVersion,
      new_version: newVersion,
    });
  }

  /**
   * 한글: 알림 권한 요청
   */
  trackNotificationPermission(granted) {
    this.trackEvent('notification_permission', {
      granted: granted,
    });
  }

  /**
   * 한글: 즐겨찾기 추가
   */
  trackAddToFavorites(contentType, contentId) {
    this.trackEvent('add_to_favorites', {
      content_type: contentType,
      content_id: contentId,
    });
  }

  /**
   * 한글: 평점 제출
   */
  trackRating(rating, contentType = 'app') {
    this.trackEvent('rate_app', {
      rating: rating,
      content_type: contentType,
    });
  }

  /**
   * 한글: 사용자 피드백
   */
  trackFeedback(feedbackType, rating = null) {
    this.trackEvent('user_feedback', {
      feedback_type: feedbackType,
      rating: rating,
    });
  }

  /**
   * 한글: 성능 측정
   */
  trackPerformance(metricName, value) {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      value: value,
    });
  }

  /**
   * 한글: 컨텐츠 조회 시작
   */
  trackContentView(contentType, contentId, contentName) {
    this.trackEvent('view_item', {
      content_type: contentType,
      item_id: contentId,
      item_name: contentName,
    });
  }

  /**
   * 한글: 앱 첫 실행
   */
  trackFirstOpen() {
    this.trackEvent('first_open');
  }

  /**
   * 한글: 언어 변경
   */
  trackLanguageChange(fromLang, toLang) {
    this.trackEvent('language_changed', {
      from_language: fromLang,
      to_language: toLang,
    });
  }

  /**
   * 한글: 테마 변경
   */
  trackThemeChange(theme) {
    this.trackEvent('theme_changed', {
      theme: theme,
    });
  }

  /**
   * 한글: 음악 재생
   */
  trackMusicPlay(trackName, autoPlay = false) {
    this.trackEvent('music_play', {
      track_name: trackName,
      auto_play: autoPlay,
    });
  }

  /**
   * 한글: 음악 정지
   */
  trackMusicStop(trackName, duration) {
    this.trackEvent('music_stop', {
      track_name: trackName,
      duration_seconds: Math.floor(duration / 1000),
    });
  }

  /**
   * 한글: 타로 히스토리 조회
   */
  trackViewHistory(historyCount) {
    this.trackEvent('view_history', {
      item_count: historyCount,
    });
  }

  /**
   * 한글: 타로 결과 저장
   */
  trackSaveReading(spreadType) {
    this.trackEvent('save_reading', {
      spread_type: spreadType,
    });
  }

  /**
   * 한글: 질문 입력
   */
  trackQuestionInput(questionLength, hasQuestion) {
    this.trackEvent('question_input', {
      question_length: questionLength,
      has_question: hasQuestion,
    });
  }

  /**
   * 한글: AI 해석 요청
   */
  trackAIInterpretation(spreadType, cardCount) {
    this.trackEvent('ai_interpretation', {
      spread_type: spreadType,
      card_count: cardCount,
    });
  }

  /**
   * 한글: 앱 설정 열기
   */
  trackOpenSettings() {
    this.trackEvent('open_settings');
  }

  /**
   * 한글: 도움말 보기
   */
  trackViewHelp(helpTopic) {
    this.trackEvent('view_help', {
      help_topic: helpTopic,
    });
  }

  /**
   * 한글: 외부 링크 클릭
   */
  trackExternalLink(linkUrl, linkName) {
    this.trackEvent('external_link_click', {
      link_url: linkUrl,
      link_name: linkName,
    });
  }

  /**
   * 한글: 앱 재방문
   */
  trackAppReturn(daysSinceLastVisit) {
    this.trackEvent('app_return', {
      days_since_last_visit: daysSinceLastVisit,
    });
  }

  /**
   * 한글: 쿠폰 사용
   */
  trackCouponUse(couponCode, discountAmount) {
    this.trackEvent('coupon_used', {
      coupon_code: couponCode,
      discount_amount: discountAmount,
    });
  }

  /**
   * 한글: 환불 요청
   */
  trackRefundRequest(productId, reason) {
    this.trackEvent('refund_requested', {
      product_id: productId,
      reason: reason,
    });
  }

  /**
   * 한글: 소셜 공유
   */
  trackSocialShare(platform, contentType = 'tarot_reading') {
    this.trackEvent('share', {
      // Firebase 표준
      method: platform,
      content_type: contentType,
    });
  }

  /**
   * 한글: 사용자 피드백 제출
   */
  trackSubmitFeedback(feedbackType, rating) {
    this.trackEvent('submit_feedback', {
      feedback_type: feedbackType,
      rating: rating,
    });
  }

  /**
   * 한글: 알림 클릭
   */
  trackNotificationClick(notificationType) {
    this.trackEvent('notification_click', {
      notification_type: notificationType,
    });
  }

  /**
   * 한글: 검색 필터 사용
   */
  trackFilterUse(filterType, filterValue) {
    this.trackEvent('filter_used', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  /**
   * 한글: 앱 충돌
   */
  trackAppCrash(errorMessage, stackTrace) {
    this.trackEvent('app_crash', {
      error_message: errorMessage.substring(0, 100),
      has_stack_trace: !!stackTrace,
    });
  }

  /**
   * 한글: 화면 로딩 시간
   */
  trackScreenLoad(screenName, loadTime) {
    this.trackEvent('screen_load_time', {
      screen_name: screenName,
      load_time_ms: loadTime,
    });
  }

  /**
   * 한글: 광고 제거 구매
   */
  trackRemoveAds(price, duration) {
    this.trackEvent('remove_ads_purchase', {
      price: price,
      duration_days: duration,
    });
  }

  /**
   * 한글: 프리미엄 구독
   */
  trackSubscribe(planType, price, period) {
    this.trackEvent('subscribe', {
      plan_type: planType,
      price: price,
      subscription_period: period, // 'monthly', 'yearly'
    });
  }

  /**
   * 한글: 구독 취소
   */
  trackUnsubscribe(planType, reason) {
    this.trackEvent('unsubscribe', {
      plan_type: planType,
      reason: reason,
    });
  }

  /**
   * 한글: 앱 배경화면 전환
   */
  trackAppBackground() {
    this.trackEvent('app_background');
  }

  /**
   * 한글: 앱 포그라운드 복귀
   */
  trackAppForeground() {
    this.trackEvent('app_foreground');
  }

  /**
   * 한글: 3D 모델 로딩
   */
  track3DModelLoad(modelName, loadTime) {
    this.trackEvent('model_3d_loaded', {
      model_name: modelName,
      load_time_ms: loadTime,
    });
  }

  /**
   * 카드 애니메이션 완료
   */
  trackCardAnimation(animationType) {
    this.trackEvent('card_animation', {
      animation_type: animationType,
    });
  }

  /**
   * 한글: 튜토리얼 단계
   */
  trackTutorialStep(stepNumber, stepName, completed = false) {
    this.trackEvent('tutorial_step', {
      step_number: stepNumber,
      step_name: stepName,
      completed: completed,
    });
  }

  /**
   * 한글: 앱 평가 요청 응답
   */
  trackRatingPrompt(action) {
    this.trackEvent('rating_prompt_response', {
      action: action, // 'rate_now', 'later', 'never'
    });
  }

  /**
   * 한글: 푸시 알림 수신
   */
  trackPushReceived(notificationType) {
    this.trackEvent('push_received', {
      notification_type: notificationType,
    });
  }

  /**
   * 한글: 인앱 리뷰 작성
   */
  trackInAppReview(rating, hasComment) {
    this.trackEvent('in_app_review', {
      rating: rating,
      has_comment: hasComment,
    });
  }

  /**
   * 커뮤니티 기능 사용
   */
  trackCommunityAction(actionType, contentId = '') {
    this.trackEvent('community_action', {
      action_type: actionType, // 'like', 'comment', 'share'
      content_id: contentId,
    });
  }

  /**
   * 일일 접속 보상
   */
  trackDailyReward(day, rewardType) {
    this.trackEvent('daily_reward_claimed', {
      day: day,
      reward_type: rewardType,
    });
  }

  /**
   * 업적 달성
   */
  trackAchievement(achievementId, achievementName) {
    this.trackEvent('unlock_achievement', {
      // Firebase 표준
      achievement_id: achievementId,
      achievement_name: achievementName,
    });
  }

  /**
   * 사용자 세그먼트 변경
   */
  trackSegmentChange(oldSegment, newSegment) {
    this.trackEvent('segment_changed', {
      old_segment: oldSegment,
      new_segment: newSegment,
    });
  }

  /**
   * 앱 권한 요청
   */
  trackPermissionRequest(permissionType, granted) {
    this.trackEvent('permission_requested', {
      permission_type: permissionType,
      granted: granted,
    });
  }

  /**
   * 오프라인 모드 사용
   */
  trackOfflineMode(enabled) {
    this.trackEvent('offline_mode', {
      enabled: enabled,
    });
  }

  /**
   * 데이터 동기화
   */
  trackDataSync(syncType, itemCount) {
    this.trackEvent('data_sync', {
      sync_type: syncType,
      item_count: itemCount,
    });
  }

  // ==================== 퍼널 분석 (Funnel Analysis) ====================

  /**
   * 퍼널 단계 진입
   */
  trackFunnelStep(stepName, stepNumber, totalSteps) {
    this.trackEvent('funnel_step', {
      step_name: stepName,
      step_number: stepNumber,
      total_steps: totalSteps,
    });
  }

  /**
   * 퍼널 이탈
   */
  trackFunnelAbandonment(stepName, stepNumber, timeSpent) {
    this.trackEvent('funnel_abandonment', {
      step_name: stepName,
      step_number: stepNumber,
      time_spent_seconds: Math.floor(timeSpent / 1000),
    });
  }

  /**
   * 퍼널 완료
   */
  trackFunnelCompletion(funnelName, totalTime, stepsCompleted) {
    this.trackEvent('funnel_completion', {
      funnel_name: funnelName,
      total_time_seconds: Math.floor(totalTime / 1000),
      steps_completed: stepsCompleted,
    });
  }

  // ==================== 이탈 지점 추적 ====================

  /**
   * 모달 이탈
   */
  trackModalAbandonment(modalName, timeSpent, lastAction) {
    this.trackEvent('modal_abandonment', {
      modal_name: modalName,
      time_spent_seconds: Math.floor(timeSpent / 1000),
      last_action: lastAction,
    });
  }

  /**
   * 페이지 이탈
   */
  trackPageAbandonment(pageName, timeSpent, scrollDepth) {
    this.trackEvent('page_abandonment', {
      page_name: pageName,
      time_spent_seconds: Math.floor(timeSpent / 1000),
      scroll_depth_percent: scrollDepth,
    });
  }

  /**
   * 세션 중단
   */
  trackSessionAbandonment(sessionDuration, lastPage, reason) {
    this.trackEvent('session_abandonment', {
      session_duration_seconds: Math.floor(sessionDuration / 1000),
      last_page: lastPage,
      reason: reason || 'unknown',
    });
  }

  /**
   * 작업 포기
   */
  trackTaskAbandonment(taskName, stepReached, timeSpent) {
    this.trackEvent('task_abandonment', {
      task_name: taskName,
      step_reached: stepReached,
      time_spent_seconds: Math.floor(timeSpent / 1000),
    });
  }

  // ==================== 전환율 최적화 ====================

  /**
   * 무료에서 유료 전환 시도
   */
  trackFreeToPaidConversionAttempt(source) {
    this.trackEvent('free_to_paid_attempt', {
      source: source, // 'ad', 'feature_limit', 'promotion' 등
    });
  }

  /**
   * 광고 시청 후 결제 전환
   */
  trackAdToPurchaseConversion(adType, timeToPurchase) {
    this.trackEvent('ad_to_purchase_conversion', {
      ad_type: adType,
      time_to_purchase_seconds: Math.floor(timeToPurchase / 1000),
    });
  }

  /**
   * 기능 사용 후 결제 전환
   */
  trackFeatureToPurchaseConversion(featureName, usageCount) {
    this.trackEvent('feature_to_purchase_conversion', {
      feature_name: featureName,
      usage_count: usageCount,
    });
  }

  /**
   * 전환 실패
   */
  trackConversionFailure(conversionType, reason) {
    this.trackEvent('conversion_failure', {
      conversion_type: conversionType,
      failure_reason: reason,
    });
  }

  // ==================== 사용자 세그먼트 분석 ====================

  /**
   * 사용자 세그먼트 설정
   */
  setUserSegment(segment) {
    this.setUserProps({
      user_segment: segment, // 'new', 'returning', 'free', 'paid', 'vip' 등
    });
  }

  /**
   * 신규 사용자 행동
   */
  trackNewUserAction(action, details = {}) {
    this.trackEvent('new_user_action', {
      action: action,
      ...details,
    });
  }

  /**
   * 재방문 사용자 행동
   */
  trackReturningUserAction(action, daysSinceLastVisit, details = {}) {
    this.trackEvent('returning_user_action', {
      action: action,
      days_since_last_visit: daysSinceLastVisit,
      ...details,
    });
  }

  /**
   * 사용자 그룹별 행동 비교
   */
  trackSegmentBehavior(segment, action, value) {
    this.trackEvent('segment_behavior', {
      segment: segment,
      action: action,
      value: value,
    });
  }

  // ==================== 불만/문제점 추적 ====================

  /**
   * 상세 에러 추적
   */
  trackDetailedError(errorType, errorLocation, errorMessage, userAction) {
    this.trackEvent('detailed_error', {
      error_type: errorType,
      error_location: errorLocation,
      error_message: errorMessage.substring(0, 100),
      user_action: userAction,
    });
  }

  /**
   * 로딩 시간 추적
   */
  trackLoadingTime(screenName, loadTime, isSlow = false) {
    this.trackEvent('loading_time', {
      screen_name: screenName,
      load_time_ms: loadTime,
      is_slow: isSlow,
    });
  }

  /**
   * 기능 건너뛰기
   */
  trackFeatureSkip(featureName, reason) {
    this.trackEvent('feature_skip', {
      feature_name: featureName,
      skip_reason: reason,
    });
  }

  /**
   * 상세 환불 이유
   */
  trackDetailedRefund(productId, reason, usageCount, daysSincePurchase) {
    this.trackEvent('detailed_refund', {
      product_id: productId,
      refund_reason: reason,
      usage_count: usageCount,
      days_since_purchase: daysSincePurchase,
    });
  }

  /**
   * 사용자 불만 표시
   */
  trackUserFrustration(location, action, timeSpent) {
    this.trackEvent('user_frustration', {
      location: location,
      action: action,
      time_spent_seconds: Math.floor(timeSpent / 1000),
    });
  }

  // ==================== 리텐션 분석 ====================

  /**
   * 일일 리텐션
   */
  trackDailyRetention(dayNumber, isReturning) {
    this.trackEvent('daily_retention', {
      day_number: dayNumber,
      is_returning: isReturning,
    });
  }

  /**
   * 주간 리텐션
   */
  trackWeeklyRetention(weekNumber, isReturning) {
    this.trackEvent('weekly_retention', {
      week_number: weekNumber,
      is_returning: isReturning,
    });
  }

  /**
   * 월간 리텐션
   */
  trackMonthlyRetention(monthNumber, isReturning) {
    this.trackEvent('monthly_retention', {
      month_number: monthNumber,
      is_returning: isReturning,
    });
  }

  /**
   * 이탈 사용자 재유입
   */
  trackChurnRecovery(daysSinceLastVisit, trigger) {
    this.trackEvent('churn_recovery', {
      days_since_last_visit: daysSinceLastVisit,
      recovery_trigger: trigger, // 'notification', 'promotion', 'feature_update' 등
    });
  }

  /**
   * 재방문 주기
   */
  trackReturnCycle(daysSinceLastVisit, visitCount) {
    this.trackEvent('return_cycle', {
      days_since_last_visit: daysSinceLastVisit,
      total_visits: visitCount,
    });
  }

  // ==================== 사용자 행동 패턴 ====================

  /**
   * 스프레드 타입 사용 빈도
   */
  trackSpreadUsage(spreadType, frequency) {
    this.trackEvent('spread_usage', {
      spread_type: spreadType,
      usage_frequency: frequency,
    });
  }

  /**
   * 질문 길이별 만족도
   */
  trackQuestionLengthSatisfaction(questionLength, wasSaved) {
    this.trackEvent('question_length_satisfaction', {
      question_length: questionLength,
      was_saved: wasSaved,
    });
  }

  /**
   * 시간대별 사용 패턴
   */
  trackTimeBasedUsage(hour, dayOfWeek, action) {
    this.trackEvent('time_based_usage', {
      hour: hour,
      day_of_week: dayOfWeek,
      action: action,
    });
  }

  /**
   * 세션 길이별 행동
   */
  trackSessionLengthBehavior(sessionLength, actionsCount) {
    this.trackEvent('session_length_behavior', {
      session_length_seconds: Math.floor(sessionLength / 1000),
      actions_count: actionsCount,
    });
  }

  /**
   * 사용 패턴 분석
   */
  trackUsagePattern(patternType, details = {}) {
    this.trackEvent('usage_pattern', {
      pattern_type: patternType,
      ...details,
    });
  }

  // ==================== 코호트 분석 ====================

  /**
   * 코호트 그룹 설정
   */
  setCohortGroup(cohortName, cohortDate) {
    this.setUserProps({
      cohort_name: cohortName,
      cohort_date: cohortDate,
    });
  }

  /**
   * 코호트별 행동
   */
  trackCohortBehavior(cohortName, action, value) {
    this.trackEvent('cohort_behavior', {
      cohort_name: cohortName,
      action: action,
      value: value,
    });
  }

  /**
   * 이벤트 참여자 그룹 추적
   */
  trackEventParticipant(eventName, participantId) {
    this.trackEvent('event_participant', {
      event_name: eventName,
      participant_id: participantId,
    });
  }

  // ==================== 관심사/선호도 분석 ====================

  /**
   * 질문 주제별 빈도
   */
  trackQuestionTopic(topic, frequency) {
    this.trackEvent('question_topic', {
      topic: topic,
      frequency: frequency,
    });
  }

  /**
   * 카드 선택 패턴
   */
  trackCardSelectionPattern(cardName, frequency, isReversed) {
    this.trackEvent('card_selection_pattern', {
      card_name: cardName,
      frequency: frequency,
      is_reversed: isReversed,
    });
  }

  /**
   * 모드 선택 패턴
   */
  trackModeSelectionPattern(mode, frequency, spreadType) {
    this.trackEvent('mode_selection_pattern', {
      mode: mode, // 'normal', 'deep', 'serious'
      frequency: frequency,
      spread_type: spreadType,
    });
  }

  /**
   * 선호도 분석
   */
  trackPreference(category, preference, value) {
    this.trackEvent('user_preference', {
      category: category,
      preference: preference,
      value: value,
    });
  }

  // ==================== 소셜/바이럴 추적 ====================

  /**
   * 공유 성공률
   */
  trackShareSuccess(platform, contentType, wasSuccessful) {
    this.trackEvent('share_success', {
      platform: platform,
      content_type: contentType,
      was_successful: wasSuccessful,
    });
  }

  /**
   * 추천 코드 사용률
   */
  trackReferralCodeUsage(referralCode, wasUsed) {
    this.trackEvent('referral_code_usage', {
      referral_code: referralCode,
      was_used: wasUsed,
    });
  }

  /**
   * 바이럴 계수
   */
  trackViralCoefficient(inviterId, inviteeCount) {
    this.trackEvent('viral_coefficient', {
      inviter_id: inviterId,
      invitee_count: inviteeCount,
    });
  }

  /**
   * 소셜 공유 상세
   */
  trackSocialShareDetail(platform, contentType, shareMethod) {
    this.trackEvent('social_share_detail', {
      platform: platform,
      content_type: contentType,
      share_method: shareMethod, // 'button', 'menu', 'auto' 등
    });
  }

  // ==================== 수익 최적화 ====================

  /**
   * ARPU (사용자당 평균 수익)
   */
  trackARPU(userId, totalRevenue, daysActive) {
    this.trackEvent('arpu', {
      user_id: userId,
      total_revenue: totalRevenue,
      days_active: daysActive,
    });
  }

  /**
   * LTV (고객 생애 가치) 예측
   */
  trackLTVPrediction(userId, predictedLTV, factors = {}) {
    this.trackEvent('ltv_prediction', {
      user_id: userId,
      predicted_ltv: predictedLTV,
      ...factors,
    });
  }

  /**
   * 가격대별 구매 분석
   */
  trackPricePointAnalysis(pricePoint, purchaseCount, conversionRate) {
    this.trackEvent('price_point_analysis', {
      price_point: pricePoint,
      purchase_count: purchaseCount,
      conversion_rate: conversionRate,
    });
  }

  /**
   * 수익 최적화 이벤트
   */
  trackRevenueOptimization(action, revenue, margin) {
    this.trackEvent('revenue_optimization', {
      action: action,
      revenue: revenue,
      margin: margin,
    });
  }

  // ==================== 사용자 만족도 추적 ====================

  /**
   * 결과 저장률 (만족도 지표)
   */
  trackResultSaveRate(spreadType, wasSaved, satisfactionLevel) {
    this.trackEvent('result_save_rate', {
      spread_type: spreadType,
      was_saved: wasSaved,
      satisfaction_level: satisfactionLevel, // 1-5
    });
  }

  /**
   * 추가 질문 비율 (해석 만족도)
   */
  trackAdditionalQuestionRate(hasAdditionalQuestion, questionCount) {
    this.trackEvent('additional_question_rate', {
      has_additional_question: hasAdditionalQuestion,
      question_count: questionCount,
    });
  }

  /**
   * 재질문 비율 (불만족 지표)
   */
  trackRequestionRate(originalQuestion, wasRequestioned, timeBetween) {
    this.trackEvent('requestion_rate', {
      original_question: originalQuestion.substring(0, 50),
      was_requestioned: wasRequestioned,
      time_between_seconds: Math.floor(timeBetween / 1000),
    });
  }

  /**
   * 만족도 점수
   */
  trackSatisfactionScore(score, category, details = {}) {
    this.trackEvent('satisfaction_score', {
      score: score, // 1-5 또는 1-10
      category: category,
      ...details,
    });
  }

  // ==================== 기술적 문제 추적 ====================

  /**
   * API 응답 시간
   */
  trackAPIResponseTime(apiName, responseTime, wasSuccessful) {
    this.trackEvent('api_response_time', {
      api_name: apiName,
      response_time_ms: responseTime,
      was_successful: wasSuccessful,
    });
  }

  /**
   * AI 해석 실패율
   */
  trackAIFailure(aiModel, errorType, retryCount) {
    this.trackEvent('ai_failure', {
      ai_model: aiModel,
      error_type: errorType,
      retry_count: retryCount,
    });
  }

  /**
   * 3D 모델 로딩 실패
   */
  track3DModelFailure(modelName, errorType, loadTime) {
    this.trackEvent('3d_model_failure', {
      model_name: modelName,
      error_type: errorType,
      load_time_ms: loadTime,
    });
  }

  /**
   * 네트워크 오류 빈도
   */
  trackNetworkError(errorType, url, statusCode) {
    this.trackEvent('network_error', {
      error_type: errorType,
      url: url.substring(0, 100),
      status_code: statusCode,
    });
  }

  /**
   * 성능 메트릭
   */
  trackPerformanceMetric(metricName, value, threshold) {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      value: value,
      exceeds_threshold: value > threshold,
    });
  }

  // ==================== 마케팅 채널 분석 ====================

  /**
   * 유입 경로 추적
   */
  trackTrafficSource(source, medium, campaign) {
    this.trackEvent('traffic_source', {
      source: source, // 'google', 'direct', 'referral' 등
      medium: medium, // 'organic', 'cpc', 'social' 등
      campaign: campaign,
    });
  }

  /**
   * 캠페인 효과 측정
   */
  trackCampaignEffectiveness(campaignName, conversionType, conversionValue) {
    this.trackEvent('campaign_effectiveness', {
      campaign_name: campaignName,
      conversion_type: conversionType,
      conversion_value: conversionValue,
    });
  }

  /**
   * 키워드별 전환율
   */
  trackKeywordConversion(keyword, conversionType, conversionRate) {
    this.trackEvent('keyword_conversion', {
      keyword: keyword,
      conversion_type: conversionType,
      conversion_rate: conversionRate,
    });
  }

  /**
   * 마케팅 채널 ROI
   */
  trackChannelROI(channel, revenue, cost, roi) {
    this.trackEvent('channel_roi', {
      channel: channel,
      revenue: revenue,
      cost: cost,
      roi: roi,
    });
  }

  // ==================== 추가 질문 기능 ====================

  /**
   * 추가 질문 버튼 클릭
   */
  trackAdditionalQuestionButtonClick(origin = 'durumagi') {
    this.trackEvent('additional_question_button_click', {
      origin: origin, // 'durumagi', 'mypage'
    });
  }

  /**
   * 추가 질문 입력 완료
   */
  trackAdditionalQuestionInput(questionLength, questionCount) {
    this.trackEvent('additional_question_input', {
      question_length: questionLength,
      question_count: questionCount,
    });
  }

  /**
   * 추가 질문 카드 선택
   */
  trackAdditionalQuestionCardSelection(cardName, questionCount) {
    this.trackEvent('additional_question_card_selection', {
      card_name: cardName,
      question_count: questionCount,
    });
  }

  /**
   * 추가 질문 완료
   */
  trackAdditionalQuestionComplete(questionCount, duration, spreadType) {
    this.trackEvent('additional_question_complete', {
      question_count: questionCount,
      duration_seconds: Math.floor(duration / 1000),
      spread_type: spreadType,
    });
  }

  /**
   * 추가 질문 포기/취소
   */
  trackAdditionalQuestionAbandoned(step, questionCount, timeSpent) {
    this.trackEvent('additional_question_abandoned', {
      step: step, // 'button_click', 'input', 'card_selection', 'spread_selection'
      question_count: questionCount,
      time_spent_seconds: Math.floor(timeSpent / 1000),
    });
  }

  // ==================== 결과 저장/복사/다운로드 ====================

  /**
   * 결과 저장
   */
  trackResultSave(spreadType, hasCardMeaning = false) {
    this.trackEvent('result_save', {
      spread_type: spreadType,
      has_card_meaning: hasCardMeaning,
    });
  }

  /**
   * 결과 복사
   */
  trackResultCopy(spreadType, hasCardMeaning = false) {
    this.trackEvent('result_copy', {
      spread_type: spreadType,
      has_card_meaning: hasCardMeaning,
    });
  }

  /**
   * 결과 다운로드
   */
  trackResultDownload(spreadType, hasCardMeaning = false) {
    this.trackEvent('result_download', {
      spread_type: spreadType,
      has_card_meaning: hasCardMeaning,
    });
  }

  /**
   * 결과 읽기 시간
   */
  trackResultReadTime(spreadType, readTime, wordCount) {
    this.trackEvent('result_read_time', {
      spread_type: spreadType,
      read_time_seconds: Math.floor(readTime / 1000),
      word_count: wordCount,
    });
  }

  /**
   * 결과 스크롤 깊이
   */
  trackResultScrollDepth(spreadType, scrollDepth) {
    this.trackEvent('result_scroll_depth', {
      spread_type: spreadType,
      scroll_depth_percent: scrollDepth,
    });
  }

  // ==================== 통계/차트 조회 ====================

  /**
   * 통계 탭 클릭
   */
  trackStatisticsTabClick() {
    this.trackEvent('statistics_tab_click');
  }

  /**
   * 차트 타입 전환
   */
  trackChartTypeChange(chartType, period) {
    this.trackEvent('chart_type_change', {
      chart_type: chartType, // 'major', 'minor', 'cups', 'swords', 'wands', 'pentacles'
      period: period, // 'today', 'this_week', 'this_month', 'total'
    });
  }

  /**
   * 차트 필터 변경
   */
  trackChartFilterChange(filterType, filterValue) {
    this.trackEvent('chart_filter_change', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  /**
   * 통계 조회 시간
   */
  trackStatisticsViewTime(duration) {
    this.trackEvent('statistics_view_time', {
      duration_seconds: Math.floor(duration / 1000),
    });
  }

  /**
   * 특정 기간 통계 클릭
   */
  trackPeriodStatisticsClick(period) {
    this.trackEvent('period_statistics_click', {
      period: period,
    });
  }

  // ==================== 결제 취소/실패 ====================

  /**
   * 결제 취소
   */
  trackPurchaseCancel(productId, price, currency = 'KRW', reason = '') {
    this.trackEvent('purchase_cancel', {
      product_id: productId,
      price: price,
      currency: currency,
      reason: reason,
    });
  }

  /**
   * 결제 실패
   */
  trackPurchaseFailure(
    productId,
    price,
    currency = 'KRW',
    errorType,
    errorMessage = '',
  ) {
    this.trackEvent('purchase_failure', {
      product_id: productId,
      price: price,
      currency: currency,
      error_type: errorType,
      error_message: errorMessage.substring(0, 100),
    });
  }

  /**
   * 상품 상세 조회
   */
  trackProductDetailView(productId, productName, price) {
    this.trackEvent('view_item', {
      item_id: productId,
      item_name: productName,
      price: price,
    });
  }

  /**
   * 이용권 정보 조회
   */
  trackVoucherInfoView() {
    this.trackEvent('voucher_info_view');
  }

  // ==================== 3D 인터랙션 ====================

  /**
   * 크리스탈 볼 클릭/터치
   */
  trackCrystalBallClick() {
    this.trackEvent('crystal_ball_click');
  }

  /**
   * 크리스탈 액션 전환
   */
  trackCrystalActionTransition(fromAction, toAction) {
    this.trackEvent('crystal_action_transition', {
      from_action: fromAction, // 'greeting', 'magic', 'waiting'
      to_action: toAction,
    });
  }

  /**
   * 3D 카드 회전/드래그
   */
  track3DCardInteraction(interactionType, cardName) {
    this.trackEvent('3d_card_interaction', {
      interaction_type: interactionType, // 'rotate', 'drag', 'flip'
      card_name: cardName,
    });
  }

  /**
   * 카드 애니메이션 완료
   */
  trackCardAnimationComplete(animationType, duration) {
    this.trackEvent('card_animation_complete', {
      animation_type: animationType,
      duration_ms: duration,
    });
  }

  /**
   * 3D 씬 로딩 시간
   */
  track3DSceneLoadTime(loadTime) {
    this.trackEvent('3d_scene_load_time', {
      load_time_ms: loadTime,
    });
  }

  // ==================== 결과 모달 상호작용 ====================

  /**
   * 폰트 크기 조절
   */
  trackFontSizeChange(action, fontSize) {
    this.trackEvent('font_size_change', {
      action: action, // 'increase', 'decrease', 'reset'
      font_size: fontSize,
    });
  }

  /**
   * 카드 의미 보기/숨기기 토글
   */
  trackCardMeaningToggle(isVisible) {
    this.trackEvent('card_meaning_toggle', {
      is_visible: isVisible,
    });
  }

  /**
   * 결과 높이 조절
   */
  trackResultHeightToggle(isExpanded) {
    this.trackEvent('result_height_toggle', {
      is_expanded: isExpanded,
    });
  }

  // ==================== 히스토리 상호작용 ====================

  /**
   * 히스토리 항목 클릭
   */
  trackHistoryItemClick(tarotId, spreadType, createdAt) {
    this.trackEvent('history_item_click', {
      tarot_id: tarotId,
      spread_type: spreadType,
      created_at: createdAt,
    });
  }

  /**
   * 히스토리 삭제
   */
  trackHistoryDelete(tarotId, spreadType) {
    this.trackEvent('history_delete', {
      tarot_id: tarotId,
      spread_type: spreadType,
    });
  }

  /**
   * 히스토리 정렬/필터
   */
  trackHistoryFilter(sortBy, filterBy) {
    this.trackEvent('history_filter', {
      sort_by: sortBy,
      filter_by: filterBy,
    });
  }

  /**
   * 히스토리에서 추가 질문 시작
   */
  trackHistoryAdditionalQuestionStart(tarotId) {
    this.trackEvent('history_additional_question_start', {
      tarot_id: tarotId,
    });
  }

  /**
   * 히스토리에서 결과 재조회
   */
  trackHistoryResultReopen(tarotId) {
    this.trackEvent('history_result_reopen', {
      tarot_id: tarotId,
    });
  }

  // ==================== AI 해석 관련 ====================

  /**
   * AI 해석 로딩 시간
   */
  trackAIInterpretationLoadTime(aiModel, loadTime, spreadType) {
    this.trackEvent('ai_interpretation_load_time', {
      ai_model: aiModel, // 'claude', 'gpt', 'grok'
      load_time_ms: loadTime,
      spread_type: spreadType,
    });
  }

  /**
   * AI 해석 실패/재시도
   */
  trackAIInterpretationFailure(aiModel, errorType, retryCount, spreadType) {
    this.trackEvent('ai_interpretation_failure', {
      ai_model: aiModel,
      error_type: errorType,
      retry_count: retryCount,
      spread_type: spreadType,
    });
  }

  /**
   * AI 모델 선택
   */
  trackAIModelSelection(aiModel, spreadType) {
    this.trackEvent('ai_model_selection', {
      ai_model: aiModel,
      spread_type: spreadType,
    });
  }

  // ==================== 네비게이션 ====================

  /**
   * 페이지 이동
   */
  trackNavigation(fromPage, toPage) {
    this.trackEvent('navigation', {
      from_page: fromPage,
      to_page: toPage,
    });
  }

  /**
   * 뒤로가기 버튼 사용
   */
  trackBackButton(fromPage) {
    this.trackEvent('back_button', {
      from_page: fromPage,
    });
  }

  // ==================== 에러/예외 상황 ====================

  /**
   * 네트워크 오류
   */
  trackNetworkError(errorType, url, statusCode) {
    this.trackEvent('network_error', {
      error_type: errorType,
      url: url.substring(0, 100),
      status_code: statusCode,
    });
  }

  /**
   * API 타임아웃
   */
  trackAPITimeout(apiName, timeout) {
    this.trackEvent('api_timeout', {
      api_name: apiName,
      timeout_ms: timeout,
    });
  }

  /**
   * 세션 만료
   */
  trackSessionExpired() {
    this.trackEvent('session_expired');
  }

  /**
   * 권한 오류
   */
  trackPermissionError(permissionType, action) {
    this.trackEvent('permission_error', {
      permission_type: permissionType,
      action: action,
    });
  }

  // ==================== 사용자 액션 ====================

  /**
   * 회원 탈퇴 버튼 클릭
   */
  trackWithdrawalButtonClick() {
    this.trackEvent('withdrawal_button_click');
  }

  /**
   * 회원 탈퇴 완료
   */
  trackWithdrawalComplete() {
    this.trackEvent('withdrawal_complete');
  }

  /**
   * 이용약관 조회
   */
  trackTermsOfServiceView() {
    this.trackEvent('terms_of_service_view');
  }

  /**
   * 사업자 정보 조회
   */
  trackBusinessInfoView() {
    this.trackEvent('business_info_view');
  }

  /**
   * 도움말 조회
   */
  trackHelpView(helpTopic = '') {
    this.trackEvent('help_view', {
      help_topic: helpTopic,
    });
  }

  // ==================== 광고 관련 상세 ====================

  /**
   * 보상형 광고 시청 시작
   */
  trackRewardedAdStart(adId) {
    this.trackEvent('rewarded_ad_start', {
      ad_id: adId,
    });
  }

  /**
   * 보상형 광고 시청 완료
   */
  trackRewardedAdComplete(adId, rewardType) {
    this.trackEvent('rewarded_ad_complete', {
      ad_id: adId,
      reward_type: rewardType,
    });
  }

  /**
   * 보상형 광고 시청 중단
   */
  trackRewardedAdAbandoned(adId, timeSpent) {
    this.trackEvent('rewarded_ad_abandoned', {
      ad_id: adId,
      time_spent_seconds: Math.floor(timeSpent / 1000),
    });
  }

  /**
   * 광고 로딩 실패
   */
  trackAdLoadFailure(adType, errorType) {
    this.trackEvent('ad_load_failure', {
      ad_type: adType,
      error_type: errorType,
    });
  }

  // 광고 표시 시간 추적
  // 広告表示時間のトラッキング
  // Track ad display time
  trackAdDisplayTime(adType, displayTime) {
    this.trackEvent('ad_display_time', {
      ad_type: adType,
      display_time_seconds: Math.floor(displayTime / 1000),
    });
  }
}

// 싱글톤 인스턴스
// シングルトンインスタンス
// Singleton instance
const firebaseAnalytics = new FirebaseAnalyticsService();

export default firebaseAnalytics;
