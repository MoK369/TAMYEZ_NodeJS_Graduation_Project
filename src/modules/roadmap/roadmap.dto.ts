import { z } from "zod";
import type RoadmapValidators from "./roadmap.validation.ts";

export type CreateRoadmapStepBodyDto = z.infer<
  typeof RoadmapValidators.createRoadmapStep.body
>;
