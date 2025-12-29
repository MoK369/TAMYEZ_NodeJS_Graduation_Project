import type { Default__v, HydratedDocument, Require_id, Types } from "mongoose";
import type { PlatfromsEnum } from "../../utils/constants/enum.constants.ts";

export interface INotificationPushDevice {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  deviceId: string;

  notificationsEnabled: boolean;
  fcmToken: string;
  tokenLastUpdate?: Date;
  jwtTokenExpiresAt: Date;

  platfrom: PlatfromsEnum;
  appVersion: string;
  os: string;
  deviceModel: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FullINotificationPushDevice = Require_id<
  Default__v<INotificationPushDevice>
>;

export type HINotificationPushDevice =
  HydratedDocument<INotificationPushDevice>;
