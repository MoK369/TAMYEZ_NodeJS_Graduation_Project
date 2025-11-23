import { RolesEnum } from "../../utils/constants/enum.constants.js";
const endpointsAuthorization = {
    createQuiz: [RolesEnum.admin, RolesEnum.superAdmin],
};
export default endpointsAuthorization;
