import type { Types } from "mongoose";
import type { ProvidersEnum } from "../../utils/constants/enum.constants.ts";

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

