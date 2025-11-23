import type { Request, Response } from "express";
// import { QuizModel } from "../../db/models/index.ts";
// import { QuizRepository } from "../../db/repositories/index.ts";
import successHandler from "../../utils/handlers/success.handler.ts";

class QuizService {
  //private _quizRepository = new QuizRepository(QuizModel);

  createQuiz = async (req: Request, res: Response): Promise<Response> => {
    console.log("inside service");
    
    return successHandler({ res });
  };
}

export default QuizService;
