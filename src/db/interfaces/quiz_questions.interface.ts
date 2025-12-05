import type { Default__v, HydratedDocument, Require_id, Types } from "mongoose";
import type { QuestionTypesEnum } from "../../utils/constants/enum.constants.ts";

export interface IQuestion {
  id?: Types.ObjectId;
  text: string;
  type: QuestionTypesEnum;
  options?: string[] | undefined;
  correctAnswer?: string | string[] | undefined;
}

export type FullIQuestion = Require_id<Default__v<IQuestion>>;

export type HIQuestion = HydratedDocument<IQuestion>;

export interface IQuizQuestions {
  id?: Types.ObjectId;

  quizId: Types.ObjectId;

  userId: Types.ObjectId;

  writtenQuestionsIndexes?: number[];
  correctAnswersMap: Map<string, string | string[]>;

  questions: IQuestion[];
  
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type FullIQuizQuestions = Require_id<Default__v<IQuizQuestions>>;

export type HIQuizQuestions = HydratedDocument<IQuizQuestions>;
