import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


const makeFakeUser = (): User => {
  const user = new User();
  user.name = 'Any name';
  user.email = "valid_email@email.com";
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

  it('ensure CreateUserUseCase calls userRepository create with corrects values', async () => {
    const { sut,usersRepository } = makeSut();
    const repSpy = jest.spyOn(usersRepository, "create");
    await sut.execute({email: "valid_email@email.com", name: "Any Name",password: "any Password"});
    expect(repSpy).toHaveBeenCalledWith(expect.objectContaining({email: "valid_email@email.com", name: "Any Name"}));
  });

  it('ensure CreateUserUseCase throws when user email exists', async () => {
    const { sut,usersRepository } = makeSut();
    jest.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(makeFakeUser());
    const response = sut.execute({email: "valid_email@email.com", name: "Any Name",password: "any Password"});
    expect(response).rejects.toBeInstanceOf(CreateUserError);
  });

  it('ensure CreateUserUseCase return a user when valid values are provided', async () => {
    const { sut,usersRepository } = makeSut();
    jest.spyOn(usersRepository, "create").mockResolvedValueOnce(makeFakeUser());
    const response = await sut.execute({email: "valid_email@email.com", name: "Any name",password: "any Password"});
    expect(response).toBeTruthy();
    expect(response.id).not.toBeNull();
    expect(response.name).toBe("Any name");
    expect(response.email).toBe("valid_email@email.com");
  });

});
