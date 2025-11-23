import DatabaseRepository from "./database.repository.js";
class RevokedTokenRepository extends DatabaseRepository {
    constructor(model) {
        super(model);
    }
}
export default RevokedTokenRepository;
