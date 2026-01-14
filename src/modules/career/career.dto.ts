import { z } from "zod";
import type CareerValidators from "./career.validation.ts";

export type CreateCareerBodyDto = z.infer<
  typeof CareerValidators.createCareer.body
>;

export type uploadCareerPictureParamsDto = z.infer<
  typeof CareerValidators.uploadCareerPicture.params
>;

export type uploadCareerPictureBodyDto = z.infer<
  typeof CareerValidators.uploadCareerPicture.body
>;
