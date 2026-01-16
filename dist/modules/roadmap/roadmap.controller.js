import { Router } from "express";
import RoadmapService from "./roadmap.service.js";
import RoutePaths from "../../utils/constants/route_paths.constants.js";
import Auths from "../../middlewares/auths.middleware.js";
import roadmapAuthorizationEndpoints from "./roadmap.authorization.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import RoadmapValidators from "./roadmap.validation.js";
const roadmapRouter = Router();
const roadmapService = new RoadmapService();
roadmapRouter.post(RoutePaths.createRoadmapStep, Auths.combined({
    accessRoles: roadmapAuthorizationEndpoints.createRoadmapStep,
}), validationMiddleware({ schema: RoadmapValidators.createRoadmapStep }), roadmapService.createRoadmapStep);
export default roadmapRouter;
