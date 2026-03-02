# AI 폴더 공개 가능 / 공개 불가 구분

`back/src/AI/` 내 파일을 **공개 가능(포트폴리오·오픈소스용)** vs **공개 불가(핵심 IP·보안)** 로 구분한 문서입니다.

---

## 1. 공개 가능 (Public)

**특징:** 비밀/키 없음, 도메인 무관한 유틸리티, 또는 공개해도 경쟁력에 영향 적은 코드.

| 경로 | 설명 | 비고 |
|------|------|------|
| `lib/stripOuterBraces.js` | JSON 문자열 정리·파싱 (마크다운 제거, 중괄호 보정 등) | 현재 `.gitignore` 예외로 이미 추적 중 |
| `lib/log_newly_test.js` | 토큰 사용량·비용 로깅 유틸 (개발용) | 현재 `.gitignore` 예외로 이미 추적 중 |
| `lib/stripPrefixFront.js` | 문자열에서 접두어(prefix) 제거 | 범용 유틸 |
| `lib/stripLastfixBack.js` | 문자열에서 접미어 제거 | 범용 유틸 |
| `lib/format-stringified-numbered-list.js` | 리스트 → "1) ... 2) ..." 형태 문자열 | 범용 포맷 |
| `lib/formatObjectFromList.js` | 배열 → 번호 붙은 객체 변환 | 범용 포맷 |
| `lib/cardNameTranslator.js` | 타로 카드명 영→한/일 번역 (사전 데이터) | 공개된 카드명 수준 |
| `prompt/data/spreadListConstants.js` | 스프레드 이름·레이블 상수 (다국어) | UI/상수만, 지침 없음 |

**트랜잭션·Redis 큐·Redis 캐싱 공개:** `tarotCardInterpreterWithAIAPI.js`는 **공개하지 않음**. 대신 **호출 측**인 `back/src/domains/tarot/controllers/utils/postQuestionToAI.js`를 공개하며, 해당 파일에 Redis 캐시 조회·Bull 큐 등록·동기 경로(runSyncTarotFlow)를 노출. AI 해석은 `tarotCardInterpreterWithAIAPI.js`(비공개)에서 수행. → [포트폴리오 스니펫](portfolio/TAROT_AI_TRANSACTION_QUEUE_CACHE_SNIPPET.md) 참고.

**선택적 공개(일부만 보여주고 싶을 때):**

- `utils/validate.js`  
  - **공개:** 검증 흐름·함수 시그니처만 예시로 공개 가능  
  - **비공개:** 실제 필드명·스키마 상세(comprehensive/individual 등)는 비즈니스 구조이므로 가린 뒤 공개 권장

---

## 2. 공개 불가 (Private) — 핵심 IP·보안

**특징:** API 키/설정 참조, 프롬프트·가이드라인, 모델 선택·오케스트레이션, 비즈니스 규칙.

### 2-1. API·설정 (보안)

| 경로 | 이유 |
|------|------|
| `model/model-list.js` | `process.env.ANTHROPICAPI_SECRET_KEY`, `OPENAI_SECRET_KEY`, `XAI_API_KEY` 등 환경변수명·클라이언트 초기화 노출. 키 값은 env에 있더라도 변수명·구조 공개 시 타깃이 됨. |

### 2-2. 프롬프트·가이드라인 (핵심 IP)

| 경로 | 이유 |
|------|------|
| `prompt/system-prompt.js` | AI 역할 정의, “professional tarot master”, 해석 원칙, 공통 규칙. 서비스 톤·품질의 핵심. |
| `prompt/user-prompt.js` | 질문 구조 설명, 해석 종류별 지침, 포맷 요구. 프롬프트 엔지니어링 핵심. |
| `prompt/data/ListOfGuidelines.js` | 언어별 톤, 금지 표현, 인칭 규칙, 문체 등 상세 가이드라인. 복제 시 유사 품질 구현 가능. |
| `prompt/data/ComprehensiveInterpretationCharacters.js` | 종합 해석 문장 수·깊이 규칙 (모드별). 비즈니스 규칙. |
| `prompt/data/IndividualInterpretationCharacters.js` | 개별 카드 해석 규칙. 비즈니스 규칙. |
| `prompt/lib/responseFormat.js` | AI 응답 JSON 스키마·필드 정의, 카드/포지션 의미 설명. 프롬프트 구조 노출. |
| `prompt/data/questionForm.js` | 질문 폼 구조·필드 매핑. 도메인 모델. |

### 2-3. 커맨드·대화 플로우 (비즈니스 로직)

| 경로 | 이유 |
|------|------|
| `command/assistantCommand.js` | 어시스턴트 발화 문구·플로우. 서비스 톤·UX. |
| `command/userCommand.js` | 사용자 측 질문/요청 문구·규칙 생성. 프롬프트와 직결. |
| `command/userCommandForFirstMsg.js` | 첫 메시지용 유저 커맨드. 플로우·품질 설계. |

### 2-4. 오케스트레이션·모델 호출 (구현 디테일)

| 경로 | 이유 |
|------|------|
| `tarotCardInterpreterWithAIAPI.js` | AI 타로 해석 엔트리(processMessage → stripOuterBraces → processTarotResult). **공개하지 않음.** 트랜잭션·큐·캐시는 postQuestionToAI.js(공개)에서 노출. |
| `model/openAI/finalMsgInterpreterOfOpenAI.js` | OpenAI 호출 방식·메시지 구성. |
| `model/anthropic/firstMsgInterpreterOfAnthropic.js` | Anthropic 첫 메시지 호출. |
| `model/anthropic/fallbackMsgInterpreterOfAnthropic.js` | Anthropic 폴백. |
| `model/anthropic/finalMsgInterpreterOfAnthropic.js` | Anthropic 최종 해석 호출. |
| `model/grok/finalMsgInterpreterOfGrok.js` | Grok 호출. |
| `openRouter/firstMsgInterpreterOfOpenRouter.js` | OpenRouter 첫 메시지. |
| `openRouter/finalMsgInterpreterOfOpenRouter.js` | OpenRouter 최종 해석. |
| `utils/messageProcessor.js` | 메시지 조합·모델 라우팅. |
| `utils/processTarotResult.js` | AI 응답 → 타로 결과 가공. 비즈니스 규칙. |

### 2-5. 도메인 지식·내부 유틸 (비즈니스 연관)

| 경로 | 이유 |
|------|------|
| `lib/getSpreadDescription.js` | 스프레드별 포지션 의미(과거/현재/미래 등). 서비스 해석 설계. |
| `lib/getSpreadComments.js` | 스프레드별 코멘트. |
| `lib/getQuestionInfo.js` | 질문에서 주체·대상 등 추출. 프롬프트 입력 구조와 직결. |
| `lib/getPartOfQuestionInfo.js` | 질문 일부 정보 추출. |
| `lib/getLanguageSetting.js` | 언어·모델 등 설정 매핑. 내부 구조. |
| `lib/formatTarotCards.js` | 타로 카드 포맷팅. 우리 포맷 규칙. |

---

## 3. 요약

| 구분 | 파일 수 | 예시 |
|------|--------|------|
| **공개 가능** | 8개 | `stripOuterBraces`, `log_newly_test`, `stripPrefixFront`, `format-stringified-numbered-list`, `cardNameTranslator`, `spreadListConstants` 등. **트랜잭션·큐·캐시**는 `postQuestionToAI.js`(AI 폴더 외) 공개. |
| **공개 불가** | 나머지 전부 | `tarotCardInterpreterWithAIAPI.js`, `model-list.js`, `system-prompt.js`, `user-prompt.js`, `ListOfGuidelines.js`, 모든 `*Interpreter*.js`, `messageProcessor.js`, `processTarotResult.js` 등 |

---

## 4. .gitignore와의 관계

- **AI 폴더:** `back/src/AI/*` 무시 후 `!back/src/AI/lib/log_newly_test.js`, `!back/src/AI/lib/stripOuterBraces.js` 만 예외. `tarotCardInterpreterWithAIAPI.js`는 공개하지 않음.
- **타로 컨트롤러:** `postQuestionToAI.js` 공개 (validateTarotRequest, runSyncTarotFlow 포함).
- **권장:** “공개 가능”만 예외에 두고, 나머지는 계속 무시.  
  - 추가 예외 후보: `stripPrefixFront.js`, `stripLastfixBack.js`, `format-stringified-numbered-list.js`, `formatObjectFromList.js`, `cardNameTranslator.js`, `spreadListConstants.js` (필요 시).

이 구분을 기준으로 포트폴리오용 저장소에는 “공개 가능” 파일만 포함하고, “공개 불가”는 별도 비공개 저장소나 문서 요약으로만 설명하는 방식을 쓰시면 됩니다.
