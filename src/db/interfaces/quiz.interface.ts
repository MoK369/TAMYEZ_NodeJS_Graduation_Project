import type { Default__v, HydratedDocument, Require_id, Types } from "mongoose";
import type { QuizTypesEnum } from "../../utils/constants/enum.constants.ts";
import type { IAtByObject } from "./common.interface.ts";

export interface IQuiz {
  id?: Types.ObjectId | undefined;

  title: string;
  description: string;

  aiPrompt: string;

  type: QuizTypesEnum;
  duration?: number; // in seconds

  createdAt: Date;
  updatedAt: Date;

  createdBy: Types.ObjectId;

  freezed: IAtByObject;
  restored: IAtByObject;
}

export type FullIQuiz = Require_id<Default__v<IQuiz>>;

export type HIQuiz = HydratedDocument<IQuiz>;
