import { AppError } from "../../../../shared/errors/AppError";
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
    const repSpy = jest.spyOn(userRepository, 'findById');
    await sut.execute(makeFakeInput());
    expect(repSpy).toHaveBeenCalledWith('user_id');
  });

  it('ensure CreateStatementUseCase calls statementsRepository.getUserBalance with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'getUserBalance')
      .mockResolvedValueOnce({ balance: 500});
    const repSpy = jest.spyOn(statementRepository, 'getUserBalance');
    await sut.execute({...makeFakeInput(), type: OperationType.WITHDRAW});
    expect(repSpy).toHaveBeenCalledWith({user_id:'user_id'});
  });

  it('ensure CreateStatementUseCase throws when user not exists', async () => {
    const { sut, } = makeSut();
    const response = sut.execute(makeFakeInput());
    await expect(response).rejects.toEqual(new AppError('User not found', 404));
  });

  it('ensure CreateStatementUseCase throws when balance is insuffcients', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'getUserBalance')
      .mockResolvedValueOnce({ balance: 50});
    const repSpy = jest.spyOn(statementRepository, 'getUserBalance');
    const response = sut.execute({...makeFakeInput(), type: OperationType.WITHDRAW});
    await expect(response).rejects.toEqual(new AppError('Insufficient funds', 400));
  });

  it('ensure CreateStatementUseCase calls statementsRepository.create with correct value', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'getUserBalance')
      .mockResolvedValueOnce({ balance: 500});
    const repSpy = jest.spyOn(statementRepository, 'create');
    await sut.execute({...makeFakeInput(), type: OperationType.WITHDRAW});
    expect(repSpy).toHaveBeenCalledWith({...makeFakeInput(), type: OperationType.WITHDRAW});
  });

  it('ensure CreateStatementUseCase return statements when correct values are provided', async () => {
    const { sut, userRepository, statementRepository} = makeSut();
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User());
    jest.spyOn(statementRepository, 'getUserBalance')
      .mockResolvedValueOnce({ balance: 500});
    const reponse =   await sut.execute({...makeFakeInput(), type: OperationType.WITHDRAW});
    expect(reponse).toBeTruthy();
  });
});
