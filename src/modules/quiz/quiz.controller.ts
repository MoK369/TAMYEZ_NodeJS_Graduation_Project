import { Router } from "express";
import QuizService from "./quiz.service.ts";
import RoutePaths from "../../utils/constants/route_paths.constants.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import endpointsAuthorization from "./quiz.auhorization.ts";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import QuizValidators from "./quiz.validation.ts";

const quizRouter = Router();

const quizService = new QuizService();

quizRouter.post(
  RoutePaths.createQuiz,
  Auths.combined({ accessRoles: endpointsAuthorization.createQuiz }),
  validationMiddleware({ schema: QuizValidators.createQuiz }),
  quizService.createQuiz
);

export default quizRouter;
