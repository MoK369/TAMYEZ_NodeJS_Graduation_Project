import successHandler from "../../utils/handlers/success.handler.js";
import S3Service from "../../utils/multer/s3.service.js";
import S3FoldersPaths from "../../utils/multer/s3_folders_paths.js";
import { ProvidersEnum } from "../../utils/constants/enum.constants.js";
import DocumentFromat from "../../utils/formats/document.format.js";
class UserService {
    getProfile = async (req, res) => {
        return successHandler({ res, body: { user: req.user } });
    };
    uploadProfilePicture = async (req, res) => {
        const { attachment } = req.body;
        const subKey = await S3Service.uploadFile({
            File: attachment,
            Path: S3FoldersPaths.profileFolderPath(req.user._id.toString()),
        });
        await req.user.updateOne({
            profilePicture: {
                url: subKey,
                provide: ProvidersEnum.local,
            },
        });
        return successHandler({
            res,
            body: { url: DocumentFromat.getFullURLFromSubKey(subKey) },
        });
    };
}
export default UserService;
