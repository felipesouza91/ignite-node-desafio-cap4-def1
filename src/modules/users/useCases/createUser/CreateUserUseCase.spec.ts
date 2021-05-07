import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


const makeFakeUser = (): User => {
  const user = new User();
  user.name = 'Any name';
  return user;
}


const makeSut = () => {
  const usersRepository = new InMemoryUsersRepository();
  const sut = new CreateUserUseCase(usersRepository);
  return  {
    sut, usersRepository
  }
}

describe('Create User Use Case', () => {
  it('ensure CreateUserUseCase calls userRepository findByEmail with corrects values', async () => {
    const { sut,usersRepository } = makeSut();
    const repSpy = jest.spyOn(usersRepository, "findByEmail");

    await sut.execute({email: "valid_email@email.com", name: "Any Name",password: "any Password"});
    expect(repSpy).toHaveBeenCalledWith("valid_email@email.com");

  });
});
