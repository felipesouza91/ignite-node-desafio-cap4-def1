import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";

let connection: Connection;
let token: string;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password",
    });
  });

  beforeEach(async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com",
      password: "password",
    });
    token = response.body.token;
  });

  afterEach(async () => {
    await connection.getRepository(Statement).delete({});
  });

  afterAll(async () => {
    await connection.getRepository(User).delete({});
    await connection.dropDatabase();
    await connection.close();
  });

  it("ensure CreateStatementController return 401 when no valid is provided", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT token is missing!");
  });

  it("ensure CreateStatementController return 401 when invalid token is provided", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer anyToken`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("ensure CreateStatementController return 404 when userid not found", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "anotheruser@finapi.com",
      password: "password",
    });
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "anotheruser@finapi.com",
      password: "password",
    });
    token = responseToken.body.token;
    await connection
      .getRepository(User)
      .delete({ id: responseToken.body.user.id });
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("ensure CreateStatementController return 201 when deposit with correct values", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(201);
    expect(response.body.amount).toBe(100);
    expect(response.body.type).toBe("deposit");
  });

  it("ensure CrateStatementController return 400 when withdraw with insuficiente founds", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A withdraw" });
    console.log(response);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  it("ensure CrateStatementController return 201 when withdraw with founds", async () => {
    await request(app)
      .post("/api/v1/statements/deposit")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 50, description: "A withdraw" });
    console.log(response);
    expect(response.statusCode).toBe(201);
    expect(response.body.amount).toBe(50);
    expect(response.body.type).toBe("withdraw");
  });
});
