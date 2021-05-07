import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



const makeSut = () => {
  const fakeUserRepository = new InMemoryUsersRepository();
  const sut = new ShowUserProfileUseCase(fakeUserRepository);
  return {
    sut, fakeUserRepository
  }
}

describe('Show Use Profile Use Case', () => {

  it('ensure useRepository calls with correct user_id', async () => {
    const { sut, fakeUserRepository } = makeSut();
    jest.spyOn(fakeUserRepository, 'findById').mockResolvedValueOnce(new User());
    const repSpy = jest.spyOn(fakeUserRepository, 'findById');
    await sut.execute("any_id");
    expect(repSpy).toBeCalledWith("any_id");
  });

  it('ensure useRepository throws when user not exists', async () => {
    const { sut, fakeUserRepository } = makeSut();
    jest.spyOn(fakeUserRepository, 'findById').mockResolvedValueOnce(undefined);

    const response = sut.execute("any_id");
    expect(response).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
