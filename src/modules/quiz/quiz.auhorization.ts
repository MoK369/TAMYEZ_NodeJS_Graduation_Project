import { RolesEnum } from "../../utils/constants/enum.constants.ts";

const endpointsAuthorization = {
  createQuiz: [RolesEnum.admin, RolesEnum.superAdmin],
};

export default endpointsAuthorization;
