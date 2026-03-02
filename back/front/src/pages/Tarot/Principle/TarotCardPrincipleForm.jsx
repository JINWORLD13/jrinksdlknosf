import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TarotCardPrincipleForm.module.scss';
import sideMenuStyles from '../Section/TarotSectionForm.module.scss';
import { useLanguageChange } from '@/hooks';
import { renderAnswerAsLines } from '../../../lib/tarot/answer/renderAnswerAsLines.jsx';
import { useTranslation } from 'react-i18next';
import LoadingForm from '../../../components/Loading/Loading.jsx';
import SEOMetaTags from '../../../components/Helmet/SEOMetaTags.jsx';
import TarotPrincipleSideMenuForm from './TarotPrincipleSideMenuForm.jsx';
import TarotExplanationForm from '../Explanation/TarotExplanationForm.jsx';
import TarotLearningForm from '../Learning/TarotLearningForm.jsx';

const TarotCardPrincipleForm = () => {
  const [pathName, setPathName] = useState('');
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  // URL 변경 감지
  useEffect(() => {
    // /tarot/principle/... 경로 또는 /etc/tarot/... 경로 처리
    const pathMatch = location.pathname.match(
      /\/(?:tarot\/principle|etc\/tarot)\/([^/]+)$/
    );
    const path = pathMatch ? pathMatch[1] : '';
    setPathName(path);
  }, [location.pathname]);

  const handleScroll = event => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const delta = event.deltaY;

    if (scrollContainerRef.current) {
      // deltaY를 15로 나누어 더 미세한 스크롤 조정 (숫자가 클수록 더 미세하게 움직임)
      const scrollAmount = delta / 15;
      scrollContainerRef.current.scrollTop += scrollAmount;
    }
    return false;
  };

  // 스크롤 이벤트 리스너 직접 추가 (passive: false로 기본 동작 완전 차단)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, {
      passive: false,
      capture: true,
    });

    return () => {
      container.removeEventListener('wheel', handleScroll, {
        passive: false,
        capture: true,
      });
    };
  }, []);

  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const JSXTagArr = [...renderAnswerAsLines(t(`content.principle_content`))];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('page.principle.meta.title'),
    description: t('page.principle.meta.description'),
    author: {
      '@type': 'Organization',
      name: 'JINWORLD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cosmos Tarot',
      logo: {
        '@type': 'ImageObject',
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/cosmos_tarot_favicon/cosmos_tarot-512x512.png`,
      },
    },
    mainEntity: {
      '@type': 'Thing',
      name: 'Carl Jung Tarot Theory',
      description: t('page.principle.sections.theory.content'),
    },
  };

  // 타로 원리 메인 콘텐츠 컴포넌트
  const PrincipleContent = () => (
    <>
      {/* SEO 메타 태그 - 다국어 지원 */}
      <SEOMetaTags
        title={t('page.principle.meta.title')}
        description={t('page.principle.meta.description')}
        keywords={t('page.principle.meta.keywords')}
        structuredData={structuredData}
      />

      <div className={styles['box']}>
        <div
          className={`${
            browserLanguage === 'ja'
              ? styles['content-japanese']
              : styles['content']
          }`}
          ref={scrollContainerRef}
          style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }}
        >
          {/* 메인 제목 (H1) - SEO 핵심! */}
          <header className={styles['page-header']}>
            <div className={styles['title-wrapper']}>
              <h1 className={styles['main-title']}>
                {t('page.principle.header.mainTitle')}
              </h1>
            </div>
            <p className={styles['subtitle']}>
              {t('page.principle.header.subtitle')}
            </p>
          </header>
          {/* SEO를 위한 구조화된 콘텐츠 */}
          <main className={styles['seo-content']}>
            <section className={styles['theory-section']}>
              <h2>{t('page.principle.sections.theory.title')}</h2>
              <p>{t('page.principle.sections.theory.content')}</p>
            </section>

            <section className={styles['synchronicity-section']}>
              <h2>{t('page.principle.sections.synchronicity.title')}</h2>
              <p>{t('page.principle.sections.synchronicity.content')}</p>

              <h3>
                {t('page.principle.sections.synchronicity.application.title')}
              </h3>
              <p>
                {t('page.principle.sections.synchronicity.application.content')}
              </p>
            </section>

            <section className={styles['practical-section']}>
              <h2>{t('page.principle.sections.practical.title')}</h2>

              <h3>{t('page.principle.sections.practical.methods.title')}</h3>
              <p>{t('page.principle.sections.practical.methods.intro')}</p>
              <ul>
                <li>{t('page.principle.sections.practical.methods.item1')}</li>
                <li>{t('page.principle.sections.practical.methods.item2')}</li>
                <li>{t('page.principle.sections.practical.methods.item3')}</li>
              </ul>

              <h3>{t('page.principle.sections.practical.energy.title')}</h3>
              <p>{t('page.principle.sections.practical.energy.content')}</p>
            </section>

            <section className={styles['interpretation-section']}>
              <h2>{t('page.principle.sections.interpretation.title')}</h2>

              <h3>
                {t('page.principle.sections.interpretation.additional.title')}
              </h3>
              <p>
                {t('page.principle.sections.interpretation.additional.content')}
              </p>

              <h3>
                {t('page.principle.sections.interpretation.caution.title')}
              </h3>
              <p>
                {t('page.principle.sections.interpretation.caution.content')}
              </p>
            </section>

            <section className={styles['conclusion-section']}>
              <h2>{t('page.principle.sections.conclusion.title')}</h2>
              <p>{t('page.principle.sections.conclusion.content')}</p>
            </section>
          </main>
        </div>
      </div>
    </>
  );

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className={sideMenuStyles['container']}>
        <div className={sideMenuStyles['container-box1']}>
          <TarotPrincipleSideMenuForm setPathName={setPathName} />
        </div>
        <div className={sideMenuStyles['container-box2']}>
          {pathName === '' || pathName === 'principle' ? (
            <PrincipleContent />
          ) : null}
          {pathName === 'explanation' ? <TarotExplanationForm /> : null}
          {pathName === 'learning' ? <TarotLearningForm /> : null}
        </div>
      </div>
    </Suspense>
  );
};

export default TarotCardPrincipleForm;
