import { BadRequestException } from "../exceptions/custom.exceptions.js";
class UpdateUtil {
    static getChangedFields = ({ document, updatedObject, }) => {
        const updateWithObject = {};
        for (const key of Object.keys(updatedObject)) {
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
