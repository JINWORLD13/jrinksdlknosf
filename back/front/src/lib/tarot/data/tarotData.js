import {
  isWithinThisMonth,
  isWithinThisWeek,
  isWithinThisDay,
} from '../../../utils/format/isTimeAgo.js';
import { formattingDate } from '../../../utils/format/formatDate.jsx';
import { useTranslation } from 'react-i18next';

export const TotalMajorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const majorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const TotalMinorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const minorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 이번달만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisMonth(tarot)) return 0;
      } else {
        if (!isWithinThisMonth(tarot)) return 0;
      }

      const majorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const MonthlyMinorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 이번달만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisMonth(tarot)) return 0;
      } else {
        if (!isWithinThisMonth(tarot)) return 0;
      }

      const minorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const WeeklyMajorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 이번주만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisWeek(tarot)) return 0;
      } else {
        if (!isWithinThisWeek(tarot)) return 0;
      }

      const majorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const WeeklyMinorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 이번주만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisWeek(tarot)) return 0;
      } else {
        if (!isWithinThisWeek(tarot)) return 0;
      }

      const minorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const DailyMajorCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const majorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const minorCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const TotalCupsCount = (tarotHistory, dateToRender, browserLanguage) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const cupsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const swordsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const wandsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터링
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
      }

      const pentaclesCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const MonthlyCupsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const cupsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const MonthlySwordsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const swordsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const MonthlyWandsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const wandsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const MonthlyPentaclesCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const pentaclesCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const WeeklyCupsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const cupsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const WeeklySwordsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const swordsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const WeeklyWandsCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const wandsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const WeeklyPentaclesCount = tarotHistory => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const pentaclesCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

export const DailyCupsCount = (tarotHistory, dateToRender, browserLanguage) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const cupsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const DailySwordsCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const swordsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const DailyWandsCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const wandsCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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
export const DailyPentaclesCount = (
  tarotHistory,
  dateToRender,
  browserLanguage
) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      // 날짜 필터가 있으면 그 날짜만 체크, 없으면 오늘만
      if (dateToRender && dateToRender !== t('chart.statistics-total')) {
        const formattedDate = formattingDate(tarot?.updatedAt, browserLanguage);
        if (formattedDate !== dateToRender) return 0;
        // 특정 날짜를 선택한 경우에도 기간 체크 필요
        if (!isWithinThisDay(tarot)) return 0;
      } else {
        if (!isWithinThisDay(tarot)) return 0;
      }

      const pentaclesCount = (tarot?.readingConfig?.selectedTarotCardsArr || [])
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

//! 수정중
export const KindOfCardArrHistory = tarotHistory => {
  return tarotHistory.map(tarot => {
    const kindOfCardArr = tarot?.readingConfig?.selectedTarotCardsArr.map(card => {
      const kindOfCard = card.split(' ').map(word => {
        if (!['Pentacles', 'Swords', 'Cups', 'Wands'].includes(word) === true)
          return 'major';
      });
      return kindOfCard;
    });
    return kindOfCardArr;
  });
};
