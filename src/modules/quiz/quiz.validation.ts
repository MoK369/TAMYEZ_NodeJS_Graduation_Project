import { z } from "zod";
import StringConstants from "../../utils/constants/strings.constants.ts";
import { QuizTypesEnum } from "../../utils/constants/enum.constants.ts";

class QuizValidators {
  static createQuiz = {
    body: z
      .strictObject({
        title: z
          .string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("title"),
          })
          .min(3)
          .max(500),
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
      })
      .superRefine((data, ctx) => {
        if (
          data.type !== QuizTypesEnum.careerAssesment &&
          data.duration == undefined
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["duration"],
            message: StringConstants.PATH_REQUIRED_MESSAGE("duration"),
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
      }),
  };
}

export default QuizValidators;
