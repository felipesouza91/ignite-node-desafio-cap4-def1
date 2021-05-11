import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

const makeSut = () => {
  const userRepository = new InMemoryUsersRepository();
  const statementRepository = new InMemoryStatementsRepository();
  const sut = new CreateStatementUseCase(userRepository, statementRepository)
  return {
    sut, statementRepository, userRepository
  }
}

const makeFakeInput = () => {
  return  {
    user_id: "user_id",
     type: OperationType.DEPOSIT,
     amount: 100,
     description: "any descripton"
  }
}

describe('Create Statement Use Case', () => {

  it('ensure CreateStatementUseCase calls userRespository.findbyid with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'findStatementOperation')
      .mockResolvedValueOnce(new Statement());
    const repSpy = jest.spyOn(userRepository, 'findById');
    await sut.execute(makeFakeInput());
    expect(repSpy).toHaveBeenCalledWith('user_id');
  });
});
