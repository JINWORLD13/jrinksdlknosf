/**
 * 질문당 5가지 스프레드 중 "추천 스프레드"가 아닌 나머지 4개 스프레드용 미리 작성 해석
 * - PRE_WRITTEN_READINGS(권장 1개) + 이 파일(나머지 4개) = 질문당 5개
 * - 키: questionId → spreadId → { ko, en, ja }
 * - 해당 질문의 RECOMMENDED_SPREAD_BY_QUESTION에 해당하는 spreadId는 이 객체에 넣지 않음
 */

export const ADDITIONAL_READINGS_BY_SPREAD = {
  love_1: {
    time_3: {
      ko: `【과거·현재·미래 3장】전 애인의 나에 대한 속마음 흐름.

① 과거 — 관계가 끝났을 때 그 사람은 완전히 정리되지 못한 상태였을 수 있어요. "왜 그랬을까" 하는 후회나 못 다한 말이 남아 있었을 가능성이 있습니다.

② 현재 — 지금도 가끔 당신을 떠올리거나, 새 연인과 비교해 보는 마음이 있을 수 있어요. 다만 행동으로 나서기보다는 마음속에만 품고 있을 가능성이 큽니다.

③ 미래 — 시간이 지나면 감정이 옅어지거나, 어느 순간 "한번 더 이야기해 보고 싶다"는 결심이 날 수 있어요. 당신이 먼저 연락하지 않으면 그쪽도 쉽게 다가오지 않을 수 있습니다.`,
      en: `【Past·Present·Future 3-Card】Your ex's true feelings about you over time.

① Past — When the relationship ended, they may not have fully closed the chapter. Regret or things left unsaid may have remained.

② Present — They may still think of you sometimes or compare new partners to you. They are more likely to keep it to themselves than to act on it.

③ Future — Over time their feelings may fade, or they may suddenly want to talk again. If you don't reach out first, they are unlikely to make the first move easily.`,
      ja: `【過去・現在・未来3枚】元恋人の本音の流れ。

① 過去 — 関係が終わった時、その人は完全に区切れていなかったかも。後悔や言えなかったことが残っていた可能性があります。

② 現在 — 今も時々あなたを思い出したり、新しい人と比べる気持ちがあるかも。行動には出さず心に留めている可能性が高いです。

③ 未来 — 時間が経てば感情が薄まるか、ある瞬間「もう一度話したい」と思うか。あなたから連絡しなければ相手も簡単には動かないことがあります。`,
    },
    solution_3: {
      ko: `【문제·원인·해결 3장】전 애인의 나에 대한 속마음.

① 현재의 문제 — 전 애인이 나를 어떻게 생각하는지 궁금하지만 직접 묻기 어렵고, 연락해도 될지 망설여지는 상태일 수 있어요.

② 원인 — 과거 관계가 완전히 정리되지 않았거나, 서로에게 못 다한 말이 있어서 마음이 남아 있을 수 있어요. 그쪽도 당신에게 "내 마음을 제대로 알아줬으면" 하는 마음이 남아 있을 수 있어요.

③ 해결·조언 — 다시 사귀기보다는 "그 사람이 나를 제대로 알아봐줬으면 좋겠다"는 마음이 더 클 수 있어요. 먼저 연락하지 않는다면 그쪽도 쉽게 다가오지 않아요. 시간이 지나면 감정이 옅어질 수 있어요.`,
      en: `【Problem·Cause·Solution 3-Card】Your ex's true feelings about you.

① Current problem — You may wonder "what do they think of me?" but find it hard to ask directly, or hesitate whether to reach out.

② Cause — The past relationship may not have been fully closed, or there may be things left unsaid, so feelings remain. They may also want to feel acknowledged.

③ Solution / Advice — The wish to feel acknowledged can be stronger than the wish to get back together. If you don't reach out first, they are unlikely to move. Over time, their feelings may fade.`,
      ja: `【問題・原因・解決3枚】元恋人の本音。

① 現在の問題 — 「あの人は私をどう思っているか」気になるが直接聞きづらく、連絡していいか迷う状態かも。

② 原因 — 過去の関係が完全に区切れていなかったり、言えなかったことがあって気持ちが残っているかも。相手も認められたい気持ちがあることがあります。

③ 解決・アドバイス — 復縁より「認められたい」気持ちが強いかも。こちらから連絡しなければ相手も動きにくい。時間が経てば感情が薄まる可能性があります。`,
    },
    cross_4: {
      ko: `【크로스 4장】전 애인의 나에 대한 속마음.

① 현재 상황 — 그 사람은 과거 관계를 완전히 정리하지 못한 상태일 수 있어요. 밖으로는 쿨해 보여도 가끔 당신을 떠올릴 수 있습니다.

② 도전·장애물 — "다시 연락해도 될까", "이미 잊었을 텐데" 같은 고민으로 먼저 다가오지 못하고 있을 수 있어요.

③ 과거의 영향 — 좋았던 순간들이 가끔 떠오르거나, 새 연인과 비교하는 마음이 있을 수 있습니다. 관계를 되돌리기보다 인정받고 싶은 마음이 클 수 있어요.

④ 앞으로의 방향 — 시간이 지나면 감정이 옅어지거나, 어느 순간 "한번 더 이야기해 보고 싶다"는 결심이 날 수 있어요. 당신이 먼저 연락하지 않으면 그쪽도 쉽게 다가오지 않습니다.`,
      en: `【Cross 4-Card】Your ex's true feelings about you.

① Current situation — They may not have fully closed the chapter. Even if they seem cool, they may still think of you sometimes.

② Challenge / Obstacle — They may wonder "Can I reach out?" or "They've probably forgotten," and hesitate to make the first move.

③ Past influence — Good memories may surface, or they may compare new partners to you. The need to feel acknowledged can be stronger than the wish to get back together.

④ Future direction — Over time their feelings may fade, or they may suddenly want to talk again. If you don't reach out first, they are unlikely to move easily.`,
      ja: `【クロス4枚】元恋人の本音。

① 現在の状況 — その人は過去の関係を完全に区切れていないかも。クールに見えても時々あなたを思い出すことがあります。

② 挑戦・障害 — 「連絡していいかな」「もう忘れてるかも」と悩み、こちらから動けないかも。

③ 過去の影響 — 良かった思い出がよみがえったり、新しい人と比べる気持ちがあるかも。復縁より認められたい気持ちが強いことがあります。

④ これからの方向 — 時間が経てば感情が薄まるか、ある瞬間「もう一度話したい」と思うか。あなたから連絡しなければ相手も簡単には動きません。`,
    },
    insight_3: {
      ko: `【통찰 3장】전 애인의 나에 대한 속마음.

① 겉으로 보이는 것 — 밖으로는 쿨하거나 이미 잊은 듯 보일 수 있어요. 새 연인을 만났다고 해도 마음까지 정리됐다고 단정하기 어렵습니다.

② 숨은 요인 — "다시 연락해도 될까", 못 다한 말, 후회가 섞여 있을 수 있어요. 다시 사귀기보다는 "그 사람이 나를 제대로 알아봐줬으면 좋겠다"는 마음이 있을 수 있어요.

③ 카드가 주는 조언 — 당신이 먼저 연락하지 않는다면 그쪽도 쉽게 다가오지 않을 가능성이 큽니다. 시간이 지나면 감정이 옅어지거나, 어느 순간 이야기하고 싶다는 결심이 날 수 있어요.`,
      en: `【Insight 3-Card】Your ex's true feelings about you.

① What shows on the surface — They may seem cool or as if they've moved on. Even with a new partner, it's hard to say their heart is fully closed.

② Hidden factor — They may wonder "Can I reach out?" or have things left unsaid and regret. The need to feel acknowledged can be stronger than the wish to get back together.

③ Advice from the cards — If you don't reach out first, they are unlikely to make the first move easily. Over time their feelings may fade, or they may suddenly want to talk.`,
      ja: `【洞察3枚】元恋人の本音。

① 表に見えること — クールに見えたり、もう忘れたように見えるかも。新しい人がいても心まで整理されたとは言い切れません。

② 隠れた要因 — 「連絡していいかな」、言えなかったこと、後悔が混ざっているかも。復縁より認められたい気持ちがあることがあります。

③ カードからの助言 — あなたから連絡しなければ相手も簡単には動かない可能性が高いです。時間が経てば感情が薄まるか、ある瞬間話したいと思うかも。`,
    },
  },
  // love_2: 권장 time_3 → 나머지 solution_3, relationship_5, cross_4, insight_3
  love_2: {
    solution_3: {
      ko: `【문제·원인·해결 3장】지금 만나는 사람이 진짜 인연인지.

① 현재의 문제 — "진짜 맞는 사람일까" 불안하거나 의문이 드는 상태일 수 있어요. 관계를 소중히 하고 있다는 신호이기도 합니다.

② 원인 — 두 사람의 만남에는 우연이 아닌 필연이 섞여 있어요. 아직 성장 단계에서 서로를 알아가고 신뢰를 쌓는 과정입니다.

③ 해결·조언 — 단기적으로 결과를 재촉하기보다 하루하루 대화와 경험을 쌓는 쪽이 유리해요. "진짜 인연"은 함께 걸어가며 만들어지는 경우가 많습니다.`,
      en: `【Problem·Cause·Solution 3-Card】Is the person you're seeing your true match?

① Current problem — You may feel anxious or doubt "Is this really the right person?" That itself can be a sign you care about the relationship.

② Cause — Your meeting had a sense of fate, not just chance. You're still in a growth phase, getting to know each other and building trust.

③ Solution / Advice — Rather than rushing for a quick result, building conversation and shared experiences day by day is favorable. "True match" is often made by walking together.`,
      ja: `【問題・原因・解決3枚】今付き合っている人が本当の運命の人か。

① 現在の問題 — 「本当に合う人？」と不安や疑問がある状態かも。関係を大切にしている証でもあります。

② 原因 — 二人の出会いには偶然でない必然が。まだ成長段階で、お互いを知り信頼を積む過程です。

③ 解決・アドバイス — 短期で結果を急ぐより、日々の会話と経験を積む方が有利。「本当の運命の人」は一緒に歩みながら作られることが多いです。`,
    },
    relationship_5: {
      ko: `【관계 5장】지금 만나는 사람과의 관계를 포지션별로.

① 그 사람의 마음 — 당신을 소중히 생각하고, 관계를 더 깊게 하고 싶어 하는 쪽에 가까울 수 있어요.

② 과거에 대한 미련 — 만남의 의미에는 우연이 아닌 필연이 섞여 있어요. "이 사람이구나" 했던 직감을 믿어도 좋습니다.

③ 숨은 속마음 — 아직 성장 단계라 불안할 수 있지만, 서로를 알아가고 신뢰를 쌓는 과정이에요. 감정을 솔직히 나누는 것이 다음 단계로 이어집니다.

④ 주변의 영향 — 주변은 좋게 보거나 걱정할 수 있어요. 당신이 원하는 방향을 먼저 정리하는 것이 좋습니다.

⑤ 앞으로의 전망 — 서로가 노력하면 깊어질 수 있는 가능성이 있어요. 하루하루 대화와 경험을 쌓는 쪽이 유리합니다.`,
      en: `【Relationship 5-Card】Your relationship with the person you're seeing, position by position.

① Their state of mind — They may value you and want to deepen the relationship.

② Lingering about the past — Your meeting had a sense of fate. Trust the intuition you had when you first met.

③ Hidden feelings — Still a growth phase; anxiety is normal. Sharing your feelings honestly leads to the next step.

④ Outside influence — Others may see it positively or worry. Clarifying what you want first helps.

⑤ Outlook — The relationship can deepen if you both invest. Building conversation and experience day by day is favorable.`,
      ja: `【関係5枚】今付き合っている人との関係をポジション別に。

① その人の心 — あなたを大切に思い、関係を深めたい側に近いかも。

② 過去への未練 — 出会いの意味には偶然でない必然が。「この人だ」という直感を信じてよいです。

③ 隠れた本音 — まだ成長段階で不安もあるが、お互いを知り信頼を積む過程。気持ちを正直に分かち合うことが次の段階につながります。

④ 周囲の影響 — 周りは良く見るか心配するか。自分が望む方向を先に整理するのがおすすめです。

⑤ これからの見通し — 二人が努めれば深まる可能性が。日々の会話と経験を積む方が有利です。`,
    },
    cross_4: {
      ko: `【크로스 4장】지금 만나는 사람이 진짜 인연인지.

① 현재 상황 — 관계는 아직 성장 단계에 있어요. 서로를 알아가고 신뢰를 쌓아가는 과정입니다.

② 도전·장애물 — "진짜 맞는 사람일까" 같은 불안이나 의문이 들 수 있어요. 그 자체가 관계를 소중히 하고 있다는 신호입니다.

③ 과거의 영향 — 두 사람의 만남에는 필연이 섞여 있어요. 처음 만났을 때의 직감을 믿어도 좋습니다.

④ 앞으로의 방향 — 서로가 노력하면 깊어질 수 있어요. 결과를 재촉하기보다 대화와 경험을 쌓는 쪽이 유리합니다.`,
      en: `【Cross 4-Card】Is the person you're seeing your true match?

① Current situation — The relationship is still growing. You're getting to know each other and building trust.

② Challenge / Obstacle — You may feel anxious or doubt "Is this the right person?" That shows you care about the relationship.

③ Past influence — Your meeting had a sense of fate. Trust the intuition you had when you first met.

④ Future direction — The relationship can deepen if you both invest. Building conversation and experience is more favorable than rushing for a result.`,
      ja: `【クロス4枚】今付き合っている人が本当の運命の人か。

① 現在の状況 — 関係はまだ成長段階。お互いを知り信頼を積む過程です。

② 挑戦・障害 — 「本当に合う人？」という不安や疑問があるかも。それ自体が関係を大切にしている証です。

③ 過去の影響 — 二人の出会いには必然が。初めて会った時の直感を信じてよいです。

④ これからの方向 — 二人が努めれば深まります。結果を急ぐより会話と経験を積む方が有利です。`,
    },
    insight_3: {
      ko: `【통찰 3장】지금 만나는 사람이 진짜 인연인지.

① 겉으로 보이는 것 — 관계는 아직 성장 단계로, 서로를 알아가고 있어요. 때로 불안하거나 의문이 드는 것은 자연스럽습니다.

② 숨은 요인 — 만남에는 우연이 아닌 필연이 섞여 있어요. 당신이 느끼는 감정을 솔직히 나누는 것이 다음 단계로 이어집니다.

③ 카드가 주는 조언 — "진짜 인연"은 한 번에 정해지는 것이 아니라 함께 걸어가며 만들어지는 경우가 많아요. 하루하루 대화와 경험을 쌓으세요.`,
      en: `【Insight 3-Card】Is the person you're seeing your true match?

① What shows on the surface — The relationship is still growing; you're getting to know each other. Feeling anxious or doubtful at times is natural.

② Hidden factor — Your meeting had a sense of fate. Sharing your feelings honestly leads to the next step.

③ Advice from the cards — "True match" is often made by walking together, not decided in one moment. Build conversation and experience day by day.`,
      ja: `【洞察3枚】今付き合っている人が本当の運命の人か。

① 表に見えること — 関係はまだ成長段階で、お互いを知っている最中。不安や疑問があるのは自然です。

② 隠れた要因 — 出会いには偶然でない必然が。感じている気持ちを正直に分かち合うことが次の段階につながります。

③ カードからの助言 — 「本当の運命の人」は一瞬で決まるより、一緒に歩みながら作られることが多いです。日々の会話と経験を積んで。`,
    },
  },
  // love_3: 권장 time_3 → 나머지 4
  love_3: {
    solution_3: {
      ko: `【문제·원인·해결 3장】썸·연애의 앞으로 전개와 결말.

① 현재의 문제 — "연애로 갈지, 친구로 남을지" 또는 "더 깊어질지"에 대한 감정이 움직이는 전환점에 있어요.

② 원인 — 지금까지 끌림과 망설임이 함께 있었을 수 있어요. 한쪽이 더 적극적이었거나 타이밍이 맞지 않았을 수 있습니다.

③ 해결·조언 — 상대의 반응에 일희일비하지 말고, 자신이 원하는 방향을 먼저 정리하세요. 지금 할 수 있는 말과 행동을 하는 쪽이 후회가 적습니다.`,
      en: `【Problem·Cause·Solution 3-Card】How your situationship or relationship will unfold.

① Current problem — You're at a turning point: feelings about "romance or stay friends" or "go deeper" are in motion.

② Cause — There has been both attraction and hesitation. One may have been more active, or timing may have been off.

③ Solution / Advice — Don't swing with every reaction from the other person; clarify what you want first. Doing what you can say and do now tends to leave fewer regrets.`,
      ja: `【問題・原因・解決3枚】付き合い・恋愛のこれからの展開と結末。

① 現在の問題 — 「恋愛に進むか、友達のままか」「もっと深めるか」の気持ちが動く転換点にいます。

② 原因 — これまで惹かれつつ迷いもあったかも。片方がより積極的だったり、タイミングが合わなかったことも。

③ 解決・アドバイス — 相手の反応に一喜一憂せず、自分が望む方向を先に整理して。今できる言葉と行動をすることが後悔を減らします。`,
    },
    relationship_5: {
      ko: `【관계 5장】썸·연애 관계를 포지션별로.

① 그 사람의 마음 — 전환점에 서 있어 "연애로 갈지, 친구로 남을지" 또는 "더 깊어질지"에 대한 감정이 움직이고 있어요.

② 과거에 대한 미련 — 지금까지 끌림과 망설임이 함께 있었을 수 있어요. 그 과정이 "이 관계를 어떻게 할지" 생각하게 만든 시간이었습니다.

③ 숨은 속마음 — 상대의 반응이나 말 한마디에 일희일비하지 말고, 자신이 원하는 방향을 먼저 정리하는 것이 좋아요.

④ 주변의 영향 — 몇 달 안에 관계의 방향이 더 분명해질 가능성이 있어요. 서로 마음을 열고 대화하면 좋은 결과로 이어질 수 있습니다.

⑤ 앞으로의 전망 — 한쪽만 기다리면 흐지부지될 수 있어요. "결말"을 급하게 정하려 하기보다, 지금 할 수 있는 말과 행동을 하는 쪽이 후회가 적습니다.`,
      en: `【Relationship 5-Card】Your situationship or relationship, position by position.

① Their state of mind — You're at a turning point; feelings about "romance or friends" or "going deeper" are in motion.

② Lingering about the past — There has been both attraction and hesitation. That process gave you time to think about what you want from this relationship.

③ Hidden feelings — Try not to swing with every word or reaction; clarify what you want first.

④ Outside influence — The direction of the relationship may become clearer within a few months. Opening up and talking can lead to a good outcome.

⑤ Outlook — If one side only waits, it may fizzle. Doing what you can say and do now tends to leave fewer regrets than forcing an "ending."`,
      ja: `【関係5枚】付き合い・恋愛の関係をポジション別に。

① その人の心 — 転換点に立ち、「恋愛に進むか友達のままか」「もっと深めるか」の気持ちが動いています。

② 過去への未練 — これまで惹かれつつ迷いもあったかも。その過程が「この関係をどうするか」を考える時間になりました。

③ 隠れた本音 — 相手の反応や一言に一喜一憂せず、自分が望む方向を先に整理するのがおすすめです。

④ 周囲の影響 — 数ヶ月で関係の方向性がはっきりする可能性が。互いに心を開いて話せば良い結果につながります。

⑤ これからの見通し — 片方だけが待っているとうやむやになるかも。結末を急がず、今できる言葉と行動をすることが後悔を減らします。`,
    },
    cross_4: {
      ko: `【크로스 4장】썸·연애의 앞으로 전개.

① 현재 상황 — 전환점에 서 있어요. 썸이라면 "연애로 갈지, 친구로 남을지"가 드러나는 시기이고, 연애 중이라면 "더 깊어질지"에 대한 감정이 움직이고 있어요.

② 도전·장애물 — 상대의 반응이나 말 한마디에 일희일비하기 쉬워요. 자신이 원하는 방향을 먼저 정리하는 것이 좋습니다.

③ 과거의 영향 — 지금까지 끌림과 망설임이 함께 있었을 수 있어요. 그 과정이 관계에 대한 생각을 정리하게 만든 시간이었습니다.

④ 앞으로의 방향 — 몇 달 안에 방향이 분명해질 가능성이 있어요. 서로 마음을 열고 대화하면 좋은 결과로 이어질 수 있고, 한쪽만 기다리면 흐지부지될 수 있어요.`,
      en: `【Cross 4-Card】How your situationship or relationship will unfold.

① Current situation — You're at a turning point. If it's a situationship, "romance or friends" is becoming clearer; if dating, feelings about "going deeper" are in motion.

② Challenge / Obstacle — You may swing with every reaction or word. Clarifying what you want first helps.

③ Past influence — There has been both attraction and hesitation. That process gave you time to think about the relationship.

④ Future direction — The direction may become clearer within a few months. Opening up and talking can lead to a good outcome; if one side only waits, it may fizzle.`,
      ja: `【クロス4枚】付き合い・恋愛のこれからの展開。

① 現在の状況 — 転換点に立っています。付き合い前なら「恋愛に進むか友達のままか」がはっきりし始める時期。付き合っているなら「もっと深めるか」の気持ちが動いています。

② 挑戦・障害 — 相手の反応や一言に一喜一憂しがち。自分が望む方向を先に整理するのがおすすめです。

③ 過去の影響 — これまで惹かれつつ迷いもあったかも。その過程が関係について考える時間になりました。

④ これからの方向 — 数ヶ月で方向性がはっきりする可能性が。心を開いて話せば良い結果に、片方だけ待っていればうやむやになることも。`,
    },
    insight_3: {
      ko: `【통찰 3장】썸·연애의 앞으로 전개와 결말.

① 겉으로 보이는 것 — 지금은 전환점에 서 있어요. "연애로 갈지, 친구로 남을지" 또는 "더 깊어질지"가 점점 드러나는 시기입니다.

② 숨은 요인 — 지금까지 끌림과 망설임이 함께 있었어요. 상대의 반응에 흔들리지 말고 자신이 원하는 방향을 정리하는 것이 좋습니다.

③ 카드가 주는 조언 — 몇 달 안에 관계의 방향이 분명해질 가능성이 있어요. 지금 할 수 있는 말과 행동을 하는 쪽이 후회가 적습니다. "결말"을 급하게 정하려 하지 마세요.`,
      en: `【Insight 3-Card】How your situationship or relationship will unfold.

① What shows on the surface — You're at a turning point. "Romance or friends" or "go deeper" is becoming clearer.

② Hidden factor — There has been both attraction and hesitation. Don't be swayed by the other's reactions; clarify what you want.

③ Advice from the cards — The direction may become clearer within a few months. Doing what you can say and do now tends to leave fewer regrets. Don't rush to define an "ending."`,
      ja: `【洞察3枚】付き合い・恋愛のこれからの展開と結末。

① 表に見えること — 今は転換点に立っています。「恋愛に進むか友達のままか」「もっと深めるか」がはっきりし始める時期です。

② 隠れた要因 — これまで惹かれつつ迷いもありました。相手の反応に振り回されず、自分が望む方向を整理するのがおすすめです。

③ カードからの助言 — 数ヶ月で関係の方向性がはっきりする可能性が。今できる言葉と行動をすることが後悔を減らします。結末を急いで決めないで。`,
    },
  },
  // career_1: 권장 solution_3 → 나머지 time_3, relationship_5, cross_4, insight_3
  career_1: {
    time_3: {
      ko: `【과거·현재·미래 3장】이직·승진 시기와 방향.

① 과거 — 지금까지 성장 욕구와 현실 사이의 간격이 느껴졌을 수 있어요. "더 하고 싶은데 못 하고 있다"는 불만이 조금씩 쌓여 있었을 수 있습니다.

② 현재 — 타이밍은 준비가 되어 있을 때 열리는 경우가 많아요. 실력·인맥·정보가 쌓여 있다면 반년에서 1년 안에 기회가 보일 수 있어요.

③ 미래 — 이직이라면 "연봉·위치·일 내용" 중 우선순위를 정하고, 승진이라면 "지금 회사에서 어떻게 보여질지"를 전략적으로 생각하세요. 한 걸음씩 나아가는 것이 안정적입니다.`,
      en: `【Past·Present·Future 3-Card】When to change jobs or get promoted, and direction.

① Past — You may have felt a gap between your desire to grow and reality. Complaints like "I want to do more but can't" may have been building.

② Present — Timing often opens when you're ready. If your skills, network, and information are in place, opportunities may appear within six months to a year.

③ Future — For a job change, decide what matters most: salary, position, or type of work. For promotion, think strategically about how you're seen. Moving one step at a time is the most stable path.`,
      ja: `【過去・現在・未来3枚】転職・昇進の時期と方向。

① 過去 — これまで成長欲求と現実のギャップを感じていたかも。「もっとやりたいのに」という不満が溜まっていたことも。

② 現在 — タイミングは準備が整った時に開くことが多い。実力・人脈・情報が積み上がっていれば半年〜1年以内にチャンスが見えるかも。

③ 未来 — 転職なら年収・ポジション・仕事内容の優先順位を、昇進なら今の会社でどう見られるかを戦略的に考えて。一歩ずつ進むのが安定します。`,
    },
    relationship_5: {
      ko: `【관계 5장】이직·승진과 나에게 맞는 방향.

① 그 사람의 마음 — 지금 일터에서는 성장 욕구와 현실 사이의 간격이 느껴질 수 있어요. 다음 단계를 준비하라는 신호로 받아들이면 좋습니다.

② 과거에 대한 미련 — "승진·이직이 막혀 있다"는 불만이 쌓여 있었을 수 있어요. 이 감정 자체가 나쁜 것이 아니라, 방향을 정리하라는 의미입니다.

③ 숨은 속마음 — "일단 나가고 보자"보다는 어떤 방향으로 가고 싶은지 먼저 정리하는 것이 유리해요. 작은 성과를 기록해 두고 자격증·공부로 무기를 갖추는 것도 도움이 됩니다.

④ 주변의 영향 — 반년에서 1년 안에 기회가 보일 수 있어요. 서두르지 않고 한 걸음씩 나아가는 것이 가장 안정적입니다.

⑤ 앞으로의 전망 — 이직이라면 연봉·위치·일 내용 중 우선순위를 정하고, 승진이라면 지금 회사에서 어떻게 보여질지를 전략적으로 생각하세요.`,
      en: `【Relationship 5-Card】Job change or promotion and direction that fits you.

① Their state of mind — You may feel a gap between your desire to grow and reality at work. Take it as a signal to prepare for the next step.

② Lingering about the past — Complaints like "promotion or change is blocked" may have been building. This feeling is a signal to clarify direction, not something bad.

③ Hidden feelings — Clarifying which direction you want before jumping tends to help. Keeping a record of small wins and adding credentials or study also helps.

④ Outside influence — Opportunities may appear within six months to a year. Moving one step at a time without rushing is the most stable.

⑤ Outlook — For a job change, decide what matters most; for promotion, think strategically about how you're seen at your current company.`,
      ja: `【関係5枚】転職・昇進と自分に合う方向。

① その人の心 — 今の職場では成長欲求と現実のギャップを感じることが。次のステップの準備を促すサインとして受け止めましょう。

② 過去への未練 — 「昇進・転職が塞がっている」という不満が溜まっていたかも。この感情は悪くなく、方向を整理する意味です。

③ 隠れた本音 — 「とりあえず動く」より、どの方向へ行きたいか先に整理するのが有利。小さな成果を記録し、資格・勉強で武器を揃えるのも有効です。

④ 周囲の影響 — 半年〜1年以内にチャンスが見えるかも。焦らず一歩ずつ進むのがいちばん安定します。

⑤ これからの見通し — 転職なら年収・ポジション・仕事内容の優先順位を、昇進なら今の会社でどう見られるかを戦略的に考えて。`,
    },
    cross_4: {
      ko: `【크로스 4장】이직·승진 시기와 방향.

① 현재 상황 — 성장 욕구와 현실 사이의 간격이 느껴질 수 있어요. "더 하고 싶은데 못 하고 있다"는 불만이 조금씩 쌓여 있을 수 있습니다.

② 도전·장애물 — "일단 나가고 보자"보다는 어떤 방향으로 가고 싶은지 먼저 정리하는 것이 유리해요.

③ 과거의 영향 — 타이밍은 준비가 되어 있을 때 열리는 경우가 많아요. 실력·인맥·정보가 쌓여 있다면 반년에서 1년 안에 기회가 보일 수 있어요.

④ 앞으로의 방향 — 이직이라면 연봉·위치·일 내용 중 우선순위를, 승진이라면 지금 회사에서 어떻게 보여질지를 전략적으로 생각하세요. 한 걸음씩 나아가세요.`,
      en: `【Cross 4-Card】When to change jobs or get promoted, and direction.

① Current situation — You may feel a gap between your desire to grow and reality. Complaints like "I want to do more but can't" may be building.

② Challenge / Obstacle — It helps to clarify which direction you want before jumping.

③ Past influence — Timing often opens when you're ready. If your skills, network, and information are in place, opportunities may appear within six months to a year.

④ Future direction — For a job change, decide what matters most; for promotion, think strategically about how you're seen. Move one step at a time.`,
      ja: `【クロス4枚】転職・昇進の時期と方向。

① 現在の状況 — 成長欲求と現実のギャップを感じることが。「もっとやりたいのに」という不満が溜まっているかも。

② 挑戦・障害 — とりあえず動くより、どの方向へ行きたいか先に整理するのが有利です。

③ 過去の影響 — タイミングは準備が整った時に開くことが多い。実力・人脈・情報が積み上がっていれば半年〜1年以内にチャンスが見えるかも。

④ これからの方向 — 転職なら年収・ポジション・仕事内容の優先順位を、昇進なら今の会社でどう見られるかを戦略的に考えて。一歩ずつ進んで。`,
    },
    insight_3: {
      ko: `【통찰 3장】이직·승진 시기와 나에게 맞는 방향.

① 겉으로 보이는 것 — 지금 일터에서는 성장 욕구와 현실 사이의 간격이 느껴질 수 있어요. 다음 단계를 준비하라는 신호로 받아들이면 좋습니다.

② 숨은 요인 — 타이밍은 준비가 되어 있을 때 열리는 경우가 많아요. 실력·인맥·정보가 쌓여 있다면 반년에서 1년 안에 기회가 보일 수 있어요.

③ 카드가 주는 조언 — 이직이라면 "연봉·위치·일 내용" 중 우선순위를 정하고, 승진이라면 "지금 회사에서 어떻게 보여질지"를 전략적으로 생각하세요. 서두르지 않고 한 걸음씩 나아가세요.`,
      en: `【Insight 3-Card】When to change jobs or get promoted, and direction that fits you.

① What shows on the surface — You may feel a gap between your desire to grow and reality at work. Take it as a signal to prepare for the next step.

② Hidden factor — Timing often opens when you're ready. If your skills, network, and information are in place, opportunities may appear within six months to a year.

③ Advice from the cards — For a job change, decide what matters most; for promotion, think strategically about how you're seen. Move one step at a time without rushing.`,
      ja: `【洞察3枚】転職・昇進の時期と自分に合う方向。

① 表に見えること — 今の職場では成長欲求と現実のギャップを感じることが。次のステップの準備を促すサインとして受け止めましょう。

② 隠れた要因 — タイミングは準備が整った時に開くことが多い。実力・人脈・情報が積み上がっていれば半年〜1年以内にチャンスが見えるかも。

③ カードからの助言 — 転職なら年収・ポジション・仕事内容の優先順位を、昇進なら今の会社でどう見られるかを戦略的に考えて。焦らず一歩ずつ進んで。`,
    },
  },
  // career_2: 권장 relationship_5 → 나머지 4
  career_2: {
    time_3: {
      ko: `【과거·현재·미래 3장】상사·동료가 나를 어떻게 보는지.

① 과거 — 상사는 당신을 "쓸 만한 사람", "키워볼 만한 사람"으로 보고 있을 가능성이 있어요. 아직 완전히 믿고 맡기기에는 한 단계가 부족하다고 느낄 수 있습니다.

② 현재 — 동료들은 당신을 무난하게 좋은 사람으로 보는 편이에요. 일 외에 가끔 사적인 이야기를 나누거나 작은 부탁을 들어주면 신뢰가 쌓여 관계가 풍성해질 수 있어요.

③ 미래 — 꾸준히 신뢰를 쌓으면 몇 달 안에 더 중요한 일을 맡기거나 의견을 물어보는 빈도가 늘어날 수 있어요. 한 번 실수로 인상이 나빠졌다면 다음 일에서 확실히 해내면 올라설 수 있습니다.`,
      en: `【Past·Present·Future 3-Card】How your boss and coworkers see you.

① Past — Your boss likely sees you as "useful" or "worth developing," but may feel one step short of fully trusting you with bigger tasks.

② Present — Colleagues tend to see you as a decent, good person. Sharing a bit of personal talk or helping with small requests can build trust and deepen ties.

③ Future — If you keep building trust, within a few months you may get more important tasks or be asked for your opinion more often. Doing well on the next task can help you recover from one mistake.`,
      ja: `【過去・現在・未来3枚】上司・同僚が私をどう見ているか。

① 過去 — 上司はあなたを「使える人」「育てる価値がある人」と見ている可能性。完全に任せるにはあと一歩と感じているかも。

② 現在 — 同僚はあなたを「悪くない良い人」と見ている傾向。仕事外でちょっとしたプライベートな話や小さな頼みを聞いてあげると信頼が積み、関係が豊かになります。

③ 未来 — コツコツ信頼を積めば、数ヶ月でより重要な仕事を任されたり意見を聞かれる回数が増えるかも。一度の失敗で印象が悪くなっても、次の仕事で確実に結果を出せば立て直せます。`,
    },
    solution_3: {
      ko: `【문제·원인·해결 3장】상사·동료가 나를 어떻게 보는지.

① 현재의 문제 — 상사는 아직 완전히 믿고 맡기기에는 한 단계가 부족하다고 느낄 수 있어요. 말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있습니다.

② 원인 — 동료들은 "친해지고 싶다"보다는 "일할 만한 사람"으로 인식할 수 있어요. 겉으로는 잘해 주지만 속으로는 "조금 더 기대해 봐도 되겠다" 같은 생각을 할 수 있습니다.

③ 해결·조언 — 특정 분야에서 확실한 강점을 보이거나, 위기 상황에서 한 번 잘 해내면 위치가 올라갈 수 있어요. 꾸준히 신뢰를 쌓으세요.`,
      en: `【Problem·Cause·Solution 3-Card】How your boss and coworkers see you.

① Current problem — Your boss may feel one step short of fully trusting you with bigger tasks. One or two concrete results can change that.

② Cause — Colleagues may see you more as "someone good to work with" than "someone to get close to." They may be supportive on the surface but think "let's see a bit more" inside.

③ Solution / Advice — Showing clear strength in one area or performing well in a pinch can raise your standing. Keep building trust.`,
      ja: `【問題・原因・解決3枚】上司・同僚が私をどう見ているか。

① 現在の問題 — 上司は完全に任せるにはあと一歩と感じているかも。言葉より結果を見せる仕事が一、二回あると関係が変わります。

② 原因 — 同僚は「仲良くなりたい」より「一緒に仕事しやすい人」として認識。表ではよくしてくれても、内心「もう少し期待してみよう」と思っているかも。

③ 解決・アドバイス — 特定分野で強みを見せるか、ピンチで一度きちんと結果を出せばポジションが上がり得ます。コツコツ信頼を積んで。`,
    },
    cross_4: {
      ko: `【크로스 4장】상사·동료가 나를 어떻게 보는지.

① 현재 상황 — 상사는 당신을 "쓸 만한 사람"으로 보고 있을 가능성이 있어요. 동료들은 무난하게 좋은 사람으로 보는 편입니다.

② 도전·장애물 — 아직 "이 사람 없이는 안 된다" 수준까지는 아닐 수 있어요. 특정 분야에서 확실한 강점을 보이거나 위기 상황에서 한 번 잘 해내면 위치가 올라갈 수 있습니다.

③ 과거의 영향 — 겉으로는 잘해 주지만 속으로는 "조금 더 기대해 봐도 되겠다", "아직은 지켜보자" 같은 생각을 할 수 있어요. 나쁜 의미가 아니라 관찰 단계로 받아들이면 됩니다.

④ 앞으로의 방향 — 꾸준히 신뢰를 쌓으면 몇 달 안에 더 중요한 일을 맡기거나 의견을 물어보는 빈도가 늘어날 수 있어요.`,
      en: `【Cross 4-Card】How your boss and coworkers see you.

① Current situation — Your boss likely sees you as "useful." Colleagues tend to see you as a decent, good person.

② Challenge / Obstacle — You're not yet "we can't do without this person." Showing clear strength in one area or performing well in a pinch can raise your standing.

③ Past influence — They may be supportive on the surface but think "let's see a bit more" or "let's keep watching." Take it as an observation phase, not something negative.

④ Future direction — If you keep building trust, within a few months you may get more important tasks or be asked for your opinion more often.`,
      ja: `【クロス4枚】上司・同僚が私をどう見ているか。

① 現在の状況 — 上司はあなたを「使える人」と見ている可能性。同僚は「悪くない良い人」と見ている傾向です。

② 挑戦・障害 — まだ「この人がいないと困る」レベルまでは行っていないかも。特定分野で強みを見せるか、ピンチで一度きちんと結果を出せばポジションが上がり得ます。

③ 過去の影響 — 表ではよくしてくれても、内心「もう少し期待してみよう」「まだ見守ろう」と思っているかも。悪い意味ではなく観察段階と受け止めて。

④ これからの方向 — コツコツ信頼を積めば、数ヶ月でより重要な仕事を任されたり意見を聞かれる回数が増えるかも。`,
    },
    insight_3: {
      ko: `【통찰 3장】상사·동료가 나를 어떻게 보는지.

① 겉으로 보이는 것 — 상사는 "쓸 만한 사람", 동료들은 무난하게 좋은 사람으로 보는 편이에요. 아직 완전히 믿고 맡기기에는 한 단계가 부족하다고 느낄 수 있습니다.

② 숨은 요인 — 속으로는 "조금 더 기대해 봐도 되겠다", "아직은 지켜보자" 같은 생각을 할 수 있어요. 나쁜 의미가 아니라 당신에게 기회를 주기 전에 관찰하는 단계로 받아들이면 됩니다.

③ 카드가 주는 조언 — 말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있어요. 일 외에 가끔 사적인 이야기를 나누거나 작은 부탁을 들어주면 신뢰가 쌓입니다.`,
      en: `【Insight 3-Card】How your boss and coworkers see you.

① What shows on the surface — Your boss sees you as "useful"; colleagues tend to see you as a decent, good person. They may feel one step short of fully trusting you.

② Hidden factor — They may think "let's see a bit more" or "let's keep watching" inside. Take it as an observation phase before they give you more opportunities, not as something negative.

③ Advice from the cards — One or two concrete results can change the relationship. Sharing a bit of personal talk or helping with small requests can build trust.`,
      ja: `【洞察3枚】上司・同僚が私をどう見ているか。

① 表に見えること — 上司は「使える人」、同僚は「悪くない良い人」と見ている傾向。完全に任せるにはあと一歩と感じているかも。

② 隠れた要因 — 内心「もう少し期待してみよう」「まだ見守ろう」と思っているかも。悪い意味ではなく、チャンスをくれる前の観察段階と受け止めて。

③ カードからの助言 — 言葉より結果を見せる仕事が一、二回あると関係が変わります。仕事外でちょっとしたプライベートな話や小さな頼みを聞いてあげると信頼が積みます。`,
    },
  },
  // career_3: 권장 time_3 → 나머지 4
  career_3: {
    solution_3: {
      ko: `【문제·원인·해결 3장】일운·직장에서의 행운.

① 현재의 문제 — 지금은 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.

② 원인 — 동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 새로운 스킬을 배우거나 자격증·공부를 시작하면 반년 뒤쯤 그 결실이 직장에서 보이기 시작할 수 있습니다.

③ 해결·조언 — 무리하게 "대박"을 노리기보다는 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다. 몇 달에서 1년 사이에 "이번 일 잘됐다" 같은 경험이 한두 번 생길 가능성이 있어요.`,
      en: `【Problem·Cause·Solution 3-Card】Your work luck and fortune at the workplace.

① Current problem — No major misfortune, but not a phase of obvious windfalls. Steady work tends to bring gradual recognition and small opportunities.

② Cause — There are people among colleagues or your boss who have a positive influence on you. Learning new skills or starting a certificate or study can bear fruit at work in about six months.

③ Solution / Advice — Doing what you can reliably helps build luck more than chasing a big break. In the next few months to a year, you may have one or two experiences like "that went well."`,
      ja: `【問題・原因・解決3枚】仕事運・職場での幸運。

① 現在の問題 — 今は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れです。

② 原因 — 同僚や上司の中にあなたに良い影響を与える人がいます。新しいスキルや資格・勉強を始めると、半年ほどで職場に実がなり始めることも。

③ 解決・アドバイス — 無理に「大当たり」を狙うより、できることを着実にすることが運を育てます。数ヶ月〜1年以内に「この仕事うまくいった」という経験が一二回ある可能性。`,
    },
    relationship_5: {
      ko: `【관계 5장】일운·직장에서의 행운.

① 그 사람의 마음 — 지금은 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.

② 과거에 대한 미련 — 무리하게 "대박"을 노리기보다는 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다.

③ 숨은 속마음 — 동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 그 사람의 조언을 듣거나 함께 일할 기회를 만들면 일운이 올라갈 수 있어요.

④ 주변의 영향 — 새로운 스킬을 배우거나 자격증·공부를 시작하면 반년 뒤쯤 그 결실이 직장에서 보이기 시작할 수 있습니다.

⑤ 앞으로의 전망 — 몇 달에서 1년 사이에 "이번 일 잘됐다", "덕분에 인정받았다" 같은 경험이 한두 번 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비를 해 두면 행운이 더 크게 와 닿습니다.`,
      en: `【Relationship 5-Card】Your work luck and fortune at the workplace.

① Their state of mind — No major misfortune, but not a phase of obvious windfalls. Steady work tends to bring gradual recognition and small opportunities.

② Lingering about the past — Doing what you can reliably helps build luck more than chasing a big break.

③ Hidden feelings — There are people among colleagues or your boss who have a positive influence on you. Listening to their advice or creating chances to work together can raise your work luck.

④ Outside influence — Learning new skills or starting a certificate or study can bear fruit at work in about six months.

⑤ Outlook — In the next few months to a year, you may have one or two experiences like "that went well" or "I was recognized thanks to that." Preparing now makes that luck land more strongly.`,
      ja: `【関係5枚】仕事運・職場での幸運。

① その人の心 — 今は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れです。

② 過去への未練 — 無理に「大当たり」を狙うより、できることを着実にすることが運を育てます。

③ 隠れた本音 — 同僚や上司の中にあなたに良い影響を与える人がいます。その人のアドバイスを聞いたり、一緒に仕事する機会を作ると仕事運が上がり得ます。

④ 周囲の影響 — 新しいスキルや資格・勉強を始めると、半年ほどで職場に実がなり始めることも。

⑤ これからの見通し — 数ヶ月〜1年以内に「この仕事うまくいった」「おかげで認められた」という経験が一二回ある可能性。その時のために今できる準備をしておくと幸運がより大きく届きます。`,
    },
    cross_4: {
      ko: `【크로스 4장】일운·직장에서의 행운.

① 현재 상황 — 지금은 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.

② 도전·장애물 — 무리하게 "대박"을 노리기보다는 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다.

③ 과거의 영향 — 동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 새로운 스킬을 배우거나 자격증·공부를 시작하면 반년 뒤쯤 그 결실이 직장에서 보이기 시작할 수 있습니다.

④ 앞으로의 방향 — 몇 달에서 1년 사이에 "이번 일 잘됐다" 같은 경험이 한두 번 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비를 해 두세요.`,
      en: `【Cross 4-Card】Your work luck and fortune at the workplace.

① Current situation — No major misfortune, but not a phase of obvious windfalls. Steady work tends to bring gradual recognition and small opportunities.

② Challenge / Obstacle — Doing what you can reliably helps build luck more than chasing a big break.

③ Past influence — There are people among colleagues or your boss who have a positive influence on you. Learning new skills or starting study can bear fruit at work in about six months.

④ Future direction — In the next few months to a year, you may have one or two experiences like "that went well." Prepare now for that time.`,
      ja: `【クロス4枚】仕事運・職場での幸運。

① 現在の状況 — 今は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れです。

② 挑戦・障害 — 無理に「大当たり」を狙うより、できることを着実にすることが運を育てます。

③ 過去の影響 — 同僚や上司の中にあなたに良い影響を与える人がいます。新しいスキルや資格・勉強を始めると、半年ほどで職場に実がなり始めることも。

④ これからの方向 — 数ヶ月〜1年以内に「この仕事うまくいった」という経験が一二回ある可能性。その時のために今できる準備をしておいて。`,
    },
    insight_3: {
      ko: `【통찰 3장】일운·직장에서의 행운.

① 겉으로 보이는 것 — 지금은 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.

② 숨은 요인 — 동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 그 사람의 조언을 듣거나 함께 일할 기회를 만들면 일운이 올라갈 수 있어요.

③ 카드가 주는 조언 — 무리하게 "대박"을 노리기보다는 당신이 할 수 있는 일을 착실히 하세요. 몇 달에서 1년 사이에 "이번 일 잘됐다" 같은 경험이 한두 번 생길 가능성이 있어요.`,
      en: `【Insight 3-Card】Your work luck and fortune at the workplace.

① What shows on the surface — No major misfortune, but not a phase of obvious windfalls. Steady work tends to bring gradual recognition and small opportunities.

② Hidden factor — There are people among colleagues or your boss who have a positive influence on you. Listening to their advice or creating chances to work together can raise your work luck.

③ Advice from the cards — Doing what you can reliably helps build luck. In the next few months to a year, you may have one or two experiences like "that went well."`,
      ja: `【洞察3枚】仕事運・職場での幸運。

① 表に見えること — 今は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れです。

② 隠れた要因 — 同僚や上司の中にあなたに良い影響を与える人がいます。その人のアドバイスを聞いたり、一緒に仕事する機会を作ると仕事運が上がり得ます。

③ カードからの助言 — 無理に「大当たり」を狙うより、できることを着実にしてください。数ヶ月〜1年以内に「この仕事うまくいった」という経験が一二回ある可能性。`,
    },
  },
  // money_1: 권장 time_3 → 나머지 solution_3, relationship_5, cross_4, insight_3
  money_1: {
    solution_3: {
      ko: `【문제·원인·해결 3장】돈이 들어올 시기와 방법.\n\n① 현재의 문제 — 지금은 큰 수입이 한 번에 들어오기보다 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요.\n② 원인 — 불필요한 지출을 줄이고 저축·정리를 해 두면 나중에 "돈이 필요할 때" 훨씬 수월해집니다.\n③ 해결·조언 — 반년에서 1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요. 돈이 들어오기 전에 쓰는 습관을 줄이고 들어온 돈의 일부는 반드시 따로 모아 두세요.`,
      en: `【Problem·Cause·Solution 3-Card】When and how money will come in.\n\n① Current problem — Rather than one big windfall, you may see steady income or small bonuses.\n② Cause — Cutting unnecessary spending and saving or organizing now will make "when you need money" much easier later.\n③ Solution / Advice — Within six months to a year, income may increase or unexpected money may appear. Reduce the habit of spending before money arrives and set aside part of what comes in.`,
      ja: `【問題・原因・解決3枚】お金が入る時期・方法。\n\n① 現在の問題 — 今は大きな収入が一気に入るより、安定した収入や小さなボーナスが続く流れかも。\n② 原因 — 無駄な支出を減らし貯金・整理をしておくと、あとで「お金が必要な時」が楽になります。\n③ 解決・アドバイス — 半年〜1年以内に収入が増えたり予想外の収入がある可能性。お金が入る前に使う癖を減らし、入ったお金の一部は必ず別に貯めましょう。`,
    },
    relationship_5: {
      ko: `【관계 5장】돈이 들어올 시기와 방법.\n\n① 그 사람의 마음 — 지금은 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요.\n② 과거에 대한 미련 — 불필요한 지출을 줄이고 저축·정리를 해 두면 나중에 훨씬 수월해집니다.\n③ 숨은 속마음 — 반년에서 1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요.\n④ 주변의 영향 — 정보를 모으고 준비해 둔 자격이나 실력이 있으면 그때 발휘될 수 있습니다.\n⑤ 앞으로의 전망 — 돈이 들어오기 전에 쓰는 습관을 줄이고 들어온 돈의 일부는 반드시 따로 모아 두세요.`,
      en: `【Relationship 5-Card】When and how money will come in.\n\n① Their state of mind — You may see steady income or small bonuses rather than one big windfall.\n② Lingering about the past — Cutting unnecessary spending and saving now will make later much easier.\n③ Hidden feelings — Within six months to a year, income may increase or unexpected money may appear.\n④ Outside influence — If you've gathered information and have skills or credentials ready, they can pay off then.\n⑤ Outlook — Reduce the habit of spending before money arrives and set aside part of what comes in.`,
      ja: `【関係5枚】お金が入る時期・方法。\n\n① その人の心 — 今は安定した収入や小さなボーナスが続く流れかも。\n② 過去への未練 — 無駄な支出を減らし貯金・整理をしておくとあとで楽になります。\n③ 隠れた本音 — 半年〜1年以内に収入が増えたり予想外の収入がある可能性。\n④ 周囲の影響 — 情報を集め、資格や実力の準備があればその時に活きます。\n⑤ これからの見通し — お金が入る前に使う癖を減らし、入ったお金の一部は必ず別に貯めましょう。`,
    },
    cross_4: {
      ko: `【크로스 4장】돈이 들어올 시기와 방법.\n\n① 현재 상황 — 지금은 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요.\n② 도전·장애물 — 불필요한 지출을 줄이고 저축·정리를 해 두는 것이 좋아요.\n③ 과거의 영향 — 반년에서 1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요.\n④ 앞으로의 방향 — 돈이 들어오기 전에 쓰는 습관을 줄이고 들어온 돈의 일부는 반드시 따로 모아 두세요.`,
      en: `【Cross 4-Card】When and how money will come in.\n\n① Current situation — You may see steady income or small bonuses rather than one big windfall.\n② Challenge / Obstacle — Cutting unnecessary spending and saving or organizing now helps.\n③ Past influence — Within six months to a year, income may increase or unexpected money may appear.\n④ Future direction — Reduce the habit of spending before money arrives and set aside part of what comes in.`,
      ja: `【クロス4枚】お金が入る時期・方法。\n\n① 現在の状況 — 今は安定した収入や小さなボーナスが続く流れかも。\n② 挑戦・障害 — 無駄な支出を減らし貯金・整理をしておくのがおすすめです。\n③ 過去の影響 — 半年〜1年以内に収入が増えたり予想外の収入がある可能性。\n④ これからの方向 — お金が入る前に使う癖を減らし、入ったお金の一部は必ず別に貯めましょう。`,
    },
    insight_3: {
      ko: `【통찰 3장】돈이 들어올 시기와 방법.\n\n① 겉으로 보이는 것 — 지금은 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요.\n② 숨은 요인 — 반년에서 1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요.\n③ 카드가 주는 조언 — 돈이 들어오기 전에 쓰는 습관을 줄이고 들어온 돈의 일부는 반드시 따로 모아 두세요. "나중에"라고 미루지 말고 이번 달부터 작은 금액이라도 저축을 시작하세요.`,
      en: `【Insight 3-Card】When and how money will come in.\n\n① What shows on the surface — You may see steady income or small bonuses rather than one big windfall.\n② Hidden factor — Within six months to a year, income may increase or unexpected money may appear.\n③ Advice from the cards — Reduce the habit of spending before money arrives and set aside part of what comes in. Don't put it off "for later"—start saving even a small amount this month.`,
      ja: `【洞察3枚】お金が入る時期・方法。\n\n① 表に見えること — 今は安定した収入や小さなボーナスが続く流れかも。\n② 隠れた要因 — 半年〜1年以内に収入が増えたり予想外の収入がある可能性。\n③ カードからの助言 — お金が入る前に使う癖を減らし、入ったお金の一部は必ず別に貯めましょう。「あとで」と延ばさず、今月から少額でも貯金を始めて。`,
    },
  },
  money_2: {
    time_3: {
      ko: `【과거·현재·미래 3장】지금 투자·저축 어떻게 할지.\n\n① 과거 — "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 느낌이 있었을 수 있어요.\n② 현재 — 무리한 투자보다는 "안정적인 저축 + 소액 분산"이 당신에게 맞는 편이에요.\n③ 미래 — 유행하는 코인이나 "반드시 오른다"는 말에 쉽게 끌려가지 마세요. 매달 고정 금액을 저축·투자에 쓰는 습관을 들이세요.`,
      en: `【Past·Present·Future 3-Card】How you should invest or save right now.\n\n① Past — You may have felt "I should do something but don't know what."\n② Present — For you, stable saving + small diversified investment tends to fit better than aggressive investing.\n③ Future — Don't be easily pulled in by trendy coins or "it will definitely go up." Build a habit of putting a fixed amount into saving/investment each month.`,
      ja: `【過去・現在・未来3枚】今、投資・貯金はどうするか。\n\n① 過去 — 「何かした方がいいけど何をすればいいか分からない」という感覚があったかも。\n② 現在 — 無理な投資より「安定貯金＋少額分散」があなたに合う傾向。\n③ 未来 — 流行のコインや「必ず上がる」という言葉に簡単に乗らないで。毎月一定額を貯金・投資に回す習慣をつけて。`,
    },
    relationship_5: {
      ko: `【관계 5장】투자·저축 어떻게 할지.\n\n① 그 사람의 마음 — 지금은 "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 방향이 흐릿한 상태일 수 있어요.\n②~⑤ (요약) 안정 저축 + 소액 분산이 맞고, 원금을 지키는 것을 최우선으로 하세요. 매달 고정 금액을 저축·투자에 쓰는 습관을 들이면 장기적으로 재정이 안정됩니다.`,
      en: `【Relationship 5-Card】How you should invest or save right now.\n\n① Their state of mind — You may feel direction is unclear: "I should do something but don't know what."\n②~⑤ (summary) Stable saving + small diversified investment fits you; protect principal first. A habit of putting a fixed amount into saving/investment each month stabilizes your finances in the long run.`,
      ja: `【関係5枚】投資・貯金はどうするか。\n\n① その人の心 — 今は「何かした方がいいけど何をすればいいか分からない」と方向がぼやけている状態かも。\n②~⑤ (要約) 安定貯金＋少額分散が合い、元本を守ることを最優先に。毎月一定額を貯金・投資に回す習慣をつけると長期的に財務が安定します。`,
    },
    cross_4: {
      ko: `【크로스 4장】투자·저축 어떻게 할지.\n\n① 현재 상황 — "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 느낌이 있을 수 있어요.\n② 도전·장애물 — 무리한 투자보다 안정 저축 + 소액 분산이 맞아요.\n③ 과거의 영향 — 한 곳에 올인하기보다 비상금을 먼저 쌓고 여유 자금으로 조금씩 분산 투자하는 흐름이 위험을 줄입니다.\n④ 앞으로의 방향 — 원금을 지키는 것을 최우선으로 하고 매달 고정 금액을 저축·투자에 쓰는 습관을 들이세요.`,
      en: `【Cross 4-Card】How you should invest or save right now.\n\n① Current situation — You may feel "I should do something but don't know what."\n② Challenge / Obstacle — Stable saving + small diversified investment tends to fit better than aggressive investing.\n③ Past influence — Building an emergency fund first, then using spare money for small diversified investments, reduces risk.\n④ Future direction — Protect principal first and build a habit of putting a fixed amount into saving/investment each month.`,
      ja: `【クロス4枚】投資・貯金はどうするか。\n\n① 現在の状況 — 「何かした方がいいけど何をすればいいか分からない」という感覚があるかも。\n② 挑戦・障害 — 無理な投資より安定貯金＋少額分散が合います。\n③ 過去の影響 — 一か所に集中するより、まず緊急資金を貯め、余裕資金で少しずつ分散投資する流れがリスクを減らします。\n④ これからの方向 — 元本を守ることを最優先に、毎月一定額を貯金・投資に回す習慣をつけて。`,
    },
    insight_3: {
      ko: `【통찰 3장】투자·저축 어떻게 할지.\n\n① 겉으로 보이는 것 — "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 방향이 흐릿한 상태일 수 있어요.\n② 숨은 요인 — 무리한 투자보다 "안정적인 저축 + 소액 분산"이 당신에게 맞는 편이에요.\n③ 카드가 주는 조언 — 유행하는 코인이나 "반드시 오른다"는 말에 쉽게 끌려가지 마세요. 매달 고정 금액을 저축·투자에 쓰는 습관을 들이세요.`,
      en: `【Insight 3-Card】How you should invest or save right now.\n\n① What shows on the surface — You may feel direction is unclear: "I should do something but don't know what."\n② Hidden factor — For you, stable saving + small diversified investment tends to fit better than aggressive investing.\n③ Advice from the cards — Don't be easily pulled in by trendy coins or "it will definitely go up." Build a habit of putting a fixed amount into saving/investment each month.`,
      ja: `【洞察3枚】投資・貯金はどうするか。\n\n① 表に見えること — 「何かした方がいいけど何をすればいいか分からない」と方向がぼやけている状態かも。\n② 隠れた要因 — 無理な投資より「安定貯金＋少額分散」があなたに合う傾向。\n③ カードからの助言 — 流行のコインや「必ず上がる」に簡単に乗らないで。毎月一定額を貯金・投資に回す習慣をつけて。`,
    },
  },
  money_3: {
    solution_3: {
      ko: `【문제·원인·해결 3장】금전운 전반·불필요한 지출 피하기.\n\n① 현재의 문제 — 지금은 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요.\n② 원인 — 스트레스나 권유, "이번만"이라는 생각이 지출을 늘리는 경우가 많아요.\n③ 해결·조언 — 필요한 것과 원하는 것을 구분하고 매달 "쓸 수 있는 한도"를 정해 두세요. 카드 영수증이나 가계부 앱으로 한 달 치를 돌아보면 반복되는 낭비가 보입니다.`,
      en: `【Problem·Cause·Solution 3-Card】Overall money luck and how to avoid unnecessary spending.\n\n① Current problem — You may feel not one big loss but "small leaks" eating at your finances.\n② Cause — Stress, persuasion, or "just this once" often increase spending.\n③ Solution / Advice — Separate needs from wants and set a monthly "spending limit." Looking back at a month's receipts or budget app will show repeated waste.`,
      ja: `【問題・原因・解決3枚】金運全般・無駄遣いを避けるには。\n\n① 現在の問題 — 今は「少しずつ漏れる穴」が財務を削っている感覚かも。\n② 原因 — ストレス・勧め・「今回だけ」という気持ちが支出を増やすことが多い。\n③ 解決・アドバイス — 必要なものと欲しいものを分け、毎月「使っていい上限」を決めておくのがおすすめ。カード明細や家計簿アプリで一ヶ月を振り返ると繰り返しの無駄が見えます。`,
    },
    relationship_5: {
      ko: `【관계 5장】금전운·불필요한 지출 피하기.\n\n① 그 사람의 마음 — 지금은 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요.\n②~⑤ (요약) 스트레스나 권유가 지출을 늘립니다. "24시간 rule"을 적용해 보세요. 필요한 것과 원하는 것을 구분하고 매달 한도를 정해 두면 금전운이 정리되기 시작합니다.`,
      en: `【Relationship 5-Card】Money luck and avoiding unnecessary spending.\n\n① Their state of mind — You may feel "small leaks" eating at your finances.\n②~⑤ (summary) Stress and persuasion increase spending. Try a "24-hour rule." Separating needs from wants and setting a monthly limit helps your money luck tidy up.`,
      ja: `【関係5枚】金運・無駄遣いを避けるには。\n\n① その人の心 — 今は「少しずつ漏れる穴」が財務を削っている感覚かも。\n②~⑤ (要約) ストレス・勧めが支出を増やします。「24時間ルール」を試して。必要なものと欲しいものを分け、毎月上限を決めると金運が整い始めます。`,
    },
    cross_4: {
      ko: `【크로스 4장】금전운·불필요한 지출 피하기.\n\n① 현재 상황 — "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요.\n② 도전·장애물 — 스트레스나 권유, "이번만"이라는 생각이 지출을 늘립니다.\n③ 과거의 영향 — 감정이 올라갔을 때 쇼핑하거나 친구·광고에 이끌려 구매하는 패턴이 있다면 "24시간 rule"을 적용해 보세요.\n④ 앞으로의 방향 — 필요한 것과 원하는 것을 구분하고 매달 "쓸 수 있는 한도"를 정해 두세요.`,
      en: `【Cross 4-Card】Money luck and avoiding unnecessary spending.\n\n① Current situation — You may feel "small leaks" eating at your finances.\n② Challenge / Obstacle — Stress, persuasion, or "just this once" often increase spending.\n③ Past influence — If you tend to shop when emotional or buy when pushed by friends or ads, try a "24-hour rule."\n④ Future direction — Separate needs from wants and set a monthly "spending limit."`,
      ja: `【クロス4枚】金運・無駄遣いを避けるには。\n\n① 現在の状況 — 「少しずつ漏れる穴」が財務を削っている感覚かも。\n② 挑戦・障害 — ストレス・勧め・「今回だけ」が支出を増やします。\n③ 過去の影響 — 感情が高まった時の買い物や友人・広告に流されて買うパターンがあるなら「24時間ルール」を試して。\n④ これからの方向 — 必要なものと欲しいものを分け、毎月「使っていい上限」を決めておいて。`,
    },
    insight_3: {
      ko: `【통찰 3장】금전운·불필요한 지출 피하기.\n\n① 겉으로 보이는 것 — 지금은 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요.\n② 숨은 요인 — 스트레스나 권유, "이번만"이라는 생각이 지출을 늘리는 경우가 많아요.\n③ 카드가 주는 조언 — 필요한 것과 원하는 것을 구분하고 매달 "쓸 수 있는 한도"를 정해 두세요. 그 부분부터 줄이면 금전운이 정리되기 시작합니다.`,
      en: `【Insight 3-Card】Money luck and avoiding unnecessary spending.\n\n① What shows on the surface — You may feel "small leaks" eating at your finances.\n② Hidden factor — Stress, persuasion, or "just this once" often increase spending.\n③ Advice from the cards — Separate needs from wants and set a monthly "spending limit." Cutting that first helps your money luck tidy up.`,
      ja: `【洞察3枚】金運・無駄遣いを避けるには。\n\n① 表に見えること — 今は「少しずつ漏れる穴」が財務を削っている感覚かも。\n② 隠れた要因 — ストレス・勧め・「今回だけ」が支出を増やすことが多い。\n③ カードからの助言 — 必要なものと欲しいものを分け、毎月「使っていい上限」を決めておいて。そこから減らすと金運が整い始めます。`,
    },
  },
  relationship_1: {
    time_3: {
      ko: `【과거·현재·미래 3장】주변 사람들이 나를 어떻게 생각하는지.\n\n① 과거 — 주변에서는 당신을 "무난하게 좋은 사람", "편한 사람"으로 보는 경우가 많아요.\n② 현재 — 겉으로는 차분하고 말도 잘 들어 주지만 속마음을 잘 말하지 않아 "무슨 생각인지 모르겠다"고 느끼는 사람이 있을 수 있어요.\n③ 미래 — 관계를 더 깊게 하고 싶다면 "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보세요. 솔직한 한 마디가 신뢰를 키웁니다.`,
      en: `【Past·Present·Future 3-Card】What people around you really think of you.\n\n① Past — People often see you as "a nice, easy person" and "comfortable to be around."\n② Present — You seem calm and a good listener, but because you don't share your inner thoughts much, some may feel "I don't know what they're thinking."\n③ Future — If you want deeper relationships, try saying "I think this" or "I like that" sometimes. One honest line builds trust.`,
      ja: `【過去・現在・未来3枚】周りの人が私をどう思っているか。\n\n① 過去 — 周囲はあなたを「悪くない良い人」「居心地のいい人」と見ることが多い。\n② 現在 — 落ち着いていて話もよく聞くが、本音をあまり言わないので「何を考えているか分からない」と感じる人も。\n③ 未来 — 関係を深めたいなら、たまに「私はこう思う」「私はこれが好き」と伝えてみて。正直な一言が信頼を育てます。`,
    },
    solution_3: {
      ko: `【문제·원인·해결 3장】주변 사람들이 나를 어떻게 생각하는지.\n\n① 현재의 문제 — "깊이 알아가고 싶다"까지는 아니고 "적당히 친하면 좋겠다" 수준일 수 있어요.\n② 원인 — 속마음을 잘 말하지 않아 "믿을 만한 사람", "감정은 잘 모르겠다" 같은 평가가 섞여 있을 수 있어요.\n③ 해결·조언 — 조금 더 본인의 생각이나 감정을 드러내면 관계가 더 가까워질 수 있어요. 맞춰 주기만 하면 상대는 당신의 진짜 모습을 알기 어렵습니다.`,
      en: `【Problem·Cause·Solution 3-Card】What people around you really think of you.\n\n① Current problem — They may not be eager to know you deeply—"friendly enough" is the level.\n② Cause — Because you don't share your inner thoughts much, mixed views like "reliable" or "hard to read emotionally" may exist.\n③ Solution / Advice — Sharing a bit more of your thoughts and feelings can bring relationships closer. If you only accommodate, others can't see the real you.`,
      ja: `【問題・原因・解決3枚】周りの人が私をどう思っているか。\n\n① 現在の問題 — 「深く知りたい」まではいかず「程よく仲良くできれば」というレベルかも。\n② 原因 — 本音をあまり言わないので「信頼できる人」「感情は分かりにくい」などの評価が混ざっているかも。\n③ 解決・アドバイス — もう少し自分の考えや感情を出せば関係が近くなります。合わせるだけだと相手はあなたの本当の姿を知れません。`,
    },
    cross_4: {
      ko: `【크로스 4장】주변 사람들이 나를 어떻게 생각하는지.\n\n① 현재 상황 — 주변에서는 당신을 "무난하게 좋은 사람", "편한 사람"으로 보는 경우가 많아요.\n② 도전·장애물 — 속마음을 잘 말하지 않아 "무슨 생각인지 모르겠다"고 느끼는 사람이 있을 수 있어요.\n③ 과거의 영향 — "믿을 만한 사람", "일은 잘하는데 감정은 잘 모르겠다" 같은 평가가 섞여 있을 수 있어요.\n④ 앞으로의 방향 — 관계를 더 깊게 하고 싶다면 "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보세요.`,
      en: `【Cross 4-Card】What people around you really think of you.\n\n① Current situation — People often see you as "a nice, easy person" and "comfortable to be around."\n② Challenge / Obstacle — Because you don't share your inner thoughts much, some may feel "I don't know what they're thinking."\n③ Past influence — Mixed views like "reliable" or "good at work but hard to read emotionally" may exist.\n④ Future direction — If you want deeper relationships, try saying "I think this" or "I like that" sometimes.`,
      ja: `【クロス4枚】周りの人が私をどう思っているか。\n\n① 現在の状況 — 周囲はあなたを「悪くない良い人」「居心地のいい人」と見ることが多い。\n② 挑戦・障害 — 本音をあまり言わないので「何を考えているか分からない」と感じる人も。\n③ 過去の影響 — 「信頼できる人」「仕事はできるが感情は分かりにくい」などの評価が混ざっているかも。\n④ これからの方向 — 関係を深めたいなら「私はこう思う」「私はこれが好き」と伝えてみて。`,
    },
    insight_3: {
      ko: `【통찰 3장】주변 사람들이 나를 어떻게 생각하는지.\n\n① 겉으로 보이는 것 — 주변에서는 당신을 "무난하게 좋은 사람", "편한 사람"으로 보는 경우가 많아요. 위협적이지 않고 다가가기 쉬운 이미지입니다.\n② 숨은 요인 — "믿을 만한 사람", "일은 잘하는데 감정은 잘 모르겠다" 같은 평가가 섞여 있을 수 있어요. 당신을 더 알고 싶어 하는 사람은 당신이 먼저 마음을 열어 주길 기다리고 있을 수 있습니다.\n③ 카드가 주는 조언 — "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보세요. 솔직한 한 마디가 신뢰를 키웁니다.`,
      en: `【Insight 3-Card】What people around you really think of you.\n\n① What shows on the surface — People often see you as "a nice, easy person" and "comfortable to be around." You come across as approachable, not threatening.\n② Hidden factor — Mixed views like "reliable" or "good at work but hard to read emotionally" may exist. Those who want to know you better may be waiting for you to open up first.\n③ Advice from the cards — Try saying "I think this" or "I like that" sometimes. One honest line builds trust.`,
      ja: `【洞察3枚】周りの人が私をどう思っているか。\n\n① 表に見えること — 周囲はあなたを「悪くない良い人」「居心地のいい人」と見ることが多い。脅威ではなく、近づきやすいイメージ。\n② 隠れた要因 — 「信頼できる人」「仕事はできるが感情は分かりにくい」などの評価が混ざっているかも。あなたをもっと知りたい人はあなたが先に心を開くのを待っているかも。\n③ カードからの助言 — 「私はこう思う」「私はこれが好き」と伝えてみて。正直な一言が信頼を育てます。`,
    },
  },
  relationship_2: {
    time_3: {
      ko: `【과거·현재·미래 3장】인간관계에서 피해야 할 사람·주의점.\n\n① 과거 — "이 사람이랑은 거리두는 게 나을 것 같다", "뭔가 불편하다"고 느끼는 관계가 하나둘 있을 수 있어요.\n② 현재 — 당신에게 에너지를 빼앗기만 하거나 항상 당신이 맞춰 줘야 하는 관계는 거리를 두는 것이 좋아요.\n③ 미래 — "다 좋은 사람이어야 한다"고 생각하지 마세요. 소수라도 서로 존중하고 말을 들어 주는 사람과 시간을 보내는 것이 훨씬 가치 있습니다.`,
      en: `【Past·Present·Future 3-Card】Who to avoid in relationships and what to watch out for.\n\n① Past — You may feel "I should keep my distance from this person" or "something's off" in one or two relationships.\n② Present — Keep distance from people who only drain your energy or relationships where you always have to accommodate.\n③ Future — Don't think "everyone has to be nice." Spending time with a few people who respect you and listen is far more valuable.`,
      ja: `【過去・現在・未来3枚】人間関係で避けるべき人・注意点。\n\n① 過去 — 「この人とは距離を置いた方がいい」「何か違和感がある」と感じる関係が一二あるかも。\n② 現在 — あなたからエネルギーを奪うだけ、いつもあなたが合わせる関係は距離を置くのがおすすめ。\n③ 未来 — 「みんないい人でなくては」と思わないで。少数でも互いに尊重し話を聞いてくれる人と時間を過ごす方がずっと価値があります。`,
    },
    relationship_5: {
      ko: `【관계 5장】인간관계에서 피해야 할 사람·주의점.\n\n① 그 사람의 마음 — "이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 있을 수 있어요.\n②~⑤ (요약) 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계는 거리를 두세요. "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 마음 건강에 좋습니다. 관계는 질이 중요해요.`,
      en: `【Relationship 5-Card】Who to avoid in relationships and what to watch out for.\n\n① Their state of mind — You may feel "I should keep my distance from this person" in one or two relationships.\n②~⑤ (summary) Keep distance from people who only drain your energy or where you always accommodate. With those who "only talk about themselves" or "often blame or compare," it's better not to get deeply involved. Quality of relationships matters.`,
      ja: `【関係5枚】人間関係で避けるべき人・注意点。\n\n① その人の心 — 「この人とは距離を置いた方がいい」と感じる関係があるかも。\n②~⑤ (要約) エネルギーを奪うだけ、いつも合わせる関係は距離を置いて。「自分の話ばかりで私の話を聞かない」「批判・比較が多い」人とは深く関わらない方が心の健康に良い。関係は質が大事です。`,
    },
    cross_4: {
      ko: `【크로스 4장】인간관계에서 피해야 할 사람·주의점.\n\n① 현재 상황 — "이 사람이랑은 거리두는 게 나을 것 같다", "뭔가 불편하다"고 느끼는 관계가 있을 수 있어요.\n② 도전·장애물 — 당신에게 에너지를 빼앗기만 하거나 항상 당신이 맞춰 줘야 하는 관계는 거리를 두는 것이 좋아요.\n③ 과거의 영향 — "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 좋습니다.\n④ 앞으로의 방향 — 부담스러운 요청에는 "지금은 어렵다"고 말해도 되고, 관계는 질이 중요합니다.`,
      en: `【Cross 4-Card】Who to avoid in relationships and what to watch out for.\n\n① Current situation — You may feel "I should keep my distance from this person" or "something's off" in one or two relationships.\n② Challenge / Obstacle — Keep distance from people who only drain your energy or relationships where you always have to accommodate.\n③ Past influence — With those who "only talk about themselves" or "often blame or compare," it's better not to get deeply involved.\n④ Future direction — It's okay to say "I can't right now" to burdensome requests—quality of relationships matters.`,
      ja: `【クロス4枚】人間関係で避けるべき人・注意点。\n\n① 現在の状況 — 「この人とは距離を置いた方がいい」「何か違和感がある」と感じる関係があるかも。\n② 挑戦・障害 — あなたからエネルギーを奪うだけ、いつもあなたが合わせる関係は距離を置くのがおすすめ。\n③ 過去の影響 — 「自分の話ばかりで私の話を聞かない」「批判・比較が多い」人とは深く関わらない方が良い。\n④ これからの方向 — 負担な頼みには「今は難しい」と言ってよく、関係は質が大事です。`,
    },
    insight_3: {
      ko: `【통찰 3장】인간관계에서 피해야 할 사람·주의점.\n\n① 겉으로 보이는 것 — "이 사람이랑은 거리두는 게 나을 것 같다", "뭔가 불편하다"고 느끼는 관계가 하나둘 있을 수 있어요.\n② 숨은 요인 — 당신에게 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계, "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 마음 건강에 좋습니다.\n③ 카드가 주는 조언 — "다 좋은 사람이어야 한다"고 생각하지 마세요. 부담스러운 요청에는 "지금은 어렵다"고 말해도 됩니다.`,
      en: `【Insight 3-Card】Who to avoid in relationships and what to watch out for.\n\n① What shows on the surface — You may feel "I should keep my distance from this person" or "something's off" in one or two relationships.\n② Hidden factor — Keep distance from people who only drain your energy or where you always accommodate; with those who "often blame or compare," it's better not to get deeply involved for your mental health.\n③ Advice from the cards — Don't think "everyone has to be nice." It's okay to say "I can't right now" to burdensome requests.`,
      ja: `【洞察3枚】人間関係で避けるべき人・注意点。\n\n① 表に見えること — 「この人とは距離を置いた方がいい」「何か違和感がある」と感じる関係が一二あるかも。\n② 隠れた要因 — あなたからエネルギーを奪うだけ、合わせる関係、「批判・比較が多い」人とは深く関わらない方が心の健康に良い。\n③ カードからの助言 — 「みんないい人でなくては」と思わないで。負担な頼みには「今は難しい」と言ってよいです。`,
    },
  },
  relationship_3: {
    solution_3: {
      ko: `【문제·원인·해결 3장】진짜 친구·내 편은 누구?\n\n① 현재의 문제 — 지금 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있을 수 있어요.\n② 원인 — 진짜 내 편은 당신이 잘될 때만이 아니라 막힐 때나 실수했을 때도 변하지 않는 사람이에요.\n③ 해결·조언 — 말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람을 눈여겨보세요. 먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 됩니다.`,
      en: `【Problem·Cause·Solution 3-Card】Who are your true friends and allies.\n\n① Current problem — You have good people around, but some relationships may be hard to call "truly on my side."\n② Cause — True allies don't change when you're stuck or when you make a mistake, not only when you're doing well.\n③ Solution / Advice — Look for people who reach out or offer small help when you're in trouble, not just say "I support you." Making the first move or asking a small favor can start a relationship.`,
      ja: `【問題・原因・解決3枚】本当の友達・味方は誰？\n\n① 現在の問題 — 今の周りには良い人もいるが、「本当に味方」と断言しにくい関係が混ざっているかも。\n② 原因 — 本当の味方はあなたがうまくいっている時だけでなく、行き詰まった時や失敗した時も変わらない人。\n③ 解決・アドバイス — 言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人を目に留めて。こちらから近づいたり小さな頼みをしてみると関係が始まります。`,
    },
    relationship_5: {
      ko: `【관계 5장】진짜 친구·내 편은 누구?\n\n① 그 사람의 마음 — 수많은 인연보다 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가깝습니다.\n②~⑤ (요약) 진짜 내 편은 잘될 때만이 아니라 막힐 때나 실수했을 때도 변하지 않는 사람이에요. 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구입니다. 일·취미·모임을 통해 "마음이 맞는다"고 느끼는 인연이 생길 가능성이 있어요.`,
      en: `【Relationship 5-Card】Who are your true friends and allies.\n\n① Their state of mind — True friends are often those who are there for you even once when things are hard, not the many shallow connections.\n②~⑤ (summary) True allies don't change when you're stuck or when you make a mistake. Those who listen without blaming are real friends. Through work, hobbies, or gatherings, you may meet people you feel "in sync with."`,
      ja: `【関係5枚】本当の友達・味方は誰？\n\n① その人の心 — 数多くの縁より、辛い時に一度いてくれる人を覚えている人が本当の友達に近いです。\n②~⑤ (要約) 本当の味方はうまくいっている時だけでなく行き詰まった時や失敗した時も変わらない人。あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。仕事・趣味・集まりで「気が合う」と感じる縁ができる可能性。`,
    },
    cross_4: {
      ko: `【크로스 4장】진짜 친구·내 편은 누구?\n\n① 현재 상황 — 지금 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있을 수 있어요.\n② 도전·장애물 — 진짜 내 편은 말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람이에요.\n③ 과거의 영향 — 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구입니다.\n④ 앞으로의 방향 — 일·취미·모임을 통해 "이 사람이랑은 마음이 맞는다"고 느끼는 인연이 생길 가능성이 있어요. 먼저 다가가거나 작은 부탁을 해 보세요.`,
      en: `【Cross 4-Card】Who are your true friends and allies.\n\n① Current situation — You have good people around, but some relationships may be hard to call "truly on my side."\n② Challenge / Obstacle — True allies reach out or offer small help when you're in trouble, not just say "I support you."\n③ Past influence — Those who listen without blaming are real friends.\n④ Future direction — Through work, hobbies, or gatherings, you may meet people you feel "in sync with." Making the first move or asking a small favor helps.`,
      ja: `【クロス4枚】本当の友達・味方は誰？\n\n① 現在の状況 — 今の周りには良い人もいるが、「本当に味方」と断言しにくい関係が混ざっているかも。\n② 挑戦・障害 — 本当の味方は言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人。\n③ 過去の影響 — あなたの話を傾聴し責めずに聞いてくれる人が本当の友達です。\n④ これからの方向 — 仕事・趣味・集まりで「この人とは気が合う」と感じる縁ができる可能性。こちらから近づいたり小さな頼みをしてみて。`,
    },
    insight_3: {
      ko: `【통찰 3장】진짜 친구·내 편은 누구?\n\n① 겉으로 보이는 것 — 지금 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있을 수 있어요.\n② 숨은 요인 — 진짜 내 편은 당신이 잘될 때만이 아니라 막힐 때나 실수했을 때도 변하지 않는 사람이에요. 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구입니다.\n③ 카드가 주는 조언 — 먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 됩니다. 기존 친구 중에서도 "진짜 말해 봐도 될까?" 하고 마음을 열어 보면 관계가 깊어질 수 있어요.`,
      en: `【Insight 3-Card】Who are your true friends and allies.\n\n① What shows on the surface — You have good people around, but some relationships may be hard to call "truly on my side."\n② Hidden factor — True allies don't change when you're stuck or when you make a mistake. Those who listen without blaming are real friends.\n③ Advice from the cards — Making the first move or asking a small favor can start a relationship. Among existing friends, opening up with "can I really tell you?" can deepen the bond.`,
      ja: `【洞察3枚】本当の友達・味方は誰？\n\n① 表に見えること — 今の周りには良い人もいるが、「本当に味方」と断言しにくい関係が混ざっているかも。\n② 隠れた要因 — 本当の味方はうまくいっている時だけでなく行き詰まった時や失敗した時も変わらない人。あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。\n③ カードからの助言 — こちらから近づいたり小さな頼みをしてみると関係が始まります。既存の友達の中にも「本当の話していい？」と心を開いてみると関係が深まることがあります。`,
    },
  },
  fortune_1: {
    solution_3: {
      ko: `【문제·원인·해결 3장】이번 달·올해 전체 운세.\n\n① 현재의 문제 — 지금은 "조금씩 정리되는" 느낌의 시기입니다. 마음이나 환경, 인간관계를 가볍게 정리하고 나면 다음 단계로 넘어가기 좋은 토대가 만들어집니다.\n② 원인 — 중반에는 작은 기회나 "덕분에 잘됐다"는 경험이 한두 번 생길 수 있어요.\n③ 해결·조언 — 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. 내년을 위한 씨앗도 이 시기에 뿌려 두면 다음 해가 더 풍성해질 수 있습니다.`,
      en: `【Problem·Cause·Solution 3-Card】Your fortune this month and this year overall.\n\n① Current problem — A phase of "things settling bit by bit" rather than major accidents or bad luck. Lightly organizing your mind, environment, and relationships creates a good base for the next step.\n② Cause — In the middle, you may have one or two small opportunities or "it went well thanks to that" experiences.\n③ Solution / Advice — Toward year-end, what you did this year may feel wrapped up or recognized. Sowing seeds for next year in this period can make the coming year richer.`,
      ja: `【問題・原因・解決3枚】今月・今年の全体運勢。\n\n① 現在の問題 — 今は「少しずつ整理される」感覚の時期。心・環境・人間関係を軽く整理すると次のステップへ移りやすい土台ができます。\n② 原因 — 中盤には小さなチャンスや「おかげでうまくいった」経験が一二回あるかも。\n③ 解決・アドバイス — 年末に近づくほど今年やったことがまとまったり認められる感覚が。来年のための種もこの時期にまいておくと翌年がより豊かになります。`,
    },
    relationship_5: {
      ko: `【관계 5장】이번 달·올해 전체 운세.\n\n① 그 사람의 마음 — 지금은 "조금씩 정리되는" 느낌의 시기입니다.\n②~⑤ (요약) 중반에는 작은 기회나 "덕분에 잘됐다"는 경험이 생길 수 있어요. 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. 내년을 위한 씨앗을 뿌려 두면 다음 해가 더 풍성해질 수 있습니다.`,
      en: `【Relationship 5-Card】Your fortune this month and this year overall.\n\n① Their state of mind — A phase of "things settling bit by bit" rather than major accidents or bad luck.\n②~⑤ (summary) In the middle you may have small opportunities or "it went well thanks to that" experiences. Toward year-end, what you did this year may feel wrapped up or recognized. Sowing seeds for next year can make the coming year richer.`,
      ja: `【関係5枚】今月・今年の全体運勢。\n\n① その人の心 — 今は「少しずつ整理される」感覚の時期。\n②~⑤ (要約) 中盤には小さなチャンスや「おかげでうまくいった」経験があるかも。年末に近づくほど今年やったことがまとまったり認められる感覚が。来年のための種をまいておくと翌年がより豊かになります。`,
    },
    cross_4: {
      ko: `【크로스 4장】이번 달·올해 전체 운세.\n\n① 현재 상황 — 지금은 "조금씩 정리되는" 느낌의 시기입니다. 급하게 결과를 바라기보다는 할 수 있는 일을 착실히 하는 것이 운을 키웁니다.\n② 도전·장애물 — 중반에는 작은 기회나 "덕분에 잘됐다"는 경험이 한두 번 생길 수 있어요. 전부 다 잡을 필요는 없고 본인에게 맞는 것 하나만 골라서 집중해도 충분합니다.\n③ 과거의 영향 — 새로운 인연, 정보, 제안이 들어오는 흐름이에요.\n④ 앞으로의 방향 — 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. 내년을 위한 씨앗도 이 시기에 뿌려 두세요.`,
      en: `【Cross 4-Card】Your fortune this month and this year overall.\n\n① Current situation — A phase of "things settling bit by bit." Steady effort builds luck more than hoping for quick results.\n② Challenge / Obstacle — In the middle you may have one or two small opportunities or "it went well thanks to that" experiences. You don't have to catch everything—choosing one thing that fits you and focusing is enough.\n③ Past influence — New connections, information, or offers may come in.\n④ Future direction — Toward year-end, what you did this year may feel wrapped up or recognized. Sowing seeds for next year in this period helps.`,
      ja: `【クロス4枚】今月・今年の全体運勢。\n\n① 現在の状況 — 今は「少しずつ整理される」感覚の時期。結果を急がず、できることを着実にすることが運を育てます。\n② 挑戦・障害 — 中盤には小さなチャンスや「おかげでうまくいった」経験が一二回あるかも。全部掴む必要はなく、自分に合うもの一つを選んで集中すれば十分。\n③ 過去の影響 — 新しい縁・情報・提案が入ってくる流れ。\n④ これからの方向 — 年末に近づくほど今年やったことがまとまったり認められる感覚が。来年のための種もこの時期にまいておいて。`,
    },
    insight_3: {
      ko: `【통찰 3장】이번 달·올해 전체 운세.\n\n① 겉으로 보이는 것 — 지금은 "조금씩 정리되는" 느낌의 시기입니다. 마음이나 환경, 인간관계를 가볍게 정리하고 나면 다음 단계로 넘어가기 좋은 토대가 만들어집니다.\n② 숨은 요인 — 중반에는 작은 기회나 "덕분에 잘됐다"는 경험이 한두 번 생길 수 있어요. 새로운 인연, 정보, 제안이 들어오는 흐름이에요.\n③ 카드가 주는 조언 — 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. "고생한 보람이 있다"고 느끼는 순간이 오면 작은 축하를 해 주세요.`,
      en: `【Insight 3-Card】Your fortune this month and this year overall.\n\n① What shows on the surface — A phase of "things settling bit by bit." Lightly organizing your mind, environment, and relationships creates a good base for the next step.\n② Hidden factor — In the middle you may have one or two small opportunities or "it went well thanks to that" experiences. New connections, information, or offers may come in.\n③ Advice from the cards — Toward year-end, what you did this year may feel wrapped up or recognized. When you feel "it was worth the effort," a small celebration is good.`,
      ja: `【洞察3枚】今月・今年の全体運勢。\n\n① 表に見えること — 今は「少しずつ整理される」感覚の時期。心・環境・人間関係を軽く整理すると次のステップへ移りやすい土台ができます。\n② 隠れた要因 — 中盤には小さなチャンスや「おかげでうまくいった」経験が一二回あるかも。新しい縁・情報・提案が入ってくる流れ。\n③ カードからの助言 — 年末に近づくほど今年やったことがまとまったり認められる感覚が。「頑張った甲斐があった」と感じる瞬間が来たら少しお祝いして。`,
    },
  },
  fortune_2: {
    solution_3: {
      ko: `【문제·원인·해결 3장】지금 시기 나에게 숨은 기회.\n\n① 현재의 문제 — 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.\n② 원인 — 기회는 "큰 이벤트" 형태보다 "작은 문이 열리는" 형태로 올 가능성이 많아요. 소개 요청 한 번, 작은 프로젝트 제안, 새로운 모임 초대 같은 것들이에요.\n③ 해결·조언 — 기회를 잡으려면 먼저 "내가 원하는 게 뭔지"를 대략이라도 정해 두는 것이 좋아요. "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 스스로 당신 쪽으로 걸어옵니다.`,
      en: `【Problem·Cause·Solution 3-Card】Hidden opportunities for you right now.\n\n① Current problem — Something or someone that feels "this is it" may be approaching, even if not obviously.\n② Cause — Opportunities may come less as "big events" and more as "small doors opening"—e.g. one introduction request, a small project offer, an invite to a new group.\n③ Solution / Advice — To seize opportunities, it helps to have at least a rough idea of "what I want." If you keep doing one thing you've decided "I'll at least try this," luck tends to walk toward you.`,
      ja: `【問題・原因・解決3枚】今の時期、私に隠れたチャンス。\n\n① 現在の問題 — 目立たないが「これだ」と感じる出来事や人が近づいているかも。\n② 原因 — チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。紹介の依頼一つ、小さなプロジェクトの提案、新しい集まりへの招待など。\n③ 解決・アドバイス — チャンスを掴むには「自分が何を望んでいるか」を大まかでいいので決めておくといい。「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてきます。`,
    },
    relationship_5: {
      ko: `【관계 5장】지금 시기 나에게 숨은 기회.\n\n① 그 사람의 마음 — 지금은 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.\n②~⑤ (요약) 기회는 "작은 문이 열리는" 형태로 올 수 있어요. "이건 기회가 아니야"라고 무시하지 말고 한 번 참여해 보거나 이야기를 들어 보세요. "내가 원하는 게 뭔지"를 대략이라도 정해 두면 문이 열렸을 때 들어갈 수 있어요.`,
      en: `【Relationship 5-Card】Hidden opportunities for you right now.\n\n① Their state of mind — Something or someone that feels "this is it" may be approaching, even if not obviously.\n②~⑤ (summary) Opportunities may come as "small doors opening." Don't dismiss them as "not an opportunity"; try joining once or listening. Having a rough idea of "what I want" lets you step in when the door opens.`,
      ja: `【関係5枚】今の時期、私に隠れたチャンス。\n\n① その人の心 — 今は目立たないが「これだ」と感じる出来事や人が近づいているかも。\n②~⑤ (要約) チャンスは「小さな扉が開く」形で来ることが。「これはチャンスじゃない」と見送らず、一度参加したり話を聞いてみて。「自分が何を望んでいるか」を大まかで決めておけば扉が開いた時に入れます。`,
    },
    cross_4: {
      ko: `【크로스 4장】지금 시기 나에게 숨은 기회.\n\n① 현재 상황 — 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.\n② 도전·장애물 — 기회는 "큰 이벤트" 형태보다 "작은 문이 열리는" 형태로 올 가능성이 많아요.\n③ 과거의 영향 — 일상 속에서 새로 시작한 습관, 우연히 만난 사람, 흘려들은 정보가 나중에 기회로 이어질 수 있습니다.\n④ 앞으로의 방향 — "내가 원하는 게 뭔지"를 대략이라도 정해 두는 것이 좋아요. "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어옵니다.`,
      en: `【Cross 4-Card】Hidden opportunities for you right now.\n\n① Current situation — Something or someone that feels "this is it" may be approaching, even if not obviously.\n② Challenge / Obstacle — Opportunities may come less as "big events" and more as "small doors opening."\n③ Past influence — A new habit, someone you met by chance, or information you overheard can later turn into opportunity.\n④ Future direction — It helps to have at least a rough idea of "what I want." If you keep doing one thing you've decided "I'll at least try this," luck tends to walk toward you.`,
      ja: `【クロス4枚】今の時期、私に隠れたチャンス。\n\n① 現在の状況 — 目立たないが「これだ」と感じる出来事や人が近づいているかも。\n② 挑戦・障害 — チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。\n③ 過去の影響 — 日常で始めた習慣、偶然会った人、聞き流した情報が後でチャンスにつながることがあります。\n④ これからの方向 — 「自分が何を望んでいるか」を大まかでいいので決めておくといい。「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてきます。`,
    },
    insight_3: {
      ko: `【통찰 3장】지금 시기 나에게 숨은 기회.\n\n① 겉으로 보이는 것 — 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.\n② 숨은 요인 — 기회는 "작은 문이 열리는" 형태로 올 수 있어요. "이건 기회가 아니야"라고 무시하지 말고 한 번 참여해 보거나 이야기를 들어 보는 것이 좋습니다.\n③ 카드가 주는 조언 — "내가 원하는 게 뭔지"를 대략이라도 정해 두세요. 부담스럽지 않은 범위에서 "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 스스로 당신 쪽으로 걸어옵니다.`,
      en: `【Insight 3-Card】Hidden opportunities for you right now.\n\n① What shows on the surface — Something or someone that feels "this is it" may be approaching, even if not obviously.\n② Hidden factor — Opportunities may come as "small doors opening." Don't dismiss them as "not an opportunity"; try joining once or listening to the story.\n③ Advice from the cards — Have at least a rough idea of "what I want." Within a comfortable range, if you keep doing one thing you've decided "I'll at least try this," luck tends to walk toward you.`,
      ja: `【洞察3枚】今の時期、私に隠れたチャンス。\n\n① 表に見えること — 目立たないが「これだ」と感じる出来事や人が近づいているかも。\n② 隠れた要因 — チャンスは「小さな扉が開く」形で来ることが。「これはチャンスじゃない」と見送らず、一度参加したり話を聞いてみるのがおすすめ。\n③ カードからの助言 — 「自分が何を望んでいるか」を大まかでいいので決めておいて。負担のない範囲で「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてきます。`,
    },
  },
  fortune_3: {
    time_3: {
      ko: `【과거·현재·미래 3장】피해야 할 일·조심할 점.\n\n① 과거 — 지금은 피로나 스트레스가 쌓여 있어서 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.\n② 현재 — 감정이 올라갔을 때의 결단(이직, 연애, 큰 지출, 관계 정리 등)은 미루는 것이 좋아요. "반드시 해야 한다"는 압박에 휩쓸려 무리한 약속을 하지 마세요.\n③ 미래 — 중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 한 번 말해 본 뒤에 결정하세요. 건강—잠, 식사, 휴식—을 조금만 챙겨도 판단력이 돌아오고 피해야 할 일을 덜 하게 됩니다.`,
      en: `【Past·Present·Future 3-Card】What to avoid and what to be careful about.\n\n① Past — Fatigue or stress may be building, so judgment can be clouded and you may be swept by emotion.\n② Present — Postpone big decisions when emotions are high (job change, love, big spending, ending a relationship). Don't make rash promises under "I have to this" pressure.\n③ Future — Sleep on important matters or talk to someone you trust before deciding. Taking a little care of health—sleep, meals, rest—brings back judgment and reduces things you'll regret.`,
      ja: `【過去・現在・未来3枚】避けるべきこと・注意すること。\n\n① 過去 — 疲れやストレスが溜まっていて、判断が鈍ったり感情に流されやすい時期かも。\n② 現在 — 感情が高まった時の決断（転職・恋愛・大きな支出・関係の整理など）は延ばすのがおすすめ。「やらなきゃ」のプレッシャーに流されて無理な約束をしないで。\n③ 未来 — 重要なことは一晩寝かせるか、信頼する人に一度話してから決めましょう。健康—睡眠・食事・休息—を少しでも整えると判断力が戻り、避けるべきことをしなくなります。`,
    },
    relationship_5: {
      ko: `【관계 5장】피해야 할 일·조심할 점.\n\n① 그 사람의 마음 — 지금은 피로나 스트레스가 쌓여 있어서 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.\n②~⑤ (요약) "오늘만", "이번만"이라는 생각으로 큰 결정을 하면 나중에 후회할 수 있어요. 감정이 올라갔을 때의 결단은 미루고, 중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 말해 본 뒤에 결정하세요. 건강을 조금만 챙겨도 판단력이 돌아옵니다.`,
      en: `【Relationship 5-Card】What to avoid and what to be careful about.\n\n① Their state of mind — Fatigue or stress may be building, so judgment can be clouded and you may be swept by emotion.\n②~⑤ (summary) Making big decisions with a "just today" or "just this once" mindset can lead to regret later. Postpone big decisions when emotions are high; sleep on important matters or talk to someone you trust before deciding. A little care of health brings back judgment.`,
      ja: `【関係5枚】避けるべきこと・注意すること。\n\n① その人の心 — 疲れやストレスが溜まっていて、判断が鈍ったり感情に流されやすい時期かも。\n②~⑤ (要約) 「今日だけ」「今回だけ」の気持ちで大きな決断をすると後悔することが。感情が高まった時の決断は延ばし、重要なことは一晩寝かせるか信頼する人に話してから決めましょう。健康を少しでも整えると判断力が戻ります。`,
    },
    cross_4: {
      ko: `【크로스 4장】피해야 할 일·조심할 점.\n\n① 현재 상황 — 지금은 피로나 스트레스가 쌓여 있어서 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.\n② 도전·장애물 — "오늘만", "이번만"이라는 생각으로 큰 결정을 하거나 중요한 말을 하면 나중에 후회할 수 있어요.\n③ 과거의 영향 — 감정이 올라갔을 때의 결단(이직, 연애, 큰 지출, 관계 정리 등)은 미루는 것이 좋아요. SNS에서의 과한 비교, 밤늦은 시간의 중요한 대화도 피하면 마음이 편해집니다.\n④ 앞으로의 방향 — 중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 한 번 말해 본 뒤에 결정하세요. "지금 말하지 않으면 안 된다"는 생각은 대부분 착각입니다.`,
      en: `【Cross 4-Card】What to avoid and what to be careful about.\n\n① Current situation — Fatigue or stress may be building, so judgment can be clouded and you may be swept by emotion.\n② Challenge / Obstacle — Making big decisions or saying important things with a "just today" or "just this once" mindset can lead to regret later.\n③ Past influence — Postpone big decisions when emotions are high. Avoiding excessive comparison on social media and important conversations late at night also helps peace of mind.\n④ Future direction — Sleep on important matters or talk to someone you trust before deciding. The feeling "I have to say it now" is often an illusion.`,
      ja: `【クロス4枚】避けるべきこと・注意すること。\n\n① 現在の状況 — 疲れやストレスが溜まっていて、判断が鈍ったり感情に流されやすい時期かも。\n② 挑戦・障害 — 「今日だけ」「今回だけ」の気持ちで大きな決断や重要な発言をすると後悔することがあります。\n③ 過去の影響 — 感情が高まった時の決断は延ばすのがおすすめ。SNSの過度な比較、夜遅い時間の重要な会話も避けると心が楽になります。\n④ これからの方向 — 重要なことは一晩寝かせるか、信頼する人に一度話してから決めましょう。「今言わなきゃ」は多くが錯覚です。`,
    },
    insight_3: {
      ko: `【통찰 3장】피해야 할 일·조심할 점.\n\n① 겉으로 보이는 것 — 지금은 피로나 스트레스가 쌓여 있어서 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.\n② 숨은 요인 — "오늘만", "이번만"이라는 생각으로 큰 결정을 하면 나중에 후회할 수 있어요. 감정이 올라갔을 때의 결단, "반드시 해야 한다"는 압박에 휩쓸린 무리한 약속은 피하세요.\n③ 카드가 주는 조언 — 중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 한 번 말해 본 뒤에 결정하세요. 건강—잠, 식사, 휴식—을 조금만 챙겨도 판단력이 돌아오고 피해야 할 일을 덜 하게 됩니다.`,
      en: `【Insight 3-Card】What to avoid and what to be careful about.\n\n① What shows on the surface — Fatigue or stress may be building, so judgment can be clouded and you may be swept by emotion.\n② Hidden factor — Making big decisions with a "just today" or "just this once" mindset can lead to regret later. Avoid big decisions when emotions are high and rash promises under "I have to" pressure.\n③ Advice from the cards — Sleep on important matters or talk to someone you trust before deciding. Taking a little care of health—sleep, meals, rest—brings back judgment and reduces things you'll regret.`,
      ja: `【洞察3枚】避けるべきこと・注意すること。\n\n① 表に見えること — 疲れやストレスが溜まっていて、判断が鈍ったり感情に流されやすい時期かも。\n② 隠れた要因 — 「今日だけ」「今回だけ」の気持ちで大きな決断をすると後悔することが。感情が高まった時の決断、「やらなきゃ」のプレッシャーに流された無理な約束は避けて。\n③ カードからの助言 — 重要なことは一晩寝かせるか、信頼する人に一度話してから決めましょう。健康—睡眠・食事・休息—を少しでも整えると判断力が戻り、避けるべきことをしなくなります。`,
    },
  },
};

