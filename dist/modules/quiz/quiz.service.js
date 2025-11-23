import successHandler from "../../utils/handlers/success.handler.js";
class QuizService {
    createQuiz = async (req, res) => {
        console.log("inside service");
        return successHandler({ res });
    };
}
export default QuizService;
