import { z } from "zod";
import StringConstants from "../../utils/constants/strings.constants.ts";
import { QuizTypesEnum } from "../../utils/constants/enum.constants.ts";
import AppRegex from "../../utils/constants/regex.constants.ts";
import generalValidationConstants from "../../utils/constants/validation.constants.ts";

class QuizValidators {
  static createQuiz = {
    body: z
      .strictObject({
        title: z
          .string()
          .regex(AppRegex.quizTitleRegex, {
            error:
              "Quiz title must consists of words each start with a capital letter followed by at least a small letter length between 3 and 200 charachters 🔠",
          })
          .optional(),
        description: z
          .string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("description"),
          })
          .min(3)
          .max(50_000),
        aiPrompt: z
          .string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("aiPrompt"),
          })
          .min(3)
          .max(50_000),
        type: z
          .enum(Object.values(QuizTypesEnum), {
            error: StringConstants.INVALID_ENUM_VALUE_MESSAGE({
              enumValueName: "quiz type",
              theEnum: QuizTypesEnum,
            }),
          })
          .optional()
          .default(QuizTypesEnum.stepQuiz),
        duration: z
          .number({
            error: StringConstants.INVALID_VALIDATION_DURATION_MESSAGE,
          })
          .int({ error: StringConstants.INVALID_VALIDATION_DURATION_MESSAGE })
          .min(60)
          .max(36_000)
          .optional(),
        tags: z.array(z.string().toLowerCase()).min(2).max(20).optional(),
      })
      .superRefine((data, ctx) => {
        if (
          data.type !== QuizTypesEnum.careerAssesment &&
          data.title == undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["title"],
            message: StringConstants.PATH_REQUIRED_MESSAGE("title"),
          });
        } else if (
          data.type === QuizTypesEnum.careerAssesment &&
          data.title != undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["title"],
            message: `quiz with type ${QuizTypesEnum.careerAssesment} its title is set by default ⚠️`,
          });
        }

        if (
          data.type !== QuizTypesEnum.careerAssesment &&
          data.duration == undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["duration"],
            message: StringConstants.PATH_REQUIRED_MESSAGE("duration"),
          });
        } else if (
          data.type === QuizTypesEnum.careerAssesment &&
          data.duration != undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["duration"],
            message: StringConstants.INVALID_DURATION_EXIST_MESSAGE,
          });
        }

        if (data.type !== QuizTypesEnum.careerAssesment && !data.tags?.length) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: StringConstants.PATH_REQUIRED_MESSAGE("tags"),
          });
        } else if (
          data.type === QuizTypesEnum.careerAssesment &&
          data.tags?.length
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: `${StringConstants.CAREER_ASSESSMENT} should not have tags`,
          });
        }
      })
      .transform((data) => {
        if (
          data.type === QuizTypesEnum.careerAssesment &&
          !data.title &&
          !data.tags?.length
        ) {
          return {
            ...data,
            title: StringConstants.CAREER_ASSESSMENT,
            tags: ["initial", "assessment"],
          };
        }
        return data;
      }),
  };

  static updateQuiz = {
    params: z.strictObject({ quizId: generalValidationConstants.objectId }),
    body: z
      .strictObject({
        title: z
          .string()
          .regex(AppRegex.quizTitleRegex, {
            error:
              "Quiz title must consists of words each start with a capital letter followed by at least a small letter length between 3 and 200 charachters 🔠",
          })
          .optional(),
        description: z
          .string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("description"),
          })
          .min(3)
          .max(50_000),
        aiPrompt: z
          .string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("aiPrompt"),
          })
          .min(3)
          .max(50_000),
        type: z
          .enum(Object.values(QuizTypesEnum), {
            error: StringConstants.INVALID_ENUM_VALUE_MESSAGE({
              enumValueName: "quiz type",
              theEnum: QuizTypesEnum,
            }),
          })
          .optional(),
        duration: z
          .number({
            error: StringConstants.INVALID_VALIDATION_DURATION_MESSAGE,
          })
          .int({ error: StringConstants.INVALID_VALIDATION_DURATION_MESSAGE })
          .min(60)
          .max(36_000)
          .optional(),
        tags: z.array(z.string().toLowerCase()).min(2).max(20).optional(),
      })
      .superRefine((data, ctx) => {
        if (
          data.type === QuizTypesEnum.careerAssesment &&
          data.title != undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["title"],
            message: `quiz with type ${QuizTypesEnum.careerAssesment} its title can not be updated ⚠️`,
          });
        }

        if (
          data.type === QuizTypesEnum.careerAssesment &&
          data.duration != undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["duration"],
            message: StringConstants.INVALID_DURATION_EXIST_MESSAGE,
          });
        }

        if (data.type === QuizTypesEnum.careerAssesment && data.tags?.length) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: `${StringConstants.CAREER_ASSESSMENT} should not have tags`,
          });
        }
      }),
  };
}

export default QuizValidators;
