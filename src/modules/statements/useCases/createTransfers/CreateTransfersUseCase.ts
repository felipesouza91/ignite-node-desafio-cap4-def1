import { IUsersRepository } from "../../../users/repositories/IUsersRepository";

interface ICreateTransfersInput {
  userId: string;
  destUserId: string;
  amount: number;
  description: string;
}

export default class CreateTransfersUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    userId,
    destUserId,
    amount,
    description,
  }: ICreateTransfersInput): Promise<void> {
    await this.userRepository.findById(userId);
    await this.userRepository.findById(destUserId);
  }
}
