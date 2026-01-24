import successHandler from "../../utils/handlers/success.handler.js";
import S3Service from "../../utils/multer/s3.service.js";
import S3FoldersPaths from "../../utils/multer/s3_folders_paths.js";
import { LogoutFlagsEnum, ProvidersEnum, } from "../../utils/constants/enum.constants.js";
import UpdateUtil from "../../utils/update/util.update.js";
import HashingSecurityUtil from "../../utils/security/hash.security.js";
import { BadRequestException, NotFoundException, VersionConflictException, } from "../../utils/exceptions/custom.exceptions.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import TokenSecurityUtil from "../../utils/security/token.security.js";
import { NotificationPushDeviceRepository, UserRepository, } from "../../db/repositories/index.js";
import NotificationPushDeviceModel from "../../db/models/notifiction_push_device.model.js";
import S3KeyUtil from "../../utils/multer/s3_key.multer.js";
import UserModel from "../../db/models/user.model.js";
class UserService {
    _notificationPushDeviceRepository = new NotificationPushDeviceRepository(NotificationPushDeviceModel);
    _userResository = new UserRepository(UserModel);
    getProfile = async (req, res) => {
        return successHandler({ res, body: { user: req.user } });
    };
    uploadProfilePicture = async (req, res) => {
        const { attachment, v } = req.body;
        if (!(await this._userResository.exists({
            filter: { _id: req.user._id, __v: v },
        }))) {
            throw new VersionConflictException(StringConstants.INVALID_VERSION_MESSAGE);
        }
        const subKey = await S3Service.uploadFile({
            File: attachment,
            Path: S3FoldersPaths.profileFolderPath(req.user._id.toString()),
        });
        const result = await this._userResository
            .updateOne({
            filter: { _id: req.user?._id, __v: v },
            update: {
                profilePicture: {
                    url: subKey,
                    provide: ProvidersEnum.local,
                },
            },
        })
            .catch(async (error) => {
            await S3Service.deleteFile({
                SubKey: subKey,
            });
            throw error;
        });
        if (result.matchedCount) {
            if (req.user?.profilePicture &&
                req.user.profilePicture.provider === ProvidersEnum.local) {
                await S3Service.deleteFile({
                    SubKey: req.user.profilePicture.url,
                });
            }
        }
        else {
            await S3Service.deleteFile({
                SubKey: subKey,
            });
        }
        return successHandler({
            res,
            body: { url: S3KeyUtil.generateS3UploadsUrlFromSubKey(subKey) },
        });
    };
    updateProfile = async (req, res) => {
        const { firstName, lastName, phoneNumber, gender, v } = req.body;
        const updatedObject = UpdateUtil.getChangedFields({
            document: req.user,
            updatedObject: { firstName, lastName, phoneNumber, gender },
        });
        if (updatedObject.gender && req.user.gender) {
            throw new BadRequestException("Gender can't be changed after first selection 🚻");
        }
        await this._userResository.updateOne({
            filter: { _id: req.user._id, __v: v },
            update: { ...updatedObject },
        });
        return successHandler({ res });
    };
    changePassword = async (req, res) => {
        const { currentPassword, newPassword, flag, v } = req.validationResult
            .body;
        if (!(await HashingSecurityUtil.compareHash({
            plainText: currentPassword,
            cipherText: req.user.password,
        }))) {
            throw new BadRequestException(StringConstants.INVALID_PARAMETER_MESSAGE("currentPassword"));
        }
        const updateObject = {};
        switch (flag) {
            case LogoutFlagsEnum.all:
                updateObject.changeCredentialsTime = new Date();
                break;
            case LogoutFlagsEnum.one:
                await TokenSecurityUtil.revoke({
                    flag,
                    userId: req.user._id,
                    tokenPayload: req.tokenPayload,
                });
                break;
            default:
                break;
        }
        await this._userResository.updateOne({
            filter: { _id: req.user._id, __v: v },
            update: { password: newPassword, ...updateObject },
        });
        return successHandler({ res });
    };
    logout = async (req, res) => {
        const { flag, deviceId } = req.validationResult.body;
        if (deviceId) {
            const pushDeviceResult = await this._notificationPushDeviceRepository.updateOne({
                filter: { userId: req.user._id, deviceId, __v: undefined },
                update: {
                    isActive: false,
                    $unset: { fcmToken: true },
                },
            });
            if (!pushDeviceResult?.matchedCount) {
                throw new NotFoundException("Invalid deviceId, or notification is disabled ❌");
            }
        }
        await TokenSecurityUtil.revoke({
            flag,
            userId: req.user._id,
            tokenPayload: req.tokenPayload,
        });
        return successHandler({ res });
    };
}
export default UserService;
