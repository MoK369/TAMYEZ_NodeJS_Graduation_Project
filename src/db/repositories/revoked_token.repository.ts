import type { Model } from "mongoose";
import type { IRevokedToken as TDocument } from "../interfaces/revoked_token.interface.ts";
import DatabaseRepository from "./database.repository.ts";

class RevokedTokenRepository extends DatabaseRepository<TDocument> {
  constructor(model: Model<TDocument>) {
    super(model);
  }
}
export default RevokedTokenRepository;
