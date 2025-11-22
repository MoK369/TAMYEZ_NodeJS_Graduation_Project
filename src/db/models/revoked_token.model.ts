import mongoose, { Model } from "mongoose";
import type { IRevokedToken } from "../interfaces/revoked_token.interface.ts";
import ModelsNames from "../../utils/constants/models.names.ts";

const revokedTokenSchema = new mongoose.Schema<IRevokedToken>(
  {
    jti: { type: String, required: true },
    expiresIn: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: ModelsNames.userModel,
    },
  },
  { timestamps: true }
);

const RevokedTokenModel =
  (mongoose.models.RevokedToken as Model<IRevokedToken>) ||
  mongoose.model<IRevokedToken>(
    ModelsNames.revokedTokenModel,
    revokedTokenSchema
  );

export default RevokedTokenModel;
