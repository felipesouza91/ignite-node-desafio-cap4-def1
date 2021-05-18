import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
import { User } from "../../entities/User";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(async () => {
    await connection.getRepository(User).delete({});
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("ensure return 400 when email alread is used", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password",
    });
    const response = await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  it("ensure return 201 when valid values are provided", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password",
    });
    expect(response.statusCode).toBe(201);
  });
});
