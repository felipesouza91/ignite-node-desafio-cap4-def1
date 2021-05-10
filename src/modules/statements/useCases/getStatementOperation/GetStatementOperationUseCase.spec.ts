import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

const makeSut = () => {
  const userRepository = new InMemoryUsersRepository();
  const statementRepository = new InMemoryStatementsRepository();
  const sut = new GetStatementOperationUseCase(userRepository, statementRepository)
  return {
    sut, statementRepository, userRepository
  }
}

describe('Get Statement Operation Use Case', () => {
  it('ensure GetStatementOperationUseCase calls userRespository.findbyid with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'findStatementOperation')
      .mockResolvedValueOnce(new Statement());
    const repSpy = jest.spyOn(userRepository, 'findById');
    await sut.execute({user_id: 'user_id', statement_id: "statement_id"});
    expect(repSpy).toHaveBeenCalledWith('user_id');
  });

  it('ensure GetStatementOperationUseCase calls statementsRepository.findStatementOperation with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'findStatementOperation')
      .mockResolvedValueOnce(new Statement());
    const repSpy = jest.spyOn(statementRepository, 'findStatementOperation');
    await sut.execute({user_id: 'user_id', statement_id: "statement_id"});
    expect(repSpy).toHaveBeenCalledWith({user_id: 'user_id', statement_id:"statement_id" });
  });
});
