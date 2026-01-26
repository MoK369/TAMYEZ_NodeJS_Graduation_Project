import { Router } from "express";
import QuizService from "./quiz.service.ts";
import RoutePaths from "../../utils/constants/route_paths.constants.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import quizAuthorizationEndpoints from "./quiz.auhorization.ts";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import QuizValidators from "./quiz.validation.ts";

export const quizRouter = Router();
export const adminQuizRouter = Router();

const quizService = new QuizService();

// normal user apis

quizRouter.get(
  RoutePaths.getSavedQuizzes,
  Auths.authenticationMiddleware(),
  validationMiddleware({ schema: QuizValidators.getSavedQuizzes }),
  quizService.getSavedQuizzes,
);

quizRouter.get(
  RoutePaths.getSavedQuiz,
  Auths.authenticationMiddleware(),
  validationMiddleware({ schema: QuizValidators.getSavedQuiz }),
  quizService.getSavedQuiz,
);

quizRouter.get(
  RoutePaths.getQuizQuestions,
  Auths.authenticationMiddleware(),
  validationMiddleware({ schema: QuizValidators.getQuiz }),
  quizService.getQuizQuestions,
);

quizRouter.get(
  RoutePaths.getQuiz,
  Auths.authenticationMiddleware(),
  validationMiddleware({ schema: QuizValidators.getQuiz }),
  quizService.getQuiz(),
);

quizRouter.post(
  RoutePaths.checkQuizAnswers,
  Auths.authenticationMiddleware(),
  validationMiddleware({ schema: QuizValidators.checkQuizAnswers }),
  quizService.checkQuizAnswers,
);

// admin apis

adminQuizRouter.post(
  RoutePaths.createQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.createQuiz }),
  quizService.createQuiz,
);

adminQuizRouter.get(
  RoutePaths.getQuizzes,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.getQuizzes }),
  quizService.getQuizzes(),
);

adminQuizRouter.get(
  RoutePaths.getArchivedQuizzes,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.getQuizzes }),
  quizService.getQuizzes({ archived: true }),
);

adminQuizRouter.get(
  RoutePaths.getArchivedQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.getQuiz }),
  quizService.getQuiz({ archived: true }),
);

adminQuizRouter.patch(
  RoutePaths.archiveQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.archiveQuiz }),
  quizService.archiveQuiz,
);

adminQuizRouter.patch(
  RoutePaths.restoreQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.restoreQuiz }),
  quizService.restoreQuiz,
);

adminQuizRouter.patch(
  RoutePaths.updateQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.updateQuiz }),
  quizService.updateQuiz,
);

adminQuizRouter.delete(
  RoutePaths.deleteQuiz,
  Auths.combined({ accessRoles: quizAuthorizationEndpoints.createQuiz }),
  validationMiddleware({ schema: QuizValidators.deleteQuiz }),
  quizService.deleteQuiz,
);
