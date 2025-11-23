import { z } from "zod";
import UploadsValidators from "./uploads.validation.ts";

export type GetFileFromSubKeyQueryDtoType = z.infer<
  typeof UploadsValidators.getFileFromSubKey.query
>;
export type GetFileFromSubKeyParamsDtoType = z.infer<
  typeof UploadsValidators.getFileFromSubKey.params
>;
