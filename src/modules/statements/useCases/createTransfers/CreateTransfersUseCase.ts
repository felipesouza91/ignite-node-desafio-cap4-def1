import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
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
  }: ICreateTransfersInput): Promise<Statement> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CreateTransfersError.UserNotFound();
    }
    const destanationUser = await this.userRepository.findById(destUserId);
    if (!destanationUser) {
      throw new CreateTransfersError.UserNotFound();
    }
    const userBalance = await this.statementRepoisoty.getUserBalance({
      user_id: userId,
    });
    if (userBalance.balance < amount) {
      throw new CreateTransfersError.InsufficientFunds();
    }
    //record a deposit in the destination user
    const transference = this.statementRepoisoty.create({
      amount,
      description,
      type: OperationType.TRANSFERS,
      user_id: destUserId,
      sender_id: userId,
    });

    this.statementRepoisoty.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: userId,
    });
    return transference;
  }
}
