import mongoose, { Model } from "mongoose";
import type { INotificationPushDevice } from "../interfaces/notification_push_device.interface.ts";
import ModelsNames from "../../utils/constants/models.names.constants.ts";
import { PlatfromsEnum } from "../../utils/constants/enum.constants.ts";

const notifictionPushDeviceSchema =
  new mongoose.Schema<INotificationPushDevice>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ModelsNames.userModel,
      },
      deviceId: {
        type: String,
        require: true,
      },

      notificationsEnabled: { type: Boolean, default: true },
      fcmToken: { type: String, required: true },
      tokenLastUpdate: { type: Date },
      jwtTokenExpiresAt: { type: Date, required: true },

      appVersion: { type: String, required: true },
      platfrom: { type: String, enum: Object.values(PlatfromsEnum) },
      os: { type: String, required: true },
      deviceModel: { type: String, required: true },

      isActive: { type: Boolean, default: true },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      id: false,
    }
  );

notifictionPushDeviceSchema.virtual("id").get(function () {
  return this._id;
});

notifictionPushDeviceSchema.index({ userId: 1, deviceId: 1 });

const NotificationPushDeviceModel =
  (mongoose.models.NotificationPushDevice as Model<INotificationPushDevice>) ||
  mongoose.model<INotificationPushDevice>(
    ModelsNames.notificationPushDevice,
    notifictionPushDeviceSchema
  );

export default NotificationPushDeviceModel;
