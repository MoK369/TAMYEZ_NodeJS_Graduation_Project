import { z } from "zod";
import type QuizValidators from "./quiz.validation.ts";

export type CreateQuizBodyDtoType = z.infer<
  typeof QuizValidators.createQuiz.body
>;


export type UpdateQuizParamsDtoType = z.infer<
  typeof QuizValidators.updateQuiz.params
>;

export type UpdateQuizBodyDtoType = z.infer<
  typeof QuizValidators.updateQuiz.body
>;
