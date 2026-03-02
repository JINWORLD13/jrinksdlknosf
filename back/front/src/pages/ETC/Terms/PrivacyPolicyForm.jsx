/*eslint-disable*/
import React, { memo } from 'react';
import styles from './PrivacyPolicyForm.module.scss';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
const isNative = Capacitor.isNativePlatform();

const PrivacyPolicyForm = memo(({ ...props }) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();

  return (
    <div
      className={`${
        browserLanguage === 'ja'
          ? styles['privacy-policy-container-japanese']
          : styles['privacy-policy-container']
      }`}
    >
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['privacy-policy1-japanese']
            : styles['privacy-policy1']
        }`}
      >
        <div>
          {browserLanguage === 'ko' ? (
            <>
              <div>제1조 (개인정보 수집 및 정보제공)</div>{' '}
              <div>1. 수집하는 정보의 범위</div>{' '}
              <div>
                회사는 서비스 제공을 위해 이용자에게 다음 각 호의 정보를 요구할
                수 있습니다:
              </div>{' '}
              <div>&nbsp;가. 이름, 이메일 등 기본 인적사항</div>{' '}
              <div>&nbsp;나. 서비스 이용 과정에서 생성되는 정보</div>{' '}
              <div>&nbsp;다. 모바일 앱 사용 시 기기 정보</div>{' '}
              <div>2. 정보 제공 의무</div>{' '}
              <div>
                이용자는 모든 정보를 진실하게 제공하여야 합니다. 허위 정보
                제공으로 인한 불이익은 이용자 본인이 부담합니다.
              </div>{' '}
              <div>3. 정보 수집 방법</div>{' '}
              <div>회사는 다음과 같은 방법으로 정보를 수집합니다:</div>{' '}
              <div>&nbsp;가. 회원가입 시 웹 폼을 통한 직접 수집</div>{' '}
              <div>
                &nbsp;나. 서비스 이용 과정에서 자동으로 생성되는 정보 수집
              </div>{' '}
              <div>&nbsp;다. 모바일 앱 사용 시 기기 정보 자동 수집</div>{' '}
              <div>4. 백그라운드 데이터 수집</div>{' '}
              <div>
                회사는 서비스 개선을 위해 백그라운드에서 다음의 데이터를 수집할
                수 있습니다:
              </div>{' '}
              <div>&nbsp;가. 앱 사용 통계</div> <div>&nbsp;나. 오류 보고서</div>{' '}
              <div>&nbsp;다. 기기 성능 데이터</div>{' '}
              <div>5. 정보의 보관 및 복구 불가 안내</div>{' '}
              <div>
                회사는 수집한 정보를 다음과 같은 기간 동안 보관하며, 사용자가
                삭제하거나 보존 기간이 경과하여 파기된 데이터는 직접 복구할 수
                없습니다:
              </div>{' '}
              <div>
                &nbsp;가. 회원 정보 (이름, 연락처, 이메일 등): 회원 탈퇴 시까지
              </div>{' '}
              <div>
                &nbsp;나. 콘텐츠 정보: 이용자 삭제 시 즉시 파기 또는 이용
                시점으로부터 3개월 후 자동 파기
              </div>{' '}
              <div>
                &nbsp;다. 컨텐츠 이용권: 구매일로부터 최대 1년간 보관 후 소멸
              </div>{' '}
              <div>6. 정보의 파기</div>{' '}
              <div>
                보존 기간이 경과한 정보는 다음과 같은 방법으로 파기됩니다:
              </div>{' '}
              <div>
                &nbsp;가. 전자적 파일: 복구 및 재생이 불가능한 방법으로 안전하게
                삭제
              </div>{' '}
              <div>&nbsp;나. 기록물, 인쇄물, 서면: 분쇄하거나 소각</div>{' '}
              <div>7. 제3자 제공 정보 및 AI 서비스 활용</div>{' '}
              <div>
                회사가 사용하는 제3자 SDK 및 AI 서비스 제공업체의 정보 처리:
              </div>{' '}
              <div>&nbsp;가. 제3자 AI 서비스 제공업체</div>{' '}
              <div>&nbsp;&nbsp;- 수집정보: 비식별화된 타로 질문 내용</div>{' '}
              <div>&nbsp;&nbsp;- 이용목적: 타로 해석 및 콘텐츠 생성</div>{' '}
              <div>&nbsp;나. Google AdMob / Google AdSense</div>{' '}
              <div>
                &nbsp;&nbsp;- 수집정보: 광고 식별자, 기기 정보, 사용 통계
              </div>{' '}
              <div>
                &nbsp;&nbsp;- 이용목적: 맞춤형 광고 제공, 광고 성과 측정
              </div>{' '}
              <div>
                &nbsp;&nbsp;- 보관기간: 광고 식별자 재설정 또는 비활성화 시까지
              </div>{' '}
              <div>8. 정보 수집 안내</div>{' '}
              <div>회사는 정보 수집에 대해 다음과 같이 안내합니다:</div>{' '}
              <div>&nbsp;가. 앱 최초 실행 시 데이터 수집 안내 표시</div>{' '}
              <div>
                &nbsp;나. 새로운 유형의 데이터 수집 시 별도 팝업 알림 제공
              </div>{' '}
              <div>9. 제3자 SDK 처리방침</div>{' '}
              <div>
                각 SDK의 데이터 수집 및 처리는 해당 서비스의 개인정보처리방침을
                따릅니다.
              </div>{' '}
              {'*'}
              <div>제2조 (개인정보 보호)</div> <div>1. 기본 원칙</div>{' '}
              <div>
                &nbsp;가. 회사는 관련 법령에 따라 이용자의 개인정보를 안전하게
                보호합니다.
              </div>{' '}
              <div>
                &nbsp;나. 회사는 개인정보 수집 시 수집목적, 항목, 보유기간 등을
                고지하고 동의를 받습니다.
              </div>{' '}
              <div>
                다. 이용자는 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.
              </div>{' '}
              <div>2. 이용자의 권리</div>{' '}
              <div>이용자는 다음과 같은 권리를 가집니다:</div>{' '}
              <div>&nbsp;가. 개인정보 접근권</div>{' '}
              <div>&nbsp;나. 개인정보 정정 및 삭제 요청권</div>{' '}
              <div>&nbsp;다. 개인정보 처리 제한 요청권</div>{' '}
              <div>&nbsp;라. 개인정보 이동권</div>{' '}
              <div>
                &nbsp;마. 특정 목적의 개인정보 처리 중단 요청권 (예: 마케팅
                목적의 개인정보 사용 거부)
              </div>{' '}
              <div>3. 국제법 준수</div>{' '}
              <div>
                &nbsp;가. 회사는 유럽 일반 개인정보보호법(GDPR) 및 캘리포니아
                소비자 개인정보보호법(CCPA)을 포함한 국내외 개인정보보호 법령을
                준수합니다.
              </div>{' '}
              <div>
                &nbsp;나. EU 거주자와 캘리포니아 주민은 해당 법령에 따른
                추가적인 권리를 가집니다.
              </div>{' '}
              <div>4. 개인정보의 파기</div>{' '}
              <div>
                &nbsp;가. 보존 기간이 경과한 개인정보는 지체 없이 파기됩니다.
              </div>{' '}
              <div>&nbsp;나. 파기 방법:</div>{' '}
              <div>
                &nbsp;&nbsp;- 전자적 파일: 복구 및 재생이 불가능한 방법으로
                안전하게 삭제
              </div>{' '}
              <div>&nbsp;&nbsp;- 기록물, 인쇄물, 문서: 파쇄 또는 소각</div>{' '}
              {'*'}
              <div>제3조 (광고 서비스)</div>{' '}
              <div>
                1. 회사는 Google AdMob / Google AdSense를 사용하여 광고를 제공할
                수 있습니다.
              </div>{' '}
              <div>
                2. 광고 목적으로 수집되는 정보에는 기기 정보(모델명, OS 버전
                등), 위치 정보, 앱 사용 패턴, 광고 상호작용 데이터 등이 포함될
                수 있습니다.
              </div>{' '}
              <div>
                3. 이용자는 기기 설정을 통해 맞춤형 광고를 거부할 수 있습니다.
              </div>{' '}
              <div>&nbsp;{`가. Android: 설정 > Google > 광고`}</div>{' '}
              <div>&nbsp;{`나. iOS: 설정 > 개인정보 보호 > 추적`}</div>
              <div>
                4. 광고 식별자는 사용자가 재설정하거나 맞춤형 광고를 비활성화할
                때까지 보관됩니다.
              </div>{' '}
              {'*'}
              <div>제4조 (광고 콘텐츠)</div>{' '}
              <div>
                1. 광고 콘텐츠는 Google AdMob / Google AdSense의 정책을 따르며,
                회사는 개별 광고 내용을 직접 통제할 수 없습니다.
              </div>{' '}
              <div>
                2. 부적절한 광고 발견 시 Google AdMob / Google AdSense을 통해
                신고할 수 있습니다.
              </div>{' '}
              <div>
                3. 보상형 광고 시청은 선택적이며, 시청 완료 시 명시된 보상이
                즉시 지급됩니다.
              </div>{' '}
              {'*'}
              <div>제5조 (사용자 식별 수단)</div>{' '}
              {isNative ? (
                <>
                  <div>
                    1. 회사는 모바일 앱에서 광고 제공 및 사용자 식별을 위해 광고
                    식별자를 사용합니다.
                  </div>{' '}
                  <div>
                    2. 이용자는 기기 설정을 통해 광고 식별자 사용을 제한할 수
                    있습니다.
                  </div>{' '}
                </>
              ) : (
                <>
                  <div>
                    1. 회사는 서비스 제공 및 광고 목적으로 쿠키를 사용할 수
                    있습니다.
                  </div>{' '}
                  <div>
                    2. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수
                    있습니다.
                  </div>{' '}
                </>
              )}
              {'*'}
              <div>제6조 (제3자 정보 공유)</div>{' '}
              <div>
                1. 회사는 Google Admob / Google AdSense와 이용자 정보를 공유할
                수 있습니다.
              </div>{' '}
              <div>&nbsp;가. 기기 정보</div>{' '}
              <div>&nbsp;나. 대략적 위치 정보</div>{' '}
              <div>&nbsp;다. 광고 식별자(AAID/IDFA)</div>{' '}
              <div>
                2. 공유되는 정보는 광고 ID, 기기 정보 등이며, 광고 제공 목적으로
                사용됩니다.
              </div>{' '}
              <div>&nbsp;가. 맞춤형 광고 제공</div>{' '}
              <div> &nbsp;나. 광고 성과 측정</div>{' '}
              <div>&nbsp;다. 부정 광고 방지</div> {'*'}
              <div>제7조 (국제 데이터 전송)</div>{' '}
              <div>
                1. 이용자의 개인정보는 국외에 위치한 서버에 저장되거나 국외
                업체에 전송될 수 있습니다.
              </div>{' '}
              <div>
                2. 회사는 국제 전송 시 개인정보 보호를 위한 적절한 조치를
                취합니다.
              </div>{' '}
              <div>
                3. EU 지역 거주자의 개인정보 국외 이전 시에는 GDPR이 규정하는
                표준계약조항(Standard Contractual Clauses) 등 적절한 안전조치를
                적용합니다.
              </div>{' '}
              <div>
                4. 캘리포니아 주민의 개인정보는 CCPA의 규정에 따라 처리되며,
                관련 권리 행사 방법은 개인정보처리방침에서 확인할 수 있습니다.
              </div>{' '}
              {'*'}
              <div>제8조 (아동의 개인정보 보호)</div>{' '}
              <div>1. 본 서비스는 3세 이상 사용자가 이용할 수 있습니다.</div>{' '}
              <div>2. 아동 보호를 위해 다음 사항을 준수합니다:</div>{' '}
              <div>
                &nbsp;가. 유해하거나 부적절한 콘텐츠를 제공하지 않습니다.
              </div>{' '}
              <div>&nbsp;나. 필수적인 최소한의 정보만을 수집합니다.</div>{' '}
              <div>&nbsp;다. 안전한 서비스 이용 환경을 제공합니다.</div>{' '}
              <div>3. 보호자 관리:</div>{' '}
              <div>
                &nbsp;가. 만 13세 미만 아동의 경우 보호자의 관리감독이
                권장됩니다.
              </div>{' '}
              <div>
                &nbsp;나. 보호자는 언제든지 자녀의 이용 내역 확인 및 관리가
                가능합니다.
              </div>{' '}
              {'*'}
              <div>제9조 (개인정보 보호책임자)</div>{' '}
              <div>1. 개인정보 보호책임자: 김진영</div>{' '}
              <div>2. 연락처: cosmostarotinfo@gmail.com</div> {'*'}
              <div>제10조 (보안 조치)</div>{' '}
              <div>
                <div>
                  1. 회사는 이용자의 개인정보 보호를 위해 다음과 같은 보안
                  조치를 취하고 있습니다:
                </div>{' '}
                <div>&nbsp;가. 개인정보의 암호화</div>{' '}
                <div>&nbsp;나. 해킹 등에 대비한 기술적 대책</div>{' '}
                <div>&nbsp;다. 개인정보에 대한 접근 제한</div>{' '}
              </div>{' '}
              {'*'}
              <div>부칙</div>{' '}
              <div>이 약관은 2024년 9월 14일부터 시행됩니다.</div>
            </>
          ) : (
            ''
          )}
          {browserLanguage === 'ja' ? (
            <>
              <div className={styles['privacy-policy-details-japanese']}>
                第1条（サービス利用及び情報提供）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 収集する情報の範囲
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、サービス提供のために利用者に以下の情報の提供を求めることがあります：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．氏名、メールアドレスなどの基本的な個人情報
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．サービス利用過程で生成される情報
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．モバイルアプリ使用時の端末情報
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. 情報提供の義務
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                利用者は、全ての情報を真実に基づいて提供しなければなりません。虚偽の情報提供による不利益は、利用者本人が負担するものとします。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3. 情報の収集方法
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、以下の方法で情報を収集します：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．会員登録時のウェブフォームを通じた直接収集
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．サービス利用過程で自動的に生成される情報の収集
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．モバイルアプリ使用時の端末情報の自動収集
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                4. バックグラウンドデータの収集
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、サービス改善のためにバックグラウンドで以下のデータを収集することがあります：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．アプリ使用統計
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．エラー報告
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．端末性能データ
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                5. 情報の保管及び復旧不可のご案内
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、収集した情報を以下の期間保管します。利用者が削除したデータや保存期間が経過して破棄されたデータは、利用者が直接復旧することはできません：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．会員情報（氏名、連絡先、メールアドレスなど）：会員退会まで
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．コンテンツ情報：利用者が削除した時点で即時に破棄、または利用時点から3ヶ月後に自動的に破棄
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．コンテンツ利用券：購入日から最大1年間保管後、消滅
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                6. 情報の破棄
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                保存期間が経過した情報は、以下の方法で破棄されます：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．電子ファイル：復元及び再生が不可能な方法で安全に削除
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．記録物、印刷物、書面：裁断または焼却
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                7. 第三者への情報提供及びAIサービスの活用
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社が使用する第三者SDK及びAIサービスプロバイダーの情報処理：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．第三者AIサービスプロバイダー
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;-
                収集情報：個人を特定できない状態のタロットの質問内容
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;- 利用目的：タロット解釈及びコンテンツの生成
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．Google AdMob / Google AdSense
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;- 収集情報：広告識別子、端末情報、使用統計
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;-
                利用目的：パーソナライズド広告の提供、広告効果の測定
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;- 保管期間：広告識別子のリセットまたは無効化まで
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                8. 情報収集のご案内
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、情報収集について以下のようにご案内します：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．アプリの初回起動時にデータ収集の案内を表示
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．新しい種類のデータ収集時に別途ポップアップで通知
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                9. 第三者SDKの処理方針
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                各SDKのデータ収集及び処理は、該当するサービスのプライバシーポリシーに従います。
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第2条（個人情報の保護）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 基本原則
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．当社は、関連法令に従い利用者の個人情報を安全に保護します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．当社は、個人情報収集時に収集目的、項目、保有期間などを告知し、同意を得ます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．利用者は、個人情報の閲覧、訂正、削除を要求することができます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. 利用者の権利
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                利用者は、以下の権利を有します：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．個人情報へのアクセス権
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．個人情報の訂正及び削除要求権
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ．個人情報処理の制限要求権
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;エ．個人情報の移動権
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;オ．特定目的の個人情報処理の中断要求権（例：マーケティング目的の個人情報使用の拒否）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3. 国際法の遵守
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．当社は、欧州一般データ保護規則（GDPR）及びカリフォルニア州消費者プライバシー法（CCPA）を含む国内外の個人情報保護法令を遵守します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．EU居住者及びカリフォルニア州住民は、それぞれの法令に基づく追加的な権利を有します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                4. 個人情報の破棄
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．保有期間が経過した個人情報は、遅滞なく破棄されます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．破棄方法：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;-
                電子ファイル：復元及び再生が不可能な方法で安全に削除
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;&nbsp;- 記録物、印刷物、文書：裁断または焼却
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第3条（広告サービス）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 当社は、Google AdMob / Google
                AdSenseを使用して広告を提供することがあります。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2.
                広告目的で収集される情報には、端末情報（モデル名、OSバージョンなど）、位置情報、アプリの使用パターン、広告との相互作用データなどが含まれる場合があります。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3.
                利用者は、端末の設定を通じてパーソナライズド広告を拒否することができます。
              </div>{' '}
              <div
                className={styles['privacy-policy-details-japanese']}
              >{`ア. Android: 設定 > Google > 広告`}</div>{' '}
              <div
                className={styles['privacy-policy-details-japanese']}
              >{`イ. iOS: 設定 > プライバシー > トラッキング`}</div>{' '}
              {'*'}
              <div>第4条（広告コンテンツ）</div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 広告コンテンツはGoogle AdMob / Google
                AdSenseのポリシーに従い、当社は個別の広告内容を直接制御することはできません。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. 不適切な広告を発見した場合、Google AdMob / Google
                AdSenseを通じて報告することができます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3.
                報酬型広告の視聴は任意であり、視聴完了時に明示された報酬が即時に支給されます。
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第5条（ユーザー識別手段）
              </div>{' '}
              {isNative ? (
                <>
                  <div className={styles['privacy-policy-details-japanese']}>
                    1.
                    当社は、モバイルアプリでの広告提供及びユーザー識別のために広告識別子を使用します。
                  </div>{' '}
                  <div className={styles['privacy-policy-details-japanese']}>
                    2.
                    利用者は、端末の設定により広告識別子の使用を制限することができます。
                  </div>{' '}
                </>
              ) : (
                <>
                  <div className={styles['privacy-policy-details-japanese']}>
                    1.
                    当社は、サービス提供及び広告目的でクッキーを使用することがあります。
                  </div>{' '}
                  <div className={styles['privacy-policy-details-japanese']}>
                    2.
                    利用者は、ブラウザの設定を通じてクッキーの保存を拒否することができます。
                  </div>{' '}
                </>
              )}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第6条（第三者への情報提供）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 当社は、Google AdMob / Google
                AdSenseと利用者情報を共有することがあります。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ア．アプリ使用統計、端末情報
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;イ．エラー報告、おおよその位置情報
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                &nbsp;ウ. 広告識別子(AAID/IDFA)
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2.
                共有される情報は広告ID、端末情報などであり、広告提供目的で使用されます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                ア. パーソナライズド広告の提供
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                イ. 広告効果の測定
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                ウ. 不正広告の防止
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第7条（国際データ転送）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1.
                利用者の個人情報は、国外に位置するサーバーに保存されたり、国外の企業に転送されたりすることがあります。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2.
                当社は、国際転送時に個人情報保護のための適切な措置を講じます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3.
                EU居住者の個人情報を国際転送する場合、GDPRが規定する標準契約条項（Standard
                Contractual Clauses）などの適切な保護措置を適用します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                4.
                カリフォルニア州居住者の個人情報は、CCPA規制に従って処理され、関連する権利行使の方法はプライバシーポリシーでご確認いただけます。
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第8条（児童の個人情報保護）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 本サービスは3歳以上のユーザーが利用できます。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. 児童保護のため、以下の事項を遵守します：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                ア. 有害または不適切なコンテンツを提供しません。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                イ. 必要最小限の情報のみを収集します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                ウ. 安全なサービス利用環境を提供します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3. 保護者による管理：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                ア. 13歳未満の児童の場合、保護者による管理監督を推奨します。
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                イ.
                保護者はいつでも子供の利用履歴を確認・管理することができます。
              </div>{' '}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第9条（個人情報保護責任者）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 個人情報保護責任者：キム ジニョン
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. 連絡先：cosmostarotinfo@gmail.com
              </div>{' '}
              {''}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                第10条（セキュリティ対策）
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                当社は、利用者の個人情報を保護するために以下のセキュリティ対策を講じています：
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                1. 個人情報の暗号化
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                2. ハッキング等に対する技術的対策
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                3. 個人情報へのアクセス制限
              </div>{' '}
              {''}
              {'*'}
              <div className={styles['privacy-policy-details-japanese']}>
                付則
              </div>{' '}
              <div className={styles['privacy-policy-details-japanese']}>
                本規約は、2024年9月14日から施行されます。
              </div>
            </>
          ) : (
            ''
          )}
          {browserLanguage === 'en' ? (
            <>
              <div>
                Article 1 (Personal Information Collection and Information
                Provision)
              </div>{' '}
              <div>1. Scope of Collected Information</div>{' '}
              <div>
                The Company may request the following types of information from
                users for service provision:
              </div>{' '}
              <div>
                &nbsp;a. Basic personal information such as name and email
              </div>{' '}
              <div>&nbsp;b. Information generated during service use</div>{' '}
              <div>&nbsp;c. Device information when using mobile app</div>{' '}
              <div>2. Information Provision Obligation</div>{' '}
              <div>
                Users must provide all information truthfully. Users shall bear
                any disadvantages resulting from providing false information.
              </div>{' '}
              <div>3. Information Collection Methods</div>{' '}
              <div>
                The Company collects information through the following methods:
              </div>{' '}
              <div>
                &nbsp;a. Direct collection through web forms during membership
                registration
              </div>{' '}
              <div>
                &nbsp;b. Automatic collection of information generated during
                service use
              </div>{' '}
              <div>
                &nbsp;c. Automatic collection of device information when using
                mobile app
              </div>{' '}
              <div>4. Background Data Collection</div>{' '}
              <div>
                The Company may collect the following data in the background for
                service improvement:
              </div>{' '}
              <div>&nbsp;a. App usage statistics</div>{' '}
              <div>&nbsp;b. Error reports</div>{' '}
              <div>&nbsp;c. Device performance data</div>{' '}
              <div>5. Information Storage and Non-Restorability Notice</div>{' '}
              <div>
                The Company stores collected information for the following
                periods. Data deleted by the user or disposed of after the
                retention period cannot be personally restored by the user:
              </div>{' '}
              <div>
                &nbsp;a. Member information (name, contact, email, etc.): Until
                membership withdrawal
              </div>{' '}
              <div>
                &nbsp;b. Content information: Immediate deletion upon user
                request or automatic deletion after 3 months from use
              </div>{' '}
              <div>
                &nbsp;c. Content usage rights: Maximum 1 year from purchase
                date, then expires
              </div>{' '}
              <div>6. Information Disposal</div>{' '}
              <div>
                Information past its retention period is disposed of as follows:
              </div>{' '}
              <div>
                &nbsp;a. Electronic files: Securely deleted in a manner
                preventing recovery and reproduction
              </div>{' '}
              <div>
                &nbsp;b. Records, printouts, documents: Shredded or incinerated
              </div>{' '}
              <div>
                7. Third-Party Information Provision and AI Service Utilization
              </div>{' '}
              <div>
                Information processing by third-party SDK and AI service
                providers used by the Company:
              </div>{' '}
              <div>&nbsp;a. Third-Party AI Service Providers</div>{' '}
              <div>
                &nbsp;&nbsp;- Collected information: Anonymized tarot questions
              </div>{' '}
              <div>
                &nbsp;&nbsp;- Purpose: Generating tarot interpretations and
                content
              </div>{' '}
              <div>&nbsp;b. Google AdMob / Google AdSense</div>{' '}
              <div>
                &nbsp;&nbsp;- Collected information: Ad identifier, device
                information, usage statistics
              </div>{' '}
              <div>
                &nbsp;&nbsp;- Purpose: Personalized ad delivery, ad performance
                measurement
              </div>{' '}
              <div>
                &nbsp;&nbsp;- Storage period: Until ad identifier reset or
                deactivation
              </div>{' '}
              <div>8. Information Collection Notice</div>{' '}
              <div>
                The Company provides notice of information collection as
                follows:
              </div>{' '}
              <div>
                &nbsp;a. Display data collection notice at first app launch
              </div>{' '}
              <div>
                &nbsp;b. Provide separate popup notification for new types of
                data collection
              </div>{' '}
              <div>9. Third-Party SDK Processing Policy</div>{' '}
              <div>
                Data collection and processing by each SDK follows the privacy
                policy of the respective service.
              </div>{' '}
              {'*'}
              <div>Article 2 (Protection of Personal Information)</div>{' '}
              <div>1. Basic Principles</div>{' '}
              <div>
                &nbsp;a. The Company safely protects users' personal information
                in accordance with relevant laws and regulations.
              </div>{' '}
              <div>
                &nbsp;b. The Company notifies and obtains consent regarding the
                purpose, items, and retention period of personal information
                collection.
              </div>{' '}
              <div>
                &nbsp;c. Users may request access to, correction of, or deletion
                of their personal information.
              </div>{' '}
              <div>2. User Rights</div>{' '}
              <div>Users have the following rights:</div>{' '}
              <div>&nbsp;a. Right to access personal information</div>{' '}
              <div>
                &nbsp;b. Right to request correction and deletion of personal
                information
              </div>{' '}
              <div>
                &nbsp;c. Right to request restriction of personal information
                processing
              </div>{' '}
              <div>&nbsp;d. Right to data portability</div>{' '}
              <div>
                &nbsp;e. Right to request cessation of personal information
                processing for specific purposes (e.g., refusing the use of
                personal information for marketing purposes)
              </div>{' '}
              <div>3. International Law Compliance</div>{' '}
              <div>
                &nbsp;a. The Company complies with domestic and international
                privacy laws, including the European General Data Protection
                Regulation (GDPR) and the California Consumer Privacy Act
                (CCPA).
              </div>{' '}
              <div>
                &nbsp;b. EU residents and California residents have additional
                rights under their respective regulations.
              </div>{' '}
              <div>4. Disposal of Personal Information</div>{' '}
              <div>
                &nbsp;a. Personal information past its retention period will be
                disposed of without delay.
              </div>{' '}
              <div>&nbsp;b. Disposal methods:</div>{' '}
              <div>
                &nbsp;&nbsp;- Electronic files: Securely deleted in a manner
                preventing recovery and reproduction
              </div>{' '}
              <div>
                &nbsp;&nbsp;- Records, printouts, documents: Shredded or
                incinerated
              </div>{' '}
              {'*'}
              <div>Article 3 (Advertising Services)</div>{' '}
              <div>
                1. The Company may provide advertisements using Google AdMob /
                Google AdSense.
              </div>{' '}
              <div>
                2. Information collected for advertising purposes may include
                device information (model name, OS version, etc.), location
                information, app usage patterns, and ad interaction data.
              </div>{' '}
              <div>
                3. Users can opt out of personalized advertising through their
                device settings.
              </div>{' '}
              <div>&nbsp;{`a. Android: Settings > Google > Ads`}</div>{' '}
              <div>&nbsp;{`b. iOS: Settings > Privacy > Tracking`}</div> {'*'}
              <div>Article 4 (Advertisement Content)</div>{' '}
              <div>
                1. Advertisement content follows Google AdMob / Google AdSense's
                policies, and the company cannot directly control individual
                advertisement content.
              </div>{' '}
              <div>
                2. Inappropriate advertisements can be reported through Google
                AdMob / Google AdSense.
              </div>{' '}
              <div>
                3. Rewarded ad viewing is optional, and specified rewards are
                immediately provided upon completion of viewing.
              </div>{' '}
              {'*'}
              <div>Article 5 (User Identification Methods)</div>{' '}
              {isNative ? (
                <>
                  <div>
                    1. The company uses advertising identifiers for ad delivery
                    and user identification in mobile applications.
                  </div>{' '}
                  <div>
                    2. Users can restrict the use of advertising identifiers
                    through device settings.
                  </div>{' '}
                </>
              ) : (
                <>
                  <div>
                    1. The Company may use cookies for service provision and
                    advertising purposes.
                  </div>{' '}
                  <div>
                    2. Users can refuse to store cookies through their browser
                    settings.
                  </div>{' '}
                </>
              )}
              {'*'}
              <div>Article 6 (Third-Party Information Sharing)</div>{' '}
              <div>
                1. The Company may share user information with Google AdMob /
                Google AdSense.
              </div>{' '}
              <div>&nbsp;a. Device Information</div>{' '}
              <div>&nbsp;b. Approximate Location Data</div>{' '}
              <div>&nbsp;c. Advertising Identifier (AAID/IDFA)</div>{' '}
              <div>
                2. Shared information includes advertising IDs and device
                information, which are used for advertising purposes.
              </div>{' '}
              <div>&nbsp;a. Personalized Ad Delivery</div>{' '}
              <div>&nbsp;b. Ad Performance Measurement</div>{' '}
              <div>&nbsp;c. Ad Fraud Prevention</div> {'*'}
              <div>Article 7 (International Data Transfer)</div>{' '}
              <div>
                1. Users' personal information may be stored on servers located
                outside the country or transferred to overseas companies.
              </div>{' '}
              <div>
                2. The Company takes appropriate measures to protect personal
                information during international transfers.
              </div>{' '}
              <div>
                3. When transferring personal information of EU residents
                internationally, appropriate safeguards such as Standard
                Contractual Clauses as stipulated by GDPR will be applied.
              </div>{' '}
              <div>
                4. Personal information of California residents is processed in
                accordance with CCPA regulations, and methods for exercising
                related rights can be found in the Privacy Policy.
              </div>{' '}
              {'*'}
              <div>
                Article 8 (Protection of Children's Personal Information)
              </div>{' '}
              <div>1. This service is available to users aged 3 and above.</div>{' '}
              <div>
                2. We comply with the following measures to protect children:
              </div>{' '}
              <div>
                &nbsp;a. We do not provide harmful or inappropriate content.
              </div>{' '}
              <div>
                &nbsp;b. We collect only the minimum necessary information.
              </div>{' '}
              <div>&nbsp;c. We provide a safe service environment.</div>{' '}
              <div>3. Parental Control:</div>{' '}
              <div>
                &nbsp;a. Parental supervision is recommended for children under
                13 years of age.
              </div>{' '}
              <div>
                &nbsp;b. Parents can check and manage their children's usage
                history at any time.
              </div>{' '}
              {'*'}
              <div>
                Article 9 (Personal Information Protection Officer)
              </div>{' '}
              <div>
                1. Personal Information Protection Officer: KIM JIN YOUNG
              </div>{' '}
              <div>2. Contact: cosmostarotinfo@gmail.com</div> {'*'}
              <div>Article 10 (Security Measures)</div>{' '}
              <div>
                The Company implements the following security measures to
                protect users' personal information:
              </div>{' '}
              <div>1. Encryption of personal information</div>{' '}
              <div>2. Technical measures against hacking and other threats</div>{' '}
              <div>3. Access control to personal information</div> {'*'}
              <div>Addendum</div>{' '}
              <div>
                These terms and conditions shall take effect from September
                14th, 2024.
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});

export default PrivacyPolicyForm;
