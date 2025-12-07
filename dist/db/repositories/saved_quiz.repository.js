import DatabaseRepository from "./database.repository.js";
class SavedQuizRepository extends DatabaseRepository {
    constructor(model) {
        super(model);
    }
}
export default SavedQuizRepository;
