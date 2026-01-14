import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import careerAuthorizationEndpoints from "./career.authorization.ts";
import CareerService from "./career.service.ts";
import CareerValidators from "./career.validation.ts";
import RoutePaths from "../../utils/constants/route_paths.constants.ts";
import CloudMulter from "../../utils/multer/cloud.multer.ts";
import EnvFields from "../../utils/constants/env_fields.constants.ts";
import fileValidation from "../../utils/multer/file_validation.multer.ts";
import { StorageTypesEnum } from "../../utils/constants/enum.constants.js";
import StringConstants from "../../utils/constants/strings.constants.ts";

const careerRouter = Router();

const careerService = new CareerService();

careerRouter.post(
  RoutePaths.createCareer,
  Auths.combined({ accessRoles: careerAuthorizationEndpoints.createCareer }),
  validationMiddleware({ schema: CareerValidators.createCareer }),
  careerService.createCareer
);

careerRouter.patch(
  RoutePaths.uploadCareerPicture,
  Auths.combined({ accessRoles: careerAuthorizationEndpoints.createCareer }),
  CloudMulter.handleSingleFileUpload({
    fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
    maxFileSize: Number(process.env[EnvFields.CAREER_PICTURE_SIZE]),
    validation: fileValidation.image,
    storageApproach: StorageTypesEnum.memory,
  }),
  validationMiddleware({ schema: CareerValidators.uploadCareerPicture }),
  careerService.uploadCareerPicture
);

export default careerRouter;
