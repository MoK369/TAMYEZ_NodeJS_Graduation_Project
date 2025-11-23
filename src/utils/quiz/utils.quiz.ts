abstract class QuizUtil {
  static getQuizUniqueKey = ({
    title,
    tags,
  }: {
    title: string;
    tags: string[];
  }) => {
    return title + "-" + tags.sort().join(",");
  };
}

export default QuizUtil;
