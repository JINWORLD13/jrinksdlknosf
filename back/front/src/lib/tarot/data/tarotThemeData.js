import { useTranslation } from 'react-i18next';
import {
  // isMonthAgo,
  // isWeekAgo,
  // isDayAgo,
  isWithinThisMonth,
  isWithinThisWeek,
  isWithinThisDay,
} from '../../../utils/format/isTimeAgo.js';

export const TotalMajorCount = (tarotHistory, themeToRender) => {
  const { t } = useTranslation();
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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
export const TotalMinorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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

export const MonthlyMajorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const MonthlyMinorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const WeeklyMajorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const WeeklyMinorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const DailyMajorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const DailyMinorCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const TotalCupsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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
export const TotalSwordsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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
export const TotalWandsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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
export const TotalPentaclesCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      const theme = tarot?.questionData?.theme;
      if (theme !== themeToRender) return 0;
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

export const MonthlyCupsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const MonthlySwordsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const MonthlyWandsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const MonthlyPentaclesCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisMonth(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const WeeklyCupsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const WeeklySwordsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const WeeklyWandsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const WeeklyPentaclesCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisWeek(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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

export const DailyCupsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const DailySwordsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const DailyWandsCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const DailyPentaclesCount = (tarotHistory, themeToRender) => {
  return tarotHistory
    ?.map(tarot => {
      if (isWithinThisDay(tarot)) {
        const theme = tarot?.questionData?.theme;
        if (theme !== themeToRender) return 0;
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
export const KindOfCardArrHistory = (tarotHistory, themeToRender) => {
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
