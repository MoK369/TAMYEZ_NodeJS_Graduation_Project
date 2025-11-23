import type { Default__v, HydratedDocument, Require_id, Types } from "mongoose";

export interface IRevokedToken {
  jti: string;
  expiresIn: number;
  userId: Types.ObjectId;

  createdAt?: Date;
  updateAt?: Date;
}

export type FullIRevokedToken = Require_id<Default__v<IRevokedToken>>;

export type HIRevokedToken = HydratedDocument<IRevokedToken>;
