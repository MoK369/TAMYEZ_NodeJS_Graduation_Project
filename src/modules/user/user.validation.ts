import { z } from "zod";
import generalValidationConstants from "../../utils/constants/validation.constants.ts";
import fileValidation from "../../utils/multer/file_validation.multer.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";
import EnvFields from "../../utils/constants/env_fields.constants.ts";

class UserValidators {
  static uploadProfilePicture = {
    body: z.strictObject({
      attachment: generalValidationConstants.fileKeys({
        fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
        maxSize: Number(process.env[EnvFields.PROFILE_PICTURE_SIZE]),
        mimetype: fileValidation.image,
      }),
    }),
  };
}

export default UserValidators;
