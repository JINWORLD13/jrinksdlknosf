// // withCredentials: true는 서버에 요청 시에 인증 정보를 함께 보내도록 하는 옵션일 것입니다. 보통 쿠키를 사용하는 세션 기반 인증에서 필요한 옵션입니다.
// // data.user._json은 일반적으로 OAuth 인증을 통해 얻은 사용자 정보에서 사용자의 추가 정보(사용자의 이메일, 이름, 프로필 사진 URL 등)를 담고 있는 객체
// // 언더스코어(_)는 객체의 프로퍼티 이름. 즉,  _json은 단순히 객체의 속성 이름
// // 추출한 userInfo 객체의 _json 속성
// // _json이라는 이름의 속성은 주로 OAuth 인증 프로세스에서 사용됩니다. 일반적으로 OAuth 공급자로부터 반환되는 사용자 정보가 JSON 형식으로 제공되는데, 이 정보는 _json이라는 속성에 담겨 있을 수 있습니다.
// // {
// //   "login": "example_user",
// //   "id": 123456,
// //   "name": "John Doe",
// //   "email": "john@example.com"
// //   // ... 기타 사용자 정보
// // }
// // 이런식으로 나옴.

// // console.log('tarotHistory._json : ', tarotHistory._json);

/*eslint-disable*/
import React, { memo, useState } from 'react';
import styles from './TarotReadingInfo.module.scss';
import { hasAccessToken } from '../../../utils/storage/tokenCookie.jsx';
import { useNavigate } from 'react-router-dom';
import QuestionInfo from '../question/QuestionInfo.jsx';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button.jsx';

const isNative = Capacitor.isNativePlatform();

const TarotReadingInfoForm = memo(
  ({
    tarotHistory,
    updateTarotHistory,
    setAnswerModalOpen,
    updateAnswerForm,
    updateTarotAlertModalOpen,
    updateTarotAndIndexInfo,
    isClickedForInvisible,
    handleDeleteAllTarotHistory,
    updateTarotAllAlertModalOpen,
    handleAddQuestion,
  }) => {
    const { t } = useTranslation();
    const browserLanguage = useLanguageChange();
    const isJapanese = browserLanguage === 'ja';

    if (!hasAccessToken() && !isNative) return null;

    const getCurrentRecordCount = () => {
      return (
        tarotHistory?.filter(tarot => browserLanguage === tarot?.language)
          .length || 0
      );
    };

    const handleDeleteAllClick = () => {
      if (getCurrentRecordCount() === 0) {
        return; // 기록이 없으면 모달을 열지 않음
      }
      updateTarotAllAlertModalOpen(true); // alert modal 열기
    };

    return (
      <div
        className={
          isJapanese
            ? styles['user-info-container-japanese']
            : styles['user-info-container']
        }
      >
        <div
          className={
            isJapanese ? styles['user-info2-japanese'] : styles['user-info2']
          }
        >
          <div
            className={
              isJapanese
                ? styles['user-info2-box1-japanese']
                : styles['user-info2-box1']
            }
          >
            <div className={styles['tarot-header']}>
              <h2
                className={`${
                  browserLanguage === 'ja'
                    ? styles['h2-japanese']
                    : styles['h2']
                } ${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font']
                    : styles['korean-dongle-font']
                }`}
              >
                {t(`mypage.tarot-history`)}
              </h2>
              <Button
                className={`${styles['delete-all-button']} ${
                  browserLanguage === 'ja'
                    ? styles['delete-all-button-japanese']
                    : ''
                }`}
                onClick={handleDeleteAllClick}
              >
                {t('button.delete-all')}
              </Button>
            </div>
            <QuestionInfo
              tarotHistory={tarotHistory}
              updateTarotHistory={updateTarotHistory}
              setAnswerModalOpen={setAnswerModalOpen}
              updateAnswerForm={updateAnswerForm}
              updateTarotAlertModalOpen={updateTarotAlertModalOpen}
              updateTarotAndIndexInfo={updateTarotAndIndexInfo}
              isClickedForInvisible={isClickedForInvisible}
              handleAddQuestion={handleAddQuestion}
              handleDeleteAllClick={handleDeleteAllClick} // Pass handler for mobile footer
            />
          </div>
        </div>
      </div>
    );
  }
);

export default TarotReadingInfoForm;
