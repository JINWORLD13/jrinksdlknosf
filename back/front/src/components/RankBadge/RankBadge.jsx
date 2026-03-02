import React from 'react';
import styles from './RankBadge.module.scss';

// RankBadge 컴포넌트 (변경 없음)
export const RankBadge = ({ userInfo, ...props }) => {
  if (!userInfo?.isRanked || !Object.values(userInfo?.isRanked)?.includes(true))
    return null;
  return (
    <RankBadgeMark
      className={props?.className}
      size={props?.size}
      whichRank={
        Object.entries(userInfo.isRanked).find(
          ([key, value]) => value === true
        )?.[0]
      }
    >
      {props?.children ||
        Object.entries(userInfo.isRanked).find(
          ([key, value]) => value === true
        )?.[0]}
    </RankBadgeMark>
  );
};

// RankBadgeMark 컴포넌트 (모양 선택 로직 추가)
export const RankBadgeMark = ({ whichRank, size, className, children }) => {
  const getIcon = () => {
    switch (whichRank) {
      case 'VIP':
        return <Crown size={size || 22} />;
      case 'COSMOS':
        return <Meteor size={size || 22} />;
      case 'STAR':
        return <Star size={size || 22} />;
      case 'NEW':
        return <Hat size={size || 22} />;
      default:
        return <Hat size={size || 22} />;
    }
  };

  return (
    <span
      className={`${styles.badge} ${styles['badge-position']} ${
        whichRank && styles[`${whichRank}`]
      } ${className || ''}`}
    >
      {getIcon()}
      {children || whichRank || 'NEW'}
    </span>
  );
};

// Crown 컴포넌트 (기존)
const Crown = ({ size = 22, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7" />
    <path d="M5 20h14" /> {/* 16 → 18로 변경하여 아래로 띄움 */}
  </svg>
);

// Star 컴포넌트 (별 모양)
const Star = ({ size = 22, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"
      fill="#f39c12" // 기본 노란색
    >
      <animate
        attributeName="fill"
        values="#f1c40f;yellow;#f1c40f" // 노란색 ↔ 밝은 노란색
        dur="1.5s" // 1.5초 동안 애니메이션
        repeatCount="indefinite" // 무한 반복
      />
      <animate
        attributeName="opacity"
        values="0.7;1;0.7" // 투명도 변화
        dur="1.5s"
        repeatCount="indefinite"
      />
    </polygon>
  </svg>
);
// Hat 컴포넌트 (마녀 모자 모양으로 변경)
const Hat = ({ size = 22, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 둥근 테두리 */}
    <ellipse cx="12" cy="18" rx="11" ry="6" />
    {/* 삼각형 모자 윗부분 */}
    <path d="M12 2L6 18H18L12 2Z" />
    {/* 벨트 */}
    <rect x="8" y="14" width="8" height="2" />
    {/* 버클 */}
    <rect x="10" y="13" width="4" height="4" fill="none" strokeWidth="1" />
  </svg>
);

// '#FF4500'
const Meteor = ({ size = 22, color = 'gold' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 빛나는 그라디언트 정의 */}
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.9 }} />
        <stop offset="70%" style={{ stopColor: color, stopOpacity: 0.3 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    {/* 메인 꼬리 */}
    <path d="M22 2L6 18" strokeWidth="3" strokeDasharray="6,6">
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="12"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
    {/* 넓게 갈라진 꼬리들 */}
    <path
      d="M22 2L8 20"
      strokeWidth="2.5"
      strokeOpacity="0.9"
      strokeDasharray="5,5"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="10"
        dur="1.2s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M22 2L4 16"
      strokeWidth="2"
      strokeOpacity="0.8"
      strokeDasharray="4,4"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="8"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M22 2L2 14"
      strokeWidth="1.5"
      strokeOpacity="0.7"
      strokeDasharray="3,3"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="6"
        dur="1.6s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M22 2L1 12"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeDasharray="2,2"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="4"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M22 2L3 10"
      strokeWidth="1"
      strokeOpacity="0.5"
      strokeDasharray="2,2"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="4"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M22 2L5 8"
      strokeWidth="0.8"
      strokeOpacity="0.4"
      strokeDasharray="1,1"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="2"
        dur="2.2s"
        repeatCount="indefinite"
      />
    </path>
    {/* 꼬리 끝 확산 효과 - 곡선과 선 */}
    <path
      d="M6 18Q7 19 8 20"
      strokeWidth="1"
      strokeOpacity="0.7"
      strokeDasharray="2,2"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="2"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M8 20L9 21"
      strokeWidth="0.8"
      strokeOpacity="0.5"
      strokeDasharray="1,1"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="1"
        dur="1.2s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M4 16Q5 17 6 18"
      strokeWidth="1"
      strokeOpacity="0.7"
      strokeDasharray="2,2"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="2"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M2 14Q3 15 4 16"
      strokeWidth="0.8"
      strokeOpacity="0.6"
      strokeDasharray="1,1"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="1"
        dur="1.6s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M1 12L2 13"
      strokeWidth="0.6"
      strokeOpacity="0.5"
      strokeDasharray="1,1"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="1"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </path>
    {/* 빛나는 운석 본체 */}
    <circle cx="7" cy="15" r="6" fill="url(#glow)" />
    {/* 최소화된 불꽃 */}
    <circle cx="8" cy="16" r="1.5" fill={color} fillOpacity="0.6">
      <animate
        attributeName="r"
        values="1.5;1;1.5"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
