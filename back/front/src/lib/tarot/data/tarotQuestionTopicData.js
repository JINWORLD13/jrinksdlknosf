import { useTranslation } from 'react-i18next';
import {
  isMonthAgo,
  isWeekAgo,
  isDayAgo,
  isWithinThisMonth,
  isWithinThisWeek,
  isWithinThisDay,
} from '../../../utils/format/isTimeAgo.js';
import { formattingDate } from '../../../utils/format/formatDate.jsx';
import { useLanguageChange } from '@/hooks';

export const TotalMajorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const majorCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const major = card.split(' ').map(word => {
            if (
              ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) !== true
            ) {
              return 1;
            }
          });
          let result = 0;
          if (major.includes(undefined)) {
            result = 0;
          } else {
            result = 1;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return majorCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const TotalMinorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const minorCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const minor = card.split(' ').map(word => {
            if (
              ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true
            )
              return 1;
          });
          let result = 0;
          if (minor.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return minorCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const MonthlyMajorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const majorCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const major = card.split(' ').map(word => {
              if (
                ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) !== true
              )
                return 1;
            });
            let result = 0;
            if (major.includes(undefined)) {
              result = 0;
            } else {
              result = 1;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return majorCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const MonthlyMinorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const minorCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const minor = card.split(' ').map(word => {
              if (
                ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true
              )
                return 1;
            });
            let result = 0;
            if (minor.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return minorCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const WeeklyMajorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const majorCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const major = card.split(' ').map(word => {
              if (
                ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) !== true
              )
                return 1;
            });
            let result = 0;
            if (major.includes(undefined)) {
              result = 0;
            } else {
              result = 1;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return majorCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const WeeklyMinorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const minorCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const minor = card.split(' ').map(word => {
              if (
                ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true
              )
                return 1;
            });
            let result = 0;
            if (minor.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return minorCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const DailyMajorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t(`chart.statistics-total`)) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const majorCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const major = card.split(' ').map(word => {
            if (
              ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) !== true
            )
              return 1;
          });
          let result = 0;
          if (major.includes(undefined)) {
            result = 0;
          } else {
            result = 1;
          }

          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return majorCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const DailyMinorCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t(`chart.statistics-total`)) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const minorCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const minor = card.split(' ').map(word => {
            if (
              ['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true
            )
              return 1;
          });
          let result = 0;
          if (minor.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return minorCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const TotalCupsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const cupsCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const cups = card.split(' ').map(word => {
            if (['Cups'].includes(word) === true) return 1;
          });
          let result = 0;
          if (cups.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return cupsCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const TotalSwordsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const swordsCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const swords = card.split(' ').map(word => {
            if (['Swords'].includes(word) === true) return 1;
          });
          let result = 0;
          if (swords.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return swordsCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const TotalWandsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const wandsCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const wands = card.split(' ').map(word => {
            if (['Wands'].includes(word) === true) return 1;
          });
          let result = 0;
          if (wands.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return wandsCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const TotalPentaclesCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      const questionTopic = tarot?.questionData['question_topic'];
      // 주제가 비어있으면 제외
      if (!questionTopic || questionTopic === '' || questionTopic === undefined)
        return 0;
      if (questionTopic !== questionTopicToRender) return 0;

      // questionOfTopic 필터링
      const question = tarot?.questionData['question'];
      if (
        questionOfTopicToRender !== t(`chart.statistics-total`) &&
        question !== questionOfTopicToRender
      )
        return 0;

      const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
      if (
        formattedDate !== dateToRender &&
        dateToRender !== t(`chart.statistics-total`)
      )
        return 0;
      const pentaclesCount = tarot?.readingConfig?.selectedTarotCardsArr
        ?.map(card => {
          const pentacles = card.split(' ').map(word => {
            if (['Pentacles'].includes(word) === true) return 1;
          });
          let result = 0;
          if (pentacles.includes(1)) {
            result = 1;
          } else {
            result = 0;
          }
          return result;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
      return pentaclesCount;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const MonthlyCupsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const cupsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const cups = card.split(' ').map(word => {
              if (['Cups'].includes(word) === true) return 1;
            });
            let result = 0;
            if (cups.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return cupsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const MonthlySwordsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const swordsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const swords = card.split(' ').map(word => {
              if (['Swords'].includes(word) === true) return 1;
            });
            let result = 0;
            if (swords.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return swordsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const MonthlyWandsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const wandsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const wands = card.split(' ').map(word => {
              if (['Wands'].includes(word) === true) return 1;
            });
            let result = 0;
            if (wands.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return wandsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const MonthlyPentaclesCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const pentaclesCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const pentacles = card.split(' ').map(word => {
              if (['Pentacles'].includes(word) === true) return 1;
            });
            let result = 0;
            if (pentacles.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return pentaclesCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const WeeklyCupsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const cupsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const cups = card.split(' ').map(word => {
              if (['Cups'].includes(word) === true) return 1;
            });
            let result = 0;
            if (cups.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return cupsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const WeeklySwordsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const swordsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const swords = card.split(' ').map(word => {
              if (['Swords'].includes(word) === true) return 1;
            });
            let result = 0;
            if (swords.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return swordsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const WeeklyWandsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const wandsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const wands = card.split(' ').map(word => {
              if (['Wands'].includes(word) === true) return 1;
            });
            let result = 0;
            if (wands.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return wandsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const WeeklyPentaclesCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const pentaclesCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const pentacles = card.split(' ').map(word => {
              if (['Pentacles'].includes(word) === true) return 1;
            });
            let result = 0;
            if (pentacles.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return pentaclesCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

export const DailyCupsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const cupsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const cups = card.split(' ').map(word => {
              if (['Cups'].includes(word) === true) return 1;
            });
            let result = 0;
            if (cups.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return cupsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const DailySwordsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const swordsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const swords = card.split(' ').map(word => {
              if (['Swords'].includes(word) === true) return 1;
            });
            let result = 0;
            if (swords.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return swordsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const DailyWandsCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const wandsCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const wands = card.split(' ').map(word => {
              if (['Wands'].includes(word) === true) return 1;
            });
            let result = 0;
            if (wands.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return wandsCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};
export const DailyPentaclesCount = (
  tarotHistory,
  questionTopicToRender,
  questionOfTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const questionTopic = tarot?.questionData['question_topic'];
        // 주제가 비어있으면 제외
        if (
          !questionTopic ||
          questionTopic === '' ||
          questionTopic === undefined
        )
          return 0;
        if (questionTopic !== questionTopicToRender) return 0;

        // questionOfTopic 필터링
        const question = tarot?.questionData['question'];
        if (
          questionOfTopicToRender !== t(`chart.statistics-total`) &&
          question !== questionOfTopicToRender
        )
          return 0;

        // 날짜 필터링
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (
          formattedDate !== dateToRender &&
          dateToRender !== t(`chart.statistics-total`)
        )
          return 0;

        const pentaclesCount = tarot?.readingConfig?.selectedTarotCardsArr
          ?.map(card => {
            const pentacles = card.split(' ').map(word => {
              if (['Pentacles'].includes(word) === true) return 1;
            });
            let result = 0;
            if (pentacles.includes(1)) {
              result = 1;
            } else {
              result = 0;
            }
            return result;
          })
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        return pentaclesCount;
      }
      return 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
};

//! 수정중
export const KindOfCardArrHistory = (
  tarotHistory,
  questionTopicToRender,
  dateToRender
) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  return tarotHistory.map(tarot => {
    const kindOfCardArr = tarot?.readingConfig?.selectedTarotCardsArr.map(
      (card, index1) => {
        const kindOfCard = card.split(' ').map(word => {
          if (!['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true)
            return 'major';
        });
        return kindOfCard;
      }
    );
    return kindOfCardArr;
  });
};
