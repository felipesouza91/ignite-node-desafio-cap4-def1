import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import CreateTransfersUseCase from "./CreateTransfersUseCase";

const makeSut = () => {
  const userRepository = new InMemoryUsersRepository();
  const sut = new CreateTransfersUseCase(userRepository);
  return {
    sut,
    userRepository,
  };
};

describe("Create Transfers Use Case", () => {
  it("ensure CreateTransfersUseCase calls findUserBtIdReposity with user_id", async () => {
    const { sut, userRepository } = makeSut();
    const repSpy = jest.spyOn(userRepository, "findById");
    await sut.execute({
      amount: 100,
      description: "Pix diner",
      destUserId: "valid_destination_id",
      userId: "user_id",
    });
    expect(repSpy).toHaveBeenCalledWith("user_id");
  });

  it("ensure CreateTransfersUseCase calls findUserBtIdReposity with valid_destination_id", async () => {
    const { sut, userRepository } = makeSut();
    const repSpy = jest.spyOn(userRepository, "findById");
    await sut.execute({
      amount: 100,
      description: "Pix diner",
      destUserId: "valid_destination_id",
      userId: "user_id",
    });
    expect(repSpy).toHaveBeenCalledWith("valid_destination_id");
  });
});
