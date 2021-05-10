import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import {hash} from 'bcryptjs';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


const makeSut = () => {
  const userRespository = new InMemoryUsersRepository();
  const sut = new AuthenticateUserUseCase(userRespository);
  return { sut , userRespository}
}

describe('Authenticate User Use Case', () => {

  it('ensure AuthenticateUserUseCase calls usersRepository.findByEmail with correct value', async () => {
    const { sut, userRespository} = makeSut();
    const password = await hash("password", 8);
    await userRespository.create({
      email: "valid_email@email.com",
      password,
      name: "Felipe"
    });
    const repSpy = jest.spyOn(userRespository, 'findByEmail');
    await sut.execute({email: "valid_email@email.com", password: "password"});
    expect(repSpy).toHaveBeenCalledWith("valid_email@email.com");
  });

  it('ensure AuthenticateUserUseCase throws when user not exists', async () => {
    const { sut, userRespository} = makeSut();
    const reponse =  sut.execute({email: "valid_email@email.com", password: "password"});
    expect(reponse).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('ensure AuthenticateUserUseCase throws when password is invalid', async () => {
    const { sut, userRespository} = makeSut();
    const password = await hash("password", 8);
    await userRespository.create({
      email: "valid_email@email.com",
      password,
      name: "Felipe"
    });
    const reponse =  sut.execute({email: "valid_email@email.com", password: "invalidPasswor"});
    expect(reponse).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('ensure AuthenticateUserUseCase return a Authentication object when correct values are provided', async () => {
    const { sut, userRespository} = makeSut();
    const password = await hash("password", 8);
    await userRespository.create({
      email: "valid_email@email.com",
      password,
      name: "Felipe"
    });
    const response = await sut.execute({email: "valid_email@email.com", password: "password"});
    expect(response).toBeTruthy();
    expect(response.user.email).toBe("valid_email@email.com");
    expect(response.token).toBeTruthy();
  });
});
