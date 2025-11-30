import type { FullIQuiz } from "../../db/interfaces/quiz.interface.ts";

export interface IGetQuizDetailsResponse {
  quiz: Partial<FullIQuiz>;
}
