import type { Model } from "mongoose";
import type { IQuiz as TDocument } from "../interfaces/quiz.interface.ts";
import DatabaseRepository from "./database.repository.ts";

class QuizRepository extends DatabaseRepository<TDocument> {
  constructor(model: Model<TDocument>) {
    super(model);
  }
}
export default QuizRepository;
