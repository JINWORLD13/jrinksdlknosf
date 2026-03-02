// utils/seoData.js - 감성적이고 사용자 중심적인 SEO 설정
export const seoData = {
  // 기본 설정
  default: {
    title: 'COSMOS TAROT',
    description: 'Warm tarot consultation when your mind feels complicated',
    keywords: 'tarot cards, mind reading, comfort, fortune, healing',
  },

  // 루트 경로 (도메인만 접근하는 경우) - 영어 기본
  '/': {
    title:
      'Will My Ex Contact Me? Soulmate Insights & Secret Feelings - COSMOS',
    description:
      'The honest truth about your relationship. Will they come back? Get deep insights into their secret feelings and your future together. Explore the whispers of destiny today.',
    keywords:
      'ex contact me, secret feelings, reconciliation, soulmate reading, deep tarot, hidden truth, online master',
    threeJSContent: true,
    image: '/assets/images/home/preview-en.png',
    imageWidth: '1920',
    imageHeight: '867',
  },

  // 홈페이지 - Three.js 페이지
  '/ko': {
    title: '헤어진 전남친 연락 오는 시기? 재회운·속마음 1:1 비밀 상담 - COSMOS',
    description:
      '"그의 속마음은 진심일까?" "우리는 다시 만날 수 있을까?" 당신만 알고 싶은 비밀스러운 고민, 1:1 타로 상담으로 명확한 해답을 찾아드립니다.',
    keywords:
      '전남친 연락 시기, 재회운, 상대방 속마음, 비밀 상담, 연애운, 금전운, 직장운',
    threeJSContent: true,
    image: '/assets/images/home/preview-ko.png',
    imageWidth: '1920',
    imageHeight: '872',
  },
  '/en': {
    title:
      'Will My Ex Contact Me? Soulmate Insights & Secret Feelings - COSMOS',
    description:
      'The honest truth about your relationship. Will they come back? Get deep insights into their secret feelings and your future together. Explore the whispers of destiny today.',
    keywords:
      'ex contact me, secret feelings, reconciliation, soulmate reading, deep tarot, hidden truth, online master',
    threeJSContent: true,
    image: '/assets/images/home/preview-en.png',
    imageWidth: '1920',
    imageHeight: '867',
  },
  '/ja': {
    title: '復縁できる可能性は？元彼の本音と連絡が来る時期を透視 - COSMOS',
    description:
      '「あの人は今、何を考えている？」 「もう一度やり直せる？」 誰にも言えない秘密の悩み、タロットマスターがあなたの運命を導き出します。',
    keywords:
      '復縁可能性, 元彼の本音, 連絡が来る時期, 相手の気持ち, 秘密の相談, 恋愛運, オンライン占い',
    threeJSContent: true,
    image: '/assets/images/home/preview-ja.png',
    imageWidth: '1917',
    imageHeight: '872',
  },

  // 타로 원리 페이지
  '/ko/tarot/principle': {
    title: '점술이 아닌 심리학: 무의식이 알려주는 당신의 미래와 타로의 원리',
    description:
      '단순한 운세를 넘어선 과학적 접근. 무의식의 거울인 타로가 어떻게 당신의 현재와 미래를 정교하게 비추는지 그 심리적 메커니즘을 공개합니다.',
    keywords: '타로 원리, 심리학 타로, 무의식의 거울, 타로 학문, 동시성 이론',
    image: '/assets/images/home/preview-ko.png',
    imageWidth: '1920',
    imageHeight: '872',
    ogLocale: 'ko_KR',
  },
  '/en/tarot/principle': {
    title: 'Beyond Divination: The Psychology & Hidden Principles of Tarot',
    description:
      'Explore the scientific approach to your inner world. Learn how tarot serves as a mirror of the unconscious and the psychological mechanisms behind the cards.',
    keywords:
      'tarot psychology, unconscious mirror, synchronicity, tarot principles, psychological reading',
    image: '/assets/images/home/preview-en.png',
    imageWidth: '1920',
    imageHeight: '867',
    ogLocale: 'en_US',
  },
  '/ja/tarot/principle': {
    title:
      '単なる占いではない心理学：無意識が教えるあなたの未来とタロットの原理',
    description:
      '運勢を超えた科学的アプローチ。無意識の鏡であるタロットがどのようにあなたの現在と未来を映し出すか、その心理的メカ니즘을解説します。',
    keywords:
      'タロット原理, 心理学タロット, 無意識の鏡, シンクロニシティ, タロットの仕組み',
    image: '/assets/images/home/preview-ja.png',
    imageWidth: '1917',
    imageHeight: '872',
    ogLocale: 'ja_JP',
  },

  // 마이페이지 메인
  '/ko/mypage': {
    title: '과거 운세 다시보기: 나의 연애운·금전운 히스토리 보관소 - COSMOS',
    description:
      '그동안 확인했던 타로 결과와 운세 기록을 한눈에 살펴보세요. 당신의 고민과 인생의 흐름을 되짚어보는 개인 보관소입니다.',
    keywords: '타로 기록, 과거 운세 다시보기, 운세 히스토리, 상담 보관소',
  },
  '/en/mypage': {
    title: 'Prediction History: Your Love & Career Reading Archive - COSMOS',
    description:
      "Revisit your past tarot readings and fortune records. A private space to track your journey and review the insights you've received.",
    keywords:
      'tarot history, past readings, reading archive, personal fortune records',
  },
  '/ja/mypage': {
    title: '過去の占い履歴：恋愛運・金運のヒ스트リー保管所 - COSMOS',
    description:
      'これまで確認したタロットの結果と運勢の記録を一目でチェック。あなたの悩みと人生の流れを振り返る個人保管所です。',
    keywords: 'タロット記録, 占い履歴, 鑑定アーカイブ, 運勢の記録',
  },

  // 마이페이지 - 리딩 정보
  '/ko/mypage/readingInfo': {
    title: '상담 기록 리스트: 내가 뽑은 카드와 지난 조언 다시 읽기 - COSMOS',
    description:
      '상세한 타로 리딩 기록을 다시 읽어보세요. 과거에 뽑았던 카드와 AI가 전해준 구체적인 조언들이 모두 저장되어 있습니다.',
    keywords: '상담 리스트, 카드 기록, 타로 조언 다시보기, 운세 상세 기록',
  },
  '/en/mypage/readingInfo': {
    title: 'Reading List: Revisit Your Past Tarot Insights - COSMOS',
    description:
      "Review your detailed tarot reading history. All your picked cards and the specific insights you've received are saved here for reflection.",
    keywords:
      'reading history list, revisited insights, tarot card logs, detailed prediction',
  },
  '/ja/mypage/readingInfo': {
    title: '鑑定記録リスト：引いたカードと過去のアドバイスを再読 - COSMOS',
    description:
      '詳細なタロットリーディングの記録を読み返しましょう。過去に引いたカードとマスターが伝えた具体的なアドバイスがすべて保存されています。',
    keywords: '鑑定リスト, カードの記録, アドバイス再読, 占い詳細ログ',
  },

  // 마이페이지 - 전체 차트
  '/ko/mypage/chart/totalchart': {
    title: '운세 통계 리포트: 나의 주된 고민과 마음 변화 데이터 분석 - COSMOS',
    description:
      '시간이 지남에 따라 변해온 나의 운세 흐름을 데이터로 확인하세요. 어떤 고민이 가장 많았는지 시각적 차트로 보여드립니다.',
    keywords: '운세 데이터, 마음 통계, 고민 분석 차트, 운세 리포트',
  },
  '/en/mypage/chart/totalchart': {
    title: 'Fortune Statistics: Analyzing Your Mind & Growth Data - COSMOS',
    description:
      'Track your fortune trends over time with visual data. Discover which concerns occurred most frequently through our analytical growth charts.',
    keywords: 'fortune stats, mind analytics, concern charts, growth data',
  },
  '/ja/mypage/chart/totalchart': {
    title: '運勢統計レポート：悩みの傾向と心の変化をデータ分析 - COSMOS',
    description:
      '時間の経過とともに変化した運勢の流れをデータで確認。どのような悩みが多く寄せられたか, 視覚的なチャートで分析します。',
    keywords: '運勢データ, 心の統計, 悩み分析チャート, 運勢レポート',
  },

  // 마이페이지 - 주제별 차트
  '/ko/mypage/chart/subjectchart': {
    title: '주제별 고민 분석: 연애·직장·금전 분야별 운세 흐름 - COSMOS',
    description:
      '연애, 금전, 직장 등 삶의 각 영역에서 어떤 조언을 받아왔는지 한눈에 비교해보세요. 주제별로 정리된 나의 운세 지도.',
    keywords: '연애운 분석, 직장운 통계, 금전운 흐름, 주제별 운세',
  },
  '/en/mypage/chart/subjectchart': {
    title: 'Niche Insights: Your Fortune Trends by Topic - COSMOS',
    description:
      "Compare the guidance you've received across different areas of life, such as love, career, and wealth. A personalized map of your themed insights.",
    keywords: 'topic analytics, love insights, career trends, life theme data',
  },
  '/ja/mypage/chart/subjectchart': {
    title: 'テーマ別悩み分析：恋愛・仕事・金運それぞれの運勢傾向 - COSMOS',
    description:
      '恋愛, 金運, 仕事など人生の各分野でどのようなアドバイスを受けてきたか一目で比較。分野別に整理されたあなたの運勢地図。',
    keywords: '恋愛運分析, 仕事運統計, 金運の傾向, テーマ別占い',
  },

  // 마이페이지 - 질문 주제 차트
  '/ko/mypage/chart/questiontopicchart': {
    title: '질문 패턴 분석: 내가 가장 많이 물어본 고민 키워드 - COSMOS',
    description:
      '당신의 질문 속에 숨겨진 진짜 욕망은 무엇일까요? 가장 빈번하게 물어본 키워드를 통해 나의 관심사를 데이터로 분석합니다.',
    keywords: '질문 패턴, 궁금증 키워드, 고민 분석, 데이터 성찰',
  },
  '/en/mypage/chart/questiontopicchart': {
    title: 'Question Patterns: Analyzing Your Most Frequent Concerns - COSMOS',
    description:
      'What are you truly curious about? We analyze your most frequent question keywords to discover the patterns underlying your thoughts.',
    keywords:
      'question keywords, concern patterns, curiosity data, thought analysis',
  },
  '/ja/mypage/chart/questiontopicchart': {
    title: '質問パターン分析：最も多く問いかけた悩みのキーワード - COSMOS',
    description:
      'あなたの質問の中に隠された本当の関心事は何でしょうか。最も頻繁に問いかけたキーワードを通じて, あなたの傾向をデータで分析します。',
    keywords: '質問パターン, 関心キーワード, 悩み分析, 데이터による内省',
  },

  // 마이페이지 - 회원 탈퇴
  '/ko/mypage/userinfo/withdraw': {
    title: '회원 탈퇴: 기록 삭제 전 확인 및 작별 인사 - COSMOS',
    description:
      '정말로 떠나시겠어요? 탈퇴 시 저장된 모든 상담 기록이 영구 삭제됩니다. 그동안 함께해주셔서 진심으로 감사합니다.',
    keywords: '회원 탈퇴, 기록 삭제, 작별 인사, 서비스 종료',
  },
  '/en/mypage/userinfo/withdraw': {
    title: 'Account Deletion: Farewell & Record Removal Info - COSMOS',
    description:
      'Are you sure you want to leave? All your saved insights will be permanently removed upon deletion. Thank you for our journey together.',
    keywords: 'account deletion, data removal, checkout, farewell',
  },
  '/ja/mypage/userinfo/withdraw': {
    title: '会員退会：記録削除前の確認と別れの挨拶 - COSMOS',
    description:
      '本当に退会されますか？ 退会時に保存されたすべての鑑定記録が永久に削除されます。これまでご利用いただき、誠にありがとうございました。',
    keywords: '会員退会, 記録削除, 別れの挨拶, サービス終了',
  },

  // 기타 페이지
  '/ko/etc': {
    title: '타로 기초 백과: 초보자가 꼭 알아야 할 기초 궁금증 해소 - COSMOS',
    description:
      '타로가 처음인가요? 카드 셔플부터 해석의 기본 원리까지, 입문자를 위해 준비한 친절한 가이드와 FAQ를 확인하세요.',
    keywords: '타로 기초 가이드, 타로 입문, 초보자 FAQ, 타로하는 법',
  },
  '/en/etc': {
    title: 'Tarot FAQ & Basics: Everything a Beginner Needs to Know - COSMOS',
    description:
      'New to tarot? Explore our friendly guide for beginners, covering everything from card shuffling to basic interpretation principles and FAQs.',
    keywords: 'tarot basics, beginner guide, tarot FAQ, how to read tarot',
  },
  '/ja/etc': {
    title: 'タロット基礎百科：初心者が知っておくべき基本の疑問を解決 - COSMOS',
    description:
      'タロットは初めてですか？ カードのシャッフルから解釈の基本原理まで, 入門者のために用意した親切なガイドとFAQをご確認ください。',
    keywords: 'タロット基礎ガイド, タロット入門, 初心者向けFAQ, 占いの方法',
  },

  // 타로 설명
  '/ko/etc/tarot/explanation': {
    title:
      '78장 타로 카드 실전 해석: 상대방 속마음 읽는 법 & 상황별 완벽 가이드',
    description:
      '유니버설 웨이트 78장 전 카드의 핵심 상징과 실전 리딩법. "그 사람의 이 행동은 무슨 뜻일까?" 질문에 대한 정답을 드립니다.',
    keywords:
      '타로 카드 해석, 속마음 읽는 법, 실전 타로, 메이저 아르카나, 마이너 아르카나',
    image: '/assets/images/home/preview-ko.png',
    imageWidth: '1920',
    imageHeight: '872',
    ogLocale: 'ko_KR',
  },
  '/en/etc/tarot/explanation': {
    title: '78 Tarot Card Meanings: Read Their Mind with Our Situation Guide',
    description:
      'Master the symbols of all 78 Universal Waite cards. Learn exactly how to interpret their actions and feelings in any life situation.',
    keywords:
      'tarot meanings, mind reading, practical tarot, major arcana, minor arcana, card symbols',
    image: '/assets/images/home/preview-en.png',
    imageWidth: '1920',
    imageHeight: '867',
    ogLocale: 'en_US',
  },
  '/ja/etc/tarot/explanation': {
    title:
      'タロットカード78枚の実戦解釈：相手の本心を読む方法＆状況別完全ガイド',
    description:
      'ウェイト版タロット78枚全カードの核心的な象徴と実戦リーディング法。 「あの人のあの行動はどういう意味？」という疑問を解決します。',
    keywords:
      'タロット意味, 本心を読む方法, 実戦タロット, 大アルカナ, 小アルカナ, カードの解釈',
    image: '/assets/images/home/preview-ja.png',
    imageWidth: '1917',
    imageHeight: '872',
    ogLocale: 'ja_JP',
  },

  // 타로 학습
  '/ko/etc/tarot/learning': {
    title: '타로 카드 독학으로 부수입 벌기? 1주일 만에 끝내는 초보자 리딩 수업',
    description:
      '복잡한 이론은 빼고, 당장 실전에서 써먹을 수 있는 리딩 노하우만. 타로 독학으로 자신만의 인사이트를 키우는 가장 빠른 길.',
    keywords:
      '타로 독학, 타로로 돈 벌기, 리딩 수업, 타로 기초 강의, 실전 리딩 노하우',
    image: '/assets/images/home/preview-ko.png',
    imageWidth: '1920',
    imageHeight: '872',
    ogLocale: 'ko_KR',
  },
  '/en/etc/tarot/learning': {
    title: 'Master Tarot in 7 Days: Professional Reading Guide for Beginners',
    description:
      'Skip the complex theories. Learn the fast-track secrets to reading cards like a professional. Build your own intuition and start your journey today.',
    keywords:
      'master tarot, fast learning, tarot guide, intuitive reading, pro secrets',
    image: '/assets/images/home/preview-en.png',
    imageWidth: '1920',
    imageHeight: '867',
    ogLocale: 'en_US',
  },
  '/ja/etc/tarot/learning': {
    title: 'タロット独学で副業も？ 1週間でマスターする初心者講座',
    description:
      '難しい理論は抜きにして、すぐに実戦で使えるリーディングのノウハウを伝授。タロット独학으로 자신만의 인사이트를 키우는 最短ルート。',
    keywords:
      'タロット勉強, 副業タロット, リーディング講座, タロット基礎, 初心者向け',
    image: '/assets/images/home/preview-ja.png',
    imageWidth: '1917',
    imageHeight: '872',
    ogLocale: 'ja_JP',
  },

  // 사업자 정보
  '/ko/etc/business': {
    title: '정직한 1인 개발 서비스: COSMOS 제작 의도와 신뢰의 약속 - COSMOS',
    description:
      'COSMOS 팀(1인 개발)의 정직한 운영 철학과 개발자의 진솔한 제작 의도입니다. 투명한 서비스로 신뢰를 쌓아가겠습니다.',
    keywords: '1인 개발 타로, 제작 의도, 운영 철학, 신뢰 서비스',
  },
  '/en/etc/business': {
    title:
      'Solo Indie Developer: The Creator’s Story & Transparency Pledge - COSMOS',
    description:
      'Discover the honest mission of the solo developer behind COSMOS. We are dedicated to providing a high-quality, transparent tarot experience.',
    keywords:
      'indie developer, creator intent, transparency pledge, honest tarot',
  },
  '/ja/etc/business': {
    title: '誠実な1人開発サービス：COSMOS制作意図と信頼の約束 - COSMOS',
    description:
      'COSMOSチーム（1人開発）の誠実な運営哲学と開発者の正直な制作意図。透明なサービスで信頼を築いていきます。',
    keywords: '1人開発タロット, 制作意図, 運営哲学, 信頼のサービス',
  },

  // 환불 페이지
  '/ko/mypage/refund': {
    title: '정직한 서비스, 신속한 환불 처리 - COSMOS',
    description:
      '불편을 드려 죄송합니다. 절차에 따라 가장 빠르고 투명하게 환불 및 사후 관리를 도와드립니다.',
    keywords: '환불 안내, 신속 처리, 투명 서비스, 사후 관리',
  },
  '/en/mypage/refund': {
    title: 'Transparent & Fast Refund Service - COSMOS',
    description:
      'Your satisfaction is our priority. Our refund process is clear and efficient, ensuring you are taken care of during any issue.',
    keywords: 'refund policy, fast processing, customer support, data clarity',
  },
  '/ja/mypage/refund': {
    title: '誠実なサービス, 迅速な返金処理 - COSMOS',
    description:
      'ご不便をおかけして申し訳ありません。手続きに従い, 最も迅速かつ透明に返金およびアフターサービスをお手伝いいたします。',
    keywords: '返金案内, 迅速処理, 誠実なサービス, アフターケア',
  },
};

/* 
개선 포인트:
1. 뜬구름 잡는 표현(비밀 보관소, 조언들, 여행 기록 등)을 구체적인 기능명(히스토리, 상담 리스트, 통계 리포트)으로 교체
2. 사용자가 페이지에 진입했을 때 얻을 수 있는 구체적인 혜택(데이터 분석, 지난 조언 다시 읽기 등) 명시
3. '1인 개발'임을 강조하여 진정성과 신뢰성 확보
4. 모든 언어(KO, EN, JA)에서 동일하게 구체적인 톤앤매너 유지
*/
