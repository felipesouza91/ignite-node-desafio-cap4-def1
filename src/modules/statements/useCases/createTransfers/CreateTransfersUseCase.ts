import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransfersError } from "./CreateTransfersError";

interface ICreateTransfersInput {
  userId: string;
  destUserId: string;
  amount: number;
  description: string;
}

export default class CreateTransfersUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private statementRepoisoty: IStatementsRepository
  ) {}

  async execute({
    userId,
    destUserId,
    amount,
    description,
  }: ICreateTransfersInput): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CreateTransfersError.UserNotFound();
    }
    const destanationUser = await this.userRepository.findById(destUserId);
    if (!destanationUser) {
      throw new CreateTransfersError.UserNotFound();
    }
    await this.statementRepoisoty.getUserBalance({ user_id: userId });
  }
}
