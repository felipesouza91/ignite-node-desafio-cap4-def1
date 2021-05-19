import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";

let connection: Connection;
let token: string;
let userId: string;
describe("Create Transfers Controller", () => {
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
    userId = response.body.user.id;
  });

  afterEach(async () => {
    await connection.getRepository(Statement).delete({});
  });

  afterAll(async () => {
    await connection.getRepository(User).delete({});
    await connection.dropDatabase();
    await connection.close();
  });

  it("ensure CreateTransfersController return 401 when no valid is provided", async () => {
    const response = await request(app)
      .post("/api/v1/statements/transfers/:user_id")
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT token is missing!");
  });

  it("ensure CreateTransfersController return 401 when invalid token is provided", async () => {
    const response = await request(app)
      .post("/api/v1/statements/transfers/:user_id")
      .set("Authorization", `Bearer anyToken`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("ensure CreateStatementController return 404 when userid not found", async () => {
    const anotherUser = await request(app).post("/api/v1/users").send({
      name: "Another user ",
      email: "anotheruser@finapi.com",
      password: "password",
    });
    await connection.getRepository(User).delete({ id: userId });
    const response = await request(app)
      .post(`/api/v1/statements/transfers/${anotherUser.body.id}`)
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
