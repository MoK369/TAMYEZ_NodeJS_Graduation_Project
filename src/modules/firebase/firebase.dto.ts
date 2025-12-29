import { z } from "zod";
import FirebaseValidators from "./firebase.validation.ts";

export type SendNotificationBodyDtoType = z.infer<
  typeof FirebaseValidators.sendNotification.body
>;

export type SendMultipleNotificationsBodyDtoType = z.infer<
  typeof FirebaseValidators.sendMultiNotifications.body
>;

export type EnableNotificationsBodyDtoType = z.infer<
  typeof FirebaseValidators.enableNotifications.body
>;
