import type { MailOptions } from "nodemailer/lib/json-transport/index.js";
import type { IssueObjectType } from "../types/issue_object.type.ts";
import type { ErrorCodesEnum } from "./enum.constants.ts";
import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";
import type Stream from "node:stream";

export interface IAppError extends Error {
  statusCode?: number;
  code?: ErrorCodesEnum;
  details?: IssueObjectType[] | undefined;
}

export interface IExtendedMailOptions extends MailOptions {
  otpOrLink: string;
  to: string;
}

export interface ITokenPayload extends JwtPayload {
  id: Types.ObjectId;
  jti: string;
}

export interface IMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  stream?: Stream.Readable | undefined;
  size: number;
  /** `DiskStorage` only: Directory to which this file has been uploaded. */
  destination?: string | undefined;
  /** `DiskStorage` only: Name of this file within `destination`. */
  filename?: string | undefined;
  /** `DiskStorage` only: Full path to the uploaded file. */
  path?: string | undefined;
  /** `MemoryStorage` only: A Buffer containing the entire file. */
  buffer?: Buffer | undefined;
}
