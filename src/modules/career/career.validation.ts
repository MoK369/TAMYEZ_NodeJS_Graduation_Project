import { z } from "zod";
import {
  CareerResourceAppliesToEnum,
  LanguagesEnum,
  RoadmapStepPricingTypesEnum,
} from "../../utils/constants/enum.constants.ts";
import generalValidationConstants from "../../utils/constants/validation.constants.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";
import AppRegex from "../../utils/constants/regex.constants.ts";

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
            message: "specifiendSteps are missing or less then 2 ❌",
          });
        }
      }),
  };

  static createCareer = {
    body: z.strictObject({
      title: z
        .string()
        .regex(AppRegex.careerTitleRegex, {
          error:
            "Career title must follow this format: [Domain Words] [Role Type] (Optional Focus), e.g., Mobile Developer (iOS) or Data Scientist (NLP).",
        })
        .min(3)
        .max(100),
      description: z.string().min(5).max(10_000),
      courses: z.array(this.careerResource.body).optional(),
      youtubePlaylists: z.array(this.careerResource.body).optional(),
      books: z.array(this.careerResource.body).optional(),
    }),
  };
}

export default CareerValidators;
