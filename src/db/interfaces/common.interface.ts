import type { HydratedDocument, Require_id, Types } from "mongoose";
import type { OptionIdsEnum, ProvidersEnum } from "../../utils/constants/enum.constants.ts";
import type { Default__v } from "mongoose";

export interface IAtByObject {
  at: Date;
  by: Types.ObjectId;
}

export interface ICodExpireCoundObject {
  code: string;
  expiresAt: Date;
  count?: number;
}

export interface IProfilePictureObject {
  url: string;
  provider: ProvidersEnum;
}

export interface IIdSelectedAtObject {
  id: Types.ObjectId;
  selectedAt: Date;
}

export interface IQuizQuestionOption {
  id: OptionIdsEnum;
  text: string;
}
export type FullIQuizQuestionOption = Require_id<
  Default__v<IQuizQuestionOption>
>;
export type HIQuizQuestionOption = HydratedDocument<IQuizQuestionOption>;
