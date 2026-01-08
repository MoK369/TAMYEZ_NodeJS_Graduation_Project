import type { Default__v, HydratedDocument, Require_id, Types } from "mongoose";

import type { IAtByObject } from "./common.interface.ts";
import type { IRoadmapStep } from "./roadmap_step.interface.ts";

export interface ICareer {
  id?: Types.ObjectId | undefined; // virtual

  title: string;
  slug?: string;
  pictureUrl: string;
  description: string;

  isActive: boolean;

  roadmapSteps?: Partial<IRoadmapStep>[]; // virtual

  freezed?: IAtByObject;
  restored?: IAtByObject;

  createdAt: Date;
  updatedAt: Date;
}

export type FullICareer = Require_id<Default__v<ICareer>>;

export type HICareerType = HydratedDocument<ICareer>;
