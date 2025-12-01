import { z } from "zod";
import type UserValidators from "./user.validation.ts";

export type UploadProfilePictureBodyDtoType = z.infer<
  typeof UserValidators.uploadProfilePicture.body
>;

export type UpdateProfileBodyDtoType = z.infer<
  typeof UserValidators.updateProfile.body
>;

export type ChangePasswordBodyDtoType = z.infer<
  typeof UserValidators.changePassword.body
>;

export type LogoutBodyDtoType = z.infer<
  typeof UserValidators.logout.body
>;
