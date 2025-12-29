import { z } from "zod";
import AppRegex from "../../utils/constants/regex.constants.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";
import { platform } from "os";
import { PlatfromsEnum } from "../../utils/constants/enum.constants.ts";

class FirebaseValidators {
  static readonly sendNotification = {
    body: z.strictObject({
      title: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("title") })
        .min(3)
        .max(200),
      body: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("body") })
        .min(5)
        .max(1000),
      imageUrl: z.url().optional(),
      fcmToken: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fcmToken") })
        .regex(AppRegex.fcmTokenRegex, { error: "Invalid FCM Token" }),
    }),
  };

  static readonly sendMultiNotifications = {
    body: z.strictObject({
      title: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("title") })
        .min(3)
        .max(200),
      body: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("body") })
        .min(5)
        .max(1000),
      imageUrl: z.url().optional(),
      fcmTokens: z.array(
        z
          .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fcmToken") })
          .regex(AppRegex.fcmTokenRegex, { error: "Invalid FCM Token ❌" })
      ),
    }),
  };

  static readonly enableNotifications = {
    body: z.strictObject({
      deviceId: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("deviceId") })
        .regex(AppRegex.deviceIdRegex, {
          error: "Invalid deviceId, it should be a valid UUID ❌",
        }),
      replaceDeviceId: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("deviceId") })
        .regex(AppRegex.deviceIdRegex, {
          error: "Invalid deviceId, it should be a valid UUID ❌",
        })
        .optional(),
      fcmToken: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fcmToken") })
        .regex(AppRegex.fcmTokenRegex, { error: "Invalid fcmToken format ❌" }),

      appVersion: z
        .string({
          error: StringConstants.PATH_REQUIRED_MESSAGE("appVersion"),
        })
        .regex(AppRegex.appVersionRegex, {
          error:
            "appVersion must consists from 2 to 4 parts each separated by a dot e.g: 1.0, 1.0.0, 1.0.0.0 ❌",
        }),

      platform: z.enum(Object.values(PlatfromsEnum)),
      os: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("os") })
        .regex(AppRegex.osRegex, {
          error:
            "Invalid os ❌, it must be either Android, IOS, or Web followed by version number e.g Android 11",
        }),
      deviceModel: z
        .string({
          error: StringConstants.PATH_REQUIRED_MESSAGE("deviceModel"),
        })
        .regex(AppRegex.deviceModelRegex, {
          error: "Invalid device model format ❌",
        }),
    }),
  };
}

export default FirebaseValidators;
