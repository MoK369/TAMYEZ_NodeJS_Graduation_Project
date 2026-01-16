import { Router } from "express";
import RoadmapService from "./roadmap.service.ts";
import RoutePaths from "../../utils/constants/route_paths.constants.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import roadmapAuthorizationEndpoints from "./roadmap.authorization.ts";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import RoadmapValidators from "./roadmap.validation.ts";

const roadmapRouter: Router = Router();
const roadmapService = new RoadmapService();

roadmapRouter.post(
  RoutePaths.createRoadmapStep,
  Auths.combined({
    accessRoles: roadmapAuthorizationEndpoints.createRoadmapStep,
  }),
  validationMiddleware({ schema: RoadmapValidators.createRoadmapStep }),
  roadmapService.createRoadmapStep
);

export default roadmapRouter;
