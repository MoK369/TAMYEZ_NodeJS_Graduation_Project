import { z } from "zod";
import {
  CareerResourceAppliesToEnum,
  LanguagesEnum,
  RoadmapStepPricingTypesEnum,
} from "../../utils/constants/enum.constants.ts";
import generalValidationConstants from "../../utils/constants/validation.constants.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";
import AppRegex from "../../utils/constants/regex.constants.ts";
import fileValidation from "../../utils/multer/file_validation.multer.ts";
import EnvFields from "../../utils/constants/env_fields.constants.ts";

class CareerValidators {
  static roadmapStepResource = {
    body: z.strictObject({
      title: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("title") })
        .min(3)
        .max(300),
      url: z.url(),
      pricingType: z.enum(RoadmapStepPricingTypesEnum),
      language: z.enum(LanguagesEnum),
    }),
  };

  static careerResource = {
    body: this.roadmapStepResource.body
      .extend({
        appliesTo: z.enum(CareerResourceAppliesToEnum),
        specifiedSteps: z.array(generalValidationConstants.objectId).optional(),
      })
      .superRefine((data, ctx) => {
        if (
          data.appliesTo == CareerResourceAppliesToEnum.specific &&
          (!data.specifiedSteps?.length || !(data.specifiedSteps.length > 1))
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["specifiedSteps"],
            message: "specifiedSteps are missing or less then 2 ❌",
          });
        }
      }),
  };

  static createCareer = {
    body: z
      .strictObject({
        title: z
          .string()
          .regex(AppRegex.careerTitleRegex, {
            error:
              "Career title must follow this format: [Domain Words] [Role Type] (Optional Focus), e.g., Mobile Developer (iOS) or Data Scientist (NLP).",
          })
          .min(3)
          .max(100),
        description: z.string().min(5).max(10_000),
        courses: z
          .array(this.careerResource.body)
          .max(5)
          .optional()
          .default([]),
        youtubePlaylists: z
          .array(this.careerResource.body)
          .max(5)
          .optional()
          .default([]),
        books: z.array(this.careerResource.body).max(5).optional().default([]),
      })
      .superRefine((data, ctx) => {
        if (
          data.courses?.length &&
          data.courses.findIndex(
            (c) => c.url.includes("youtube.com") || c.url.includes("youtu.be")
          ) !== -1
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["courses"],
            message: "Some courses have YouTube URLs ❌",
          });
        }

        if (
          data.youtubePlaylists?.length &&
          data.youtubePlaylists.findIndex(
            (c) =>
              !(c.url.includes("youtube.com") || c.url.includes("youtu.be"))
          ) !== -1
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["youtubePlaylists"],
            message: "Some youtube playlists have non-YouTube URLs ❌",
          });
        }

        if (
          new Set(data.courses.map((c) => c.title)).size !==
            data.courses.length ||
          new Set(data.courses.map((c) => c.url)).size !== data.courses.length
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["courses"],
            message: "Duplicate titles or urls found in courses ❌",
          });
        }

        if (
          new Set(data.youtubePlaylists.map((c) => c.title)).size !==
            data.youtubePlaylists.length ||
          new Set(data.youtubePlaylists.map((c) => c.url)).size !==
            data.youtubePlaylists.length
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["youtubePlaylists"],
            message: "Duplicate titles or urls found in youtube playlists ❌",
          });
        }

        if (
          new Set(data.books.map((c) => c.title)).size !== data.books.length ||
          new Set(data.books.map((c) => c.url)).size !== data.books.length
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["books"],
            message: "Duplicate titles or urls found in books ❌",
          });
        }
      }),
  };

  static uploadCareerPicture = {
    params: z.strictObject({
      careerId: generalValidationConstants.objectId,
    }),
    body: z.strictObject({
      attachment: generalValidationConstants.fileKeys({
        fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
        maxSize: Number(process.env[EnvFields.CAREER_PICTURE_SIZE]),
        mimetype: fileValidation.image,
      }),
    }),
  };
}

export default CareerValidators;
