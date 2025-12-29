import type { Request, Response } from "express";
import NotificationService from "../../utils/firebase/services/notifications/notification.service.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type {
  EnableNotificationsBodyDtoType,
  SendMultipleNotificationsBodyDtoType,
  SendNotificationBodyDtoType,
} from "./firebase.dto.ts";
import { NotificationPushDeviceRepository } from "../../db/repositories/index.ts";
import NotificationPushDeviceModel from "../../db/models/notifiction_push_device.model.ts";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/exceptions/custom.exceptions.ts";

class FirebaseService {
  private readonly _notificationService = new NotificationService();
  private readonly _notificationPushDeviceRepository =
    new NotificationPushDeviceRepository(NotificationPushDeviceModel);

  sendFirebaseNotification = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { title, body, imageUrl, fcmToken } =
      req.body as SendNotificationBodyDtoType;

    await this._notificationService.sendNotification({
      title,
      body,
      imageUrl,
      deviceToken: fcmToken,
    });

    return successHandler({
      res,
      message: "Notification Sent Successfully 🔔",
    });
  };

  sendMultipleFirebaseNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { title, body, imageUrl, fcmTokens } =
      req.body as SendMultipleNotificationsBodyDtoType;

    const response = await this._notificationService.sendMultipleNotifications({
      title,
      body,
      imageUrl,
      deviceTokens: fcmTokens,
    });

    return successHandler({
      res,
      message: "Notifications Sent Successfully 🔔",
      body: { response },
    });
  };

  enableNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { deviceId, replaceDeviceId } =
      req.body as EnableNotificationsBodyDtoType;

    const pushDevices = await this._notificationPushDeviceRepository.find({
      filter: { userId: req.user!._id },
    });

    if (pushDevices?.length) {
      if (pushDevices.length >= 2) {
        let bothEnabled = true;
        for (const device of pushDevices) {
          if (!device.notificationsEnabled) {
            bothEnabled = false;
            break;
          }
        }
        if (bothEnabled && !replaceDeviceId) {
          throw new BadRequestException(
            "You have two enabled push Device, choose one to replace:",
            undefined,
            pushDevices
          );
        }
        if (
          pushDevices.findIndex((p) => p.deviceId === replaceDeviceId) == -1
        ) {
          throw new NotFoundException(
            "Invalid replaceDeviceId not found for this user ❌"
          );
        }
      }
    }

    return successHandler({ res });
  };
}

export default FirebaseService;
