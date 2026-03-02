import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../modals/SpreadModal/SpreadModal.module.scss';
import {
  CelticCrossForModal,
  SixCardsTimesForModal,
  FourCardsForModal,
  SingleCardForModal,
  ThreeCardsForModal,
  ThreeCardsTimeForModal,
  TwoCardsForModal,
  TwoCardsBinaryChoiceForModal,
  ThreeCardsSolutionForModal,
  FiveCardsRelationshipForModal,
  ThreeCardsADayForModal,
  ThreeCardsThreeWayChoiceForModal,
} from '../../components/TarotCardForm/TarotCardTableForm.jsx';
import { StarIcon } from '../../modals/PurchaseModal/InAppPurchase/components/StarIcon.jsx';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

// &#9734; 빈 별(☆) / &#9733; 채운 별(★) - 모달 스프레드 목록용
// &#9734; 空き星(☆) / &#9733; 塗りつぶし星(★) - モーダルスプレッド一覧用
// &#9734; empty star (☆) / &#9733; filled star (★) - for modal spread list
export const spreadArr = () => {
  const { t } = useTranslation();

  const starIcon = (
    <StarIcon
      width="24"
      height="24"
      style={{
        color: '#FFD700',
        verticalAlign: 'middle',
      }}
    />
  );

  return [
    {
      img: <SingleCardForModal className={'spread-modal'} />,
      title: t(`title.single`),
      description: t(`description.single`),
      titleSpeedMode: t(`title.single_speed_mode`),
      descriptionSpeedMode: t(`description.single_speed_mode`),
      tags: t('tags.single', { returnObjects: true }),
      tagsSpeedMode: t('tags.single_speed', { returnObjects: true }),
      count: 1,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 100,
      voucherForNormal: (
        <span className={styles['one-card']}>
          I{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['one-card']}>
          I{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: (
        <span className={styles['one-card']}>
          I{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: true ? [1, 1] : [1, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: true ? [1, 2] : [1, 3],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [1, 4] : [1, 5],

      starForNormal: (
        <span className={styles['one-card']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['one-card']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['one-card']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <TwoCardsForModal className={'spread-modal'} />,
      title: t(`title.two`),
      description: t(`description.two`),
      titleSpeedMode: t(`title.two_speed_mode`),
      descriptionSpeedMode: t(`description.two_speed_mode`),
      tags: t('tags.two', { returnObjects: true }),
      tagsSpeedMode: t('tags.two_speed', { returnObjects: true }),
      count: 2,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 200,
      voucherForNormal: (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5
      voucherToPayForNormal: [2, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [2, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [2, 4] : [2, 5],

      starForNormal: (
        <span className={styles['two-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['two-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['two-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <TwoCardsBinaryChoiceForModal className={'spread-modal'} />,
      title: t(`title.two_choice`),
      description: t(`description.two_choice`),
      titleSpeedMode: t(`title.two_speed_mode`),
      descriptionSpeedMode: t(`description.two_speed_mode`),
      tags: t('tags.two_choice', { returnObjects: true }),
      tagsSpeedMode: t('tags.two_speed', { returnObjects: true }),
      count: 2,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 201,
      voucherForNormal: (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['two-cards']}>
          II{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5
      voucherToPayForNormal: [2, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [2, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [2, 4] : [2, 5],

      starForNormal: (
        <span className={styles['two-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['two-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['two-cards']}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <ThreeCardsForModal className={'spread-modal'} />,
      title: t(`title.three`),
      description: t(`description.three`),
      titleSpeedMode: t(`title.three_speed_mode`),
      descriptionSpeedMode: t(`description.three_speed_mode`),
      tags: t('tags.three', { returnObjects: true }),
      tagsSpeedMode: t('tags.three_speed', { returnObjects: true }),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 300,
      voucherForNormal: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [3, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [3, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [3, 4] : [3, 5],

      starForNormal: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <ThreeCardsTimeForModal className={'spread-modal'} />,
      title: t(`title.three_time`),
      description: t(`description.three_time`),
      titleSpeedMode: t(`title.three_speed_mode`),
      descriptionSpeedMode: t(`description.three_speed_mode`),
      tags: t('tags.three_time', { returnObjects: true }),
      tagsSpeedMode: t('tags.three_speed', { returnObjects: true }),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 301,
      voucherForNormal: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [3, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [3, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [3, 4] : [3, 5],

      starForNormal: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <ThreeCardsSolutionForModal className={'spread-modal'} />,
      title: t(`title.three_solution`),
      description: t(`description.three_solution`),
      titleSpeedMode: t(`title.three_speed_mode`),
      descriptionSpeedMode: t(`description.three_speed_mode`),
      tags: t('tags.three_solution', { returnObjects: true }),
      tagsSpeedMode: t('tags.three_speed', { returnObjects: true }),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 302,
      voucherForNormal: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [3, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [3, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [3, 4] : [3, 5],

      starForNormal: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <ThreeCardsADayForModal className={'spread-modal'} />,
      title: t(`title.three_a_day`),
      description: t(`description.three_a_day`),
      titleSpeedMode: t(`title.three_speed_mode`),
      descriptionSpeedMode: t(`description.three_speed_mode`),
      tags: t('tags.three_a_day', { returnObjects: true }),
      tagsSpeedMode: t('tags.three_speed', { returnObjects: true }),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 303,
      voucherForNormal: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [3, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [3, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [3, 4] : [3, 5],

      starForNormal: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <ThreeCardsThreeWayChoiceForModal className={'spread-modal'} />,
      title: t(`title.three_choice`),
      description: t(`description.three_choice`),
      titleSpeedMode: t(`title.three_speed_mode`),
      descriptionSpeedMode: t(`description.three_speed_mode`),
      tags: t('tags.three_choice', { returnObjects: true }),
      tagsSpeedMode: t('tags.three_speed', { returnObjects: true }),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 304,
      voucherForNormal: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['three-cards']}>
          III{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [3, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [3, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [3, 4] : [3, 5],

      starForNormal: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      starForSerious: (
        <span className={styles['three-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <FourCardsForModal className={'spread-modal'} />,
      title: t(`title.four`),
      description: t(`description.four`),
      titleSpeedMode: t(`title.four_speed_mode`),
      descriptionSpeedMode: t(`description.four_speed_mode`),
      tags: t('tags.four', { returnObjects: true }),
      tagsSpeedMode: t('tags.four_speed', { returnObjects: true }),
      count: 4,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 400,
      voucherForNormal: (
        <span className={styles['four-cards']}>
          IV{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['four-cards']}>
          IV{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['four-cards']}>
          IV{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['four-cards']}>
          IV{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [4, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [4, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [4, 4] : [4, 5],

      starForNormal: (
        <span className={styles['four-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['four-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['four-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <FiveCardsRelationshipForModal className={'spread-modal'} />,
      title: t(`title.five_relationship`),
      description: t(`description.five_relationship`),
      titleSpeedMode: t(`title.five_relationship_speed_mode`),
      descriptionSpeedMode: t(`description.five_relationship_speed_mode`),
      tags: t('tags.five_relationship', { returnObjects: true }),
      tagsSpeedMode: t('tags.five_speed', { returnObjects: true }),
      count: 5,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 501,
      voucherForNormal: (
        <span className={styles['five-cards']}>
          V{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['five-cards']}>
          V{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['five-cards']}>
          V{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['five-cards']}>
          V{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [5, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [5, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [5, 4] : [5, 5],

      starForNormal: (
        <span className={styles['five-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['five-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['five-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <SixCardsTimesForModal className={'spread-modal'} />,
      title: t(`title.six-day`),
      description: t(`description.six-day`),
      titleSpeedMode: t(`title.six_speed_mode`),
      descriptionSpeedMode: t(`description.six_speed_mode`),
      tags: t('tags.six_day', { returnObjects: true }),
      tagsSpeedMode: t('tags.six_speed', { returnObjects: true }),
      count: 6,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 600,
      voucherForNormal: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 4{t('unit.ea')}{' '}
          <span className={styles['center-underline']}>5{t('unit.ea')}</span>
        </span>
      ) : (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 5{t('unit.ea')}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [6, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [6, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [6, 4] : [6, 5],

      starForNormal: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <SixCardsTimesForModal className={'spread-modal'} />,
      title: t(`title.six-week`),
      description: t(`description.six-week`),
      titleSpeedMode: t(`title.six_speed_mode`),
      descriptionSpeedMode: t(`description.six_speed_mode`),
      tags: t('tags.six_week', { returnObjects: true }),
      tagsSpeedMode: t('tags.six_speed', { returnObjects: true }),
      count: 6,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 601,
      voucherForNormal: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 4{t('unit.ea')}{' '}
          <span className={styles['center-underline']}>5{t('unit.ea')}</span>
        </span>
      ) : (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 5{t('unit.ea')}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5
      voucherToPayForNormal: [6, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [6, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [6, 4] : [6, 5],

      starForNormal: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <SixCardsTimesForModal className={'spread-modal'} />,
      title: t(`title.six-month`),
      description: t(`description.six-month`),
      titleSpeedMode: t(`title.six_speed_mode`),
      descriptionSpeedMode: t(`description.six_speed_mode`),
      tags: t('tags.six_month', { returnObjects: true }),
      tagsSpeedMode: t('tags.six_speed', { returnObjects: true }),
      count: 6,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 602,
      voucherForNormal: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 4{t('unit.ea')}{' '}
          <span className={styles['center-underline']}>5{t('unit.ea')}</span>
        </span>
      ) : (
        <span className={styles['six-cards']}>
          VI{t(`unit.kind-of-voucher`)} x 5{t('unit.ea')}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [6, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [6, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [6, 4] : [6, 5],

      starForNormal: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['six-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
    {
      img: <CelticCrossForModal className={'spread-modal'} />,
      title: t(`title.celtic_cross`),
      description: t(`description.celtic_cross`),
      titleSpeedMode: t(`title.celtic_cross_speed_mode`),
      descriptionSpeedMode: t(`description.celtic_cross_speed_mode`),
      tags: t('tags.celtic_cross', { returnObjects: true }),
      tagsSpeedMode: t('tags.celtic_speed', { returnObjects: true }),
      count: 10,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 1000,
      voucherForNormal: (
        <span className={styles['ten-cards']}>
          X{t(`unit.kind-of-voucher`)} x 1{t(`unit.ea`)}
        </span>
      ),
      voucherForDeep: (
        <span className={styles['ten-cards']}>
          X{t(`unit.kind-of-voucher`)} x 2{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>3{t(`unit.ea`)}</span>
        </span>
      ),
      voucherForSerious: true ? (
        <span className={styles['ten-cards']}>
          X{t(`unit.kind-of-voucher`)} x 4{t(`unit.ea`)}{' '}
          <span className={styles['center-underline']}>5{t(`unit.ea`)}</span>
        </span>
      ) : (
        <span className={styles['ten-cards']}>
          X{t(`unit.kind-of-voucher`)} x 5{t(`unit.ea`)}
        </span>
      ),
      // 앱/웹 구분 없이 동일 반영. 할인행사로 5개분에서 4개로 제공
      // アプリ/Web区別なく同一反映。セールで5個分を4個で提供
      // Same for app and web. Sale: 4 for price of 5

      voucherToPayForNormal: [10, 1],
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      voucherToPayForDeep: [10, 2],
      // 앱/웹 동일. 할인행사로 5개에서 4개로 제공
      // アプリ/Web同一。セールで5個から4個に割引提供
      // Same for app/web. Sale: 4 for price of 5
      voucherToPayForSerious: true ? [10, 4] : [10, 5],

      starForNormal: (
        <span className={styles['ten-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 1{t(`unit.ea`)}
        </span>
      ),
      starForDeep: (
        <span className={styles['ten-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 2{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            3{t(`unit.ea`)}
          </span>
        </span>
      ),
      starForSerious: (
        <span className={styles['ten-cards']} style={{ color: '#FFD700' }}>
          {starIcon} x 4{t(`unit.ea`)}{' '}
          <span
            className={styles['center-underline']}
            style={{ color: '#FFD700' }}
          >
            5{t(`unit.ea`)}
          </span>
        </span>
      ),

      starToPayForNormal: 1,
      // 할인행사로 3개에서 2개로 제공
      // セールで3個から2個に割引提供
      // Sale: 2 for price of 3
      starToPayForDeep: 2,
      // 할인행사로 5개에서 4개로 제공
      // セールで5個から4個に割引提供
      // Sale: 4 for price of 5
      starToPayForSerious: 4,
    },
  ];
};

export const spreadArrForPoint = () => {
  const { t } = useTranslation();
  const priceOnSale = (originalPointPrice, salePercentage) => {
    const result = originalPointPrice * (1 - salePercentage * 0.01);
    return result;
  };
  return [
    {
      img: <SingleCardForModal className={'spread-modal'} />,
      title: t(`title.single`),
      description: t(`description.single`),
      count: 1,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 100,

      originalPointPriceForNormal: 20,
      salePercentageForNormal: 50,
      listPointPriceForNormal: Math.ceil(priceOnSale(20, 50)),

      originalPointPriceForDeep: 50,
      salePercentageForDeep: 50,
      listPointPriceForDeep: Math.ceil(priceOnSale(50, 50)),

      originalPointPriceForSerious: 100,
      salePercentageForSerious: 50,
      listPointPriceForSerious: Math.ceil(priceOnSale(100, 50)),
    },
    {
      img: <TwoCardsForModal className={'spread-modal'} />,
      title: t(`title.two`),
      description: t(`description.two`),
      count: 2,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 200,

      originalPointPriceForNormal: 30,
      salePercentageForNormal: 60,
      listPointPriceForNormal: Math.ceil(priceOnSale(30, 60)),

      originalPointPriceForDeep: 70,
      salePercentageForDeep: 60,
      listPointPriceForDeep: Math.ceil(priceOnSale(70, 60)),

      originalPointPriceForSerious: 140,
      salePercentageForSerious: 60,
      listPointPriceForSerious: Math.ceil(priceOnSale(140, 60)),
    },
    {
      img: <ThreeCardsForModal className={'spread-modal'} />,
      title: t(`title.three`),
      description: t(`description.three`),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 300,

      originalPointPriceForNormal: 40,
      salePercentageForNormal: 60,
      listPointPriceForNormal: Math.ceil(priceOnSale(40, 60)),

      originalPointPriceForDeep: 80,
      salePercentageForDeep: 60,
      listPointPriceForDeep: Math.ceil(priceOnSale(80, 60)),

      originalPointPriceForSerious: 160,
      salePercentageForSerious: 60,
      listPointPriceForSerious: Math.ceil(priceOnSale(160, 60)),
    },
    {
      img: <ThreeCardsTimeForModal className={'spread-modal'} />,
      title: t(`title.three_time`),
      description: t(`description.three_time`),
      count: 3,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 301,

      originalPointPriceForNormal: 40,
      salePercentageForNormal: 60,
      listPointPriceForNormal: Math.ceil(priceOnSale(40, 60)),

      originalPointPriceForDeep: 80,
      salePercentageForDeep: 60,
      listPointPriceForDeep: Math.ceil(priceOnSale(80, 60)),

      originalPointPriceForSerious: 160,
      salePercentageForSerious: 60,
      listPointPriceForSerious: Math.ceil(priceOnSale(160, 60)),
    },
    {
      img: <FourCardsForModal className={'spread-modal'} />,
      title: t(`title.four`),
      description: t(`description.four`),
      count: 4,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 400,

      originalPointPriceForNormal: 50,
      salePercentageForNormal: 60,
      listPointPriceForNormal: Math.ceil(priceOnSale(50, 60)),

      originalPointPriceForDeep: 100,
      salePercentageForDeep: 60,
      listPointPriceForDeep: Math.ceil(priceOnSale(100, 60)),

      originalPointPriceForSerious: 200,
      salePercentageForSerious: 60,
      listPointPriceForSerious: Math.ceil(priceOnSale(200, 60)),
    },
    {
      img: <CelticCrossForModal className={'spread-modal'} />,
      title: t(`title.celtic_cross`),
      description: t(`description.celtic_cross`),
      count: 10,
      // 애드몹 - 1. 전면 / 2. 보상형 / 3. 배너 / 4. 전면 보상
      // アドモブ - 1. インタースティシャル / 2. リワード / 3. バナー / 4. インタースティシャルリワード
      // AdMob - 1. Interstitial / 2. Rewarded / 3. Banner / 4. Interstitial Rewarded
      admobAds: 1,
      spreadListNumber: 1000,

      originalPointPriceForNormal: 100,
      salePercentageForNormal: 70,
      listPointPriceForNormal: Math.ceil(priceOnSale(100, 70)),

      originalPointPriceForDeep: 200,
      salePercentageForDeep: 70,
      listPointPriceForDeep: Math.ceil(priceOnSale(200, 70)),

      originalPointPriceForSerious: 400,
      salePercentageForSerious: 70,
      listPointPriceForSerious: Math.ceil(priceOnSale(400, 70)),
    },
  ];
};
