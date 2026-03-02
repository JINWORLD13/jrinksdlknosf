/**
 * Firebase Analytics Hook
 * 컴포넌트에서 Firebase Analytics를 쉽게 사용
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import firebaseAnalytics from '../services/firebaseAnalytics';
import { isBot } from '../utils/validation/isBot';

/**
 * 기본 Analytics Hook
 */
export const useFirebaseAnalytics = () => {
  return {
    // 기본 이벤트
    trackEvent: firebaseAnalytics.trackEvent.bind(firebaseAnalytics),
    trackPageView: firebaseAnalytics.trackPageView.bind(firebaseAnalytics),

    // 타로 이벤트
    trackTarotReading:
      firebaseAnalytics.trackTarotReading.bind(firebaseAnalytics),
    trackSpreadSelection:
      firebaseAnalytics.trackSpreadSelection.bind(firebaseAnalytics),
    trackCardSelection:
      firebaseAnalytics.trackCardSelection.bind(firebaseAnalytics),
    trackTarotComplete:
      firebaseAnalytics.trackTarotComplete.bind(firebaseAnalytics),
    trackTarotShare: firebaseAnalytics.trackTarotShare.bind(firebaseAnalytics),
    trackSaveReading:
      firebaseAnalytics.trackSaveReading.bind(firebaseAnalytics),
    trackViewHistory:
      firebaseAnalytics.trackViewHistory.bind(firebaseAnalytics),
    trackQuestionInput:
      firebaseAnalytics.trackQuestionInput.bind(firebaseAnalytics),
    trackAIInterpretation:
      firebaseAnalytics.trackAIInterpretation.bind(firebaseAnalytics),

    // 결제 이벤트
    trackPurchase: firebaseAnalytics.trackPurchase.bind(firebaseAnalytics),
    trackPurchaseStart:
      firebaseAnalytics.trackPurchaseStart.bind(firebaseAnalytics),
    trackViewItem: firebaseAnalytics.trackViewItem.bind(firebaseAnalytics),
    trackSubscribe: firebaseAnalytics.trackSubscribe.bind(firebaseAnalytics),
    trackUnsubscribe:
      firebaseAnalytics.trackUnsubscribe.bind(firebaseAnalytics),
    trackCouponUse: firebaseAnalytics.trackCouponUse.bind(firebaseAnalytics),
    trackRefundRequest:
      firebaseAnalytics.trackRefundRequest.bind(firebaseAnalytics),
    trackRemoveAds: firebaseAnalytics.trackRemoveAds.bind(firebaseAnalytics),

    // 광고 이벤트
    trackAdClick: firebaseAnalytics.trackAdClick.bind(firebaseAnalytics),
    trackAdImpression:
      firebaseAnalytics.trackAdImpression.bind(firebaseAnalytics),

    // 사용자 이벤트
    trackLogin: firebaseAnalytics.trackLogin.bind(firebaseAnalytics),
    trackSignUp: firebaseAnalytics.trackSignUp.bind(firebaseAnalytics),
    trackSearch: firebaseAnalytics.trackSearch.bind(firebaseAnalytics),
    trackSocialShare:
      firebaseAnalytics.trackSocialShare.bind(firebaseAnalytics),
    trackRating: firebaseAnalytics.trackRating.bind(firebaseAnalytics),
    trackFeedback: firebaseAnalytics.trackFeedback.bind(firebaseAnalytics),
    trackAddToFavorites:
      firebaseAnalytics.trackAddToFavorites.bind(firebaseAnalytics),

    // UI 이벤트
    trackModalOpen: firebaseAnalytics.trackModalOpen.bind(firebaseAnalytics),
    trackModalClose: firebaseAnalytics.trackModalClose.bind(firebaseAnalytics),
    trackButtonClick:
      firebaseAnalytics.trackButtonClick.bind(firebaseAnalytics),
    trackSettingChange:
      firebaseAnalytics.trackSettingChange.bind(firebaseAnalytics),
    trackLanguageChange:
      firebaseAnalytics.trackLanguageChange.bind(firebaseAnalytics),
    trackThemeChange:
      firebaseAnalytics.trackThemeChange.bind(firebaseAnalytics),

    // 튜토리얼
    trackTutorialBegin:
      firebaseAnalytics.trackTutorialBegin.bind(firebaseAnalytics),
    trackTutorialComplete:
      firebaseAnalytics.trackTutorialComplete.bind(firebaseAnalytics),
    trackTutorialStep:
      firebaseAnalytics.trackTutorialStep.bind(firebaseAnalytics),

    // 시스템 이벤트
    trackError: firebaseAnalytics.trackError.bind(firebaseAnalytics),
    trackEngagement: firebaseAnalytics.trackEngagement.bind(firebaseAnalytics),
    trackPerformance:
      firebaseAnalytics.trackPerformance.bind(firebaseAnalytics),
    trackAppUpdate: firebaseAnalytics.trackAppUpdate.bind(firebaseAnalytics),
    trackScreenLoad: firebaseAnalytics.trackScreenLoad.bind(firebaseAnalytics),
    track3DModelLoad:
      firebaseAnalytics.track3DModelLoad.bind(firebaseAnalytics),
    trackCardAnimation:
      firebaseAnalytics.trackCardAnimation.bind(firebaseAnalytics),

    // 음악
    trackMusicPlay: firebaseAnalytics.trackMusicPlay.bind(firebaseAnalytics),
    trackMusicStop: firebaseAnalytics.trackMusicStop.bind(firebaseAnalytics),

    // 기타
    trackLevelUp: firebaseAnalytics.trackLevelUp.bind(firebaseAnalytics),
    trackAchievement:
      firebaseAnalytics.trackAchievement.bind(firebaseAnalytics),
    trackDailyReward:
      firebaseAnalytics.trackDailyReward.bind(firebaseAnalytics),
    trackNotificationPermission:
      firebaseAnalytics.trackNotificationPermission.bind(firebaseAnalytics),
    trackPermissionRequest:
      firebaseAnalytics.trackPermissionRequest.bind(firebaseAnalytics),
    trackOpenSettings:
      firebaseAnalytics.trackOpenSettings.bind(firebaseAnalytics),
    trackViewHelp: firebaseAnalytics.trackViewHelp.bind(firebaseAnalytics),
    trackExternalLink:
      firebaseAnalytics.trackExternalLink.bind(firebaseAnalytics),
    trackInAppReview:
      firebaseAnalytics.trackInAppReview.bind(firebaseAnalytics),

    // 사용자 속성
    setUser: firebaseAnalytics.setUser.bind(firebaseAnalytics),
    setUserProps: firebaseAnalytics.setUserProps.bind(firebaseAnalytics),

    // 퍼널 분석
    trackFunnelStep: firebaseAnalytics.trackFunnelStep.bind(firebaseAnalytics),
    trackFunnelAbandonment:
      firebaseAnalytics.trackFunnelAbandonment.bind(firebaseAnalytics),
    trackFunnelCompletion:
      firebaseAnalytics.trackFunnelCompletion.bind(firebaseAnalytics),

    // 이탈 지점 추적
    trackModalAbandonment:
      firebaseAnalytics.trackModalAbandonment.bind(firebaseAnalytics),
    trackPageAbandonment:
      firebaseAnalytics.trackPageAbandonment.bind(firebaseAnalytics),
    trackSessionAbandonment:
      firebaseAnalytics.trackSessionAbandonment.bind(firebaseAnalytics),
    trackTaskAbandonment:
      firebaseAnalytics.trackTaskAbandonment.bind(firebaseAnalytics),

    // 전환율 최적화
    trackFreeToPaidConversionAttempt:
      firebaseAnalytics.trackFreeToPaidConversionAttempt.bind(
        firebaseAnalytics
      ),
    trackAdToPurchaseConversion:
      firebaseAnalytics.trackAdToPurchaseConversion.bind(firebaseAnalytics),
    trackFeatureToPurchaseConversion:
      firebaseAnalytics.trackFeatureToPurchaseConversion.bind(
        firebaseAnalytics
      ),
    trackConversionFailure:
      firebaseAnalytics.trackConversionFailure.bind(firebaseAnalytics),

    // 사용자 세그먼트 분석
    setUserSegment: firebaseAnalytics.setUserSegment.bind(firebaseAnalytics),
    trackNewUserAction:
      firebaseAnalytics.trackNewUserAction.bind(firebaseAnalytics),
    trackReturningUserAction:
      firebaseAnalytics.trackReturningUserAction.bind(firebaseAnalytics),
    trackSegmentBehavior:
      firebaseAnalytics.trackSegmentBehavior.bind(firebaseAnalytics),

    // 불만/문제점 추적
    trackDetailedError:
      firebaseAnalytics.trackDetailedError.bind(firebaseAnalytics),
    trackLoadingTime:
      firebaseAnalytics.trackLoadingTime.bind(firebaseAnalytics),
    trackFeatureSkip:
      firebaseAnalytics.trackFeatureSkip.bind(firebaseAnalytics),
    trackDetailedRefund:
      firebaseAnalytics.trackDetailedRefund.bind(firebaseAnalytics),
    trackUserFrustration:
      firebaseAnalytics.trackUserFrustration.bind(firebaseAnalytics),

    // 리텐션 분석
    trackDailyRetention:
      firebaseAnalytics.trackDailyRetention.bind(firebaseAnalytics),
    trackWeeklyRetention:
      firebaseAnalytics.trackWeeklyRetention.bind(firebaseAnalytics),
    trackMonthlyRetention:
      firebaseAnalytics.trackMonthlyRetention.bind(firebaseAnalytics),
    trackChurnRecovery:
      firebaseAnalytics.trackChurnRecovery.bind(firebaseAnalytics),
    trackReturnCycle:
      firebaseAnalytics.trackReturnCycle.bind(firebaseAnalytics),

    // 사용자 행동 패턴
    trackSpreadUsage:
      firebaseAnalytics.trackSpreadUsage.bind(firebaseAnalytics),
    trackQuestionLengthSatisfaction:
      firebaseAnalytics.trackQuestionLengthSatisfaction.bind(firebaseAnalytics),
    trackTimeBasedUsage:
      firebaseAnalytics.trackTimeBasedUsage.bind(firebaseAnalytics),
    trackSessionLengthBehavior:
      firebaseAnalytics.trackSessionLengthBehavior.bind(firebaseAnalytics),
    trackUsagePattern:
      firebaseAnalytics.trackUsagePattern.bind(firebaseAnalytics),

    // 코호트 분석
    setCohortGroup: firebaseAnalytics.setCohortGroup.bind(firebaseAnalytics),
    trackCohortBehavior:
      firebaseAnalytics.trackCohortBehavior.bind(firebaseAnalytics),
    trackEventParticipant:
      firebaseAnalytics.trackEventParticipant.bind(firebaseAnalytics),

    // 관심사/선호도 분석
    trackQuestionTopic:
      firebaseAnalytics.trackQuestionTopic.bind(firebaseAnalytics),
    trackCardSelectionPattern:
      firebaseAnalytics.trackCardSelectionPattern.bind(firebaseAnalytics),
    trackModeSelectionPattern:
      firebaseAnalytics.trackModeSelectionPattern.bind(firebaseAnalytics),
    trackPreference: firebaseAnalytics.trackPreference.bind(firebaseAnalytics),

    // 소셜/바이럴 추적
    trackShareSuccess:
      firebaseAnalytics.trackShareSuccess.bind(firebaseAnalytics),
    trackReferralCodeUsage:
      firebaseAnalytics.trackReferralCodeUsage.bind(firebaseAnalytics),
    trackViralCoefficient:
      firebaseAnalytics.trackViralCoefficient.bind(firebaseAnalytics),
    trackSocialShareDetail:
      firebaseAnalytics.trackSocialShareDetail.bind(firebaseAnalytics),

    // 수익 최적화
    trackARPU: firebaseAnalytics.trackARPU.bind(firebaseAnalytics),
    trackLTVPrediction:
      firebaseAnalytics.trackLTVPrediction.bind(firebaseAnalytics),
    trackPricePointAnalysis:
      firebaseAnalytics.trackPricePointAnalysis.bind(firebaseAnalytics),
    trackRevenueOptimization:
      firebaseAnalytics.trackRevenueOptimization.bind(firebaseAnalytics),

    // 사용자 만족도 추적
    trackResultSaveRate:
      firebaseAnalytics.trackResultSaveRate.bind(firebaseAnalytics),
    trackAdditionalQuestionRate:
      firebaseAnalytics.trackAdditionalQuestionRate.bind(firebaseAnalytics),
    trackRequestionRate:
      firebaseAnalytics.trackRequestionRate.bind(firebaseAnalytics),
    trackSatisfactionScore:
      firebaseAnalytics.trackSatisfactionScore.bind(firebaseAnalytics),

    // 기술적 문제 추적
    trackAPIResponseTime:
      firebaseAnalytics.trackAPIResponseTime.bind(firebaseAnalytics),
    trackAIFailure: firebaseAnalytics.trackAIFailure.bind(firebaseAnalytics),
    track3DModelFailure:
      firebaseAnalytics.track3DModelFailure.bind(firebaseAnalytics),
    trackNetworkError:
      firebaseAnalytics.trackNetworkError.bind(firebaseAnalytics),
    trackPerformanceMetric:
      firebaseAnalytics.trackPerformanceMetric.bind(firebaseAnalytics),

    // 마케팅 채널 분석
    trackTrafficSource:
      firebaseAnalytics.trackTrafficSource.bind(firebaseAnalytics),
    trackCampaignEffectiveness:
      firebaseAnalytics.trackCampaignEffectiveness.bind(firebaseAnalytics),
    trackKeywordConversion:
      firebaseAnalytics.trackKeywordConversion.bind(firebaseAnalytics),
    trackChannelROI: firebaseAnalytics.trackChannelROI.bind(firebaseAnalytics),

    // 추가 질문 기능
    trackAdditionalQuestionButtonClick:
      firebaseAnalytics.trackAdditionalQuestionButtonClick.bind(
        firebaseAnalytics
      ),
    trackAdditionalQuestionInput:
      firebaseAnalytics.trackAdditionalQuestionInput.bind(firebaseAnalytics),
    trackAdditionalQuestionCardSelection:
      firebaseAnalytics.trackAdditionalQuestionCardSelection.bind(
        firebaseAnalytics
      ),
    trackAdditionalQuestionComplete:
      firebaseAnalytics.trackAdditionalQuestionComplete.bind(firebaseAnalytics),
    trackAdditionalQuestionAbandoned:
      firebaseAnalytics.trackAdditionalQuestionAbandoned.bind(
        firebaseAnalytics
      ),

    // 결과 저장/복사/다운로드
    trackResultSave: firebaseAnalytics.trackResultSave.bind(firebaseAnalytics),
    trackResultCopy: firebaseAnalytics.trackResultCopy.bind(firebaseAnalytics),
    trackResultDownload:
      firebaseAnalytics.trackResultDownload.bind(firebaseAnalytics),
    trackResultReadTime:
      firebaseAnalytics.trackResultReadTime.bind(firebaseAnalytics),
    trackResultScrollDepth:
      firebaseAnalytics.trackResultScrollDepth.bind(firebaseAnalytics),

    // 통계/차트 조회
    trackStatisticsTabClick:
      firebaseAnalytics.trackStatisticsTabClick.bind(firebaseAnalytics),
    trackChartTypeChange:
      firebaseAnalytics.trackChartTypeChange.bind(firebaseAnalytics),
    trackChartFilterChange:
      firebaseAnalytics.trackChartFilterChange.bind(firebaseAnalytics),
    trackStatisticsViewTime:
      firebaseAnalytics.trackStatisticsViewTime.bind(firebaseAnalytics),
    trackPeriodStatisticsClick:
      firebaseAnalytics.trackPeriodStatisticsClick.bind(firebaseAnalytics),

    // 결제 취소/실패
    trackPurchaseCancel:
      firebaseAnalytics.trackPurchaseCancel.bind(firebaseAnalytics),
    trackPurchaseFailure:
      firebaseAnalytics.trackPurchaseFailure.bind(firebaseAnalytics),
    trackProductDetailView:
      firebaseAnalytics.trackProductDetailView.bind(firebaseAnalytics),
    trackVoucherInfoView:
      firebaseAnalytics.trackVoucherInfoView.bind(firebaseAnalytics),

    // 3D 인터랙션
    trackCrystalBallClick:
      firebaseAnalytics.trackCrystalBallClick.bind(firebaseAnalytics),
    trackCrystalActionTransition:
      firebaseAnalytics.trackCrystalActionTransition.bind(firebaseAnalytics),
    track3DCardInteraction:
      firebaseAnalytics.track3DCardInteraction.bind(firebaseAnalytics),
    trackCardAnimationComplete:
      firebaseAnalytics.trackCardAnimationComplete.bind(firebaseAnalytics),
    track3DSceneLoadTime:
      firebaseAnalytics.track3DSceneLoadTime.bind(firebaseAnalytics),

    // 결과 모달 상호작용
    trackFontSizeChange:
      firebaseAnalytics.trackFontSizeChange.bind(firebaseAnalytics),
    trackCardMeaningToggle:
      firebaseAnalytics.trackCardMeaningToggle.bind(firebaseAnalytics),
    trackResultHeightToggle:
      firebaseAnalytics.trackResultHeightToggle.bind(firebaseAnalytics),

    // 히스토리 상호작용
    trackHistoryItemClick:
      firebaseAnalytics.trackHistoryItemClick.bind(firebaseAnalytics),
    trackHistoryDelete:
      firebaseAnalytics.trackHistoryDelete.bind(firebaseAnalytics),
    trackHistoryFilter:
      firebaseAnalytics.trackHistoryFilter.bind(firebaseAnalytics),
    trackHistoryAdditionalQuestionStart:
      firebaseAnalytics.trackHistoryAdditionalQuestionStart.bind(
        firebaseAnalytics
      ),
    trackHistoryResultReopen:
      firebaseAnalytics.trackHistoryResultReopen.bind(firebaseAnalytics),

    // AI 해석 관련
    trackAIInterpretationLoadTime:
      firebaseAnalytics.trackAIInterpretationLoadTime.bind(firebaseAnalytics),
    trackAIInterpretationFailure:
      firebaseAnalytics.trackAIInterpretationFailure.bind(firebaseAnalytics),
    trackAIModelSelection:
      firebaseAnalytics.trackAIModelSelection.bind(firebaseAnalytics),

    // 네비게이션
    trackNavigation: firebaseAnalytics.trackNavigation.bind(firebaseAnalytics),
    trackBackButton: firebaseAnalytics.trackBackButton.bind(firebaseAnalytics),

    trackAPITimeout: firebaseAnalytics.trackAPITimeout.bind(firebaseAnalytics),
    trackSessionExpired:
      firebaseAnalytics.trackSessionExpired.bind(firebaseAnalytics),
    trackPermissionError:
      firebaseAnalytics.trackPermissionError.bind(firebaseAnalytics),

    // 사용자 액션
    trackWithdrawalButtonClick:
      firebaseAnalytics.trackWithdrawalButtonClick.bind(firebaseAnalytics),
    trackWithdrawalComplete:
      firebaseAnalytics.trackWithdrawalComplete.bind(firebaseAnalytics),
    trackTermsOfServiceView:
      firebaseAnalytics.trackTermsOfServiceView.bind(firebaseAnalytics),
    trackBusinessInfoView:
      firebaseAnalytics.trackBusinessInfoView.bind(firebaseAnalytics),
    trackHelpView: firebaseAnalytics.trackHelpView.bind(firebaseAnalytics),

    // 광고 관련 상세
    trackRewardedAdStart:
      firebaseAnalytics.trackRewardedAdStart.bind(firebaseAnalytics),
    trackRewardedAdComplete:
      firebaseAnalytics.trackRewardedAdComplete.bind(firebaseAnalytics),
    trackRewardedAdAbandoned:
      firebaseAnalytics.trackRewardedAdAbandoned.bind(firebaseAnalytics),
    trackAdLoadFailure:
      firebaseAnalytics.trackAdLoadFailure.bind(firebaseAnalytics),
    trackAdDisplayTime:
      firebaseAnalytics.trackAdDisplayTime.bind(firebaseAnalytics),
  };
};

/**
 * 페이지 뷰 자동 추적 Hook
 */
export const usePageViewTracking = () => {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    // 봇/크롤러는 페이지 뷰 추적하지 않음
    if (typeof window !== 'undefined' && isBot()) {
      return;
    }

    if (previousPath.current !== location.pathname) {
      const pageName = getPageName(location.pathname);
      firebaseAnalytics.trackPageView(pageName, location.pathname);
      previousPath.current = location.pathname;
    }
  }, [location]);
};

/**
 * 페이지 체류 시간 추적 Hook
 */
export const useEngagementTracking = screenName => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const duration = Date.now() - startTime.current;
      if (duration > 1000) {
        // 1초 이상
        firebaseAnalytics.trackEngagement(screenName, duration);
      }
    };
  }, [screenName]);
};

/**
 * 화면 로딩 시간 추적 Hook
 */
export const useScreenLoadTracking = screenName => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const loadTime = performance.now() - startTime;
      firebaseAnalytics.trackScreenLoad(screenName, loadTime);
    };
  }, [screenName]);
};

/**
 * 경로명을 읽기 쉬운 페이지 이름으로 변환
 */
const getPageName = pathname => {
  const routes = {
    '/': 'Home',
    '/ko': 'Home',
    '/en': 'Home',
    '/ja': 'Home',
    '/tarot': 'Tarot Reading',
    '/tarot/result': 'Tarot Result',
    '/mypage': 'My Page',
    '/mypage/history': 'Reading History',
    '/mypage/settings': 'Settings',
    '/charge': 'Charge',
    '/etc': 'ETC',
  };

  return routes[pathname] || pathname;
};

export default useFirebaseAnalytics;
