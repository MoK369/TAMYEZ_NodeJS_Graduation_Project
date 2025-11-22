import type { Request, Response } from "express";
import successHandler from "../../utils/handlers/success.handler.ts";
import type { IProfileReponse } from "./user.entity.ts";
import type { UploadProfilePictureBodyDtoType } from "./user.dto.ts";
import S3Service from "../../utils/multer/s3.service.ts";
import S3FoldersPaths from "../../utils/multer/s3_folders_paths.ts";
import { ProvidersEnum } from "../../utils/constants/enum.constants.ts";
import DocumentFromat from "../../utils/formats/document.format.ts";

class UserService {
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    return successHandler<IProfileReponse>({ res, body: { user: req.user! } });
  };

  uploadProfilePicture = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { attachment } = req.body as UploadProfilePictureBodyDtoType;

    const subKey = await S3Service.uploadFile({
      File: attachment,
      Path: S3FoldersPaths.profileFolderPath(req.user!._id!.toString()),
    });

    await req.user!.updateOne({
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
