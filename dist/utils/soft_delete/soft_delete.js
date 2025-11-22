export const softDeleteFunction = function (doc) {
    const query = doc.getQuery();
    if (query.paranoid === false) {
        doc.setQuery({ ...query });
    }
    else {
        doc.setQuery({ ...query, freezed: { $exists: false } });
    }
};
