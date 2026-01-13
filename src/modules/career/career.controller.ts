import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import careerAuthorizationEndpoints from "./career.authorization.ts";
import CareerService from "./career.service.ts";

const careerRouter = Router();

const careerService = new CareerService();

careerRouter.post(
  "/",
  Auths.combined({ accessRoles: careerAuthorizationEndpoints.createCareer }),
  validationMiddleware({}),
  
);

export default careerRouter;
