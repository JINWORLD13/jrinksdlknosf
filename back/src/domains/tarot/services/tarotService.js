const { tarotRepository } = require("../repositories/index");
const { userRepository } = require("../../user/repositories/index");
const {
  commonErrors,
  wrapError,
  createError,
} = require("../../../common/errors");

class TarotService {
  // 생성
  // 作成
  // Create
  async createTarot(tarotInfo, session = null) {
    try {
      const newTarot = await tarotRepository.create(tarotInfo, session);
      return newTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceCreateError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 조회 (ID 기준)
  // 照会 (ID 基準)
  // Get by ID
  async getTarotById(tarotId) {
    try {
      const tarotInDB = await tarotRepository.findById(tarotId);
      if (tarotInDB === null) {
        throw createError(commonErrors.tarotNotFoundError, { statusCode: 404 });
      }
      return tarotInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceGetTarotByIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 업데이트 (ID 기준)
  // 更新 (ID 基準)
  // Update by ID
  async updateTarotById(tarotId, updateData, session = null) {
    try {
      const updatedTarot = await tarotRepository.updateById(
        tarotId,
        updateData,
        session,
      );
      if (updatedTarot === null) {
        throw createError(commonErrors.tarotNotFoundError, { statusCode: 404 });
      }
      return updatedTarot;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceUpdateTarotByIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 여러 타로 조회 (ID 배열 기준)
  // 複数タロット照会 (ID 配列基準)
  // Get multiple tarots by ID array
  async getTarotsById(tarotId) {
    try {
      const tarotArrInDB = await tarotRepository.findManyById(tarotId);
      if (!tarotArrInDB || tarotArrInDB.length === 0) {
        throw createError(commonErrors.tarotsInfoNotFoundError, {
          statusCode: 404,
        });
      }
      return tarotArrInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceGetTarotsByIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 히스토리 조회 (userObjId 기준)
  // 履歴照会 (userObjId 基準)
  // Get history by userObjId
  async getHistoryByUserId(userObjId) {
    try {
      const userHistory = await tarotRepository.findHistoryByUserId(userObjId);
      if (!userHistory || userHistory.length === 0) {
        throw createError(commonErrors.historyNotFoundError, {
          statusCode: 404,
        });
      }
      return userHistory;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceGetHistoryByUserIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 스프레드 기준 타로 조회
  // スプレッド基準タロット照会
  // Get tarots by spread
  async getTarotsBySpread(readingConfig) {
    try {
      const tarotArrInDB =
        await tarotRepository.findManyBySpread(readingConfig);
      if (!tarotArrInDB || tarotArrInDB.length === 0) {
        throw createError(commonErrors.tarotsInfoNotFoundError, {
          statusCode: 404,
        });
      }
      return tarotArrInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceGetTarotsBySpreadError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 추가 질문 조회 (원본 타로 ID 기준)
  // 追加質問照会 (元のタロットID基準)
  // Get additional questions by original tarot ID
  async getAdditionalQuestionsByOriginalTarotId(originalTarotId) {
    try {
      const additionalQuestions =
        await tarotRepository.findAdditionalQuestionsByOriginalTarotId(
          originalTarotId,
        );
      if (!additionalQuestions || additionalQuestions.length === 0) {
        // 추가 질문이 없는 것은 에러가 아님 (빈 배열 반환)
        // 追加質問がないのはエラーではない (空の配列を返す)
        // No additional questions is not an error (return empty array)
        return [];
      }
      return additionalQuestions;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceGetAdditionalQuestionsByOriginalTarotIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 삭제 (answer 기준)
  // 削除 (answer 基準)
  // Delete by answer
  async deleteTarotByAnswer(tarotAnswer) {
    try {
      // 불필요한 find 조회 제거: answer로 바로 삭제
      const deletedTarot = await tarotRepository.deleteByAnswer(tarotAnswer);
      return deletedTarot;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotsByUserObjIdError,
      );
    }
  }

  // 삭제 (createdAt 기준)
  // 削除 (createdAt 基準)
  // Delete by createdAt
  async deleteTarotByCreatedAt(createdAt) {
    try {
      const deletedTarot = await tarotRepository.deleteByCreatedAt(createdAt);
      if (!deletedTarot) {
        throw createError(commonErrors.tarotNotFoundError, { statusCode: 404 });
      }
      return deletedTarot;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotByCreatedAtError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (answerArr 기준)
  // 一括削除 (answerArr 基準)
  // Bulk delete by answerArr
  async deleteTarotsByAnswerArr(tarotAnswerArr) {
    try {
      // 불필요한 find 조회 제거: answer 배열로 바로 삭제
      const deletedTarots =
        await tarotRepository.deleteManyByAnswerArr(tarotAnswerArr);
      return deletedTarots;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotsByAnswerArrError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (createdAtArr 기준)
  // 一括削除 (createdAtArr 基準)
  // Bulk delete by createdAtArr
  async deleteTarotsByCreatedAtArr(createdAtArr) {
    try {
      // createdAt 배열로 바로 삭제 - 유니크하고 신뢰성 높음
      const deletedTarots =
        await tarotRepository.deleteManyByCreatedAtArr(createdAtArr);
      return deletedTarots;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotsByCreatedAtArrError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  async deleteTarotsByUserObjId(userObjId) {
    try {
      // 불필요한 find 조회 제거: userId로 바로 삭제
      const result = await tarotRepository.deleteManyByUserId(userObjId);
      return result;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotsByUserObjIdError,
      );
    }
  }

  // 일괄 삭제 (userObjId 및 언어 기준)
  // 一括削除 (userObjId および 言語 基準)
  // Bulk delete by userObjId and language
  async deleteTarotsByUserObjIdAndLanguage(userObjId, language) {
    try {
      // userId + language로 바로 삭제 (전체 삭제용)
      const deletedTarots = await tarotRepository.deleteByUserObjIdAndLanguage(
        userObjId,
        language,
      );
      if (!deletedTarots) {
        throw createError(commonErrors.tarotNotFoundError, { statusCode: 404 });
      }
      return deletedTarots;
    } catch (err) {
      if (
        err.name ===
        commonErrors.tarotRepositoryDeleteByUserObjIdAndLanguageError
      )
        throw err;
      throw wrapError(
        err,
        commonErrors.tarotServiceDeleteTarotsByUserObjIdAndLanguageError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (스프레드 기준)
  // 一括削除 (スプレッド 基準)
  // Bulk delete by spread
  async deleteTarotsBySpread(readingConfig) {
    try {
      // 불필요한 find 조회 제거: readingConfig로 바로 삭제
      const deletedTarots =
        await tarotRepository.deleteManyBySpread(readingConfig);
      return deletedTarots;
    } catch (err) {
      throw wrapError(err, commonErrors.tarotServiceDeleteTarotsBySpreadError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
}
const tarotService = new TarotService();

module.exports = tarotService;
