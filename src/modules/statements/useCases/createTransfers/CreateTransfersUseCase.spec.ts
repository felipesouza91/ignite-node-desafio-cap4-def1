import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

import { CreateTransfersError } from "./CreateTransfersError";
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
    jest.spyOn(userRepository, "findById").mockResolvedValue(new User());
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
    jest.spyOn(userRepository, "findById").mockResolvedValue(new User());
    const repSpy = jest.spyOn(userRepository, "findById");
    await sut.execute({
      amount: 100,
      description: "Pix diner",
      destUserId: "valid_destination_id",
      userId: "user_id",
    });
    expect(repSpy).toHaveBeenCalledWith("valid_destination_id");
  });

  it("ensure CreateTransfersUseCase throw when userId not exists", async () => {
    const { sut } = makeSut();
    const response = sut.execute({
      amount: 100,
      description: "Pix diner",
      destUserId: "valid_destination_id",
      userId: "user_id",
    });
    await expect(response).rejects.toBeInstanceOf(
      CreateTransfersError.UserNotFound
    );
  });
});
