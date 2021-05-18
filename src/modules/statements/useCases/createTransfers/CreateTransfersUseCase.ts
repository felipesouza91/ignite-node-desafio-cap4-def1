import { IUsersRepository } from "../../../users/repositories/IUsersRepository";

interface ICreateTransfersInput {
  user_id: string;
  destination_id: string;
  amount: number;
  description: string;
}

export default class CreateTransfersUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    user_id,
    destination_id,
    amount,
    description,
  }: ICreateTransfersInput): Promise<void> {
    await this.userRepository.findById(user_id);
  }
}
