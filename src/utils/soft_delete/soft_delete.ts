import type { Query } from "mongoose";

export const softDeleteFunction = function (
  doc: Query<any, any, {}, unknown, "find", Record<string, never>>
) {
  const query = doc.getQuery();
  if (query.paranoid === false) {
    doc.setQuery({ ...query });
  } else {
    doc.setQuery({ ...query, freezed: { $exists: false } });
  }
};
