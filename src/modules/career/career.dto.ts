import { z } from "zod";
import type CareerValidators from "./career.validation.ts";


export type CreateCareerBodyDto = z.infer<
  typeof CareerValidators.createCareer.body
>;
