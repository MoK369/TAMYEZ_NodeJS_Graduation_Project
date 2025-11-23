import { z } from "zod";
import type QuizValidators from "./quiz.validation.ts";

export type CreateQuizBodyDtoType = z.infer<
  typeof QuizValidators.createQuiz.body
>;
