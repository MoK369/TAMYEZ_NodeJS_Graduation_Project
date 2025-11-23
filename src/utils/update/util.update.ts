import { BadRequestException } from "../exceptions/custom.exceptions.ts";
import type { PartialUndefined } from "../types/partial_undefined.type.ts";

class UpdateUtil {
  static getChangedFields = <
    TDocument extends Record<string, any | undefined>
  >({
    document,
    updatedObject,
  }: {
    document: TDocument;
    updatedObject: PartialUndefined<TDocument>;
  }) => {
    type TDocumentKeysType = keyof TDocument;
    const updateWithObject: Partial<TDocument> = {};
    for (const key of Object.keys(updatedObject) as TDocumentKeysType[]) {
      if (document[key] !== updatedObject[key]) {
        updateWithObject[key] = updatedObject[key];
      }
    }    

    const uniquValuesList = [...new Set(Object.values(updateWithObject))];

    if (!uniquValuesList.length) {
      throw new BadRequestException("No Fields provided ☹️");
    }
    if (uniquValuesList.length == 1 && uniquValuesList[0] == undefined) {
      throw new BadRequestException("No change in updatedFields ❌");
    }

    return updateWithObject;
  };
}

export default UpdateUtil;
