import type { Default__v, Require_id, Types } from "mongoose";

class DocumentFromat {
  static getIdFrom_Id = <TDocument>(
    documentInstance: Require_id<Default__v<TDocument>>
  ): Omit<Require_id<Default__v<TDocument>>, "_id"> & {
    id: Types.ObjectId | undefined;
  } => {
    const { _id, ...restObject } = documentInstance;

    return { id: _id ? _id : undefined, ...restObject };
  };
}

export default DocumentFromat;
