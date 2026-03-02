/**
 * Treat only arrays that contain at least one "real" card entry as valid.
 *
 * Why:
 * - Devtools can show `Array(empty)` (holes) which has `length > 0` but no actual values.
 * - Legacy records can contain `[undefined]` / holes.
 * - Some call sites may provide card objects instead of formatted strings.
 */
const extractNameLike = v => {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') {
    if (typeof v.name === 'string') return v.name;
    if (typeof v.cardName === 'string') return v.cardName;
    if (typeof v.title === 'string') return v.title;
  }
  return '';
};

export const hasRealCardStrings = arr =>
  Array.isArray(arr) &&
  arr.some(v => {
    const nameLike = extractNameLike(v);
    return typeof nameLike === 'string' && nameLike.trim().length > 0;
  });

export const resolveCombinedCardsArr = (combinedCardsArr, spreadCardsArr) => {
  const spread = Array.isArray(spreadCardsArr) ? spreadCardsArr : [];
  if (hasRealCardStrings(combinedCardsArr)) return combinedCardsArr;
  return spread;
};

// docs: combinedReadingConfig, readingConfig
export const resolveCombinedReadingConfig = (combinedReadingConfig, readingConfig) => {
  const combinedObj =
    combinedReadingConfig && typeof combinedReadingConfig === 'object'
      ? combinedReadingConfig
      : {};
  const spreadCardsArr = readingConfig?.selectedTarotCardsArr;
  const combinedCardsArr = combinedObj?.selectedTarotCardsArr;
  const resolvedCardsArr = resolveCombinedCardsArr(combinedCardsArr, spreadCardsArr);
  return {
    ...combinedObj,
    selectedTarotCardsArr: resolvedCardsArr,
  };
};

/** @deprecated Use resolveCombinedReadingConfig (docs 명칭) */
export const resolveCombinedSpreadInfo = resolveCombinedReadingConfig;


