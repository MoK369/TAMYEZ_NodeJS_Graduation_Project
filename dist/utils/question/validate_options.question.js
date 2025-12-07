import { OptionIdsEnum, QuestionTypesEnum, } from "../constants/enum.constants.js";
export function validateIfValidOptionsQuestion({ value, minLength = 2, maxLength = 4, }) {
    const optionIds = Object.values(OptionIdsEnum);
    return (Array.isArray(value) &&
        value.every((item) => optionIds.includes(item)) &&
        value.length >= minLength &&
        value.length <= maxLength);
}
export function validateIfValidQuestionAnswer({ questionType, value, }) {
    switch (questionType) {
        case QuestionTypesEnum.mcqSingle:
            return validateIfValidOptionsQuestion({
                value,
                minLength: 1,
                maxLength: 1,
            });
        case QuestionTypesEnum.mcqMulti:
            return validateIfValidOptionsQuestion({ value });
        case QuestionTypesEnum.written:
            return typeof value == "string" && value.length >= 1 && value.length <= 5000;
    }
}
