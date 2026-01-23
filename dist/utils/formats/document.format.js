class DocumentFromat {
    static getIdFrom_Id = (documentInstance) => {
        const { _id, __v, ...restObject } = documentInstance;
        return { id: _id, ...restObject, v: __v };
    };
}
export default DocumentFromat;
