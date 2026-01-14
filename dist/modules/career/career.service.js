import { CareerModel } from "../../db/models/index.js";
import { CareerRepository } from "../../db/repositories/index.js";
import successHandler from "../../utils/handlers/success.handler.js";
import { ConflictException, NotFoundException, ServerException, } from "../../utils/exceptions/custom.exceptions.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
import S3Service from "../../utils/multer/s3.service.js";
import IdSecurityUtil from "../../utils/security/id.security.js";
import S3FoldersPaths from "../../utils/multer/s3_folders_paths.js";
import S3KeyUtil from "../../utils/multer/s3_key.multer.js";
class CareerService {
    _careerRepository = new CareerRepository(CareerModel);
    createCareer = async (req, res) => {
        const { title, description, courses, youtubePlaylists, books } = req.body;
        const careerExists = await this._careerRepository.findOne({
            filter: { title, paranoid: false },
        });
        if (careerExists) {
            throw new ConflictException(`Career title conflicts with another ${careerExists.freezed?.at ? "archived " : ""}career ❌`);
        }
        const [newCareer] = await this._careerRepository.create({
            data: [
                {
                    title,
                    description,
                    assetFolderId: IdSecurityUtil.generateAlphaNumericId(),
                    pictureUrl: process.env[EnvFields.CAREER_DEFAULT_PICTURE_URL],
                    courses: courses,
                    youtubePlaylists: youtubePlaylists,
                    books: books,
                },
            ],
        });
        if (!newCareer) {
            throw new ServerException(`Failed to create career, please try again later ☹️`);
        }
        return successHandler({ res, message: "Career created successfully ✅" });
    };
    uploadCareerPicture = async (req, res) => {
        const { careerId } = req.params;
        const { attachment } = req.body;
        const career = await this._careerRepository.findOne({
            filter: { _id: careerId },
        });
        if (!career) {
            throw new NotFoundException("Invalid careerId or career freezed ❌");
        }
        const [_, subKey] = await Promise.all([
            career.pictureUrl &&
                career.pictureUrl != process.env[EnvFields.CAREER_DEFAULT_PICTURE_URL]
                ? S3Service.deleteFile({ SubKey: career.pictureUrl })
                : undefined,
            S3Service.uploadFile({
                File: attachment,
                Path: S3FoldersPaths.careerFolderPath(career.assetFolderId),
            }),
        ]);
        await career.updateOne({ pictureUrl: subKey });
        return successHandler({
            res,
            body: {
                pictureUrl: S3KeyUtil.generateS3UploadsUrlFromSubKey(subKey),
            },
        });
    };
}
export default CareerService;
