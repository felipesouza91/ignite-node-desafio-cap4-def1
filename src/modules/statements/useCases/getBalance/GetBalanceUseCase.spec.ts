import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

const makeSut = () => {
  const userRepository = new InMemoryUsersRepository();
  const statementRepository = new InMemoryStatementsRepository();
  const sut = new GetBalanceUseCase(statementRepository, userRepository)
  return {
    sut, statementRepository, userRepository
  }
}
describe('Get Balance Use Case', () => {

  it('ensure GetBalanceUseCase calls userRespository.findbyid with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'findStatementOperation')
      .mockResolvedValueOnce(new Statement());
    const repSpy = jest.spyOn(userRepository, 'findById');
    await sut.execute({user_id: 'user_id'});
    expect(repSpy).toHaveBeenCalledWith('user_id');
  });

  it('ensure GetBalanceUseCase throws when user not exists', async () => {
    const { sut, } = makeSut();
    const response = sut.execute({user_id: 'user_id'});
    await expect(response).rejects.toBeInstanceOf(GetBalanceError);
  });

  it('ensure GetBalanceUseCase calls statementsRepository.getUserBalance with correct value', async () => {
    const { sut, userRepository,statementRepository } = makeSut();
    const repSpy = jest.spyOn(statementRepository, 'getUserBalance');
    jest.spyOn(userRepository, 'findById')
    .mockResolvedValueOnce(new User());
    await sut.execute({user_id: 'user_id'});
    expect(repSpy).toHaveBeenCalledWith({user_id: 'user_id', with_statement: true});
  });

  it('ensure GetBalanceUseCase return Statement', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'findStatementOperation')
      .mockResolvedValueOnce(new Statement());
    const repSpy = jest.spyOn(userRepository, 'findById');
    const response = await sut.execute({user_id: 'user_id'});
    expect(response).toBeTruthy();
  });
});
