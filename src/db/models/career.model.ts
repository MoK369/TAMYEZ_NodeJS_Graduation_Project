import mongoose from "mongoose";
import type { ICareer } from "../interfaces/career.interface.ts";
import ModelsNames from "../../utils/constants/models.names.constants.ts";
import { softDeleteFunction } from "../../utils/soft_delete/soft_delete.ts";
import DocumentFormat from "../../utils/formats/document.format.ts";
import { atByObjectSchema } from "./common_schemas.model.ts";
import slugify from "slugify";
import type {
  FullIRoadmapStep,
} from "../interfaces/roadmap_step.interface.ts";

const careerSchema = new mongoose.Schema<ICareer>(
  {
    title: { type: String, unique: true, required: true, min: 3, max: 300 },
    slug: { type: String },

    pictureUrl: { type: String, required: true },

    description: { type: String, min: 5, max: 10_000, required: true },

    isActive: { type: Boolean, default: false },

    freezed: atByObjectSchema,

    restored: atByObjectSchema,
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

careerSchema.virtual("id").get(function (this) {
  return this._id.toHexString();
});

careerSchema.virtual("roadmapSteps", {
  ref: ModelsNames.roadmapStepModel,
  localField: "_id",
  foreignField: "careerId",
  justOne: false,
  options: { sort: { order: 1 } },
});

careerSchema.methods.toJSON = function () {
  const userObject: ICareer = DocumentFormat.getIdFrom_Id<ICareer>(
    this.toObject()
  );

  return {
    id: userObject.id,
    title: userObject.title,
    slug: userObject.slug,
    pictureUrl: DocumentFormat.getFullURLFromSubKey(userObject.pictureUrl),
    description: userObject.description,
    isActive: userObject.isActive,
    roadmapSteps: userObject?.roadmapSteps?.map((step) => {
      return {
        id: (step as FullIRoadmapStep)?._id,
        order: step?.order,
        careerId: step?.careerId,
        title: step?.title,
        description: step?.description,
      };
    }),
    freezed: userObject?.freezed,
    restored: userObject?.restored,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  };
};

careerSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = slugify.default(this.title);
  }

  next();
});

careerSchema.pre(
  ["find", "findOne", "findOneAndUpdate", "countDocuments"],
  function (next) {
    softDeleteFunction(this);

    next();
  }
);

const CareerModel =
  (mongoose.models?.Career as mongoose.Model<ICareer>) ||
  mongoose.model<ICareer>(ModelsNames.careerModel, careerSchema);

export default CareerModel;
