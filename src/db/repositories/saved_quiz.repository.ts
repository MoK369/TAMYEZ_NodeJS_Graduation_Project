import type { Model } from "mongoose";
import type { ISavedQuiz as TDocument } from "../interfaces/saved_quiz.interface.ts";
import DatabaseRepository from "./database.repository.ts";

class SavedQuizRepository extends DatabaseRepository<TDocument> {
  constructor(model: Model<TDocument>) {
    super(model);
  }
}
export default SavedQuizRepository;
