import type { Default__v, Require_id, Types } from "mongoose";
import EnvFields from "../constants/env_fields.constants.ts";

class DocumentFromat {
  static getIdFrom_Id = <TDocument>(
    documentInstance: Require_id<Default__v<TDocument>>
  ): Omit<Require_id<Default__v<TDocument>>, "_id"> & {
    id: Types.ObjectId | undefined;
  } => {
    const { _id, ...restObject } = documentInstance;

    return { id: _id ? _id : undefined, ...restObject };
  };

  static getFullURLFromSubKey = (subKey: string) => {
    return `${process.env[EnvFields.PROTOCOL]}://${
      process.env[EnvFields.HOST]
    }/uploads/${subKey}`;
  };
}

export default DocumentFromat;
