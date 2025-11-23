class QuizUtil {
    static getQuizUniqueKey = ({ title, tags, }) => {
        return title + "-" + tags.sort().join(",");
    };
}
export default QuizUtil;
