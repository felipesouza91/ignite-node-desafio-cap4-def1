import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import {hash} from 'bcryptjs';


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
});
