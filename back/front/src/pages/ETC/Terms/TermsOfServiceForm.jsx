/*eslint-disable*/
import React, { useState, useEffect, memo } from 'react';
import styles from './TermsOfServiceForm.module.scss';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
const isNative = Capacitor.isNativePlatform();

const TermsOfServiceForm = memo(({ ...props }) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();

  return (
    <div
      className={`${
        browserLanguage === 'ja'
          ? styles['terms-of-service-container-japanese']
          : styles['terms-of-service-container']
      }`}
    >
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['terms-of-service1-japanese']
            : styles['terms-of-service1']
        }`}
      >
        <div>
          {browserLanguage === 'ko' ? (
            <>
              <div>제1조 (목적)</div>{' '}
              <div>
                이 약관은 진월드(이하 "회사")가 제공하는 타로 서비스(이하
                "서비스")의 이용조건 및 절차에 관한 사항을 규정함을 목적으로
                합니다.
              </div>{' '}
              {'*'}
              <div>제2조 (용어의 정의)</div>{' '}
              <div>
                1. "서비스"란 회사가 운영하는 타로카드 예측 서비스를 의미합니다.
              </div>{' '}
              <div>
                2. "이용자"란 본 약관에 동의하고 서비스를 이용하는 개인 또는
                법인을 말합니다.
              </div>{' '}
              {'*'}
              <div>제3조 (서비스 이용계약의 체결)</div>{' '}
              <div>1. 이용계약은 이용자가 회원가입을 신청하면 체결됩니다.</div>{' '}
              {'*'}
              <div>제4조 (서비스 이용 요금)</div>{' '}
              <div>
                1. 서비스 이용에 대해서는 회사가 정한 컨텐츠 이용권에 대한
                요금을 납부하거나 광고 시청을 하여야 합니다.
              </div>{' '}
              <div>
                2. 요금의 구체적인 금액 및 납부방법은 서비스 내 안내를 통해
                공지합니다.
              </div>{' '}
              {'*'}
              <div>제5조 (서비스 이용 시 준수사항)</div>{' '}
              <div>
                1. 이용자는 서비스 이용 시 관련 법령과 본 약관을 준수하여야
                합니다.
              </div>{' '}
              <div>2. 이용자는 다음 각 호의 행위를 해서는 안 됩니다.</div>{' '}
              <div>&nbsp;가. 타인의 개인정보, 사생활 침해 행위</div>{' '}
              <div>&nbsp;나. 서비스 운영을 방해하는 행위</div>{' '}
              <div>&nbsp;다. 기타 법령에 위반되는 행위</div> {'*'}
              <div>제6조 (지식재산권)</div>{' '}
              <div>
                1. 서비스에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.
              </div>{' '}
              <div>
                2. 이용자는 회사의 사전 서면 승낙 없이 타로 해석 결과를 제외하고
                서비스를 복제, 전송, 수정할 수 없습니다.
              </div>{' '}
              {'*'}
              <div>제7조 (구매 및 환불)</div>{' '}
              <div>
                1. 이용자는 서비스 내에서 유료 상품을 구매할 수 있습니다.
              </div>{' '}
              <div>2. 이용권 환불은 다음과 같은 조건에 따라 처리됩니다.</div>{' '}
              <div>
                &nbsp;가. 구매 시 결제한 금액의 70%가 부분 환불 처리됩니다.
              </div>{' '}
              <div>&nbsp;나. 환불금액은 십원단위 이상부터 지급됩니다.</div>{' '}
              <div>
                &nbsp;다. 환불을 요청할 경우, 구매 시 결제 금액을 기준으로 총
                환불 요청 금액이 5,000원 이상이어야 합니다.
              </div>{' '}
              <div>
                &nbsp;라. 구매 후 청약철회 기간(1년) 이내에서만 환불 요청이
                가능합니다. 단, 예외적으로 (퀵)계좌이체로 구매한 이용권은
                구매일로부터 180일 이내, 휴대폰 결제의 경우 구매한 당월까지만
                환불이 가능합니다.
              </div>{' '}
              <div>
                &nbsp;마. 구글 플레이 스토어에서 다운로드한 앱으로 이용권을
                구매한 경우(인앱 결제 이용), 예외적으로 구글 플레이 스토어의
                환불 정책을 따릅니다.
              </div>{' '}
              <div>
                {
                  "3. 구체적인 환불절차와 기준은 회사 운영정책(환불정책)에 따르니 '마이페이지 > 회원정보 > 이용권구매 > 환불정책'에 이동하시어 환불정책 참조바랍니다."
                }
              </div>{' '}
              <div>
                4. 구매 및 환불 과정에서 부정행위가 발견될 경우, 회사는 해당
                이용자에게 금전적 배상을 요구할 수 있으며, 2회의 서면 경고를
                제공할 수 있습니다. 경고 후에도 부정행위가 지속되는 경우, 회사는
                해당 이용자의 서비스 이용을 제한하거나 계정을 정지할 수
                있습니다. 또한, 회사는 부정행위로 인한 손해에 대해 추가적인
                금전적 배상을 청구하거나 법적 조치를 취할 권리를 보유합니다.
              </div>{' '}
              <div>
                5. 참고로, 이용권 사용 시 웹사이트에서 구매한 이용권을 먼저
                사용하고, 그 다음 구글 플레이 스토어 앱에서 구매한 이용권을
                사용하게 됩니다.
              </div>{' '}
              {'*'}
              <div>제8조 (서비스 중단 및 변경)</div>{' '}
              <div>
                1. 회사는 서비스 개선 등 필요한 경우 서비스를 중단하거나 변경할
                수 있습니다.
              </div>{' '}
              <div>
                2. 회사는 사전에 이를 이용자에게 공지하되, 부득이한 경우 사후에
                공지할 수 있습니다.
              </div>{' '}
              {'*'}
              <div>제9조 (손해배상 및 면책사항)</div>{' '}
              <div>
                1. 회사는 본 서비스에서 제공하는 타로 해석 및 결과는 오락 및
                참고용(Entertainment purposes only)으로 제공합니다. 어떠한
                경우에도 전문적인 법률, 의료, 금융 상담을 대체할 수 없으며,
                결과에 따른 최종 결정의 책임은 이용자 본인에게 있습니다.
              </div>{' '}
              <div>
                2. 회사는 서비스 및 컨텐츠 이용과 관련하여 이용자에게 발생한
                모든 손해에 대해 책임을 부담하지 않습니다. 다만, 환불 관련
                사항은 이용약관 제7조에 따라 처리합니다.
              </div>{' '}
              <div>
                3. 이용자가 이 약관의 규정을 위반함으로 인해 회사에 손해가
                발생하게 되는 경우, 이용자는 회사에 대해 그 그 손해를 배상하여야
                합니다.
              </div>{' '}
              <div>
                4. 천재지변, 전쟁, 테러 등 불가항력적인 사유로 서비스 제공이
                불가능한 경우 회사는 책임을 지지 않습니다.
              </div>{' '}
              {'*'}
              <div>제10조 (분쟁해결)</div>{' '}
              <div>
                1. 이 약관의 해석 및 적용에 관한 분쟁이 발생할 경우 회사와
                이용자는 상호 협의로 해결하되, 이에 이르지 못할 경우 관련 법령
                및 상관례에 따릅니다.
              </div>{' '}
              <div>
                2. 회사와 이용자 사이에 제기된 모든 소송은 회사 본사 소재지 관할
                법원을 관할 법원으로 합니다.
              </div>{' '}
              {'*'}
              <div>제11조 (약관 변경)</div>{' '}
              <div>1. 회사는 필요한 경우 이 약관을 변경할 수 있습니다.</div>{' '}
              <div>
                2. 약관이 변경되는 경우 회사는 적용일자 및 변경사유를 명시하여
                그 변경 내용을 공지합니다.
              </div>{' '}
              <div>
                3. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고
                탈퇴할 수 있습니다.
              </div>{' '}
              <div>
                4. 회사는 (이용)약관이 변경될 경우, 변경 내용을 웹사이트
                공지사항, 개별 이메일, 또는 앱 스토어의 출시 노트를 통해
                사용자에게 알립니다. 앱의 주요 기능 변경이나 중요한 업데이트
                사항도 같은 방식으로 공지될 수 있습니다.
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
              <div className={styles['terms-of-service-details-japanese']}>
                第1条（目的）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                本規約は、ジンワールド（以下「当社」という。）が提供するタロットサービス（以下「本サービス」という。）の利用条件及び手続きに関する事項を定めることを目的とします。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第2条（用語の定義）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.「本サービス」とは、当社が運営するタロットカード予測サービスをいいます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.「利用者」とは、本規約に同意し、本サービスを利用する個人又は法人をいいます。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第3条（サービス利用契約の締結）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                利用契約は、利用者が会員登録を申請した時点で成立するものとします。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第4条（サービス利用料金）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                本サービスの利用にあたっては、当社が定めたコンテンツ利用券に対する料金を支払うか、広告を視聴しなければなりません。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.
                料金の具体的な金額及び支払方法は、本サービス内の案内を通じて告知します。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第5条（サービス利用時の遵守事項）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                利用者は、本サービスの利用時に関連法令と本規約を遵守しなければなりません。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2. 利用者は、次の各号の行為を行ってはなりません。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;ア．他인의 개인정보, 프라이버시 침해 행위
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;イ．本サービスの運営を妨害する行為
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;ウ．その他法令に違反する行為
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第6条（知的財産権）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1. 本サービスに関する著作権及び知的財産権は、当社に帰属します。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2. 利用者は、当社の事前の書면 의한 승낙 없이, 타로 해석 결과를
                제외하고, 본 서비스를 복제, 전송, 수정할 수 없습니다.
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第7条（購入及び返金）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1. 利用者は、本サービス内で有料商品を購入することができます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2. 利用券の返金は、以下の条件に従って処理されます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;ア．購入時に支払った金額の70％が一部返金として処理されます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;イ．返金金額は、USDの場合、小数点第2位（セント）まで計算されます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;ウ．返金申請の総額は、購入時の支払金額に基づき、3
                USD以上である必要があります。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;エ．返金申請は、購入後のクーリングオフ期間（180日）以内の場合にのみ可能です。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                &nbsp;オ．Google Play
                ストアからダウンロードしたアプリで利用券を購入した場合（アプリ内課金利用）、例外的にGoogle
                Play ストアの返金方針に従います。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                {`3. 具体的な返金手続きおよび基準は当社の運営方針（返金方針）に従いますので、「マイページ > ユーザー > 購入 > 方針」に移動して返金方針を参照してください。`}
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                4. 購入および返金の手続きにおいて不正行為が検出された場合,
                当社는 해당 이용자에게 금전적 배상을 요구할 수 있으며, 2회의
                서면 경고를 제공할 수 있습니다. 경고 후에도 부정행위가 지속되는
                경우, 당사는 해당 이용자의 서비스 이용을 제한하거나 계정을
                정지할 수 있는 권리를 보유합니다.
                さらに、当社は不正行為によって生じた損害に対して追加の金銭的
                배상을 청구하거나, 법적 조치를 취할 권리를 보유합니다.
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                5.
                参考までに、利用券の使用時には、ウェブサイトで購入した利用券が優先的に使用され、その後にGoogle
                Play ストアアプリで購入した利用券が使用されます。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第8条（サービスの中断及び変更）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                当社は、サービス改善などが必要な場合、サービスを中断または変更することがあります。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.
                当社は事前にこれを利用者に告知しますが、やむを得ない場合は事後に告知することがあります。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第9条（損害賠償及び免責事項）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                本サービスで提供されるタロットの解釈および結果は、娯楽および参考用（Entertainment
                purposes
                only）です。いかなる場合も、専門的な法律、医療、金融の相談に代わるものではなく、結果に基づく最終的な決定の責任は利用者本人にあります。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.
                当社は、本サービスおよびコンテンツの利用に関連して利用者に発生たいかなる損害についても責任を負いません。ただし、返金に関する事項は利用規約第7条に従って処理されます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                3.
                利用者が本規約の規定に違反したことにより当社に損害が発生した場合、利用者は当社に対してその損害を賠償しなければなりません。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                4.
                天災地変、戦争、テロなどの不可抗力的な事由によりサービスの提供が不可能な場合、当社は責任を負いません。
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第10条（紛争解決）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1.
                本規約の解釈および適用に関して紛争が生じた場合、当社と利用者は相互協議により解決するものとしますが、合意に至らない場合は関連法令および商慣習に従います。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.
                当社と利用者の間で提起されたすべての訴訟は、当社の本社所在地を管轄하는
                법원을 관할 법원으로 합니다.
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                第11条（規約の変更）
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                1. 当社は、必要な場合、本規約を変更することがあります。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                2.
                規約を変更する場合、当社は適用日および変更理由を明示して、その変更内容を告知합니다.
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                3.
                変更後の規約に同意しない利用者は、サービスの利用を中断し、退会することができます。
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                4.
                当社は、利用規約を変更する場合、変更内容をウェブサイトのお知らせ、個別のメール、
                또는 앱 스토어의 출시 노트를 통해 사용자에게 알립니다. 앱의 주요
                기능 변경이나 중요한 업데이트 사항도 같은 방식으로 공지될 수
                있습니다.
              </div>{' '}
              {'*'}
              <div className={styles['terms-of-service-details-japanese']}>
                付則
              </div>{' '}
              <div className={styles['terms-of-service-details-japanese']}>
                本規約は、2024年9月14日から施行됩니다.
              </div>
            </>
          ) : (
            ''
          )}
          {browserLanguage === 'en' ? (
            <>
              <div>Article 1 (Purpose)</div>{' '}
              <div>
                These terms and conditions aim to stipulate the conditions and
                procedures for the use of the tarot service (hereinafter
                referred to as the "Service") provided by Jinworld (hereinafter
                referred to as the "Company").
              </div>{' '}
              {'*'}
              <div>Article 2 (Definition of Terms)</div>{' '}
              <div>
                1. "Service" refers to the tarot card prediction service
                operated by the Company.
              </div>{' '}
              <div>
                2. "User" refers to an individual or legal entity that agrees to
                these terms and conditions and uses the Service.
              </div>{' '}
              {'*'}
              <div>Article 3 (Conclusion of Service Use Agreement)</div>{' '}
              <div>
                1. The service use agreement is concluded when the user applies
                for membership registration.
              </div>{' '}
              {'*'}
              <div>Article 4 (Service Usage Fees)</div>{' '}
              <div>
                1. To use the Service, users must either pay the fee for the
                voucher set by the Company or watch advertisements.
              </div>{' '}
              <div>
                2. The specific amount and payment method of the fees will be
                announced through the Service.
              </div>{' '}
              {'*'}
              <div>Article 5 (Compliance with Service Use)</div>{' '}
              <div>
                1. Users must comply with relevant laws and these terms and
                conditions when using the Service.
              </div>{' '}
              <div>2. Users shall not engage in any of the following acts:</div>{' '}
              <div>
                A. Infringement of others' personal information or privacy
              </div>{' '}
              <div>B. Interfering with the operation of the Service</div>{' '}
              <div>C. Other acts that violate laws and regulations</div> {'*'}
              <div>Article 6 (Intellectual Property Rights)</div>{' '}
              <div>
                1. Copyrights and intellectual property rights related to the
                Service belong to the Company.
              </div>{' '}
              <div>
                2. Users may not reproduce, transmit, or modify the Service
                without the Company's prior written consent, except for tarot
                interpretation results.
              </div>{' '}
              {'*'}
              <div>Article 7 (Purchase and Refund)</div>{' '}
              <div>1. Users may purchase paid products within the Service.</div>{' '}
              <div>
                2. Refunds for vouchers are processed according to the following
                conditions:
              </div>{' '}
              <div>
                A. 70% of the amount paid at the time of purchase will be
                partially refunded.
              </div>{' '}
              <div>
                B. The refund amount is calculated to the second decimal place
                (cents) for USD.
              </div>{' '}
              <div>
                C. The total amount requested for a refund must be at least 3
                USD based on the payment amount at the time of purchase.
              </div>{' '}
              <div>
                D. Refund requests can only be made within the cooling-off
                period (180 days) after the purchase.
              </div>{' '}
              <div>
                E. For vouchers purchased through apps downloaded from the
                Google Play Store (using in-app purchases), refunds will be
                processed according to the Google Play Store's refund policy as
                an exception.
              </div>{' '}
              <div>
                {`3. Specific refund procedures and standards follow the Company's
                operational policy (refund policy), so please refer to the
                refund policy by going to "My Page > User > Purchase > Policy".`}
              </div>{' '}
              <div>
                4. In the event that fraudulent activities are detected during
                the purchase and refund process, the company may demand monetary
                compensation from the user in question and may provide two
                written warnings. If the fraudulent activities persist after
                these warnings, the company reserves the right to restrict the
                user's access to the service or suspend their account.
                Furthermore, the company reserves the right to claim additional
                monetary compensation for damages caused by the fraudulent
                activities or to take legal action.
              </div>{' '}
              <div>
                5. For your information, when using vouchers, those purchased on
                the website will be used first, followed by those purchased
                through the Google Play Store app.
              </div>{' '}
              {'*'}
              <div>Article 8 (Service Interruption and Change)</div>{' '}
              <div>
                1. The Company may suspend or change the Service when necessary
                for service improvements or other reasons.
              </div>{' '}
              <div>
                2. The Company shall notify users in advance, but in unavoidable
                cases, notification may be made after the fact.
              </div>{' '}
              {'*'}
              <div>
                Article 9 (Compensation for Damages and Disclaimer)
              </div>{' '}
              <div>
                1. The tarot interpretations and results provided by this
                service are for entertainment and reference purposes only. They
                should not under any circumstances be substituted for
                professional legal, medical, or financial advice, and the user
                assumes all responsibility for any final decisions based on the
                results.
              </div>{' '}
              <div>
                2. The Company shall not be liable for any damages incurred by
                users in connection with the use of the Service and its content.
                However, matters related to refunds shall be processed in
                accordance with Article 7 of the Terms and Conditions.
              </div>{' '}
              <div>
                3. If the Company suffers damages due to the user's violation of
                these terms and conditions, the user shall compensate the
                Company for such damages.
              </div>{' '}
              <div>
                4. The Company shall not be liable if the provision of the
                Service is impossible due to force majeure events such as
                natural disasters, war, or terrorism.
              </div>{' '}
              {'*'}
              <div>Article 10 (Dispute Resolution)</div>{' '}
              <div>
                1. If a dispute arises regarding the interpretation and
                application of these terms and conditions, the Company and the
                user shall resolve it through mutual consultation. If an
                agreement cannot be reached, it shall be resolved in accordance
                with relevant laws and commercial practices.
              </div>{' '}
              <div>
                2. All lawsuits filed between the Company and users shall be
                subject to the exclusive jurisdiction of the court having
                jurisdiction over the location of the Company's headquarters.
              </div>{' '}
              {'*'}
              <div>Article 11 (Amendment of Terms and Conditions)</div>{' '}
              <div>
                1. The Company may amend these terms and conditions when
                necessary.
              </div>{' '}
              <div>
                2. In the event of an amendment to the terms and conditions, the
                Company shall specify the effective date and reason for the
                change and announce the changes.
              </div>{' '}
              <div>
                3. Users who do not agree to the amended terms and conditions
                may discontinue the use of the Service and withdraw their
                membership.
              </div>{' '}
              <div>
                4. In the event of changes to the Terms of Service, the company
                will notify users of the changes through website announcements,
                individual emails, or app store release notes. Major feature
                changes or important updates to the app may also be announced in
                the same manner.
              </div>{' '}
              {'*'}
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

export default TermsOfServiceForm;

// withCredentials: true는 서버에 요청 시에 인증 정보를 함께 보내도록 하는 옵션일 것입니다. 보통 쿠키를 사용하는 세션 기반 인증에서 필요한 옵션입니다.
// data.user._json은 일반적으로 OAuth 인증을 통해 얻은 사용자 정보에서 사용자의 추가 정보(사용자의 이메일, 이름, 프로필 사진 URL 등)를 담고 있는 객체
// 언더스코어(_)는 객체의 프로퍼티 이름. 즉,  _json은 단순히 객체의 속성 이름
// 추출한 userInfo 객체의 _json 속성
// _json이라는 이름의 속성은 주로 OAuth 인증 프로세스에서 사용됩니다. 일반적으로 OAuth 공급자로부터 반환되는 사용자 정보가 JSON 형식으로 제공되는데, 이 정보는 _json이라는 속성에 담겨 있을 수 있습니다.
// {
//   "login": "example_user",
//   "id": 123456,
//   "name": "John Doe",
//   "email": "john@example.com"
//   // ... 기타 사용자 정보
// }
// 이런식으로 나옴.
// console.log('tarotHistory._json : ', tarotHistory._json);
