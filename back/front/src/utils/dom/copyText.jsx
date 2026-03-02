import { allAnswerAsText } from '../../lib/tarot/answer/allAnswerAsText.jsx';

export const copyText = async JSXTagArr => {
  try {
    if (JSXTagArr?.[JSXTagArr?.length - 1] === null) JSXTagArr.pop();
    await navigator.clipboard.writeText(allAnswerAsText(JSXTagArr));
  } catch (err) {
    console.error('Unable to copy text', err);
  }
};
