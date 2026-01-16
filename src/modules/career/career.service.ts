import type { Request, Response } from "express";
import { CareerModel } from "../../db/models/index.ts";
import {
  CareerRepository,
} from "../../db/repositories/index.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type {
  CreateCareerBodyDto,
  uploadCareerPictureBodyDto,
  uploadCareerPictureParamsDto,
} from "./career.dto.ts";
import {
  ConflictException,
  NotFoundException,
  ServerException,
} from "../../utils/exceptions/custom.exceptions.ts";
import type { ICareerResource } from "../../db/interfaces/common.interface.ts";
import EnvFields from "../../utils/constants/env_fields.constants.ts";
import S3Service from "../../utils/multer/s3.service.ts";
import IdSecurityUtil from "../../utils/security/id.security.ts";
import S3FoldersPaths from "../../utils/multer/s3_folders_paths.ts";
import S3KeyUtil from "../../utils/multer/s3_key.multer.ts";

class CareerService {
  private readonly _careerRepository = new CareerRepository(CareerModel);
  // private readonly _roadmapStepRepository = new RoadmapStepRepository(
  //   RoadmapStepModel
  // );

  // private getResourceSpecifiedStepsIds = (
  //   resources: ICareerResource[]
  // ): Set<string> => {
  //   const specifiedStepsIdsSet = new Set<string>();
  //   if (resources?.length) {
  //     for (const resource of resources) {
  //       if (
  //         resource.appliesTo === CareerResourceAppliesToEnum.specific &&
  //         resource.specifiedSteps?.length
  //       ) {
  //         resource.specifiedSteps.forEach((stepId) =>
  //           specifiedStepsIdsSet.add(stepId.toString())
  //         );
  //       }
  //     }
  //   }
  //   return specifiedStepsIdsSet;
  // };

  createCareer = async (req: Request, res: Response): Promise<Response> => {
    const { title, description, courses, youtubePlaylists, books } =
      req.validationResult.body as CreateCareerBodyDto;

    const careerExists = await this._careerRepository.findOne({
      filter: { title, paranoid: false },
    });
    if (careerExists) {
      throw new ConflictException(
        `Career title conflicts with another ${
          careerExists.freezed?.at ? "archived " : ""
        }career ❌`
      );
    }

    // check on specfiedSteps existence
    // const specifiedStepsIdsSet = new Set<string>();
    // specifiedStepsIdsSet.union(
    //   this.getResourceSpecifiedStepsIds(courses as unknown as ICareerResource[])
    // );
    // specifiedStepsIdsSet.union(
    //   this.getResourceSpecifiedStepsIds(
    //     youtubePlaylists as unknown as ICareerResource[]
    //   )
    // );
    // specifiedStepsIdsSet.union(
    //   this.getResourceSpecifiedStepsIds(books as unknown as ICareerResource[])
    // );

    // if (specifiedStepsIdsSet.size > 0) {
    //   const existingStepsCount =
    //     await this._roadmapStepRepository.countDocuments({
    //       filter: { _id: { $in: Array.from(specifiedStepsIdsSet) } },
    //     });

    //   if (existingStepsCount !== specifiedStepsIdsSet.size) {
    //     throw new NotFoundException(
    //       `One or more specifiedSteps do not exist ❌`
    //     );
    //   }
    // }

    const [newCareer] = await this._careerRepository.create({
      data: [
        {
          title,
          description,
          assetFolderId: IdSecurityUtil.generateAlphaNumericId(),
          pictureUrl: process.env[
            EnvFields.CAREER_DEFAULT_PICTURE_URL
          ] as string,
          courses: courses as unknown as ICareerResource[],
          youtubePlaylists: youtubePlaylists as unknown as ICareerResource[],
          books: books as unknown as ICareerResource[],
        },
      ],
    });

    if (!newCareer) {
      throw new ServerException(
        `Failed to create career, please try again later ☹️`
      );
    }

    return successHandler({ res, message: "Career created successfully ✅" });
  };

  uploadCareerPicture = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { careerId } = req.params as uploadCareerPictureParamsDto;
    const { attachment } = req.body as uploadCareerPictureBodyDto;

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
