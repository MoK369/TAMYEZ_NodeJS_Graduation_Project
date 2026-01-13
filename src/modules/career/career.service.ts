import type { Request, Response } from "express";
import { CareerModel } from "../../db/models/index.ts";
import { CareerRepository } from "../../db/repositories/index.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type { CreateCareerBodyDto } from "./career.dto.ts";

class CareerService {
  private readonly _careerRepository = new CareerRepository(CareerModel);

  createCareer = async (req: Request, res: Response): Promise<Response> => {
    const {} = req.body as CreateCareerBodyDto;

    
    return successHandler({ res });
  };
}

export default CareerService;
