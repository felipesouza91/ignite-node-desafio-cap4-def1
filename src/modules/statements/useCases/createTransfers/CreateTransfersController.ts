import { Request, Response } from "express";
import { container } from "tsyringe";
import CreateTransfersUseCase from "./CreateTransfersUseCase";
export default class CreateTransfersController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { dest_user_id } = request.params;
    const { amount, description } = request.body;
    const createTransfersUseCase = container.resolve(CreateTransfersUseCase);
    const tranfers = await createTransfersUseCase.execute({
      amount,
      description,
      destUserId: dest_user_id,
      userId: user_id,
    });
    return response.status(201).json(tranfers);
  }
}
