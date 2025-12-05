import { QuizModel, QuizQuestionsModel } from "../../db/models/index.js";
import { QuizQuestionsRepository, QuizRepository, } from "../../db/repositories/index.js";
import successHandler from "../../utils/handlers/success.handler.js";
import { QuestionTypesEnum, QuizTypesEnum, RolesEnum, } from "../../utils/constants/enum.constants.js";
import { BadRequestException, ConflictException, NotFoundException, ServerException, ValidationException, } from "../../utils/exceptions/custom.exceptions.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import QuizUtil from "../../utils/quiz/utils.quiz.js";
import UpdateUtil from "../../utils/update/util.update.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
class QuizService {
    _quizRepository = new QuizRepository(QuizModel);
    _quizQuestionsRepository = new QuizQuestionsRepository(QuizQuestionsModel);
    createQuiz = async (req, res) => {
        const { title, description, aiPrompt, type, duration, tags } = req
            .validationResult.body;
        if (type === QuizTypesEnum.careerAssessment) {
            const quiz = await this._quizRepository.findOne({ filter: { type } });
            if (quiz) {
                throw new ConflictException(`Quiz of type ${QuizTypesEnum.careerAssessment} already exists 🚫`);
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
            throw new NotFoundException(StringConstants.INVALID_PARAMETER_MESSAGE("quizId"));
        }
        const uniqueKey = QuizUtil.getQuizUniqueKey({
            title: title || quiz.title,
            tags: tags || quiz.tags,
        });
        if (quiz.type === QuizTypesEnum.careerAssessment &&
            (type || duration || tags?.length)) {
            throw new ValidationException(`Only description and aiPrompt of ${StringConstants.CAREER_ASSESSMENT} can be updated 🔒`);
        }
        else {
            if (type === QuizTypesEnum.careerAssessment) {
                throw new BadRequestException(`${QuizTypesEnum.stepQuiz} can not be update to ${QuizTypesEnum.careerAssessment} 🔒`);
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
        const filter = {};
        quizId === QuizTypesEnum.careerAssessment
            ? (filter.uniqueKey = {
                $regex: StringConstants.CAREER_ASSESSMENT,
                $options: "i",
            })
            : (filter._id = quizId);
        const quiz = await this._quizRepository.findOne({
            filter: {
                ...filter,
                paranoid: req.user.role !== RolesEnum.user ? false : true,
            },
            projection,
        });
        if (!quiz) {
            throw new NotFoundException(StringConstants.INVALID_PARAMETER_MESSAGE("quizId"));
        }
        return successHandler({ res, body: { quiz } });
    };
    _generateQuestions = async ({ title, aiPrompt, }) => {
        return {
            questions: [
                {
                    type: "mcq-single",
                    text: "Which data structure uses LIFO (Last In, First Out) principle?",
                    options: ["Queue", "Stack", "Array", "Linked List"],
                    correctAnswer: "Stack",
                },
                {
                    type: "mcq-single",
                    text: "What is the time complexity of binary search in a sorted array?",
                    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
                    correctAnswer: "O(log n)",
                },
                {
                    type: "mcq-multi",
                    text: "Which of the following are programming paradigms?",
                    options: [
                        "Object-Oriented",
                        "Functional",
                        "Procedural",
                        "Relational",
                    ],
                    correctAnswer: ["Object-Oriented", "Functional", "Procedural"],
                },
                {
                    type: "written",
                    text: "Explain the difference between TCP and UDP.",
                },
                {
                    type: "mcq-single",
                    text: "Which algorithm is commonly used for shortest path in a graph?",
                    options: [
                        "Dijkstra's Algorithm",
                        "Merge Sort",
                        "DFS",
                        "Bellman-Ford",
                    ],
                    correctAnswer: "Dijkstra's Algorithm",
                },
                {
                    type: "mcq-single",
                    text: "What does SQL stand for?",
                    options: [
                        "Structured Query Language",
                        "Simple Query Language",
                        "Sequential Query Language",
                        "Standard Query Language",
                    ],
                    correctAnswer: "Structured Query Language",
                },
                {
                    type: "mcq-multi",
                    text: "Which of the following are NoSQL databases?",
                    options: ["MongoDB", "PostgreSQL", "Cassandra", "Redis"],
                    correctAnswer: ["MongoDB", "Cassandra", "Redis"],
                },
                {
                    type: "written",
                    text: "Describe the concept of polymorphism in object-oriented programming.",
                },
                {
                    type: "mcq-single",
                    text: "Which of these is NOT a valid HTTP method?",
                    options: ["GET", "POST", "FETCH", "DELETE"],
                    correctAnswer: "FETCH",
                },
                {
                    type: "written",
                    text: "What is the difference between supervised and unsupervised learning in machine learning?",
                },
            ],
        };
    };
    getQuizQuestions = async (req, res) => {
        const { quizId } = req.params;
        const filter = {};
        quizId === QuizTypesEnum.careerAssessment
            ? (filter.uniqueKey = {
                $regex: StringConstants.CAREER_ASSESSMENT,
                $options: "i",
            })
            : (filter._id = quizId);
        const quiz = await this._quizRepository.findOne({
            filter: {
                ...filter,
                paranoid: req.user.role !== RolesEnum.user ? false : true,
            },
        });
        if (!quiz) {
            throw new NotFoundException(StringConstants.INVALID_PARAMETER_MESSAGE("quizId"));
        }
        const [_, generatedQuestions] = await Promise.all([
            this._quizQuestionsRepository.deleteOne({
                filter: { quizId: quiz._id, userId: req.user._id },
            }),
            this._generateQuestions({
                title: quiz.title,
                aiPrompt: quiz.aiPrompt,
            }),
        ]);
        const writtenQuestionsIndexes = [];
        generatedQuestions.questions.forEach((value, index) => {
            if (value.type === QuestionTypesEnum.written)
                writtenQuestionsIndexes.push(index);
        });
        let [quizQuestions] = await this._quizQuestionsRepository.create({
            data: [
                {
                    quizId: quiz._id,
                    userId: req.user._id,
                    writtenQuestionsIndexes,
                    questions: generatedQuestions.questions,
                    expiresAt: new Date(Date.now() +
                        (quizId === QuizTypesEnum.careerAssessment
                            ? Number(process.env[EnvFields.CAREER_ASSESSMENT_QUESTIONS_EXPIRES_IN_SECONDS])
                            : quiz.duration +
                                Number(process.env[EnvFields.QUIZ_QUESTIONS_EXPIRES_IN_SECONDS])) *
                            1000),
                },
            ],
        });
        if (!quizQuestions) {
            throw new ServerException("Failed to generate quiz questions ❓");
        }
        return successHandler({
            res,
            body: {
                quiz: quizQuestions,
            },
        });
    };
    _checkWrittenQuestionsAnswers = async ({ title, aiPrompt, writtenAnswers, }) => {
        const response = [];
        for (const answer of writtenAnswers) {
            if (answer.userAnswer.includes("correct")) {
                response.push({
                    questionId: answer.questionId,
                    isCorrection: true,
                });
            }
            else {
                response.push({
                    questionId: answer.questionId,
                    isCorrection: false,
                    correction: "This is the correction of user answer",
                    explenation: "This is the explanation of user answer",
                });
            }
        }
        return response;
    };
    checkQuizAnswers = async (req, res) => {
        const { quizId } = req.params;
        const { answers } = req.validationResult
            .body;
        const quizQuestions = await this._quizQuestionsRepository.findOne({
            filter: { quizId, userId: req.user._id },
        });
        if (!quizQuestions) {
            throw new NotFoundException("Quiz questions not found for the given quizId and user 🚫");
        }
        if (answers.length !== quizQuestions.questions.length) {
            throw new ValidationException("Number of answers provided does not match number of questions ❌");
        }
        const checkedAnswers = [];
        for (const answer of answers) {
            const question = quizQuestions.questions.find((value) => value.id?.equals(answer.questionId));
            if (!question) {
                throw new NotFoundException("Not found questionId in the quiz questions ❌");
            }
            const selectedAnswer = question.options[answer.answerIndex];
            if (selectedAnswer == question.correctAnswer) {
                checkedAnswers.push({ ...question });
            }
            else {
                checkedAnswers.push({ ...question, wrongAnswer: selectedAnswer });
            }
        }
        return successHandler({
            res,
            message: "Quiz answers checked successfully ✅",
        });
    };
}
export default QuizService;
