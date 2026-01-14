class DocumentFromat {
    static getIdFrom_Id = (documentInstance) => {
        const { _id, ...restObject } = documentInstance;
        return { id: _id ? _id : undefined, ...restObject };
    };
}
export default DocumentFromat;
