import z from "zod";
import StringConstants from "./strings.constants.js";
import AppRegex from "./regex.constants.js";
import { Types } from "mongoose";
import { StorageTypesEnum } from "./enum.constants.js";
import Stream from "node:stream";
const generalValidationConstants = {
    objectId: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
    }, { error: StringConstants.INVALID_USER_ID_MESSAGE }),
    fullName: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fullName") })
        .regex(AppRegex.fullNameRegex, StringConstants.NAME_VALIDATION_MESSAGE),
    email: z.email(StringConstants.INVALID_EMAIL_MESSAGE),
    password: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("password") })
        .regex(AppRegex.passwordRegex, StringConstants.PASSWORD_VALIDATION_MESSAGE),
    otp: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("otp") })
        .regex(AppRegex.otpRegex, {
        error: StringConstants.INVALID_OTP_VALIDATION_MESSAGE,
    }),
    confirmPasswordChecker: (data, ctx) => {
        if (data.confirmPassword !== data.password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: StringConstants.MISMATCH_CONFIRM_PASSWORD_MESSAGE,
            });
        }
    },
    phoneNumber: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("phoneNumber") })
        .regex(AppRegex.phoneNumberRegex, {
        error: StringConstants.PHONE_NUMBER_VALIDATION_MESSAGE,
    }),
    token: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("token") })
        .regex(AppRegex.tokenRegex, {
        error: StringConstants.INVALID_VALIDATION_TOKEN_MESSAGE,
    }),
    bearerWithToken: z
        .string({
        error: StringConstants.PATH_REQUIRED_MESSAGE("token"),
    })
        .regex(AppRegex.bearerWithTokenRegex, {
        error: StringConstants.INVALID_VALIDATION_BEARER_TOKEN_MESSAGE,
    }),
    fileKeys: function ({ storageApproach = StorageTypesEnum.memory, fieldName, mimetype, maxSize, }) {
        return z
            .strictObject({
            fieldname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z.string(),
            stream: z.instanceof(Stream.Readable).optional(),
            basePath: z
                .string()
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.disk)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("basePath") }),
            finalPath: z
                .string()
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.disk)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("finalPath") }),
            destination: z
                .string()
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.disk)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("destination") }),
            filename: z
                .string()
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.disk)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("filename") }),
            path: z
                .string()
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.disk)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("path") }),
            size: z.number().positive().max(maxSize),
            buffer: z
                .instanceof(Buffer)
                .refine((buffer) => buffer.length > 0)
                .optional()
                .refine((value) => {
                if (storageApproach === StorageTypesEnum.memory)
                    return !value ? false : true;
                return true;
            }, { error: StringConstants.PATH_REQUIRED_MESSAGE("buffer") }),
        }, { error: StringConstants.PATH_REQUIRED_MESSAGE("image") })
            .superRefine((data, ctx) => {
            if (data.fieldname !== fieldName) {
                ctx.addIssue({
                    code: "custom",
                    path: [fieldName],
                    message: StringConstants.PATH_REQUIRED_MESSAGE(fieldName),
                });
            }
            if (!mimetype.includes(data.mimetype)) {
                ctx.addIssue({
                    code: "custom",
                    path: [fieldName],
                    message: StringConstants.INVALID_FILE_MIMETYPE_MESSAGE(mimetype),
                });
            }
        });
    },
};
export default generalValidationConstants;
