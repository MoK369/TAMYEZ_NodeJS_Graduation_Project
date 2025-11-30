import { QuizModel } from "../../db/models/index.js";
import { QuizRepository } from "../../db/repositories/index.js";
import successHandler from "../../utils/handlers/success.handler.js";
import { QuizTypesEnum, RolesEnum, } from "../../utils/constants/enum.constants.js";
import { BadRequestException, ConflictException, NotFoundException, ValidationException, } from "../../utils/exceptions/custom.exceptions.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import QuizUtil from "../../utils/quiz/utils.quiz.js";
import UpdateUtil from "../../utils/update/util.update.js";
import QuizApisManager from "./quiz.apis.js";
class QuizService {
    _quizRepository = new QuizRepository(QuizModel);
    _quizApisManager = new QuizApisManager();
    createQuiz = async (req, res) => {
        const { title, description, aiPrompt, type, duration, tags } = req
            .validationResult.body;
        if (type === QuizTypesEnum.careerAssesment) {
            const quiz = await this._quizRepository.findOne({ filter: { type } });
            if (quiz) {
                throw new ConflictException(`Quiz of type ${QuizTypesEnum.careerAssesment} already exists 🚫`);
            }
        }
        const uniqueKey = QuizUtil.getQuizUniqueKey({
            title: title,
            tags: tags,
        });
        if (await this._quizRepository.findOne({
            filter: { uniqueKey },
        })) {
            throw new ConflictException("A quiz with the same title and tags already exists ❌");
        }
        await this._quizRepository.create({
            data: [
                {
                    uniqueKey,
                    title: title,
                    description,
                    aiPrompt,
                    type,
                    duration,
                    tags,
                    createdBy: req.user._id,
                },
            ],
        });
        return successHandler({
            res,
            message: StringConstants.CREATED_SUCCESSFULLY_MESSAGE("Quiz"),
        });
    };
    updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const { title, description, aiPrompt, type, duration, tags } = req
            .validationResult.body;
        const quiz = await this._quizRepository.findOne({
            filter: { _id: quizId, paranoid: false },
        });
        if (!quiz) {
            throw new NotFoundException(StringConstants.INVALID_ID_MESSAGE("quizId"));
        }
        const uniqueKey = QuizUtil.getQuizUniqueKey({
            title: title || quiz.title,
            tags: tags || quiz.tags,
        });
        if (quiz.type === QuizTypesEnum.careerAssesment &&
            (type || duration || tags?.length)) {
            throw new ValidationException(`Only description and aiPrompt of ${StringConstants.CAREER_ASSESSMENT} can be updated 🔒`);
        }
        else {
            if (type === QuizTypesEnum.careerAssesment) {
                throw new BadRequestException(`${QuizTypesEnum.stepQuiz} can not be update to ${QuizTypesEnum.careerAssesment} 🔒`);
            }
            if (title || tags) {
                if (await this._quizRepository.findOne({
                    filter: { uniqueKey },
                })) {
                    throw new ConflictException("A quiz with the same title and tags already exists ❌");
                }
            }
        }
        const updateObject = UpdateUtil.getChangedFields({
            document: quiz,
            updatedObject: { title, description, aiPrompt, type, duration, tags },
        });
        await quiz.updateOne({
            uniqueKey: updateObject.title || updateObject.tags?.length ? uniqueKey : undefined,
            ...updateObject,
        });
        return successHandler({
            res,
            message: StringConstants.CREATED_SUCCESSFULLY_MESSAGE("Quiz"),
        });
    };
    getQuizDetails = async (req, res) => {
        const { quizId } = req.params;
        const projection = {};
        if (req.user.role === RolesEnum.user) {
            projection.aiPrompt = 0;
            projection.tags = 0;
        }
        const quiz = await this._quizRepository.findOne({
            filter: {
                _id: quizId,
                paranoid: req.user.role !== RolesEnum.user ? false : true,
            },
            projection,
        });
        if (!quiz) {
            throw new NotFoundException(StringConstants.INVALID_ID_MESSAGE("quizId"));
        }
        return successHandler({ res, body: { quiz } });
    };
    getQuizQuestions = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await this._quizRepository.findOne({
            filter: {
                _id: quizId,
                paranoid: req.user.role !== RolesEnum.user ? false : true,
            },
        });
        if (!quiz) {
            throw new NotFoundException(StringConstants.INVALID_ID_MESSAGE("quizId"));
        }
        return successHandler({
            res,
            body: {
                quiz: await this._quizApisManager.getQuizQustions({
                    title: quiz.title,
                    aiPrompt: quiz.aiPrompt,
                }),
            },
        });
    };
}
export default QuizService;
