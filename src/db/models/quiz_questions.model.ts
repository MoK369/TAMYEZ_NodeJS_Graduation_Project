import mongoose from "mongoose";
import type {
  FullIQuestion,
  FullIQuizQuestions,
  HIQuestion,
  IQuestion,
  IQuizQuestions,
} from "../interfaces/quiz_questions.interface.ts";
import ModelsNames from "../../utils/constants/models.names.ts";
import { QuestionTypesEnum } from "../../utils/constants/enum.constants.ts";
import type { Model } from "mongoose";

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: Object.values(QuestionTypesEnum),
      required: true,
    },
    text: { type: String, required: true },
    options: {
      type: [String],
      required: function (this) {
        return (
          this.type === QuestionTypesEnum.mcqSingle ||
          this.type === QuestionTypesEnum.mcqMulti
        );
      },
      validate: {
        validator: function (val) {
          if (
            this.type === QuestionTypesEnum.mcqSingle ||
            this.type === QuestionTypesEnum.mcqMulti
          ) {
            return Array.isArray(val) && val.length >= 2;
          }
          return true;
        },
        message:
          "Options are required for MCQ questions and must have at least two options ❌",
      },
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: function (this) {
        return this.type !== QuestionTypesEnum.written;
      },
      validate: {
        validator: function (val) {
          switch (this.type) {
            case QuestionTypesEnum.mcqSingle:
              return typeof val === "string";

            case QuestionTypesEnum.mcqMulti:
              return (
                Array.isArray(val) &&
                val.every((item) => typeof item === "string")
              );

            default:
              console.log("inside default");
              return false;
          }
        },
        message: "correctAnswer type does not match question type ❌",
      },
    },
  },
  {
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

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

    writtenQuestionsIndexes: {
      type: [Number],
      required: function (this) {
        return Boolean(
          this.questions.find(
            (value) => value.type === QuestionTypesEnum.written
          )
        );
      },
    },

    correctAnswersMap: {
      type: Map,
      validate: {
        validator: function (val) {
          return (
            typeof val === "string" ||
            (Array.isArray(val) &&
              val.every((item) => typeof item === "string"))
          );
        },
        message: "Invalid answer type ❌",
      },
    },
    questions: [questionSchema],

    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

quizQuestionsSchema.index({ quizId: 1, userId: 1 }, { unique: true });

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
  const entries: [string, string | string[]][] = [];
  for (const question of this.questions) {
    if (question.type !== QuestionTypesEnum.written) {
      entries.push([
        (question as FullIQuestion)._id.toString(),
        question.correctAnswer!,
      ]);
    }
  }

  this.correctAnswersMap = new Map(entries);
  next();
});

const QuizQuestionsModel =
  (mongoose.models.QuizQuestions as Model<IQuizQuestions>) ||
  mongoose.model<IQuizQuestions>(
    ModelsNames.quizQuestionsModel,
    quizQuestionsSchema
  );

export default QuizQuestionsModel;
