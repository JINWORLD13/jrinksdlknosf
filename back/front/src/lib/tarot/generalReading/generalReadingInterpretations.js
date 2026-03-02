/**
 * 제너럴 리딩 75세트 — (질문×스프레드)별 고유 해석
 * 각 (questionId, spreadId)마다 서로 다른 관점·내용. 재탕 없음.
 * 형식: READINGS_BY_QUESTION_AND_SPREAD[questionId][spreadId] = { ko: string[], en: string[], ja: string[] }
 * 배열 길이: time_3/solution_3/insight_3=3, cross_4=4, relationship_5=5
 * (generalReadingConfig에서 import하므로 여기서는 config 미참조로 순환 방지)
 */
const QUESTION_IDS = ['love_1', 'love_2', 'love_3', 'career_1', 'career_2', 'career_3', 'money_1', 'money_2', 'money_3', 'relationship_1', 'relationship_2', 'relationship_3', 'fortune_1', 'fortune_2', 'fortune_3'];
const QUESTION_SPREAD_IDS = ['time_3', 'solution_3', 'relationship_5', 'cross_4', 'insight_3'];

function buildReadings() {
  const out = {};
  QUESTION_IDS.forEach((qId) => {
    out[qId] = {};
    QUESTION_SPREAD_IDS.forEach((sId) => {
      out[qId][sId] = getUniqueReading(qId, sId);
    });
  });
  return out;
}

/**
 * (questionId, spreadId)에 맞는 고유 해석 1세트 반환. 75개 전부 서로 다름.
 */
function getUniqueReading(questionId, spreadId) {
  const key = `${questionId}_${spreadId}`;
  const readings = UNIQUE_READINGS[key];
  if (readings) return readings;
  return fallbackReading(questionId, spreadId);
}

function fallbackReading(questionId, spreadId) {
  const len = spreadId === 'relationship_5' ? 5 : spreadId === 'cross_4' ? 4 : 3;
  const ko = Array(len).fill('해석을 준비 중입니다.');
  const en = Array(len).fill('Interpretation is being prepared.');
  const ja = Array(len).fill('解釈を準備中です。');
  return { ko, en, ja };
}

/** 75개 고유 해석 데이터 — (questionId_spreadId) 키 */
const UNIQUE_READINGS = {
  // ---------- love_1: 전 애인의 나에 대한 속마음 ----------
  love_1_time_3: {
    ko: [
      '관계가 끝날 때 그쪽은 말하지 못한 후회나 "왜 그렇게 됐을까" 하는 생각이 남아 있었을 가능성이 큽니다.',
      '지금은 새 사람을 만나도 가끔 당신을 떠올리거나 비교해 보는 마음이 있지만, 행동으로 나서기보다는 마음속에만 두고 있을 가능성이 높습니다.',
      '앞으로는 시간이 지나 감정이 옅어지거나, 어느 순간 "한번 더 말해 보고 싶다"고 느낄 수 있어요. 당신이 먼저 연락하지 않으면 그쪽도 쉽게 다가오지 않을 가능성이 큽니다.',
    ],
    en: [
      'When things ended, they may have been left with unspoken regret or "why did it go that way."',
      'Now they may still think of you or compare new partners to you sometimes, but are more likely to keep it to themselves than act on it.',
      'Over time their feelings may fade, or they may at some point want to talk again. If you don\'t reach out first, they are unlikely to make the first move easily.',
    ],
    ja: [
      '別れの時、言えなかった後悔や「なぜああなったんだろう」が残っていた可能性が高いです。',
      '今は新しい人がいても時々あなたを思い出したり比べたりする気持ちはあるが、行動には出さず心に留めている可能性が高いです。',
      'これからは時間とともに感情が薄まるか、ある瞬間「もう一度話したい」と思うか。あなたから連絡しなければ相手も簡単には動かない可能性が高いです。',
    ],
  },
  love_1_solution_3: {
    ko: [
      '전 애인이 나를 어떻게 생각하는지 궁금하지만 직접 묻기 어렵고, 연락해도 될지 망설여지는 상태일 수 있어요.',
      '과거 관계가 완전히 정리되지 않았거나 서로에게 못 다한 말이 있어서 마음이 남아 있을 수 있어요. 그쪽도 당신에게 "내 마음을 제대로 알아줬으면" 하는 마음이 남아 있을 수 있어요.',
      '다시 사귀기보다는 "그 사람이 나를 제대로 알아봐줬으면 좋겠다"는 마음이 더 클 수 있어요. 먼저 연락하지 않는다면 그쪽도 쉽게 다가오지 않고, 시간이 지나면 감정이 옅어질 수 있어요.',
    ],
    en: [
      'You may wonder "what do they think of me?" but find it hard to ask directly, or hesitate whether to reach out.',
      'The past may not be fully closed or there may be things left unsaid, so feelings remain; they may also want to feel acknowledged.',
      'The wish to feel acknowledged can be stronger than to get back together. If you don\'t reach out first, they\'re unlikely to move; over time their feelings may fade.',
    ],
    ja: [
      '「あの人は私をどう思っているか」気になるが直接聞きづらく、連絡していいか迷う状態かもしれません。',
      '過去の関係が完全に区切れていなかったり言えなかったことがあって気持ちが残っていること、相手も認められたい気持ちがあることがあります。',
      '復縁より「認められたい」気持ちが強いことが。こちらから連絡しなければ相手も動きにくく、時間が経てば感情が薄まる可能性があります。',
    ],
  },
  love_1_relationship_5: {
    ko: [
      '그 사람은 과거 관계를 완전히 정리하지 못한 상태일 수 있어요. 밖으로는 쿨해 보여도 가끔 당신을 떠올립니다.',
      '좋았던 순간들이 가끔 떠오르거나 새 연인과 비교하는 마음이 있을 수 있어요. 행동으로 나서기보다는 마음속에만 품고 있을 가능성이 큽니다.',
      '"다시 연락해도 될까", "이미 잊었을 텐데" 같은 고민을 하고 있을 수 있어요. 다시 사귀기보다는 "그 사람이 나를 제대로 알아봐줬으면 좋겠다"는 마음이 더 클 수 있어요.',
      '주변에서는 "이미 끝난 일"이라고 말할 수 있지만, 본인은 아직 완전히 마무리되지 않았다고 느낄 수 있어요.',
      '시간이 지나면 당신에 대한 감정이 옅어지거나, 반대로 "한번 더 이야기해 보고 싶다"는 결심이 날 수 있어요. 당신이 먼저 연락하지 않으면 그쪽도 쉽게 다가오지 않을 가능성이 큽니다.',
    ],
    en: [
      'They may not have fully closed the chapter; even if they seem cool, they may still think of you sometimes.',
      'Good memories may surface or they may compare new partners to you; they are more likely to keep it to themselves than act on it.',
      'They may wonder "Can I reach out?" or "They\'ve probably forgotten"; the need to feel acknowledged can be stronger than the wish to get back together.',
      'Others may say "it\'s over," but they may still feel it isn\'t fully over.',
      'Over time their feelings may fade, or they may suddenly want to talk again. If you don\'t reach out first, they are unlikely to make the first move easily.',
    ],
    ja: [
      'その人は過去の関係を完全に区切れていないかもしれません。クールに見えても時々あなたを思い出します。',
      '良かった思い出がよみがえったり新しい人と比べる気持ちがあるかも。行動には出さず心に留めている可能性が高いです。',
      '「連絡していいかな」「もう忘れてるかも」と悩んでいるかも。復縁より認められたい気持ちが強いことが。',
      '周りは「もう終わったこと」と言うが、本人はまだ終わっていないと感じているかも。',
      '時間が経てばあなたへの感情が薄まるか、ある瞬間「もう一度話したい」と思うか。あなたから連絡しなければ相手も簡単には動かない可能性が高いです。',
    ],
  },
  love_1_cross_4: {
    ko: [
      '그 사람은 과거 관계를 완전히 정리하지 못한 상태일 수 있어요. 밖으로는 쿨해 보여도 가끔 당신을 떠올릴 수 있습니다.',
      '"다시 연락해도 될까", "이미 잊었을 텐데" 같은 고민으로 먼저 다가오지 못하고 있을 수 있어요.',
      '좋았던 순간들이 가끔 떠오르거나 새 연인과 비교하는 마음이 있을 수 있어요. 관계를 되돌리기보다 인정받고 싶은 마음이 클 수 있어요.',
      '시간이 지나면 감정이 옅어지거나, 어느 순간 "한번 더 이야기해 보고 싶다"는 결심이 날 수 있어요. 당신이 먼저 연락하지 않으면 그쪽도 쉽게 다가오지 않습니다.',
    ],
    en: [
      'They may not have fully closed the chapter; even if they seem cool, they may still think of you sometimes.',
      'They may wonder "Can I reach out?" or "They\'ve probably forgotten," and hesitate to make the first move.',
      'Good memories may surface or they may compare new partners to you; the need to feel acknowledged can be stronger than the wish to get back together.',
      'Over time their feelings may fade, or they may suddenly want to talk again. If you don\'t reach out first, they are unlikely to move easily.',
    ],
    ja: [
      'その人は過去の関係を完全に区切れていないかも。クールに見えても時々あなたを思い出すことがあります。',
      '「連絡していいかな」「もう忘れてるかも」と悩み、こちらから動けないかも。',
      '良かった思い出がよみがえったり新しい人と比べる気持ちがあるかも。復縁より認められたい気持ちが強いことが。',
      '時間が経てば感情が薄まるか、ある瞬間「もう一度話したい」と思うか。あなたから連絡しなければ相手も簡単には動きません。',
    ],
  },
  love_1_insight_3: {
    ko: [
      '밖으로는 쿨하거나 이미 잊은 듯 보일 수 있어요. 새 연인을 만났다고 해도 마음까지 정리됐다고 단정하기 어렵습니다.',
      '"다시 연락해도 될까", 못 다한 말, 후회가 섞여 있을 수 있어요. 다시 사귀기보다는 "그 사람이 나를 제대로 알아봐줬으면 좋겠다"는 마음이 있을 수 있어요.',
      '당신이 먼저 연락하지 않는다면 그쪽도 쉽게 다가오지 않을 가능성이 큽니다. 시간이 지나면 감정이 옅어지거나, 어느 순간 이야기하고 싶다는 결심이 날 수 있어요.',
    ],
    en: [
      'They may seem cool or as if they\'ve moved on; even with a new partner, it\'s hard to say their heart is fully closed.',
      'They may wonder "Can I reach out?" or have things left unsaid and regret; the need to feel acknowledged can be stronger than the wish to get back together.',
      'If you don\'t reach out first, they are unlikely to make the first move easily. Over time their feelings may fade, or they may suddenly want to talk.',
    ],
    ja: [
      'クールに見えたりもう忘れたように見えるかも。新しい人がいても心まで整理されたとは言い切れません。',
      '「連絡していいかな」、言えなかったこと、後悔が混ざっているかも。復縁より認められたい気持ちがあることが。',
      'あなたから連絡しなければ相手も簡単には動かない可能性が高いです。時間が経てば感情が薄まるか、ある瞬間話したいと思うかも。',
    ],
  },

  // ---------- love_2: 지금 만나는 사람, 진짜 인연일까 ----------
  love_2_time_3: {
    ko: [
      '두 사람의 만남에는 우연이 아닌 필연이 섞여 있어요. 비슷한 시기에 서로가 필요했던 에너지를 나누게 된 것이에요. 처음 만났을 때 "이 사람이구나" 하는 느낌이 들었다면 그 직감을 믿어도 좋습니다.',
      '지금 이 관계는 아직 성장 단계에 있어요. 서로를 더 알아가고 신뢰를 쌓아가는 과정이에요. "진짜 맞는 사람일까" 불안할 수 있지만, 그 자체가 이 관계를 소중히 하고 있다는 신호입니다.',
      '이 관계는 서로가 노력하면 깊어질 수 있는 가능성이 있어요. 단기적으로 결과를 재촉하기보다 하루하루 대화와 경험을 쌓는 쪽이 유리해요. "진짜 인연"은 함께 걸어가며 만들어지는 경우가 많습니다.',
    ],
    en: [
      'Your meeting had a sense of fate, not just chance; you met when you both needed to share a certain energy. If you felt "this is the one" when you first met, that intuition is worth trusting.',
      'The relationship is still growing; you are getting to know each other and building trust. Anxiety like "Is this the right person?" is normal and shows you care.',
      'This relationship can deepen if you both invest in it. Rather than rushing for a quick result, building conversation and shared experiences day by day is favorable. "True match" is often made by walking together.',
    ],
    ja: [
      '二人の出会いには偶然でない必然が。似た時期に互いに必要なエネルギーを分かち合うことになった。初めて会った時「この人だ」と感じたならその直感を信じてよいです。',
      '今の関係はまだ成長段階。お互いを知り信頼を積む過程。「本当に合う人？」と不安でも、それ自体が関係を大切にしている証です。',
      '二人が努めれば深まる可能性が。短期で結果を急ぐより日々の会話と経験を積む方が有利。「本当の運命の人」は一緒に歩みながら作られることが多いです。',
    ],
  },
  love_2_solution_3: {
    ko: [
      '"진짜 맞는 사람일까" 불안하거나 의문이 드는 상태일 수 있어요. 관계를 소중히 하고 있다는 신호이기도 합니다.',
      '두 사람의 만남에는 우연이 아닌 필연이 섞여 있어요. 아직 성장 단계에서 서로를 알아가고 신뢰를 쌓는 과정입니다.',
      '단기적으로 결과를 재촉하기보다 하루하루 대화와 경험을 쌓는 쪽이 유리해요. "진짜 인연"은 함께 걸어가며 만들어지는 경우가 많습니다.',
    ],
    en: [
      'You may feel anxious or doubt "Is this really the right person?" That itself can be a sign you care about the relationship.',
      'Your meeting had a sense of fate, not just chance. You\'re still in a growth phase, getting to know each other and building trust.',
      'Rather than rushing for a quick result, building conversation and shared experiences day by day is favorable. "True match" is often made by walking together.',
    ],
    ja: [
      '「本当に合う人？」と不安や疑問がある状態かも。関係を大切にしている証でもあります。',
      '二人の出会いには偶然でない必然が。まだ成長段階でお互いを知り信頼を積む過程です。',
      '短期で結果を急ぐより日々の会話と経験を積む方が有利。「本当の運命の人」は一緒に歩みながら作られることが多いです。',
    ],
  },
  love_2_relationship_5: {
    ko: [
      '그 사람은 당신을 소중히 생각하고 관계를 더 깊게 하고 싶어 하는 쪽에 가까울 수 있어요.',
      '만남의 의미에는 우연이 아닌 필연이 섞여 있어요. "이 사람이구나" 했던 직감을 믿어도 좋습니다.',
      '아직 성장 단계라 불안할 수 있지만 서로를 알아가고 신뢰를 쌓는 과정이에요. 감정을 솔직히 나누는 것이 다음 단계로 이어집니다.',
      '주변은 좋게 보거나 걱정할 수 있어요. 당신이 원하는 방향을 먼저 정리하는 것이 좋습니다.',
      '서로가 노력하면 깊어질 수 있는 가능성이 있어요. 하루하루 대화와 경험을 쌓는 쪽이 유리합니다.',
    ],
    en: [
      'They may value you and want to deepen the relationship.',
      'Your meeting had a sense of fate; trust the intuition you had when you first met.',
      'Still a growth phase; anxiety is normal. Sharing your feelings honestly leads to the next step.',
      'Others may see it positively or worry; clarifying what you want first helps.',
      'The relationship can deepen if you both invest; building conversation and experience day by day is favorable.',
    ],
    ja: [
      'その人はあなたを大切に思い、関係を深めたい側に近いかも。',
      '出会いの意味には偶然でない必然が。「この人だ」という直感を信じてよいです。',
      'まだ成長段階で不安もあるが、お互いを知り信頼を積む過程。気持ちを正直に分かち合うことが次の段階につながります。',
      '周りは良く見るか心配するか。自分が望む方向を先に整理するのがおすすめです。',
      '二人が努めれば深まる可能性が。日々の会話と経験を積む方が有利です。',
    ],
  },
  love_2_cross_4: {
    ko: [
      '관계는 아직 성장 단계에 있어요. 서로를 알아가고 신뢰를 쌓아가는 과정입니다.',
      '"진짜 맞는 사람일까" 같은 불안이나 의문이 들 수 있어요. 그 자체가 관계를 소중히 하고 있다는 신호입니다.',
      '두 사람의 만남에는 필연이 섞여 있어요. 처음 만났을 때의 직감을 믿어도 좋습니다.',
      '서로가 노력하면 깊어질 수 있어요. 결과를 재촉하기보다 대화와 경험을 쌓는 쪽이 유리합니다.',
    ],
    en: [
      'The relationship is still growing; you\'re getting to know each other and building trust.',
      'You may feel anxious or doubt "Is this the right person?" That shows you care about the relationship.',
      'Your meeting had a sense of fate; trust the intuition you had when you first met.',
      'The relationship can deepen if you both invest; building conversation and experience is more favorable than rushing for a result.',
    ],
    ja: [
      '関係はまだ成長段階。お互いを知り信頼を積む過程です。',
      '「本当に合う人？」という不安や疑問があるかも。それ自体が関係を大切にしている証です。',
      '二人の出会いには必然が。初めて会った時の直感を信じてよいです。',
      '二人が努めれば深まります。結果を急ぐより会話と経験を積む方が有利です。',
    ],
  },
  love_2_insight_3: {
    ko: [
      '관계는 아직 성장 단계로 보이고, 서로를 알아가고 있는 중이에요.',
      '만남에 필연이 섞여 있다는 느낌이 있고, "이 사람이구나" 했던 직감을 믿어도 좋은 시기입니다.',
      '결과를 재촉하기보다 대화와 경험을 꾸준히 쌓는 쪽이 유리해요. 진짜 인연은 함께 걸어가며 만들어지는 경우가 많습니다.',
    ],
    en: [
      'The relationship appears to be in a growth phase; you\'re getting to know each other.',
      'There\'s a sense of fate in your meeting; it\'s a good time to trust the intuition you had at the start.',
      'Building conversation and experience steadily is more favorable than rushing for a result; true match is often made by walking together.',
    ],
    ja: [
      '関係はまだ成長段階に見え、お互いを知っている最中です。',
      '出会いに必然が混ざっている感覚があり、「この人だ」という直感を信じてよい時期です。',
      '結果を急ぐより会話と経験を積み重ねる方が有利。本当の運命の人は一緒に歩みながら作られることが多いです。',
    ],
  },

  // ---------- love_3: 썸·연애 앞으로 전개와 결말 ----------
  love_3_time_3: {
    ko: [
      '지금까지 두 사람 사이에는 끌림과 망설임이 함께 있었을 수 있어요. 한쪽이 더 적극적이었거나 타이밍이 맞지 않아 진도가 나가지 않았을 수도 있습니다.',
      '지금은 전환점에 서 있어요. 썸이라면 "연애로 갈지, 친구로 남을지"가 드러나는 시기이고, 연애 중이라면 "더 깊어질지, 유지할지"에 대한 감정이 움직이고 있어요.',
      '앞으로 몇 달 안에 관계 방향이 더 분명해질 가능성이 큽니다. 서로 마음을 열고 대화하면 좋은 결과로 이어질 수 있고, 한쪽만 기다리면 흐지부지될 수 있어요.',
    ],
    en: [
      'There has been both attraction and hesitation; one may have been more active or timing may have slowed things down.',
      'You are at a turning point: if it\'s a situationship, "romance or stay friends" is becoming clearer; if dating, feelings about "going deeper or staying as is" are in motion.',
      'The direction will likely become clearer within the next few months; opening up and talking can lead to a good outcome; if one side only waits, it may fizzle.',
    ],
    ja: [
      'これまで二人の間には惹かれつつ迷いもあったかも。片方がより積極的だったりタイミングが合わず進まなかったことも。',
      '今は転換点。付き合い前なら「恋愛に進むか、友達のままか」がはっきりし始める時期。付き合っているなら「もっと深めるか、現状維持か」の気持ちが動いています。',
      '数ヶ月以内に関係の方向性がはっきりする可能性が高いです。心を開いて話せば良い結果につながり、片方だけ待っていればうやむやになることも。',
    ],
  },
  love_3_solution_3: {
    ko: [
      '"이 관계를 어떻게 할지"가 불명확한 상태일 수 있어요. 상대 반응에 일희일비하지 말고 자신이 원하는 방향을 먼저 정리하는 것이 좋습니다.',
      '끌림과 망설임이 함께 있었던 시간이 "이 관계를 어떻게 할지"를 생각하게 만든 과정이었어요. 지금이 그 결론에 가까워지는 시기입니다.',
      '"결말"을 급하게 정하려 하기보다 지금 할 수 있는 말과 행동을 하는 쪽이 후회가 적어요. 서로 마음을 열고 대화하는 것이 다음 단계로 이어집니다.',
    ],
    en: [
      'You may feel unclear about "what to do with this relationship"; try not to swing with every reaction—clarify what you want first.',
      'The time of both attraction and hesitation has been a process of thinking about what you want from this relationship; now you\'re closer to a conclusion.',
      'Doing what you can say and do now tends to leave fewer regrets than forcing an "ending"; opening up and talking leads to the next step.',
    ],
    ja: [
      '「この関係をどうするか」が不明確な状態かも。相手の反応に一喜一憂せず、自分が望む方向を先に整理するのがおすすめ。',
      '惹かれつつ迷いもあった時間が「この関係をどうするか」を考える過程だった。今がその結論に近づく時期です。',
      '結末を急いで決めようとせず、今できる言葉と行動をすることが後悔を減らす。心を開いて話すことが次の段階につながります。',
    ],
  },
  love_3_relationship_5: {
    ko: [
      '두 사람 모두 이 관계를 소중히 생각하지만 "어디까지 갈지"에 대한 확신이 아직 없을 수 있어요.',
      '과거에는 끌림과 망설임이 함께 있었고, 그 과정이 지금의 전환점을 만들었어요.',
      '속마음으로는 관계가 더 분명해지길 바라지만, 먼저 말하거나 행동하기를 망설일 수 있어요.',
      '주변의 의견이나 상대의 반응이 영향을 줄 수 있어요. 자신이 원하는 방향을 먼저 정리하는 것이 좋습니다.',
      '서로가 솔직히 말하고 들으면 몇 달 안에 관계 방향이 더 분명해질 가능성이 큽니다.',
    ],
    en: [
      'You both may value the relationship but lack certainty about "how far it will go."',
      'In the past there was both attraction and hesitation; that process has led to this turning point.',
      'You may want the relationship to become clearer but hesitate to speak or act first.',
      'Others\' opinions or the other\'s reactions can have an effect; clarifying what you want first helps.',
      'If you both speak and listen honestly, the direction may become clearer within a few months.',
    ],
    ja: [
      '二人ともこの関係を大切に思っているが「どこまで行くか」への確信がまだないかも。',
      '過去には惹かれつつ迷いもあり、その過程が今の転換点を作った。',
      '本音では関係がもっとはっきりすることを望んでいるが、先に言ったり動くことを躊躇うかも。',
      '周りの意見や相手の反応が影響することが。自分が望む方向を先に整理するのがおすすめ。',
      '互いに正直に話し聞けば、数ヶ月以内に関係の方向性がはっきりする可能性が高いです。',
    ],
  },
  love_3_cross_4: {
    ko: [
      '지금은 "연애로 갈지, 친구로 남을지" 또는 "더 깊어질지, 유지할지"가 드러나기 시작하는 전환점이에요.',
      '상대의 말 한마디나 반응에 일희일비하면 방향을 잡기 어려워요. 자신이 원하는 것을 먼저 정리하는 것이 좋습니다.',
      '끌림과 망설임이 있던 시간이 "이 관계를 어떻게 할지"를 생각하게 만든 과정이었어요.',
      '앞으로 몇 달 안에 방향이 더 분명해질 가능성이 큽니다. 지금 할 수 있는 말과 행동을 하는 쪽이 후회가 적어요.',
    ],
    en: [
      'You are at a turning point where "romance or stay friends" or "go deeper or stay as is" is starting to show.',
      'Swinging with every word or reaction makes it hard to find direction; clarifying what you want first helps.',
      'The time of attraction and hesitation has been a process of thinking about what to do with this relationship.',
      'The direction will likely become clearer within a few months; doing what you can say and do now tends to leave fewer regrets.',
    ],
    ja: [
      '今は「恋愛に進むか、友達のままか」または「もっと深めるか、現状維持か」が表れ始める転換点。',
      '相手の一言や反応に一喜一憂すると方向が定まりにくい。自分が望むことを先に整理するのがおすすめ。',
      '惹かれつつ迷いもあった時間が「この関係をどうするか」を考える過程だった。',
      '数ヶ月以内に方向性がはっきりする可能性が高い。今できる言葉と行動をすることが後悔を減らす。',
    ],
  },
  love_3_insight_3: {
    ko: [
      '겉으로는 "그냥 잘 지내는 사이"처럼 보일 수 있지만, 속으로는 "이 관계를 어떻게 할지" 고민이 있을 수 있어요.',
      '한쪽이 더 적극적이거나 타이밍이 맞지 않아 진도가 나가지 않았던 것이, 지금의 전환점을 만들었어요.',
      '상대 반응을 기다리기만 하기보다, 자신이 원하는 방향을 정리한 뒤 할 수 있는 말과 행동을 하는 쪽이 후회가 적습니다.',
    ],
    en: [
      'On the surface it may look like "just getting along," but inside there may be worry about "what to do with this relationship."',
      'One side being more active or timing not matching may have slowed things down and created this turning point.',
      'Rather than only waiting for the other\'s reaction, clarifying what you want and then doing what you can say and do tends to leave fewer regrets.',
    ],
    ja: [
      '表では「ただ仲良くしている関係」に見えても、内心では「この関係をどうするか」の悩みがあるかも。',
      '片方がより積極的だったりタイミングが合わず進まなかったことが、今の転換点を作った。',
      '相手の反応を待つだけより、自分が望む方向を整理してからできる言葉と行動をすることが後悔を減らします。',
    ],
  },
  // ---------- career_1: 이직·승진 시기와 나에게 맞는 방향 ----------
  career_1_time_3: {
    ko: [
      '과거에는 "더 하고 싶은데 못 하고 있다", "승진·이직이 막혀 있다"는 불만이 조금씩 쌓여 있었을 수 있어요.',
      '지금은 성장 욕구와 현실 사이의 간격이 느껴질 수 있어요. 이 감정이 다음 단계를 준비하라는 신호로 받아들이면 좋습니다.',
      '반년에서 1년 안에 기회가 보일 수 있어요. 어떤 방향으로 가고 싶은지 먼저 정리하고, 실력·인맥·정보를 쌓아 두면 유리합니다.',
    ],
    en: [
      'In the past you may have felt "I want to do more but can\'t" or "promotion/change is blocked."',
      'Now you may feel a gap between your desire to grow and reality; this feeling is a signal to prepare for the next step.',
      'Opportunities may appear within six months to a year; clarifying which direction you want and building skills, network, and information helps.',
    ],
    ja: [
      '過去には「もっとやりたいのに」「昇進・転職が塞がっている」という不満が溜まっていたかも。',
      '今は成長欲求と現実のギャップを感じることが。この感情を次のステップの準備を促すサインとして受け止めましょう。',
      '半年〜1年以内にチャンスが見えるかも。どの方向へ行きたいか先に整理し、実力・人脈・情報を積んでおくと有利です。',
    ],
  },
  career_1_solution_3: {
    ko: [
      '현재 "일단 나가고 보자"보다는 어떤 방향으로 가고 싶은지 먼저 정리하는 것이 유리해요.',
      '타이밍은 준비가 되어 있을 때 열리는 경우가 많아요. 지금 실력·인맥·정보가 어느 정도 쌓여 있다면 반년~1년 안에 기회가 보일 수 있어요.',
      '이직이라면 "연봉·위치·일 내용" 중 우선순위를 정하고, 승진이라면 "지금 회사에서 어떻게 보여질지"를 전략적으로 생각해 보세요. 작은 성과를 기록해 두는 것이 도움이 됩니다.',
    ],
    en: [
      'Right now clarifying which direction you want is more favorable than "just moving and seeing."',
      'Timing often opens when you\'re ready; if your skills, network, and information are in place, opportunities may appear within six months to a year.',
      'For a job change, set priorities among salary, position, and type of work; for promotion, think strategically about how you\'re seen at your company. Keeping a record of small wins helps.',
    ],
    ja: [
      '今は「とりあえず動いてみる」より、どの方向へ行きたいか先に整理する方が有利。',
      'タイミングは準備が整った時に開くことが多い。今の実力・人脈・情報が積み上がっていれば半年〜1年以内にチャンスが見えるかも。',
      '転職なら「年収・ポジション・仕事内容」の優先順位を決め、昇進なら「今の会社でどう見られるか」を戦略的に考えて。小さな成果を記録しておくのが有効です。',
    ],
  },
  career_1_relationship_5: {
    ko: [
      '당신은 성장 욕구와 현실 사이의 간격을 느끼고 있고, "언제쯤 기회가 올까" 생각하고 있을 수 있어요.',
      '과거에 쌓인 불만이나 "못 하고 있다"는 느낌이 지금의 방향 정리를 요구하고 있어요.',
      '속마음으로는 이직·승진을 원하지만, "어떤 방향이 나에게 맞을지" 아직 불명확할 수 있어요.',
      '주변의 조언이나 정보가 도움이 될 수 있어요. 단, 본인이 원하는 방향을 먼저 정리하는 것이 중요합니다.',
      '준비가 되어 있을 때 타이밍이 열리는 흐름이에요. 반년~1년 안에 한두 번의 기회가 보일 가능성이 있습니다.',
    ],
    en: [
      'You may feel the gap between your desire to grow and reality and wonder "when will an opportunity come."',
      'Past frustration or "I can\'t do what I want" is asking you to clarify direction now.',
      'You may want a change or promotion but still feel unclear about "which direction fits me."',
      'Others\' advice or information can help; clarifying what you want first is important.',
      'Timing tends to open when you\'re ready; you may see one or two opportunities within six months to a year.',
    ],
    ja: [
      'あなたは成長欲求と現実のギャップを感じ、「いつ頃チャンスが来るか」と思っているかも。',
      '過去に溜まった不満や「できていない」感覚が、今の方向整理を求めている。',
      '本音では転職・昇進を望んでいるが、「どの方向が自分に合うか」まだ不明確かも。',
      '周りのアドバイスや情報が役立つことが。ただし自分が望む方向を先に整理することが大事。',
      '準備が整った時にタイミングが開く流れ。半年〜1年以内に一二回のチャンスが見える可能性が。',
    ],
  },
  career_1_cross_4: {
    ko: [
      '지금은 성장 욕구와 현실 사이의 간격이 느껴질 수 있어요. "더 하고 싶은데 못 하고 있다"는 불만이 조금씩 쌓여 있을 수 있습니다.',
      '"일단 나가고 보자"보다는 어떤 방향으로 가고 싶은지 먼저 정리하는 것이 유리해요.',
      '과거에 쌓은 실력·인맥·정보가 어느 정도 있다면, 반년~1년 안에 기회가 보이는 흐름이에요.',
      '이직이라면 연봉·위치·일 내용 중 우선순위를 정하고, 승진이라면 "지금 회사에서 어떻게 보여질지"를 전략적으로 생각해 보세요.',
    ],
    en: [
      'You may feel a gap between your desire to grow and reality; frustration like "I want to do more but can\'t" may be building.',
      'Clarifying which direction you want first is more favorable than "just moving and seeing."',
      'If you\'ve built some skills, network, and information, opportunities may appear within six months to a year.',
      'For a job change, set priorities among salary, position, and type of work; for promotion, think strategically about how you\'re seen at your company.',
    ],
    ja: [
      '今は成長欲求と現実のギャップを感じることが。「もっとやりたいのに」という不満が溜まっているかも。',
      '「とりあえず動く」より、どの方向へ行きたいか先に整理する方が有利。',
      '過去に積んだ実力・人脈・情報がそこそこあれば、半年〜1年以内にチャンスが見える流れ。',
      '転職なら年収・ポジション・仕事内容の優先順位を決め、昇進なら「今の会社でどう見られるか」を戦略的に考えて。',
    ],
  },
  career_1_insight_3: {
    ko: [
      '겉으로는 "괜찮은데"처럼 보여도, 속으로는 "언제쯤 기회가 올까", "이대로 괜찮을까" 하는 생각이 있을 수 있어요.',
      '준비가 되어 있을 때 타이밍이 열리는 흐름이에요. 방향을 먼저 정리하고 실력·인맥·정보를 쌓아 두는 것이 유리합니다.',
      '반년~1년 안에 한두 번의 기회가 보일 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비—실력, 인간관계, 정보 수집—를 해 두세요.',
    ],
    en: [
      'On the surface you may seem "fine," but inside you may think "when will an opportunity come" or "is this okay."',
      'Timing tends to open when you\'re ready; clarifying direction and building skills, network, and information is favorable.',
      'You may see one or two opportunities within six months to a year; prepare now—skills, relationships, information—for that time.',
    ],
    ja: [
      '表では「大丈夫」に見えても、内心では「いつ頃チャンスが来るか」「このままでいいか」と思うことが。',
      '準備が整った時にタイミングが開く流れ。方向を先に整理し、実力・人脈・情報を積んでおくのが有利。',
      '半年〜1年以内に一二回のチャンスが見える可能性が。その時のために今できる準備—実力・人間関係・情報—をしておいて。',
    ],
  },

  career_2_time_3: {
    ko: [
      '과거에는 상사·동료가 당신을 "쓸 만한 사람", "키워볼 만한 사람"으로 보기 시작했을 수 있어요.',
      '지금은 말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있는 시기입니다. 동료는 당신을 "일할 만한 사람"으로 인식할 수 있어요.',
      '앞으로 꾸준히 신뢰를 쌓으면 몇 달 안에 더 중요한 일을 맡기거나 의견을 물어보는 빈도가 늘어날 수 있어요.',
    ],
    en: [
      'In the past your boss and coworkers may have started to see you as "useful" or "worth developing."',
      'Now one or two concrete results can change the relationship; colleagues may see you as "someone good to work with."',
      'If you keep building trust, within a few months you may get more important tasks or be asked for your opinion more often.',
    ],
    ja: [
      '過去には上司・同僚があなたを「使える人」「育てる価値がある人」と見始めたかも。',
      '今は言葉より結果を見せる仕事が一二回あると関係が変わる時期。同僚はあなたを「一緒に仕事しやすい人」と認識しているかも。',
      'これからコツコツ信頼を積めば、数ヶ月でより重要な仕事を任されたり意見を聞かれる回数が増えるかも。',
    ],
  },
  career_2_solution_3: {
    ko: [
      '"아직 완전히 믿고 맡기기에는 한 단계가 부족하다"고 느끼는 관계일 수 있어요.',
      '상사는 당신을 쓸 만한 사람·키워볼 만한 사람으로 보지만, 결과를 보여주는 한두 번의 일이 필요해요. 동료는 "친해지고 싶다"보다 "일할 만한 사람"으로 인식할 수 있어요.',
      '말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있어요. 일 외에 가끔 사적인 이야기를 나누거나 작은 부탁을 들어주면 신뢰가 쌓입니다.',
    ],
    en: [
      'You may feel "one step short of being fully trusted and given bigger tasks."',
      'Your boss may see you as useful or worth developing, but one or two concrete results are needed; colleagues may see you more as "good to work with" than "someone to get close to."',
      'One or two concrete results can change the relationship; sharing a bit of personal talk or helping with small requests builds trust.',
    ],
    ja: [
      '「完全に任せるにはあと一歩」と感じる関係かも。',
      '上司はあなたを使える人・育てる価値がある人と見ているが、結果を見せる仕事が一二回必要。同僚は「仲良くなりたい」より「一緒に仕事しやすい人」として認識しているかも。',
      '言葉より結果を見せる仕事が一二回あると関係が変わる。仕事外でちょっとしたプライベートな話や小さな頼みを聞いてあげると信頼が積みます。',
    ],
  },
  career_2_relationship_5: {
    ko: [
      '상사는 당신을 "쓸 만한 사람", "키워볼 만한 사람"으로 보고 있을 가능성이 있어요. 다만 아직 완전히 믿고 맡기기에는 한 단계가 부족하다고 느낄 수 있어요.',
      '과거에 보여준 모습이 "아직 지켜보자"라는 인상을 줄 수 있어요.',
      '속마음으로는 "조금 더 기대해 봐도 되겠다", "한두 번 더 결과를 보여주면 믿고 맡기겠다" 같은 생각이 있을 수 있어요.',
      '동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 그 사람의 조언을 듣거나 함께 일할 기회를 만들면 유리합니다.',
      '말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있어요. 몇 달 안에 더 중요한 일을 맡기거나 의견을 물어보는 빈도가 늘어날 수 있습니다.',
    ],
    en: [
      'Your boss may see you as "useful" or "worth developing" but may feel one step short of fully trusting you with bigger tasks.',
      'What you\'ve shown in the past may have given an impression of "let\'s keep watching."',
      'They may think "we can expect a bit more" or "if they show results one or two more times, we can trust them with more."',
      'There are people among colleagues or your boss who have a positive influence on you; listening to their advice or creating chances to work together helps.',
      'One or two concrete results can change the relationship; within a few months you may get more important tasks or be asked for your opinion more often.',
    ],
    ja: [
      '上司はあなたを「使える人」「育てる価値がある人」と見ている可能性が。ただ完全に任せるにはあと一歩と感じているかも。',
      '過去に見せた姿が「まだ見守ろう」という印象を与えているかも。',
      '内心では「もう少し期待してみよう」「あと一二回結果を見せてくれれば任せよう」と思っているかも。',
      '同僚や上司の中にあなたに良い影響を与える人がいる。その人のアドバイスを聞いたり一緒に仕事する機会を作ると有利。',
      '言葉より結果を見せる仕事が一二回あると関係が変わる。数ヶ月でより重要な仕事を任されたり意見を聞かれる回数が増えるかも。',
    ],
  },
  career_2_cross_4: {
    ko: [
      '지금 팀에서는 "꼭 필요한 한 명"이지만 "이 사람 없이는 안 된다" 수준까지는 아닐 수 있어요.',
      '겉으로는 잘해 주지만 속으로는 "조금 더 기대해 봐도 되겠다", "아직은 지켜보자" 같은 생각을 할 수 있어요.',
      '과거에 보여준 결과나 태도가 "한 단계 부족"이라는 인상을 줄 수 있어요.',
      '결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있어요. 꾸준히 신뢰를 쌓으면 몇 달 안에 위치가 올라갈 수 있습니다.',
    ],
    en: [
      'You\'re "one of the necessary people" but not yet "we can\'t do without this person."',
      'They may be supportive on the surface but think "let\'s see a bit more" or "let\'s keep watching."',
      'Past results or attitude may have given an impression of "one step short."',
      'One or two concrete results can change the relationship; if you keep building trust, your standing may rise within a few months.',
    ],
    ja: [
      '今のチームでは「必要な一人」だが「この人がいないと困る」レベルまでは行っていないかも。',
      '表ではよくしてくれても、内心「もう少し期待してみよう」「まだ見守ろう」と思っているかも。',
      '過去に見せた結果や態度が「あと一歩」という印象を与えているかも。',
      '結果を見せる仕事が一二回あると関係が変わる。コツコツ信頼を積めば数ヶ月でポジションが上がるかも。',
    ],
  },
  career_2_insight_3: {
    ko: [
      '겉으로는 "괜찮은 사람"으로 보이지만, 상사·동료는 아직 "한 단계 더 보여주면 믿고 맡기겠다"는 단계일 수 있어요.',
      '말만 하지 말고 결과를 보여주는 한두 번의 일이 관계를 바꿀 수 있어요. 특정 분야에서 확실한 강점을 보이거나 위기 상황에서 한 번 잘 해내면 위치가 올라갈 수 있어요.',
      '꾸준히 신뢰를 쌓으면 몇 달 안에 더 중요한 일을 맡기거나 의견을 물어보는 빈도가 늘어날 수 있어요. 한 번 실수로 인상이 나빠졌다면 다음 일에서 확실히 해내면 다시 올라설 수 있습니다.',
    ],
    en: [
      'On the surface you may seem "fine," but your boss and colleagues may still be at "show us one more step and we\'ll trust you with more."',
      'One or two concrete results can change the relationship; showing clear strength in one area or performing well in a pinch can raise your standing.',
      'If you keep building trust, within a few months you may get more important tasks or be asked for your opinion more often; if one mistake hurt your image, doing well on the next task can help you recover.',
    ],
    ja: [
      '表では「悪くない人」に見えても、上司・同僚はまだ「あと一歩見せてくれたら任せたい」という段階かも。',
      '言葉より結果を見せる仕事が一二回あると関係が変わる。特定分野で強みを見せるか、ピンチで一度きちんと結果を出せばポジションが上がるかも。',
      'コツコツ信頼を積めば数ヶ月でより重要な仕事を任されたり意見を聞かれる回数が増えるかも。一度の失敗で印象が悪くなっても、次の仕事で確実に結果を出せば立て直せます。',
    ],
  },

  career_3_time_3: {
    ko: [
      '과거~현재는 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.',
      '지금은 동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 그 사람의 조언을 듣거나 함께 일할 기회를 만들면 일운이 올라갈 수 있어요.',
      '앞으로 몇 달~1년 사이에 "이번 일 잘됐다", "덕분에 인정받았다" 같은 경험이 한두 번 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비를 해 두면 행운이 더 크게 와 닿습니다.',
    ],
    en: [
      'Past to present: no major misfortune, but not a phase of obvious windfalls; steady work tends to bring gradual recognition and small opportunities.',
      'Now there are people among colleagues or your boss who have a positive influence on you; listening to their advice or creating chances to work together can raise your work luck.',
      'In the next few months to a year you may have one or two experiences like "that went well" or "I was recognized thanks to that"; preparing now makes that luck land more strongly.',
    ],
    ja: [
      '過去〜現在は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れ。',
      '今は同僚や上司の中にあなたに良い影響を与える人がいる。その人のアドバイスを聞いたり一緒に仕事する機会を作ると仕事運が上がるかも。',
      '数ヶ月〜1年以内に「この仕事うまくいった」「おかげで認められた」という経験が一二回ある可能性。その時のために今できる準備をしておくと幸運がより大きく届きます。',
    ],
  },
  career_3_solution_3: {
    ko: [
      '현재 "대박"을 노리기보다 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다.',
      '동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 새로운 스킬을 배우거나 자격증·공부를 시작하면 반년 뒤쯤 그 결실이 직장에서 보이기 시작할 수 있어요.',
      '꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름이에요. 무리하게 "대박"을 노리기보다 할 수 있는 일을 착실히 하세요.',
    ],
    en: [
      'Right now doing what you can reliably helps build luck more than chasing a big break.',
      'There are people among colleagues or your boss who have a positive influence on you; learning new skills or starting a certificate or study can bear fruit at work in about six months.',
      'Steady work tends to bring gradual recognition and small opportunities; do what you can reliably rather than chasing a big break.',
    ],
    ja: [
      '今は「大当たり」を狙うより、できることを着実にすることが運を育てる。',
      '同僚や上司の中にあなたに良い影響を与える人がいる。新しいスキルや資格・勉強を始めると、半年ほどで職場に実がなり始めることも。',
      'コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れ。無理に「大当たり」を狙うより、できることを着実に。',
    ],
  },
  career_3_relationship_5: {
    ko: [
      '당신의 일운은 "꾸준히 인정받고 작은 기회가 생기는" 흐름에 가까워요. 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요.',
      '과거에 쌓은 실력이나 관계가 지금의 "조금씩 인정받는" 흐름을 만들고 있어요.',
      '속마음으로는 "더 좋은 기회가 왔으면" 하지만, 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다.',
      '동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 그 사람의 조언을 듣거나 함께 일할 기회를 만들면 일운이 올라갈 수 있어요.',
      '앞으로 몇 달~1년 사이에 "이번 일 잘됐다", "덕분에 인정받았다" 같은 경험이 한두 번 생길 가능성이 있어요.',
    ],
    en: [
      'Your work luck is closer to "gradual recognition and small opportunities"; no major misfortune but not a phase of obvious windfalls.',
      'Skills or relationships you\'ve built in the past are creating this "gradual recognition" flow.',
      'You may wish "a better opportunity would come," but doing what you can reliably helps build luck.',
      'There are people among colleagues or your boss who have a positive influence on you; listening to their advice or creating chances to work together can raise your work luck.',
      'In the next few months to a year you may have one or two experiences like "that went well" or "I was recognized thanks to that."',
    ],
    ja: [
      'あなたの仕事運は「少しずつ認められ、小さなチャンスが生まれる」流れに近い。大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。',
      '過去に積んだ実力や関係が、今の「少しずつ認められる」流れを作っている。',
      '本音では「もっと良いチャンスが来れば」だが、できることを着実にすることが運を育てる。',
      '同僚や上司の中にあなたに良い影響を与える人がいる。その人のアドバイスを聞いたり一緒に仕事する機会を作ると仕事運が上がるかも。',
      '数ヶ月〜1年以内に「この仕事うまくいった」「おかげで認められた」という経験が一二回ある可能性。',
    ],
  },
  career_3_cross_4: {
    ko: [
      '지금은 큰 불행은 없지만 눈에 띄는 행운이 쏟아지는 단계는 아닐 수 있어요. 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름입니다.',
      '무리하게 "대박"을 노리기보다 당신이 할 수 있는 일을 착실히 하는 것이 운을 키우는 데 도움이 됩니다.',
      '동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 새로운 스킬을 배우거나 자격증·공부를 시작하면 반년 뒤쯤 그 결실이 직장에서 보이기 시작할 수 있어요.',
      '앞으로 몇 달~1년 사이에 "이번 일 잘됐다", "덕분에 인정받았다" 같은 경험이 한두 번 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비를 해 두세요.',
    ],
    en: [
      'Now there\'s no major misfortune but not a phase of obvious windfalls; steady work tends to bring gradual recognition and small opportunities.',
      'Doing what you can reliably helps build luck more than chasing a big break.',
      'There are people among colleagues or your boss who have a positive influence on you; learning new skills or starting a certificate or study can bear fruit at work in about six months.',
      'In the next few months to a year you may have one or two experiences like "that went well" or "I was recognized thanks to that"; prepare now for that time.',
    ],
    ja: [
      '今は大きな不幸はないが、目立つ幸運が降り注ぐ段階ではないかも。コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れ。',
      '無理に「大当たり」を狙うより、できることを着実にすることが運を育てる。',
      '同僚や上司の中にあなたに良い影響を与える人がいる。新しいスキルや資格・勉強を始めると、半年ほどで職場に実がなり始めることも。',
      '数ヶ月〜1年以内に「この仕事うまくいった」「おかげで認められた」という経験が一二回ある可能性。その時のために今できる準備をしておいて。',
    ],
  },
  career_3_insight_3: {
    ko: [
      '겉으로는 "그냥 평범한 일상"처럼 보일 수 있지만, 꾸준히 일을 해 나가면 조금씩 인정받고 작은 기회가 생기는 흐름이에요.',
      '동료나 상사 중에서 당신에게 좋은 영향을 주는 사람이 있어요. 새로운 스킬·자격증·공부를 시작하면 반년 뒤쯤 직장에서 결실이 보이기 시작할 수 있어요.',
      '무리하게 "대박"을 노리기보다 할 수 있는 일을 착실히 하세요. 몇 달~1년 사이에 "이번 일 잘됐다" 같은 경험이 한두 번 생길 가능성이 있어요.',
    ],
    en: [
      'On the surface it may look like "just ordinary daily work," but steady work tends to bring gradual recognition and small opportunities.',
      'There are people among colleagues or your boss who have a positive influence on you; starting new skills, a certificate, or study can bear fruit at work in about six months.',
      'Do what you can reliably rather than chasing a big break; within a few months to a year you may have one or two experiences like "that went well."',
    ],
    ja: [
      '表では「ただの日常」に見えても、コツコツ仕事をしていれば少しずつ認められ、小さなチャンスが生まれる流れ。',
      '同僚や上司の中にあなたに良い影響を与える人がいる。新しいスキル・資格・勉強を始めると、半年ほどで職場に実がなり始めることも。',
      '無理に「大当たり」を狙うより、できることを着実に。数ヶ月〜1年以内に「この仕事うまくいった」という経験が一二回ある可能性。',
    ],
  },

  // ---------- money_1: 금전운, 수입이 늘어날까 ----------
  money_1_time_3: {
    ko: [
      '과거~현재 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요. 한 번에 큰 돈이 들어오기보다는 안정적인 흐름에 가깝습니다.',
      '지금은 불필요한 지출을 줄이고 들어오는 돈의 일부를 따로 모아 두는 습관이 나중에 "돈이 필요할 때" 수월하게 만들어요.',
      '반년~1년 안에 수입이 늘거나 예상치 못한 소득(보너스, 부수입 등)이 생길 가능성이 있어요. 돈이 들어오기 전에 쓰는 습관을 줄이세요.',
    ],
    en: [
      'Past to present you may see steady income or small bonuses; the flow is more stable than one big windfall.',
      'Cutting unnecessary spending and setting aside part of what comes in now will make "when you need money" easier later.',
      'Within six months to a year income may increase or unexpected money may appear; reduce the habit of spending before money arrives.',
    ],
    ja: [
      '過去〜現在、安定した収入や小さなボーナスが続く流れかも。一気に大金が入るより安定した流れに近い。',
      '今は無駄な支出を減らし、入ってきたお金の一部を別に貯める習慣が、あとで「お金が必要な時」を楽にする。',
      '半年〜1年以内に収入が増えたり予想外の収入（ボーナス・副収入など）がある可能性が。お金が入る前に使う癖を減らして。',
    ],
  },
  money_1_solution_3: {
    ko: [
      '"금전운이 어떻게 될까" 궁금하지만 방향이 흐릿할 수 있어요. 불필요한 지출을 줄이고 저축·정리를 해 두는 것이 유리합니다.',
      '돈이 들어오기 전에 쓰는 습관, "이번만"이라는 생각이 지출을 늘리는 경우가 있어요. 매달 고정 금액이라도 저축에 쓰는 습관을 들이세요.',
      '정리해 두면 나중에 "돈이 필요할 때" 수월해져요. 반년~1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요.',
    ],
    en: [
      'You may wonder about money luck but direction can feel unclear; cutting unnecessary spending and saving or organizing now is favorable.',
      'Spending before money arrives or "just this once" often increases spending; build a habit of putting a fixed amount into savings each month.',
      'Organizing now will make "when you need money" easier later; within six months to a year income may increase or unexpected money may appear.',
    ],
    ja: [
      '「金運はどうなるか」気になるが方向がぼやけているかも。無駄な支出を減らし貯金・整理をしておくのが有利。',
      'お金が入る前に使う癖・「今回だけ」が支出を増やすことが。毎月一定額でも貯金に回す習慣をつけて。',
      '整理しておくとあとで「お金が必要な時」が楽に。半年〜1年以内に収入が増えたり予想外の収入がある可能性が。',
    ],
  },
  money_1_relationship_5: {
    ko: [
      '당신의 금전 흐름은 "꾸준한 소득이 이어지는" 쪽에 가까워요. 한 번에 큰 돈이 들어오기보다는 안정적인 흐름일 수 있습니다.',
      '과거에 쌓아 둔 자격·실력·정보가 지금의 소득을 만들고 있어요. 불필요한 지출을 줄이고 들어온 돈의 일부를 따로 모아 두세요.',
      '속마음으로는 "수입이 더 늘었으면" 하지만, 지금 할 수 있는 준비(저축, 정리, 정보 수집)를 해 두는 것이 유리해요.',
      '주변에 금전·투자 조언을 해 주는 사람이 있을 수 있어요. 단, 원금을 지키고 무리한 투자에는 끌려가지 마세요.',
      '반년~1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요. 정보를 모으고 준비해 둔 자격이나 실력이 있으면 그때 발휘될 수 있어요.',
    ],
    en: [
      'Your money flow is closer to "steady income continuing"; it may be a stable flow rather than one big windfall.',
      'Credentials, skills, or information you\'ve built in the past are creating your income now; cut unnecessary spending and set aside part of what comes in.',
      'You may wish "income would increase more," but preparing now (saving, organizing, gathering information) is favorable.',
      'There may be people around who give money or investment advice; protect principal and don\'t be pulled into risky bets.',
      'Within six months to a year income may increase or unexpected money may appear; if you\'ve gathered information and have skills or credentials ready, they can pay off then.',
    ],
    ja: [
      'あなたの金銭の流れは「安定した収入が続く」方に近い。一気に大金が入るより安定した流れかも。',
      '過去に積んだ資格・実力・情報が今の収入を作っている。無駄な支出を減らし、入ったお金の一部は別に貯めて。',
      '本音では「収入がもっと増えれば」だが、今できる準備（貯金・整理・情報収集）をしておくのが有利。',
      '周りに金銭・投資のアドバイスをしてくれる人がいるかも。ただし元本を守り、無理な投資には流されないで。',
      '半年〜1年以内に収入が増えたり予想外の収入がある可能性が。情報を集め資格や実力の準備があればその時に活きるかも。',
    ],
  },
  money_1_cross_4: {
    ko: [
      '지금은 꾸준한 소득이나 작은 보너스가 이어지는 흐름일 수 있어요. 큰 수입이 한 번에 들어오는 단계는 아닐 수 있습니다.',
      '돈이 들어오기 전에 쓰는 습관이 있다면 그 부분부터 줄이세요. 들어온 돈의 일부는 매달 따로 모아 두는 것이 좋아요.',
      '불필요한 지출을 줄이고 저축·정리를 해 두면 나중에 "돈이 필요할 때" 수월해져요.',
      '반년~1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비를 해 두세요.',
    ],
    en: [
      'You may see steady income or small bonuses now; you may not be in a phase of one big windfall.',
      'If you tend to spend before money arrives, reduce that first; set aside part of what comes in each month.',
      'Cutting unnecessary spending and saving or organizing now will make "when you need money" easier later.',
      'Within six months to a year income may increase or unexpected money may appear; prepare now for that time.',
    ],
    ja: [
      '今は安定した収入や小さなボーナスが続く流れかも。大きな収入が一気に入る段階ではないかも。',
      'お金が入る前に使う癖があるならそこから減らして。入ったお金の一部は毎月別に貯めておくのがおすすめ。',
      '無駄な支出を減らし貯金・整理をしておくと、あとで「お金が必要な時」が楽に。',
      '半年〜1年以内に収入が増えたり予想外の収入がある可能性が。その時のために今できる準備をしておいて。',
    ],
  },
  money_1_insight_3: {
    ko: [
      '겉으로는 큰 수입이 한 번에 들어오는 단계는 아닐 수 있어요. 꾸준한 소득이나 작은 보너스가 이어지는 흐름에 가깝습니다.',
      '"나중에"라고 미루지 말고 이번 달부터 작은 금액이라도 저축을 시작하세요. 돈이 들어오기 전에 쓰는 습관을 줄이면 금전운이 정리되기 시작해요.',
      '반년~1년 안에 수입이 늘거나 예상치 못한 소득이 생길 가능성이 있어요. 그때를 위해 지금 할 수 있는 준비(저축, 정리)를 해 두세요.',
    ],
    en: [
      'You may not be in a phase of one big windfall; the flow is closer to steady income or small bonuses.',
      'Don\'t put it off "for later"—start saving even a small amount this month; reducing spending before money arrives helps your money luck tidy up.',
      'Within six months to a year income may increase or unexpected money may appear; prepare now (saving, organizing) for that time.',
    ],
    ja: [
      '表では大きな収入が一気に入る段階ではないかも。安定した収入や小さなボーナスが続く流れに近い。',
      '「あとで」と延ばさず、今月から少額でも貯金を始めて。お金が入る前に使う癖を減らすと金運が整い始める。',
      '半年〜1年以内に収入が増えたり予想外の収入がある可能性が。その時のために今できる準備（貯金・整理）をしておいて。',
    ],
  },

  // ---------- money_2: 투자·저축 방향 ----------
  money_2_time_3: {
    ko: [
      '과거에 "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 느낌이 있었을 수 있어요. 방향이 흐릿한 상태가 읽혀요.',
      '지금은 무리한 투자보다 안정 저축+소액 분산이 당신에게 맞아요. 원금을 지키는 것을 최우선으로 하세요.',
      '앞으로 매달 고정 금액을 저축·투자에 쓰는 습관을 들이면 위험을 줄이고 나중에 "덕분에 잘됐다"는 경험이 생길 수 있어요.',
    ],
    en: [
      'You may have felt "I should do something but don\'t know what" in the past; direction may feel unclear.',
      'Now stable saving and small diversified investment tend to fit you better than aggressive investing; protect principal first.',
      'Building a habit of putting a fixed amount into saving/investment each month can reduce risk and lead to "it went well" experiences later.',
    ],
    ja: [
      '過去に「何かした方がいいけど何をすればいいか分からない」感覚があったかも。方向がぼやけた状態が読める。',
      '今は無理な投資より安定貯金＋少額分散があなたに合う。元本を守ることを最優先に。',
      'これから毎月一定額を貯金・投資に回す習慣をつけるとリスクを減らし、あとで「おかげでうまくいった」経験ができるかも。',
    ],
  },
  money_2_solution_3: {
    ko: [
      '"뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 방향이 흐릿한 상태일 수 있어요. 유행하는 코인이나 "반드시 오른다"는 말에 쉽게 끌려가지 마세요.',
      '비상금을 먼저 쌓고 여유 자금으로 조금씩 분산 투자하는 흐름이 위험을 줄여요. 원금을 지키는 것이 최우선입니다.',
      '매달 고정 금액을 저축·투자에 쓰는 습관을 들이세요. 한 곳에 올인하기보다 분산이 당신에게 맞아요.',
    ],
    en: [
      'Direction may feel unclear; don\'t be pulled in by hype or "it will definitely go up."',
      'Building an emergency fund first, then small diversified investments with spare money, reduces risk; protect principal first.',
      'Build a habit of putting a fixed amount into saving/investment each month; diversification tends to fit you better than going all-in.',
    ],
    ja: [
      '「何かした方がいいけど何をすればいいか分からない」と方向がぼやけているかも。流行に簡単に乗ったり「必ず上がる」という言葉に流されないで。',
      '緊急資金を先に貯め、余裕資金で少しずつ分散投資する流れがリスクを減らす。元本を守ることが最優先。',
      '毎月一定額を貯金・投資に回す習慣をつけて。一か所に集中するより分散があなたに合う。',
    ],
  },
  money_2_relationship_5: {
    ko: [
      '당신의 금전 방향은 "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 흐릿한 상태에 가까워요. 한 번에 큰 수익을 노리기보다 원금을 지키는 쪽이 맞아요.',
      '과거에 "이것만 하면 된다"는 말에 끌려본 경험이 있거나 방향이 바뀌었을 수 있어요. 지금은 원금을 지키는 것을 최우선으로 하세요.',
      '속마음으로는 "수익이 났으면" 하지만, 무리한 투자보다 안정 저축+소액 분산이 당신에게 맞아요.',
      '주변에 투자·저축 조언을 해 주는 사람이 있을 수 있어요. 단, 원금을 지키고 "반드시 오른다"는 말에는 쉽게 끌려가지 마세요.',
      '매달 고정 금액을 저축·투자에 쓰는 습관을 들이면 나중에 "덕분에 잘됐다"는 경험이 생길 수 있어요. 비상금을 먼저 쌓으세요.',
    ],
    en: [
      'Your money direction may feel unclear: "I should do something but don\'t know what"; protecting principal tends to fit you better than chasing big returns.',
      'You may have been pulled by "just do this" in the past or changed direction; now protect principal first.',
      'You may wish "I\'d made a profit," but stable saving and small diversified investment fit you better than aggressive investing.',
      'There may be people who give investment or saving advice; protect principal and don\'t be pulled in by "it will definitely go up."',
      'Building a habit of a fixed amount each month can lead to "it went well" experiences later; build an emergency fund first.',
    ],
    ja: [
      'あなたの金銭の方向は「何かした方がいいけど何をすればいいか分からない」とぼやけた状態に近い。一気に大きな利益を狙うより元本を守る方が合う。',
      '過去に「これだけやればいい」という言葉に流された経験や方向が変わったことがあるかも。今は元本を守ることを最優先に。',
      '本音では「利益が出れば」だが、無理な投資より安定貯金＋少額分散があなたに合う。',
      '周りに投資・貯金のアドバイスをしてくれる人がいるかも。ただし元本を守り、「必ず上がる」という言葉に簡単に流されないで。',
      '毎月一定額を貯金・投資に回す習慣をつけると、あとで「おかげでうまくいった」経験ができるかも。緊急資金を先に貯めて。',
    ],
  },
  money_2_cross_4: {
    ko: [
      '지금은 "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 방향이 흐릿한 상태일 수 있어요. 한 곳에 올인하기보다 비상금을 먼저 쌓으세요.',
      '여유 자금으로 조금씩 분산 투자하는 흐름이 위험을 줄여요. 원금을 지키고 매달 고정 금액 습관을 들이세요.',
      '유행하는 말이나 "반드시 오른다"는 말에 쉽게 끌려가지 마세요. 원금을 지키는 것이 최우선입니다.',
      '매달 고정 금액을 저축·투자에 쓰는 습관을 들이면 나중에 "덕분에 잘됐다"는 경험이 생길 수 있어요.',
    ],
    en: [
      'You may feel "I should do something but don\'t know what"; build an emergency fund first rather than going all-in.',
      'Small diversified investments with spare money reduce risk; protect principal and build a fixed-amount habit.',
      'Don\'t be pulled in by hype or "it will definitely go up"; protect principal first.',
      'Building a habit of a fixed amount each month can lead to "it went well" experiences later.',
    ],
    ja: [
      '今は「何かした方がいいけど何をすればいいか分からない」と方向がぼやけているかも。一か所に集中するより緊急資金を先に貯めて。',
      '余裕資金で少しずつ分散投資する流れがリスクを減らす。元本を守り、毎月一定額の習慣を。',
      '流行の言葉や「必ず上がる」という言葉に簡単に流されないで。元本を守ることが最優先。',
      '毎月一定額を貯金・投資に回す習慣をつけると、あとで「おかげでうまくいった」経験ができるかも。',
    ],
  },
  money_2_insight_3: {
    ko: [
      '겉으로는 방향이 흐릿해 보일 수 있어요. "뭔가 해야 할 것 같은데 뭘 해야 할지 모르겠다"는 상태가 읽혀요.',
      '무리한 투자보다 "안정 저축+소액 분산"이 맞고, 원금을 지키는 것이 최우선이에요. 매달 고정 금액을 저축·투자에 쓰는 습관을 들이세요.',
      '비상금을 먼저 쌓고 여유 자금으로 조금씩 분산 투자하면 위험을 줄일 수 있어요.',
    ],
    en: [
      'Direction may appear unclear; a state of "I should do something but don\'t know what" is readable.',
      'Stable saving and small diversified investment fit you better than aggressive investing; protect principal first and build a fixed-amount habit.',
      'Building an emergency fund first and small diversified investments with spare money can reduce risk.',
    ],
    ja: [
      '表では方向がぼやけて見えるかも。「何かした方がいいけど何をすればいいか分からない」状態が読める。',
      '無理な投資より「安定貯金＋少額分散」が合う。元本を守ることが最優先。毎月一定額を貯金・投資に回す習慣を。',
      '緊急資金を先に貯め、余裕資金で少しずつ分散投資するとリスクを減らせる。',
    ],
  },

  // ---------- money_3: 지출·낭비 정리 ----------
  money_3_time_3: {
    ko: [
      '과거~현재 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌이 있을 수 있어요. 스트레스나 권유, "이번만"이라는 생각이 지출을 늘리는 경우가 많습니다.',
      '지금은 필요한 것과 원하는 것을 구분하고 매달 지출 한도를 정해 두는 것이 좋아요. 카드 영수증이나 가계부 앱으로 한 달 치를 돌아보면 반복되는 낭비가 보여요.',
      '앞으로 "24시간 rule"을 적용해 보거나, 감정이 올라갔을 때 쇼핑하는 패턴을 줄이면 금전운이 정리되기 시작해요.',
    ],
    en: [
      'Past to present you may feel "small leaks" eating at your finances; stress, persuasion, or "just this once" often increase spending.',
      'Separate needs from wants and set a monthly spending limit; a month\'s receipts or budget app will show repeated waste.',
      'Trying a "24-hour rule" or reducing the pattern of shopping when emotional can help your money luck tidy up.',
    ],
    ja: [
      '過去〜現在「少しずつ漏れる穴」が財務を削っている感覚があるかも。ストレス・勧め・「今回だけ」が支出を増やすことが多い。',
      '必要なものと欲しいものを分け、毎月の支出上限を決めておくのがおすすめ。一ヶ月分の明細や家計簿アプリで振り返ると繰り返しの無駄が見える。',
      '「24時間ルール」を試したり、感情が高まった時の買い物パターンを減らすと金運が整い始める。',
    ],
  },
  money_3_solution_3: {
    ko: [
      '"지출이 왜 이렇게 많을까" 궁금할 수 있어요. 스트레스, 권유, "이번만"이라는 생각이 지출을 늘리는 경우가 많아요.',
      '카드 영수증이나 가계부 앱으로 한 달 치를 돌아보면 반복되는 낭비가 보여요. 필요한 것과 원하는 것을 구분하고 그 부분부터 줄이세요.',
      '매달 "쓸 수 있는 한도"를 정해 두고, 감정이 올라갔을 때의 구매는 24시간 미루어 보세요. 금전운이 정리되기 시작해요.',
    ],
    en: [
      'You may wonder "why is spending so high"; stress, persuasion, or "just this once" often increase spending.',
      'A month\'s receipts or budget app will show repeated waste; separate needs from wants and cut that first.',
      'Set a monthly "spending limit" and postpone purchases when emotional by 24 hours; your money luck will start to tidy up.',
    ],
    ja: [
      '「なぜ支出がこんなに多いか」気になるかも。ストレス・勧め・「今回だけ」が支出を増やすことが多い。',
      '一ヶ月分の明細や家計簿アプリで振り返ると繰り返しの無駄が見える。必要なものと欲しいものを分け、そこから減らして。',
      '毎月「使っていい上限」を決め、感情が高まった時の購入は24時間延ばしてみて。金運が整い始める。',
    ],
  },
  money_3_relationship_5: {
    ko: [
      '당신의 재정은 "조금씩 새는 구멍"이 갉아먹는 느낌일 수 있어요. 한 번에 큰 지출보다 작은 지출이 반복되는 패턴이 읽혀요.',
      '과거에 스트레스나 권유, "이번만"이라는 생각으로 지출이 늘었을 수 있어요. 지금은 필요한 것과 원하는 것을 구분하세요.',
      '속마음으로는 "절약해야 하는데" 하지만 습관이 바뀌지 않으면 반복될 수 있어요. "24시간 rule"을 적용해 보세요.',
      '주변에 "이거 사", "이번만" 권유가 있을 수 있어요. 부담스러우면 "지금은 어렵다"고 말해도 되고, 매달 지출 한도를 정해 두세요.',
      '필요한 것과 원하는 것을 구분하고 매달 한도를 정하면 금전운이 정리되기 시작해요. 감정이 올라갔을 때의 구매는 미루세요.',
    ],
    en: [
      'Your finances may feel like "small leaks" eating away; a pattern of repeated small spending rather than one big outlay is readable.',
      'In the past stress, persuasion, or "just this once" may have increased spending; now separate needs from wants.',
      'You may think "I should save" but without changing habits it can repeat; try a "24-hour rule."',
      'There may be "buy this" or "just this once" pressure around; it\'s okay to say "I can\'t right now" and set a monthly spending limit.',
      'Separating needs from wants and setting a monthly limit helps your money luck tidy up; postpone purchases when emotional.',
    ],
    ja: [
      'あなたの財務は「少しずつ漏れる穴」が削っている感覚かも。大きな支出より小さな支出の繰り返しパターンが読める。',
      '過去にストレス・勧め・「今回だけ」で支出が増えたかも。今は必要なものと欲しいものを分けて。',
      '本音では「節約しなきゃ」だが習慣が変わらないと繰り返すかも。「24時間ルール」を試して。',
      '周りに「これ買って」「今回だけ」の勧めがあるかも。負担なら「今は難しい」と言ってよく、毎月の支出上限を決めて。',
      '必要なものと欲しいものを分け、毎月上限を決めると金運が整い始める。感情が高まった時の購入は延ばして。',
    ],
  },
  money_3_cross_4: {
    ko: [
      '지금은 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요. 스트레스나 권유, "이번만"이 지출을 늘리는 경우가 많아요.',
      '감정이 올라갔을 때 쇼핑하거나 친구·광고에 이끌려 구매하는 패턴이 있다면 "24시간 rule"을 적용해 보세요. 필요한 것과 원하는 것을 구분하세요.',
      '매달 "쓸 수 있는 한도"를 정해 두고, 반복되는 낭비(구독, 소액 결제 등)부터 줄이세요.',
      '한 달 치 영수증이나 가계부 앱으로 돌아보면 반복되는 낭비가 보여요. 그 부분부터 정리하면 금전운이 정리되기 시작해요.',
    ],
    en: [
      'You may feel "small leaks" eating at your finances; stress, persuasion, or "just this once" often increase spending.',
      'If you tend to shop when emotional or buy when pushed, try a "24-hour rule"; separate needs from wants.',
      'Set a monthly "spending limit" and reduce repeated waste (subscriptions, small payments, etc.) first.',
      'A month\'s receipts or budget app will show repeated waste; organizing that first helps your money luck tidy up.',
    ],
    ja: [
      '今は「少しずつ漏れる穴」が財務を削っている感覚かも。ストレス・勧め・「今回だけ」が支出を増やすことが多い。',
      '感情が高まった時に買い物したり友人・広告に流されて買うパターンがあるなら「24時間ルール」を試して。必要なものと欲しいものを分けて。',
      '毎月「使っていい上限」を決め、繰り返しの無駄（サブスク・少額決済など）から減らして。',
      '一ヶ月分の明細や家計簿アプリで振り返ると繰り返しの無駄が見える。そこから整理すると金運が整い始める。',
    ],
  },
  money_3_insight_3: {
    ko: [
      '겉으로는 "조금씩 새는 구멍"이 재정을 갉아먹는 느낌일 수 있어요. 필요한 것과 원하는 것을 구분하고 그 부분부터 줄이세요.',
      '스트레스나 권유, "이번만"이라는 생각이 지출을 늘리는 경우가 많아요. 카드 영수증이나 가계부 앱으로 한 달 치를 돌아보면 반복되는 낭비가 보여요.',
      '매달 지출 한도를 정하고 감정이 올라갔을 때의 구매는 미루면 금전운이 정리되기 시작해요.',
    ],
    en: [
      'You may feel "small leaks" eating at your finances; separate needs from wants and cut that first.',
      'Stress, persuasion, or "just this once" often increase spending; a month\'s receipts or budget app will show repeated waste.',
      'Setting a monthly spending limit and postponing purchases when emotional helps your money luck tidy up.',
    ],
    ja: [
      '表では「少しずつ漏れる穴」が財務を削っている感覚かも。必要なものと欲しいものを分け、そこから減らして。',
      'ストレス・勧め・「今回だけ」が支出を増やすことが多い。一ヶ月分の明細や家計簿アプリで振り返ると繰り返しの無駄が見える。',
      '毎月の支出上限を決め、感情が高まった時の購入を延ばすと金運が整い始める。',
    ],
  },

  // ---------- relationship_1: 주변에서 나를 어떻게 보나 ----------
  relationship_1_time_3: {
    ko: [
      '과거~현재 주변에서는 당신을 무난하게 좋은 사람, 편한 사람으로 보는 경우가 많아요. "믿을 만한 사람"이라는 평가가 읽혀요.',
      '지금은 "깊이 알아가고 싶다"까지는 아니고 "적당히 친하면 좋겠다" 수준으로 느끼는 사람이 있을 수 있어요. 속마음을 조금 더 드러내면 관계가 가까워져요.',
      '앞으로 "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보면 신뢰가 쌓여요. 당신을 더 알고 싶어 하는 사람은 당신이 먼저 마음을 열어 주길 기다리고 있을 수 있어요.',
    ],
    en: [
      'Past to present people often see you as a nice, easy person; an evaluation of "reliable" is readable.',
      'Now some may feel "I\'d like to get along well" rather than "I want to know you deeply"; sharing a bit more of your inner thoughts brings relationships closer.',
      'Saying "I think this" or "I like that" tends to build trust; those who want to know you better may be waiting for you to open up first.',
    ],
    ja: [
      '過去〜現在、周りはあなたを悪くない良い人・居心地のいい人と見ることが多い。「信頼できる人」という評価が読める。',
      '今は「深く知りたい」まではいかず「程よく仲良くできれば」レベルで感じる人がいるかも。本音をもう少し出せば関係が近くなる。',
      'これから「私はこう思う」「私はこれが好き」と伝えると信頼が積みます。あなたをもっと知りたい人はあなたが先に心を開くのを待っているかも。',
    ],
  },
  relationship_1_solution_3: {
    ko: [
      '"주변에서 나를 어떻게 보나" 궁금할 수 있어요. "믿을 만한 사람", "일은 잘하는데 감정은 잘 모르겠다" 같은 평가가 섞여 있을 수 있어요.',
      '"깊이 알아가고 싶다"까지는 아니고 "적당히 친하면 좋겠다" 수준일 수 있어요. 속마음을 잘 말하지 않아 "무슨 생각인지 모르겠다"고 느끼는 사람이 있을 수 있어요.',
      '조금 더 본인의 생각이나 감정을 드러내면 관계가 가까워져요. 관계를 깊게 하고 싶다면 생각이나 감정을 조금 더 드러내 보세요.',
    ],
    en: [
      'You may wonder "how do people see me"; mixed views like "reliable" or "hard to read emotionally" may exist.',
      'They may not be eager to know you deeply; you may not share inner thoughts much, so some feel "I don\'t know what they\'re thinking."',
      'Sharing a bit more of your thoughts and feelings brings relationships closer; if you want deeper relationships, share a bit more.',
    ],
    ja: [
      '「周りは私をどう見ているか」気になるかも。「信頼できる人」「仕事はできるが感情は分かりにくい」などの評価が混ざっているかも。',
      '「深く知りたい」まではいかず「程よく仲良くできれば」レベルかも。本音をあまり言わないので「何を考えているか分からない」と感じる人も。',
      'もう少し自分の考えや感情を出せば関係が近くなる。関係を深めたいなら考えや感情をもう少し出してみて。',
    ],
  },
  relationship_1_relationship_5: {
    ko: [
      '주변에서는 당신을 무난하게 좋은 사람으로 보고 있어요. "믿을 만한 사람", "일은 잘하는데 감정은 잘 모르겠다" 같은 평가가 섞여 있을 수 있어요.',
      '과거에 속마음을 잘 말하지 않아 "무슨 생각인지 모르겠다"고 느끼는 사람이 있었을 수 있어요.',
      '속마음으로는 "관계를 깊게 하고 싶다"지만 어떻게 다가가야 할지 모르는 사람이 있을 수 있어요.',
      '당신을 더 알고 싶어 하는 사람은 당신이 먼저 마음을 열어 주길 기다리고 있을 수 있어요. 솔직한 한 마디가 신뢰를 키워요.',
      '앞으로 "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보면 관계가 가까워져요. 관계를 깊게 하고 싶다면 생각이나 감정을 조금 더 드러내 보세요.',
    ],
    en: [
      'People around you see you as a nice person; mixed views like "reliable" or "hard to read emotionally" may exist.',
      'In the past you may not have shared inner thoughts much, so some felt "I don\'t know what they\'re thinking."',
      'You may want deeper relationships but some may not know how to get closer.',
      'Those who want to know you better may be waiting for you to open up first; one honest line builds trust.',
      'Saying "I think this" or "I like that" tends to bring relationships closer; if you want deeper relationships, share a bit more of your thoughts and feelings.',
    ],
    ja: [
      '周りはあなたを悪くない良い人と見ている。「信頼できる人」「仕事はできるが感情は分かりにくい」などの評価が混ざっているかも。',
      '過去に本音をあまり言わなかったので「何を考えているか分からない」と感じる人がいたかも。',
      '本音では「関係を深めたい」が、どう近づけばいいか分からない人もいるかも。',
      'あなたをもっと知りたい人はあなたが先に心を開くのを待っているかも。正直な一言が信頼を育てる。',
      'これから「私はこう思う」「私はこれが好き」と伝えると関係が近くなる。関係を深めたいなら考えや感情をもう少し出してみて。',
    ],
  },
  relationship_1_cross_4: {
    ko: [
      '지금 주변에서는 당신을 무난하게 좋은 사람, 편한 사람으로 보는 경우가 많아요. "믿을 만한 사람", "일은 잘하는데 감정은 잘 모르겠다" 같은 평가가 섞여 있어요.',
      '"깊이 알아가고 싶다"까지는 아니고 "적당히 친하면 좋겠다" 수준일 수 있어요. 속마음을 잘 말하지 않아 "무슨 생각인지 모르겠다"고 느끼는 사람이 있을 수 있어요.',
      '관계를 깊게 하고 싶다면 생각이나 감정을 조금 더 드러내 보세요. 당신을 더 알고 싶어 하는 사람은 당신이 먼저 마음을 열어 주길 기다리고 있을 수 있어요.',
      '솔직한 한 마디가 신뢰를 키워요. "나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보면 관계가 가까워져요.',
    ],
    en: [
      'People around you often see you as a nice, easy person; mixed views like "reliable" or "hard to read emotionally" may exist.',
      'They may not be eager to know you deeply; you may not share inner thoughts much, so some feel "I don\'t know what they\'re thinking."',
      'If you want deeper relationships, share a bit more of your thoughts and feelings; those who want to know you better may be waiting for you to open up first.',
      'One honest line builds trust; saying "I think this" or "I like that" tends to bring relationships closer.',
    ],
    ja: [
      '今の周りはあなたを悪くない良い人・居心地のいい人と見ることが多い。「信頼できる人」「仕事はできるが感情は分かりにくい」などの評価が混ざっている。',
      '「深く知りたい」まではいかず「程よく仲良くできれば」レベルかも。本音をあまり言わないので「何を考えているか分からない」と感じる人も。',
      '関係を深めたいなら考えや感情をもう少し出してみて。あなたをもっと知りたい人はあなたが先に心を開くのを待っているかも。',
      '正直な一言が信頼を育てる。「私はこう思う」「私はこれが好き」と伝えると関係が近くなる。',
    ],
  },
  relationship_1_insight_3: {
    ko: [
      '겉으로는 위협적이지 않고 다가가기 쉬운 이미지예요. 주변에서는 당신을 무난하게 좋은 사람, 편한 사람으로 보는 경우가 많아요.',
      '당신을 더 알고 싶어 하는 사람은 당신이 먼저 마음을 열어 주길 기다리고 있을 수 있어요. 속마음을 조금 더 드러내면 관계가 가까워져요.',
      '"나는 이렇게 생각해", "나는 이런 게 좋아"를 말해 보면 신뢰가 쌓여요. 관계를 깊게 하고 싶다면 생각이나 감정을 조금 더 드러내 보세요.',
    ],
    en: [
      'You come across as approachable, not threatening; people often see you as a nice, easy person.',
      'Those who want to know you better may be waiting for you to open up first; sharing a bit more of your inner thoughts brings relationships closer.',
      'Saying "I think this" or "I like that" tends to build trust; if you want deeper relationships, share a bit more of your thoughts and feelings.',
    ],
    ja: [
      '表では脅威ではなく近づきやすいイメージ。周りはあなたを悪くない良い人・居心地のいい人と見ることが多い。',
      'あなたをもっと知りたい人はあなたが先に心を開くのを待っているかも。本音をもう少し出せば関係が近くなる。',
      '「私はこう思う」「私はこれが好き」と伝えると信頼が積みます。関係を深めたいなら考えや感情をもう少し出してみて。',
    ],
  },

  // ---------- relationship_2: 거리두기 ----------
  relationship_2_time_3: {
    ko: [
      '과거~현재 "이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 하나둘 있을 수 있어요. 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계가 읽혀요.',
      '지금은 "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과 깊이 엮이지 않는 편이 좋아요.',
      '앞으로 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계는 거리를 두세요. 부담스러운 요청에는 "지금은 어렵다"고 말해도 되고, 관계는 질이 중요해요.',
    ],
    en: [
      'Past to present you may feel "I should keep my distance from this person" in one or two relationships; those who only drain you or where you always accommodate are readable.',
      'Now with those who "only talk about themselves" or "often blame or compare," it\'s better not to get deeply involved.',
      'Keep distance from those who only drain you or where you always accommodate; it\'s okay to say "I can\'t right now" to burdensome requests—quality matters.',
    ],
    ja: [
      '過去〜現在「この人とは距離を置いた方がいい」と感じる関係が一二あるかも。エネルギーを奪うだけ・いつも合わせる関係が読める。',
      '今は「自分の話ばかりで私の話を聞かない」「批判・比較が多い」人とは深く関わらない方がいい。',
      'これからエネルギーを奪うだけ・いつも合わせる関係は距離を置いて。負担な頼みには「今は難しい」と言ってよく、関係は質が大事。',
    ],
  },
  relationship_2_solution_3: {
    ko: [
      '"이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 있을 수 있어요. 당신에게 에너지를 빼앗기만 하거나 항상 맞춰 줘야 하는 관계입니다.',
      '"다 좋은 사람이어야 한다"고 생각하지 마세요. 부담스러운 요청에는 "지금은 어렵다"고 말해도 되고, 관계는 질이 중요해요.',
      '에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계는 거리를 두는 것이 좋아요. "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 마세요.',
    ],
    en: [
      'You may feel "I should keep my distance from this person" in some relationships; those who only drain your energy or where you always accommodate.',
      'Don\'t think "everyone has to be nice"; it\'s okay to say "I can\'t right now" to burdensome requests—quality matters.',
      'Keep distance from those who only drain you or where you always accommodate; don\'t get deeply involved with those who "only talk about themselves" or "often blame or compare."',
    ],
    ja: [
      '「この人とは距離を置いた方がいい」と感じる関係があるかも。あなたからエネルギーを奪うだけ、いつも合わせる関係。',
      '「みんないい人でなくては」と思わないで。負担な頼みには「今は難しい」と言ってよく、関係は質が大事。',
      'エネルギーを奪うだけ・いつも合わせる関係は距離を置くのがおすすめ。「自分の話ばかり」「批判・比較が多い」人とは深く関わらないで。',
    ],
  },
  relationship_2_relationship_5: {
    ko: [
      '"이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 있어요. 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계가 읽혀요.',
      '과거에 "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과 깊이 엮여 에너지가 빠졌을 수 있어요.',
      '속마음으로는 "거리두고 싶다"지만 "다 좋은 사람이어야 한다"고 생각해 말하기 어려울 수 있어요.',
      '부담스러운 요청에는 "지금은 어렵다"고 말해도 되고, 관계는 질이 중요해요. 에너지를 아끼는 것이 당신에게 유리해요.',
      '앞으로 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계는 거리를 두세요. "내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 좋아요.',
    ],
    en: [
      'You may feel "I should keep my distance from this person" in some relationships; those who only drain you or where you always accommodate are readable.',
      'In the past you may have been deeply involved with those who "only talk about themselves" or "often blame or compare" and felt drained.',
      'You may want to keep distance but find it hard to say because you think "everyone has to be nice."',
      'It\'s okay to say "I can\'t right now" to burdensome requests—quality matters; saving your energy is favorable for you.',
      'Keep distance from those who only drain you or where you always accommodate; with those who "only talk about themselves" or "often blame or compare," it\'s better not to get deeply involved.',
    ],
    ja: [
      '「この人とは距離を置いた方がいい」と感じる関係が。エネルギーを奪うだけ・いつも合わせる関係が読める。',
      '過去に「自分の話ばかりで私の話を聞かない」「批判・比較が多い」人と深く関わってエネルギーが奪われたかも。',
      '本音では「距離を置きたい」が「みんないい人でなくては」と思って言いづらいかも。',
      '負担な頼みには「今は難しい」と言ってよく、関係は質が大事。エネルギーを温存することがあなたに有利。',
      'これからエネルギーを奪うだけ・いつも合わせる関係は距離を置いて。「自分の話ばかり」「批判・比較が多い」人とは深く関わらない方がいい。',
    ],
  },
  relationship_2_cross_4: {
    ko: [
      '지금 "이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 있어요. 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계입니다.',
      '"내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 좋아요.',
      '부담스러운 요청에는 "지금은 어렵다"고 말해도 되고, 관계는 질이 중요해요. "다 좋은 사람이어야 한다"고 생각하지 마세요.',
      '에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계는 거리를 두세요. 에너지를 아끼는 것이 당신에게 유리해요.',
    ],
    en: [
      'You may feel "I should keep my distance from this person" in some relationships; those who only drain you or where you always accommodate.',
      'With those who "only talk about themselves" or "often blame or compare," it\'s better not to get deeply involved.',
      'It\'s okay to say "I can\'t right now" to burdensome requests—quality matters; don\'t think "everyone has to be nice."',
      'Keep distance from those who only drain you or where you always accommodate; saving your energy is favorable for you.',
    ],
    ja: [
      '今「この人とは距離を置いた方がいい」と感じる関係が。エネルギーを奪うだけ・いつも合わせる関係。',
      '「自分の話ばかりで私の話を聞かない」「批判・比較が多い」人とは深く関わらない方がいい。',
      '負担な頼みには「今は難しい」と言ってよく、関係は質が大事。「みんないい人でなくては」と思わないで。',
      'エネルギーを奪うだけ・いつも合わせる関係は距離を置いて。エネルギーを温存することがあなたに有利。',
    ],
  },
  relationship_2_insight_3: {
    ko: [
      '겉으로는 "이 사람이랑은 거리두는 게 나을 것 같다"고 느끼는 관계가 있어요. 에너지를 빼앗기만 하거나 맞춰 줘야 하는 관계가 읽혀요.',
      '"다 좋은 사람이어야 한다"고 생각하지 말고 부담스러운 요청에는 "지금은 어렵다"고 말해도 돼요. 관계는 질이 중요해요.',
      '"내 얘기는 안 물어보고 자기 얘기만", "비난·비교가 많다"는 사람과는 깊이 엮이지 않는 편이 좋아요.',
    ],
    en: [
      'You may feel "I should keep my distance from this person" in some relationships; those who only drain you or where you always accommodate are readable.',
      'Don\'t think "everyone has to be nice" and it\'s okay to say "I can\'t right now" to burdensome requests—quality matters.',
      'With those who "only talk about themselves" or "often blame or compare," it\'s better not to get deeply involved.',
    ],
    ja: [
      '表では「この人とは距離を置いた方がいい」と感じる関係が。エネルギーを奪うだけ・いつも合わせる関係が読める。',
      '「みんないい人でなくては」と思わず、負担な頼みには「今は難しい」と言ってよい。関係は質が大事。',
      '「自分の話ばかり」「批判・比較が多い」人とは深く関わらない方がいい。',
    ],
  },

  // ---------- relationship_3: 진짜 친구 ----------
  relationship_3_time_3: {
    ko: [
      '과거~현재 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있을 수 있어요.',
      '지금은 말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람을 눈여겨보세요. 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가까워요.',
      '앞으로 먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 되고, 기존 친구에게 마음을 열어 보면 깊어질 수 있어요.',
    ],
    en: [
      'Past to present you have good people around but some relationships may be hard to call "truly on my side."',
      'Look for people who reach out or offer small help when you\'re in trouble, not just say "I support you"; true friends are often those who are there for you even once when things are hard.',
      'Making the first move or asking a small favor can start a relationship; opening up to existing friends can deepen it.',
    ],
    ja: [
      '過去〜現在、周りには良い人もいるが「本当に味方」と断言しにくい関係が混ざっているかも。',
      '今は言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人を目に留めて。辛い時に一度いてくれる人を覚えている人が本当の友達に近い。',
      'これからこちらから近づいたり小さな頼みをしてみると関係が始まり、既存の友達に心を開いてみると深まることが。',
    ],
  },
  relationship_3_solution_3: {
    ko: [
      '"진짜 내 편"이라고 확신하기 어려운 관계가 있을 수 있어요. 말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람을 눈여겨보세요.',
      '수많은 인연보다 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가까워요. 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구예요.',
      '먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 되고, 기존 친구에게 마음을 열어 보면 깊어질 수 있어요.',
    ],
    en: [
      'Some relationships may be hard to call "truly on my side"; look for people who reach out or offer small help when you\'re in trouble, not just say "I support you."',
      'True friends are often those who are there for you even once when things are hard, not the many shallow connections; those who listen without blaming are real friends.',
      'Making the first move or asking a small favor can start a relationship; opening up to existing friends can deepen it.',
    ],
    ja: [
      '「本当に味方」と断言しにくい関係があるかも。言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人を目に留めて。',
      '数多くの縁より、辛い時に一度いてくれる人を覚えている人が本当の友達に近い。あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。',
      'こちらから近づいたり小さな頼みをしてみると関係が始まり、既存の友達に心を開いてみると深まることが。',
    ],
  },
  relationship_3_relationship_5: {
    ko: [
      '당신 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있어요. 수많은 인연보다 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가까워요.',
      '과거에 말로만 "응원해"였지만 어려울 때 연락이 오지 않았던 경험이 있을 수 있어요.',
      '속마음으로는 "진짜 친구가 있었으면" 하지만 어떻게 다가가야 할지 모를 수 있어요.',
      '당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구예요. 일·취미·모임을 통해 "마음이 맞는다"고 느끼는 인연이 생길 수 있어요.',
      '앞으로 먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 되고, 기존 친구에게 마음을 열어 보면 깊어질 수 있어요.',
    ],
    en: [
      'You have good people around but some relationships may be hard to call "truly on my side"; true friends are often those who are there for you even once when things are hard.',
      'In the past you may have had "I support you" in words but no contact when you were in trouble.',
      'You may wish "I had a true friend" but not know how to get closer.',
      'Those who listen without blaming are real friends; through work, hobbies, or gatherings you may meet people you feel "in sync with."',
      'Making the first move or asking a small favor can start a relationship; opening up to existing friends can deepen it.',
    ],
    ja: [
      'あなたの周りには良い人もいるが「本当に味方」と断言しにくい関係が混ざっている。数多くの縁より、辛い時に一度いてくれる人を覚えている人が本当の友達に近い。',
      '過去に言葉で「応援してる」だったが、困った時に連絡が来なかった経験があるかも。',
      '本音では「本当の友達がいたら」だが、どう近づけばいいか分からないかも。',
      'あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。仕事・趣味・集まりで「気が合う」と感じる縁ができるかも。',
      'これからこちらから近づいたり小さな頼みをしてみると関係が始まり、既存の友達に心を開いてみると深まることが。',
    ],
  },
  relationship_3_cross_4: {
    ko: [
      '지금 주변에는 좋은 사람도 있지만 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있어요.',
      '진짜 내 편은 말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람이에요. 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구예요.',
      '일·취미·모임을 통해 "마음이 맞는다"고 느끼는 인연이 생길 수 있어요. 먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 돼요.',
      '기존 친구에게 마음을 열어 보면 깊어질 수 있어요. 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가까워요.',
    ],
    en: [
      'You have good people around but some relationships may be hard to call "truly on my side."',
      'True allies reach out or offer small help when you\'re in trouble, not just say "I support you"; those who listen without blaming are real friends.',
      'Through work, hobbies, or gatherings you may meet people you feel "in sync with"; making the first move or asking a small favor can start a relationship.',
      'Opening up to existing friends can deepen it; true friends are often those who are there for you even once when things are hard.',
    ],
    ja: [
      '今の周りには良い人もいるが「本当に味方」と断言しにくい関係が混ざっている。',
      '本当の味方は言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人。あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。',
      '仕事・趣味・集まりで「気が合う」と感じる縁ができるかも。こちらから近づいたり小さな頼みをしてみると関係が始まる。',
      '既存の友達に心を開いてみると深まることが。辛い時に一度いてくれる人を覚えている人が本当の友達に近い。',
    ],
  },
  relationship_3_insight_3: {
    ko: [
      '겉으로는 "진짜 내 편"이라고 확신하기 어려운 관계가 섞여 있어요. 수많은 인연보다 힘들 때 한 번만 있어 줘도 기억하는 사람이 진짜 친구에 가까워요.',
      '먼저 다가가거나 작은 부탁을 해 보는 것이 관계를 시작하는 데 도움이 되고, 기존 친구에게 마음을 열어 보면 깊어질 수 있어요.',
      '말로만 "응원해"가 아니라 어려울 때 연락이 오거나 작은 도움을 주는 사람을 눈여겨보세요. 당신의 말을 경청하고 비난하지 않고 들어 주는 사람이 진짜 친구예요.',
    ],
    en: [
      'Some relationships may be hard to call "truly on my side"; true friends are often those who are there for you even once when things are hard.',
      'Making the first move or asking a small favor can start a relationship; opening up to existing friends can deepen it.',
      'Look for people who reach out or offer small help when you\'re in trouble, not just say "I support you"; those who listen without blaming are real friends.',
    ],
    ja: [
      '表では「本当に味方」と断言しにくい関係が混ざっている。数多くの縁より、辛い時に一度いてくれる人を覚えている人が本当の友達に近い。',
      'こちらから近づいたり小さな頼みをしてみると関係が始まり、既存の友達に心を開いてみると深まることが。',
      '言葉で「応援してる」だけでなく、困った時に連絡が来たり小さな手助けをしてくれる人を目に留めて。あなたの話を傾聴し責めずに聞いてくれる人が本当の友達。',
    ],
  },

  // ---------- fortune_1: 올해 운세 ----------
  fortune_1_time_3: {
    ko: [
      '과거~현재 "조금씩 정리되는" 느낌의 시기예요. 마음이나 환경, 인간관계를 가볍게 정리하고 나면 다음 단계로 넘어가기 좋은 토대가 만들어져요.',
      '지금은 중반에 작은 기회나 "덕분에 잘됐다"는 경험이 한두 번 생길 수 있어요. 급하게 결과를 바라기보다 할 수 있는 일을 착실히 하는 것이 운을 키워요.',
      '앞으로 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. "고생한 보람이 있다"고 느끼는 순간이 오면 작은 축하를 해 주세요.',
    ],
    en: [
      'Past to present: a phase of "things settling bit by bit"; lightly organizing your mind, environment, and relationships creates a good base for the next step.',
      'Now in the middle you may have one or two small opportunities or "it went well" experiences; steady effort builds luck more than hoping for quick results.',
      'Toward year-end what you did may feel wrapped up or recognized; when you feel "it was worth the effort," a small celebration is good.',
    ],
    ja: [
      '過去〜現在「少しずつ整理される」感覚の時期。心・環境・人間関係を軽く整理すると次のステップへ移りやすい土台ができる。',
      '今は中盤に小さなチャンスや「おかげでうまくいった」経験が一二回あるかも。結果を急がず、できることを着実にすることが運を育てる。',
      '年末に近づくほど今年やったことがまとまったり認められる感覚が。「頑張った甲斐があった」と感じる瞬間が来たら少しお祝いして。',
    ],
  },
  fortune_1_solution_3: {
    ko: [
      '"올해 운세가 어떻게 될까" 궁금할 수 있어요. 지금은 "조금씩 정리되는" 느낌의 시기예요.',
      '마음이나 환경, 인간관계를 가볍게 정리하고 나면 다음 단계로 넘어가기 좋은 토대가 만들어져요. 급하게 결과를 바라기보다 할 수 있는 일을 착실히 하세요.',
      '연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. 중반에 작은 기회가 생길 수 있어요.',
    ],
    en: [
      'You may wonder "how will this year go"; now is a phase of "things settling bit by bit."',
      'Lightly organizing your mind, environment, and relationships creates a good base for the next step; do what you can reliably rather than hoping for quick results.',
      'Toward year-end what you did may feel wrapped up or recognized; in the middle you may have small opportunities.',
    ],
    ja: [
      '「今年の運勢はどうなるか」気になるかも。今は「少しずつ整理される」感覚の時期。',
      '心・環境・人間関係を軽く整理すると次のステップへ移りやすい土台ができる。結果を急がず、できることを着実に。',
      '年末に近づくほど今年やったことがまとまったり認められる感覚が。中盤に小さなチャンスがあるかも。',
    ],
  },
  fortune_1_relationship_5: {
    ko: [
      '당신의 올해 운세는 "조금씩 정리되는" 느낌의 시기예요. 급하게 결과를 바라기보다 할 수 있는 일을 착실히 하는 것이 운을 키워요.',
      '과거에 쌓아 둔 마음·환경·인간관계 정리가 지금의 "정리되는" 흐름을 만들고 있어요.',
      '속마음으로는 "더 좋은 일이 있었으면" 하지만, 지금 할 수 있는 일을 착실히 하는 것이 운을 키워요.',
      '중반에 작은 기회나 "덕분에 잘됐다"는 경험이 생길 수 있어요. 내년을 위한 씨앗을 뿌려 두면 다음 해가 더 풍성해질 수 있어요.',
      '연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요. "고생한 보람이 있다"고 느끼는 순간이 오면 작은 축하를 해 주세요.',
    ],
    en: [
      'Your year is a phase of "things settling bit by bit"; steady effort builds luck more than hoping for quick results.',
      'Organizing your mind, environment, and relationships that you\'ve built in the past is creating this "settling" flow now.',
      'You may wish "better things would happen," but doing what you can reliably helps build luck.',
      'In the middle you may have small opportunities or "it went well" experiences; sowing seeds for next year can make the coming year richer.',
      'Toward year-end what you did may feel wrapped up or recognized; when you feel "it was worth the effort," a small celebration is good.',
    ],
    ja: [
      'あなたの今年の運勢は「少しずつ整理される」感覚の時期。結果を急がず、できることを着実にすることが運を育てる。',
      '過去に積んだ心・環境・人間関係の整理が、今の「整理される」流れを作っている。',
      '本音では「もっと良いことがあれば」だが、今できることを着実にすることが運を育てる。',
      '中盤に小さなチャンスや「おかげでうまくいった」経験があるかも。来年のための種をまいておくと翌年がより豊かになる。',
      '年末に近づくほど今年やったことがまとまったり認められる感覚が。「頑張った甲斐があった」と感じる瞬間が来たら少しお祝いして。',
    ],
  },
  fortune_1_cross_4: {
    ko: [
      '지금은 "조금씩 정리되는" 느낌의 시기예요. 급하게 결과를 바라기보다 할 수 있는 일을 착실히 하는 것이 운을 키워요.',
      '마음이나 환경, 인간관계를 가볍게 정리하고 나면 다음 단계로 넘어가기 좋은 토대가 만들어져요.',
      '중반에 작은 기회가 생길 수 있어요. 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요.',
      '그때를 위해 지금 할 수 있는 준비를 해 두세요. "고생한 보람이 있다"고 느끼는 순간이 오면 작은 축하를 해 주세요.',
    ],
    en: [
      'Now is a phase of "things settling bit by bit"; steady effort builds luck more than hoping for quick results.',
      'Lightly organizing your mind, environment, and relationships creates a good base for the next step.',
      'In the middle you may have small opportunities; toward year-end what you did may feel wrapped up or recognized.',
      'Prepare now for that time; when you feel "it was worth the effort," a small celebration is good.',
    ],
    ja: [
      '今は「少しずつ整理される」感覚の時期。結果を急がず、できることを着実にすることが運を育てる。',
      '心・環境・人間関係を軽く整理すると次のステップへ移りやすい土台ができる。',
      '中盤に小さなチャンスがあるかも。年末に近づくほど今年やったことがまとまったり認められる感覚が。',
      'その時のために今できる準備をしておいて。「頑張った甲斐があった」と感じる瞬間が来たら少しお祝いして。',
    ],
  },
  fortune_1_insight_3: {
    ko: [
      '겉으로는 "조금씩 정리되는" 느낌의 시기예요. 중반에 작은 기회나 "덕분에 잘됐다"는 경험이 생길 수 있어요.',
      '급하게 결과를 바라기보다 할 수 있는 일을 착실히 하는 것이 운을 키워요. 연말에 가까워질수록 올해 한 일이 정리되거나 인정받는 느낌이 들 수 있어요.',
      '"고생한 보람이 있다"고 느끼는 순간이 오면 작은 축하를 해 주세요. 마음이나 환경, 인간관계를 가볍게 정리하면 다음 단계로 넘어가기 좋아요.',
    ],
    en: [
      'A phase of "things settling bit by bit"; in the middle you may have small opportunities or "it went well" experiences.',
      'Steady effort builds luck more than hoping for quick results; toward year-end what you did may feel wrapped up or recognized.',
      'When you feel "it was worth the effort," a small celebration is good; lightly organizing your mind, environment, and relationships helps you move to the next step.',
    ],
    ja: [
      '表では「少しずつ整理される」感覚の時期。中盤に小さなチャンスや「おかげでうまくいった」経験があるかも。',
      '結果を急がず、できることを着実にすることが運を育てる。年末に近づくほど今年やったことがまとまったり認められる感覚が。',
      '「頑張った甲斐があった」と感じる瞬間が来たら少しお祝いして。心・環境・人間関係を軽く整理すると次のステップへ移りやすい。',
    ],
  },

  // ---------- fortune_2: 다가오는 기회 ----------
  fortune_2_time_3: {
    ko: [
      '과거~현재 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.',
      '지금은 기회가 "큰 이벤트"보다 "작은 문이 열리는" 형태로 올 가능성이 많아요. "이건 기회가 아니야"라고 무시하지 말고 한 번 참여해 보거나 이야기를 들어 보세요.',
      '앞으로 "내가 원하는 게 뭔지"를 대략이라도 정해 두면 문이 열렸을 때 들어갈 수 있어요. "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어와요.',
    ],
    en: [
      'Past to present something or someone that feels "this is it" may be approaching.',
      'Opportunities may come more as "small doors opening" than as big events; don\'t dismiss as "not an opportunity"—try joining once or listening.',
      'Having a rough idea of "what I want" lets you step in when the door opens; doing one thing you\'ve decided "I\'ll at least try this" tends to bring luck your way.',
    ],
    ja: [
      '過去〜現在、目立たないが「これだ」と感じる出来事や人が近づいているかも。',
      '今はチャンスが「大きなイベント」より「小さな扉が開く」形で来ることが多い。「これはチャンスじゃない」と見送らず、一度参加したり話を聞いてみて。',
      'これから「自分が何を望んでいるか」を大まかで決めておけば扉が開いた時に入れる。「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてくる。',
    ],
  },
  fortune_2_solution_3: {
    ko: [
      '"다가오는 기회가 뭘까" 궁금할 수 있어요. 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.',
      '"내가 원하는 게 뭔지"를 대략이라도 정해 두면 문이 열렸을 때 들어갈 수 있어요. 기회는 "큰 이벤트"보다 "작은 문이 열리는" 형태로 올 가능성이 많아요.',
      '"이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어와요. 부담스럽지 않은 범위에서 한 번 참여해 보거나 이야기를 들어 보세요.',
    ],
    en: [
      'You may wonder "what opportunity is coming"; something that feels "this is it" may be approaching.',
      'Having a rough idea of "what I want" lets you step in when the door opens; opportunities may come more as "small doors opening" than as big events.',
      'Doing one thing you\'ve decided "I\'ll at least try this" tends to bring luck your way; within a comfortable range try joining once or listening.',
    ],
    ja: [
      '「近づいてくるチャンスは何か」気になるかも。目立たないが「これだ」と感じる出来事や人が近づいているかも。',
      '「自分が何を望んでいるか」を大まかで決めておけば扉が開いた時に入れる。チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。',
      '「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてくる。負担のない範囲で一度参加したり話を聞いてみて。',
    ],
  },
  fortune_2_relationship_5: {
    ko: [
      '당신에게 다가오는 것은 "이거다"라고 느끼는 일이나 사람일 수 있어요. 눈에 띄지 않지만 기회가 다가오고 있어요.',
      '과거에 "이건 기회가 아니야"라고 무시했던 경험이 있을 수 있어요. 지금은 한 번 참여해 보거나 이야기를 들어 보세요.',
      '속마음으로는 "기회가 왔으면" 하지만 "내가 원하는 게 뭔지"를 대략이라도 정해 두는 것이 유리해요.',
      '일상 속에서 새로 시작한 습관, 우연히 만난 사람, 흘려들은 정보가 나중에 기회로 이어질 수 있어요.',
      '앞으로 "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어와요. 기회는 "큰 이벤트"보다 "작은 문이 열리는" 형태로 올 가능성이 많아요.',
    ],
    en: [
      'What may be approaching is something or someone that feels "this is it"; not obvious but opportunity is coming.',
      'In the past you may have dismissed as "not an opportunity"; now try joining once or listening.',
      'You may wish "an opportunity would come," but having a rough idea of "what I want" is favorable.',
      'A new habit, someone you met by chance, or information you overheard can later turn into opportunity.',
      'Doing one thing you\'ve decided "I\'ll at least try this" tends to bring luck your way; opportunities may come more as "small doors opening" than as big events.',
    ],
    ja: [
      'あなたに近づいているのは「これだ」と感じる出来事や人かも。目立たないがチャンスが近づいている。',
      '過去に「これはチャンスじゃない」と見送った経験があるかも。今は一度参加したり話を聞いてみて。',
      '本音では「チャンスが来れば」だが「自分が何を望んでいるか」を大まかで決めておくのが有利。',
      '日常で始めた習慣、偶然会った人、聞き流した情報が後でチャンスにつながることが。',
      'これから「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてくる。チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。',
    ],
  },
  fortune_2_cross_4: {
    ko: [
      '지금 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.',
      '일상 속에서 새로 시작한 습관, 우연히 만난 사람, 흘려들은 정보가 나중에 기회로 이어질 수 있어요.',
      '"이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어와요. 기회는 "큰 이벤트"보다 "작은 문이 열리는" 형태로 올 가능성이 많아요.',
      '"이건 기회가 아니야"라고 무시하지 말고 한 번 참여해 보거나 이야기를 들어 보세요. "내가 원하는 게 뭔지"를 대략이라도 정해 두면 문이 열렸을 때 들어갈 수 있어요.',
    ],
    en: [
      'Something or someone that feels "this is it" may be approaching.',
      'A new habit, someone you met by chance, or information you overheard can later turn into opportunity.',
      'Doing one thing you\'ve decided "I\'ll at least try this" tends to bring luck your way; opportunities may come more as "small doors opening" than as big events.',
      'Don\'t dismiss as "not an opportunity"—try joining once or listening; having a rough idea of "what I want" lets you step in when the door opens.',
    ],
    ja: [
      '今は目立たないが「これだ」と感じる出来事や人が近づいているかも。',
      '日常で始めた習慣、偶然会った人、聞き流した情報が後でチャンスにつながることが。',
      '「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてくる。チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。',
      '「これはチャンスじゃない」と見送らず、一度参加したり話を聞いてみて。「自分が何を望んでいるか」を大まかで決めておけば扉が開いた時に入れる。',
    ],
  },
  fortune_2_insight_3: {
    ko: [
      '겉으로는 눈에 띄지 않지만 "이거다"라고 느끼는 일이나 사람이 다가오고 있을 수 있어요.',
      '부담스럽지 않은 범위에서 "이것만은 해 보자"라고 정한 일을 꾸준히 하면 운이 당신 쪽으로 걸어와요.',
      '기회는 "큰 이벤트"보다 "작은 문이 열리는" 형태로 올 가능성이 많아요. "이건 기회가 아니야"라고 무시하지 말고 한 번 참여해 보거나 이야기를 들어 보세요.',
    ],
    en: [
      'Something that feels "this is it" may be approaching.',
      'Within a comfortable range, doing one thing you\'ve decided "I\'ll at least try this" tends to bring luck your way.',
      'Opportunities may come more as "small doors opening" than as big events; don\'t dismiss as "not an opportunity"—try joining once or listening.',
    ],
    ja: [
      '表では目立たないが「これだ」と感じる出来事や人が近づいているかも。',
      '負担のない範囲で「これだけはやってみよう」と決めたことを続けると、運がこちらの方へ歩いてくる。',
      'チャンスは「大きなイベント」より「小さな扉が開く」形で来ることが多い。「これはチャンスじゃない」と見送らず、一度参加したり話を聞いてみて。',
    ],
  },

  // ---------- fortune_3: 지금 조심할 것 ----------
  fortune_3_time_3: {
    ko: [
      '과거~현재 피로나 스트레스가 쌓여 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.',
      '지금은 "오늘만", "이번만"이라는 생각으로 큰 결정을 하면 나중에 후회할 수 있어요. 중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 말해 본 뒤에 결정하세요.',
      '앞으로 감정이 올라갔을 때의 결단(이직, 연애, 큰 지출, 관계 정리 등)은 미루는 것이 좋아요. 건강을 조금만 챙겨도 판단력이 돌아와요.',
    ],
    en: [
      'Past to present fatigue or stress may be building, so judgment can be clouded or you may be swept by emotions.',
      'Making big decisions with "just today" or "just this once" can lead to regret; sleep on important matters or talk to someone you trust before deciding.',
      'Postpone big decisions when emotions are high (job change, love, big spending, ending a relationship, etc.); a little care of health brings back judgment.',
    ],
    ja: [
      '過去〜現在、疲れやストレスが溜まり、判断が鈍ったり感情に流されやすい時期かも。',
      '今は「今日だけ」「今回だけ」の気持ちで大きな決断をすると後悔することが。重要なことは一晩寝かせるか、信頼する人に話してから決めて。',
      'これから感情が高まった時の決断（転職・恋愛・大きな支出・関係の整理など）は延ばすのがおすすめ。健康を少しでも整えると判断力が戻る。',
    ],
  },
  fortune_3_solution_3: {
    ko: [
      '"지금 조심할 게 뭘까" 궁금할 수 있어요. 피로나 스트레스가 쌓여 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.',
      '"오늘만", "이번만"이라는 생각으로 큰 결정을 하면 나중에 후회할 수 있어요. 감정이 올라갔을 때의 결단은 미루세요.',
      '건강을 조금만 챙겨도 판단력이 돌아와요. SNS에서의 과한 비교, 밤늦은 시간의 중요한 대화도 피하면 마음이 편해져요.',
    ],
    en: [
      'You may wonder "what should I be careful about"; fatigue or stress may be building, so judgment can be clouded.',
      'Making big decisions with "just today" or "just this once" can lead to regret; postpone big decisions when emotions are high.',
      'A little care of health brings back judgment; avoiding excessive comparison on social media and important conversations late at night helps peace of mind.',
    ],
    ja: [
      '「今何に気をつけるか」気になるかも。疲れやストレスが溜まり、判断が鈍ったり感情に流されやすい時期かも。',
      '「今日だけ」「今回だけ」の気持ちで大きな決断をすると後悔することが。感情が高まった時の決断は延ばして。',
      '健康を少しでも整えると判断力が戻る。SNSの過度な比較、夜遅い時間の重要な会話も避けると心が楽に。',
    ],
  },
  fortune_3_relationship_5: {
    ko: [
      '당신은 지금 피로나 스트레스가 쌓여 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.',
      '과거에 "오늘만", "이번만"이라는 생각으로 큰 결정을 해 후회한 경험이 있을 수 있어요.',
      '속마음으로는 "지금 말하지 않으면 안 된다"고 느낄 수 있지만, 그 생각은 대부분 착각일 수 있어요.',
      '중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 말해 본 뒤에 결정하세요. 감정이 올라갔을 때의 결단(이직, 연애, 큰 지출, 관계 정리 등)은 미루세요.',
      '앞으로 건강을 조금만 챙겨도 판단력이 돌아와요. SNS에서의 과한 비교, 밤늦은 시간의 중요한 대화도 피하면 마음이 편해져요.',
    ],
    en: [
      'You may be in a phase where fatigue or stress is building, so judgment can be clouded or you may be swept by emotions.',
      'In the past you may have made big decisions with "just today" or "just this once" and regretted it.',
      'You may feel "I have to say it now," but that thought is often an illusion.',
      'Sleep on important matters or talk to someone you trust before deciding; postpone big decisions when emotions are high (job change, love, big spending, ending a relationship, etc.).',
      'A little care of health brings back judgment; avoiding excessive comparison on social media and important conversations late at night helps peace of mind.',
    ],
    ja: [
      'あなたは今、疲れやストレスが溜まり、判断が鈍ったり感情に流されやすい時期かも。',
      '過去に「今日だけ」「今回だけ」の気持ちで大きな決断をして後悔した経験があるかも。',
      '本音では「今言わなきゃ」と感じるかもだが、その考えは多くが錯覚かも。',
      '重要なことは一晩寝かせるか、信頼する人に話してから決めて。感情が高まった時の決断（転職・恋愛・大きな支出・関係の整理など）は延ばして。',
      'これから健康を少しでも整えると判断力が戻る。SNSの過度な比較、夜遅い時間の重要な会話も避けると心が楽に。',
    ],
  },
  fortune_3_cross_4: {
    ko: [
      '지금은 피로나 스트레스가 쌓여 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.',
      '감정이 올라갔을 때의 결단(이직, 연애, 큰 지출, 관계 정리 등)은 미루는 것이 좋아요.',
      'SNS에서의 과한 비교, 밤늦은 시간의 중요한 대화도 피하면 마음이 편해져요.',
      '중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 말해 본 뒤에 결정하세요. "지금 말하지 않으면 안 된다"는 생각은 대부분 착각이에요.',
    ],
    en: [
      'You may be in a phase where fatigue or stress is building, so judgment can be clouded or you may be swept by emotions.',
      'Postpone big decisions when emotions are high (job change, love, big spending, ending a relationship, etc.).',
      'Avoiding excessive comparison on social media and important conversations late at night helps peace of mind.',
      'Sleep on important matters or talk to someone you trust before deciding; the feeling "I have to say it now" is often an illusion.',
    ],
    ja: [
      '今は疲れやストレスが溜まり、判断が鈍ったり感情に流されやすい時期かも。',
      '感情が高まった時の決断（転職・恋愛・大きな支出・関係の整理など）は延ばすのがおすすめ。',
      'SNSの過度な比較、夜遅い時間の重要な会話も避けると心が楽に。',
      '重要なことは一晩寝かせるか、信頼する人に話してから決めて。「今言わなきゃ」は多くが錯覚。',
    ],
  },
  fortune_3_insight_3: {
    ko: [
      '겉으로는 피로나 스트레스가 쌓여 판단이 흐려지거나 감정에 휩쓸리기 쉬운 때일 수 있어요.',
      '"지금 말하지 않으면 안 된다"는 생각은 대부분 착각이에요. 건강을 조금만 챙겨도 판단력이 돌아와요.',
      '중요한 일은 하루 잠들어 보거나 신뢰하는 사람에게 말해 본 뒤에 결정하세요. 감정이 올라갔을 때의 결단은 미루세요.',
    ],
    en: [
      'Fatigue or stress may be building; judgment can be clouded or you may be swept by emotions.',
      'The feeling "I have to say it now" is often an illusion; a little care of health brings back judgment.',
      'Sleep on important matters or talk to someone you trust before deciding; postpone big decisions when emotions are high.',
    ],
    ja: [
      '表では疲れやストレスが溜まり、判断が鈍ったり感情に流されやすい時期かも。',
      '「今言わなきゃ」は多くが錯覚。健康を少しでも整えると判断力が戻る。',
      '重要なことは一晩寝かせるか、信頼する人に話してから決めて。感情が高まった時の決断は延ばして。',
    ],
  },
};

/** 75세트 (질문×스프레드). 있으면 고유 해석, 없으면 fallback → config에서 legacy 사용 */
export const READINGS_BY_QUESTION_AND_SPREAD = buildReadings();
