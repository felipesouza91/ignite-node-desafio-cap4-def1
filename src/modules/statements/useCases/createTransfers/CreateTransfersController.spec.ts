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
      .post("/api/v1/statements/transfers/:user_id")
      .send({ amount: 100, description: "A deposit" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT token is missing!");
  });
});
