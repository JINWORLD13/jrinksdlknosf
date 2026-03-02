const Tarot = require("../models/tarot");
const { commonErrors, wrapError } = require("../../../common/errors");

function hasRealCardStrings(arr) {
  return (
    Array.isArray(arr) &&
    arr.some((v) => typeof v === "string" && v.trim().length > 0)
  );
}

function resolveCombinedReadingConfigForResponse(combinedReadingConfig, readingConfig) {
  const spreadCardsArr = readingConfig?.selectedTarotCardsArr;
  const combinedCardsArr = combinedReadingConfig?.selectedTarotCardsArr;
  const resolvedCardsArr = hasRealCardStrings(combinedCardsArr)
    ? combinedCardsArr
    : Array.isArray(spreadCardsArr)
      ? spreadCardsArr
      : [];
  return {
    ...(combinedReadingConfig && typeof combinedReadingConfig === "object"
      ? combinedReadingConfig
      : {}),
    selectedTarotCardsArr: resolvedCardsArr,
  };
}

const tarotDAO = {
  create: async (tarotInfo, session = null) => {
    try {
      const userObjId = tarotInfo?.userId?._id ?? null;
      const { userId, ...rest } = tarotInfo;
      const tarotInfoWithoutUserInfo = rest;
      // userId 없이 만들어야 해서 비구조화 할당과 나머지 연산자 사용했음.(Object.assign메서드 사용 가능.)
      // populate시, 연결할 데이터의 ObjId를 쓰면 되는 거임.
      const newTarot = new Tarot({
        ...tarotInfoWithoutUserInfo,
        userId: userObjId,
      });
      await newTarot.save({ session });

      // Tarot 데이터를 가져와 userId 필드를 populate하여 실제 데이터로 채워줌
      // populate("Tarot 스키마에서 다른 스키마를 연결한 부분에 쓴 (다른 스키마의 ) OBJECT ID키값")
      const query = Tarot?.findOne({
        _id: newTarot?._id,
      }).populate("userId");

      // 트랜잭션 사용 시 세션을 포함해야 함
      if (session) {
        query.session(session);
      }

      const populatedTarot = await query;
      return populatedTarot?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryCreateError);
    }
  },

  findById: async (tarotId) => {
    try {
      const plainTarot = await Tarot?.findOne({ _id: tarotId })?.lean();
      return plainTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotDAOFindByIdError);
    }
  },

  updateById: async (tarotId, updateData, session = null) => {
    try {
      const query = Tarot?.findOneAndUpdate(
        { _id: tarotId },
        { $set: updateData },
        { new: true },
      );

      if (session) {
        query.session(session);
      }

      const updatedTarot = await query.lean();
      return updatedTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryUpdateByIdError);
    }
  },

  findByUserId: async (userObjId) => {
    try {
      const plainTarot = await Tarot?.findOne({ userId: userObjId })?.lean();
      return plainTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindByUserIdError);
    }
  },

  findByAnswer: async (tarotAnswer) => {
    try {
      const plainTarot = await Tarot?.findOne({ interpretation: tarotAnswer })?.lean();
      return plainTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindByAnswerError);
    }
  },

  findByAnswerArr: async (tarotAnswerArr) => {
    try {
      // $in 연산자로 단일 쿼리 실행 (Promise.all 대신)
      // 여러 개의 커넥션 사용 → 1개의 커넥션만 사용
      const plainTarotArr = await Tarot?.find({
        interpretation: { $in: tarotAnswerArr },
      })?.lean();
      return plainTarotArr;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindByAnswerError);
    }
  },

  findManyById: async (tarotId) => {
    try {
      const plainTarotArr = await Tarot?.find({ _id: tarotId });
      return plainTarotArr;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotDAOFindManyByIdError);
    }
  },

  findManyByUserId: async (userObjId) => {
    try {
      // populate된 부분은 ObjId로 찾아야 함.
      const plainTarotArr = await Tarot?.find({ userId: userObjId });
      const plainTarotArrWithoutObjId = plainTarotArr
        .filter((tarot) => {
          // 실제 타로 카드 데이터가 있는 레코드만 필터링
          return (
            tarot?.readingConfig?.selectedTarotCardsArr &&
            Array.isArray(tarot.readingConfig.selectedTarotCardsArr) &&
            tarot.readingConfig.selectedTarotCardsArr.length > 0
          );
        })
        .map((tarot, i) => {
          const {
            questionData,
            readingConfig,
            combinedReadingConfig,
            interpretation,
            language,
            createdAt,
            updatedAt,
            timeOfCounselling,
            additionalQuestionCount,
            hasAdditionalQuestion,
            originalTarotId,
            parentTarotId,
            tarotIdChain,
            ...rest
          } = tarot;

          // Parse interpretation if it's a JSON string to prevent double-parsing issues in frontend
          let parsedAnswer = interpretation;
          if (typeof interpretation === "string" && interpretation.trim().startsWith("{")) {
            try {
              parsedAnswer = JSON.parse(interpretation);
            } catch (e) {
              // If parsing fails, keep the original string
              console.error("Failed to parse interpretation JSON:", e);
              parsedAnswer = interpretation;
            }
          }

          return {
            _id: tarot?._id,
            questionData,
            readingConfig,
            // Normalize legacy/old records: ensure combinedReadingConfig cards are never empty when spread cards exist.
            combinedReadingConfig: resolveCombinedReadingConfigForResponse(
              combinedReadingConfig,
              readingConfig,
            ),
            interpretation: parsedAnswer, // Return parsed object instead of string
            language,
            createdAt,
            updatedAt,
            timeOfCounselling,
            additionalQuestionCount: additionalQuestionCount ?? 0,
            hasAdditionalQuestion: hasAdditionalQuestion ?? false,
            originalTarotId: originalTarotId || null,
            parentTarotId: parentTarotId || null,
            tarotIdChain: Array.isArray(tarotIdChain) ? tarotIdChain : [],
          };
        });
      return plainTarotArrWithoutObjId;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindManyByUserIdError);
    }
  },

  findManyBySpread: async (readingConfig) => {
    try {
      const plainTarotArr = await Tarot?.find({ readingConfig })?.lean();
      return plainTarotArr;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindManyBySpreadError);
    }
  },

  findManyByLanguage: async (languageInfo) => {
    try {
      const plainTarotArr = await Tarot?.find({
        language: languageInfo,
      })?.lean();
      return plainTarotArr;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindManyByLanguageError);
    }
  },

  findManyByOriginalTarotId: async (originalTarotId) => {
    try {
      // originalTarotId로 모든 추가 질문 타로를 가져오기 (생성 시간 순으로 정렬)
      const plainTarotArr = await Tarot?.find({
        originalTarotId: originalTarotId,
      })
        .sort({ createdAt: 1 }) // 생성 시간 오름차순 정렬 (1번째 추가 질문이 먼저)
        .lean();
      return plainTarotArr;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryFindManyByOriginalTarotIdError);
    }
  },

  deleteById: async (tarotId) => {
    try {
      const result = await Tarot?.deleteOne({ _id: tarotId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotDAODeleteByIdError);
    }
  },

  deleteByAnswer: async (tarotAnswer) => {
    try {
      // interpretation로 직접 삭제 - find 없이 바로 처리
      const result = await Tarot?.deleteOne({ interpretation: tarotAnswer });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteByAnswerError);
    }
  },

  deleteByCreatedAt: async (createdAt) => {
    try {
      // createdAt으로 직접 삭제 - deleteMany 사용으로 pool 부담 감소
      // createdAt이 유니크하므로 결과는 동일하지만 연속 클릭에 안전
      const result = await Tarot?.deleteMany({ createdAt: createdAt });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteByCreatedAtError);
    }
  },

  deleteManyByIdArr: async (tarotIdArr) => {
    try {
      // 배치 삭제로 변경: 여러 개의 쿼리 대신 하나의 쿼리로 처리
      // $in 연산자 사용 - 존재하지 않는 ID가 있어도 에러 발생하지 않음
      const result = await Tarot?.deleteMany({ _id: { $in: tarotIdArr } });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteManyByIdError);
    }
  },

  deleteManyByAnswerArr: async (tarotAnswerArr) => {
    try {
      // interpretation 배열로 직접 삭제 - find 없이 바로 처리
      const result = await Tarot?.deleteMany({
        interpretation: { $in: tarotAnswerArr },
      });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotDAODeleteManyByAnswerArrError);
    }
  },

  deleteManyByCreatedAtArr: async (createdAtArr) => {
    try {
      // createdAt 배열로 직접 삭제 - 유니크하고 신뢰성 높음
      const result = await Tarot?.deleteMany({
        createdAt: { $in: createdAtArr },
      });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteManyByCreatedAtArrError);
    }
  },

  deleteManyByUserId: async (userObjId) => {
    try {
      const result = await Tarot?.deleteMany({
        userId: userObjId,
      })?.lean();
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteManyByUserInfoError);
    }
  },

  deleteManyByUserIdAndLanguage: async (userObjId, language) => {
    try {
      const result = await Tarot?.deleteMany({
        userId: userObjId,
        language: language,
      });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteManyByUserIdAndLanguageError);
    }
  },

  deleteManyBySpread: async (readingConfig) => {
    try {
      const result = await Tarot?.deleteMany({ readingConfig })?.lean();
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteManyBySpreadError);
    }
  },

  deleteAll: async () => {
    try {
      const result = await Tarot?.deleteMany({});
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotRepositoryDeleteAllError);
    }
  },
};

module.exports = tarotRepository;
