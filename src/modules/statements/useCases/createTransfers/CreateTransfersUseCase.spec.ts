import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateTransfersError } from "./CreateTransfersError";
import CreateTransfersUseCase from "./CreateTransfersUseCase";

const makeSut = () => {
  const userRepository = new InMemoryUsersRepository();
  const statementRepoisoty = new InMemoryStatementsRepository();
  const sut = new CreateTransfersUseCase(userRepository, statementRepoisoty);
  return {
    sut,
    userRepository,
    statementRepoisoty,
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

  it("ensure CreateTransfersUseCase calls find getUserBalance with user_id", async () => {
    const { sut, statementRepoisoty, userRepository } = makeSut();
    jest.spyOn(userRepository, "findById").mockResolvedValue(new User());
    const repSpy = jest.spyOn(statementRepoisoty, "getUserBalance");
    await sut.execute({
      amount: 100,
      description: "Pix diner",
      destUserId: "valid_destination_id",
      userId: "user_id",
    });
    expect(repSpy).toHaveBeenCalledWith({ user_id: "user_id" });
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

  it("ensure CreateTransfersUseCase throw when destination_id not exists", async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, "findById").mockResolvedValueOnce(new User());
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
