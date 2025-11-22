import { z } from "zod";
import type UserValidators from "./user.validation.ts";

export type UploadProfilePictureBodyDtoType = z.infer<
  typeof UserValidators.uploadProfilePicture.body
>;
