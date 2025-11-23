import EnvFields from "../constants/env_fields.constants.js";
class DocumentFromat {
    static getIdFrom_Id = (documentInstance) => {
        const { _id, ...restObject } = documentInstance;
        return { id: _id ? _id : undefined, ...restObject };
    };
    static getFullURLFromSubKey = (subKey) => {
        return `${process.env[EnvFields.PROTOCOL]}://${process.env[EnvFields.HOST]}/uploads/${subKey}`;
    };
}
export default DocumentFromat;
