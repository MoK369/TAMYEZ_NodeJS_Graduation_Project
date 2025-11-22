import { z } from "zod";
import generalValidationConstants from "../../utils/constants/validation.constants.js";
import fileValidation from "../../utils/multer/file_validation.multer.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
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
