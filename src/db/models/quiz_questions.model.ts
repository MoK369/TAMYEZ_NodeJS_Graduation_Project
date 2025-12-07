import mongoose from "mongoose";
import type {
  FullIQuestion,
  FullIQuizQuestions,
  HIQuestion,
  IQuestion,
  IQuizQuestions,
  QuizQuestionsAnswersMapValueType,
} from "../interfaces/quiz_questions.interface.ts";
import ModelsNames from "../../utils/constants/models.names.ts";
import { QuestionTypesEnum } from "../../utils/constants/enum.constants.ts";
import type { Model } from "mongoose";
import { questionOptionSchema } from "./common_schemas.model.ts";
import { validateIfValidQuestionAnswer } from "../../utils/question/validate_options.question.ts";
import type { IQuizQuestionOption } from "../interfaces/common.interface.ts";

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: Object.values(QuestionTypesEnum),
      required: true,
    },
    text: { type: String, required: true },
    options: {
      type: [questionOptionSchema],
      default: undefined,
      required: function (this) {
        return (
          this.type === QuestionTypesEnum.mcqSingle ||
          this.type === QuestionTypesEnum.mcqMulti
        );
      },
      minlength: 2,
      maxlength: 4,
      set: (v: IQuizQuestionOption[]) =>
        Array.isArray(v) && v.length === 0 ? undefined : v,
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: function (this) {
        return this.type !== QuestionTypesEnum.written;
      },
      validate: {
        validator: function (value) {
          return validateIfValidQuestionAnswer({
            questionType: this.type,
            value,
          });
        },
        message: "correctAnswer type does not match question type ❌",
      },
    },
    explanation: {
      type: String,
      maxlength: 500,
      required: function (this) {
        return this.type !== QuestionTypesEnum.written;
      },
    },
  },
  {
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
  }
);

questionSchema.virtual("id").get(function () {
  return this._id;
});

questionSchema.methods.toJSON = function () {
  const { _id, text, type, options } = this.toObject() as FullIQuestion;
  return {
    id: _id,
    text,
    type,
    options: options?.length ? options : undefined,
  };
};

const quizQuestionsSchema = new mongoose.Schema<IQuizQuestions>(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: ModelsNames.quizModel,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: ModelsNames.userModel,
    },

    answersMap: {
      type: Map,
      validate: {
        validator: function (val: QuizQuestionsAnswersMapValueType) {
          return Object.values(QuestionTypesEnum).includes(val.type)
            ? val.type !== QuestionTypesEnum.written
              ? true
              : typeof val.text !== "undefined"
              ? true
              : false
            : false;
        },
        message: "Invalid answer type ❌",
      },
    },
    questions: {
      type: [questionSchema],
      required: true,
      minlength: 1,
      maxlength: 150,
    },

    expiresAt: { type: Date, required: true, expires: 0 },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
  }
);

quizQuestionsSchema.index({ quizId: 1, userId: 1 }, { unique: true });

quizQuestionsSchema.virtual("id").get(function () {
  return this._id;
});

quizQuestionsSchema.methods.toJSON = function () {
  const { _id, quizId, userId, createdAt, updatedAt } =
    this.toObject() as FullIQuizQuestions;
  return {
    id: _id,
    quizId,
    userId,
    createdAt,
    updatedAt,
    questions: (this.questions as HIQuestion[]).map((question) => {
      return (question as HIQuestion).toJSON();
    }),
  };
};

quizQuestionsSchema.pre("save", function (next) {
  if (!this.isModified("questions")) return next();

  // Build a map keyed by question _id (string)
  const entries: [string, QuizQuestionsAnswersMapValueType][] = [];
  for (const question of this.questions) {
    entries.push([
      (question as FullIQuestion)._id.toString(),
      {
        text:
          question.type === QuestionTypesEnum.written
            ? question.text
            : undefined,
        type: question.type!,
      },
    ]);
  }

  this.answersMap = new Map(entries);
  next();
});

const QuizQuestionsModel =
  (mongoose.models.QuizQuestions as Model<IQuizQuestions>) ||
  mongoose.model<IQuizQuestions>(
    ModelsNames.quizQuestionsModel,
    quizQuestionsSchema
  );

export default QuizQuestionsModel;
