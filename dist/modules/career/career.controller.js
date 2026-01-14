import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import Auths from "../../middlewares/auths.middleware.js";
import careerAuthorizationEndpoints from "./career.authorization.js";
import CareerService from "./career.service.js";
import CareerValidators from "./career.validation.js";
import RoutePaths from "../../utils/constants/route_paths.constants.js";
import CloudMulter from "../../utils/multer/cloud.multer.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
import fileValidation from "../../utils/multer/file_validation.multer.js";
import { StorageTypesEnum } from "../../utils/constants/enum.constants.js";
import StringConstants from "../../utils/constants/strings.constants.js";
const careerRouter = Router();
const careerService = new CareerService();
careerRouter.post(RoutePaths.createCareer, Auths.combined({ accessRoles: careerAuthorizationEndpoints.createCareer }), validationMiddleware({ schema: CareerValidators.createCareer }), careerService.createCareer);
careerRouter.patch(RoutePaths.uploadCareerPicture, Auths.combined({ accessRoles: careerAuthorizationEndpoints.createCareer }), CloudMulter.handleSingleFileUpload({
    fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
    maxFileSize: Number(process.env[EnvFields.CAREER_PICTURE_SIZE]),
    validation: fileValidation.image,
    storageApproach: StorageTypesEnum.memory,
}), validationMiddleware({ schema: CareerValidators.uploadCareerPicture }), careerService.uploadCareerPicture);
export default careerRouter;
