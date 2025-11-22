import mongoose, { Model } from "mongoose";
import ModelsNames from "../../utils/constants/models.names.js";
const revokedTokenSchema = new mongoose.Schema({
    jti: { type: String, required: true },
    expiresIn: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ModelsNames.userModel,
    },
}, { timestamps: true });
const RevokedTokenModel = mongoose.models.RevokedToken ||
    mongoose.model(ModelsNames.revokedTokenModel, revokedTokenSchema);
export default RevokedTokenModel;
