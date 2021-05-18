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
  it("ensure return 401 when invalid credentials are provided ", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "admin@finapi.com", password: "password" });
    expect(response.statusCode).toBe(401);
  });

  it("ensure return 200 when valid credentials are provided ", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password",
    });
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "admin@finapi.com", password: "password" });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe("admin@finapi.com");
  });
});
