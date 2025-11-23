import { Router } from "express";
import RoutePaths from "../../utils/constants/route_paths.constants.js";
import Auths from "../../middlewares/auths.middleware.js";
import UserService from "./user.service.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import UserValidators from "./user.validation.js";
import CloudMulter from "../../utils/multer/cloud.multer.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import fileValidation from "../../utils/multer/file_validation.multer.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
const userRouter = Router();
const userService = new UserService();
userRouter.get(RoutePaths.userProfile, Auths.authenticationMiddleware(), userService.getProfile);
userRouter.patch(RoutePaths.profilePicture, Auths.authenticationMiddleware(), CloudMulter.handleSingleFileUpload({
    fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
    maxFileSize: Number(process.env[EnvFields.PROFILE_PICTURE_SIZE]),
    validation: fileValidation.image,
}), validationMiddleware({ schema: UserValidators.uploadProfilePicture }), userService.uploadProfilePicture);
export default userRouter;
