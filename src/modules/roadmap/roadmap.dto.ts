import { z } from "zod";
import type RoadmapValidators from "./roadmap.validation.ts";

export type CreateRoadmapStepBodyDto = z.infer<
  typeof RoadmapValidators.createRoadmapStep.body
>;

export type GetRoadmapParamsDto = z.infer<
  typeof RoadmapValidators.getRoadmap.params
>;

export type GetRoadmapQueryDto = z.infer<
  typeof RoadmapValidators.getRoadmap.query
>;

export type GetRoadmapStepParamsDto = z.infer<
  typeof RoadmapValidators.getRoadmapStep.params
>;

export type UpdateRoadmapStepParamsDto = z.infer<
  typeof RoadmapValidators.updateRoadmapStep.params
>;

export type UpdateRoadmapStepBodyDto = z.infer<
  typeof RoadmapValidators.updateRoadmapStep.body
>;

export type UpdateRoadmapStepResourceParamsDto = z.infer<
  typeof RoadmapValidators.updateRoadmapStepResource.params
>;

export type UpdateRoadmapResourceStepBodyDto = z.infer<
  typeof RoadmapValidators.updateRoadmapStepResource.body
>;
