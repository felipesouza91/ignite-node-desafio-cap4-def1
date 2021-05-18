import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";
let connection: Connection;
let token: string;
describe("Get Balance Controller", () => {
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

  it("ensure GetBalanceController return 401 when no valid is provided", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/balance`)
      .send({ amount: 100, description: "A deposit" });
    expect(response.body.message).toBe("JWT token is missing!");
  });

  it("ensure GetBalanceController return 401 when token invalid", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/balance`)
      .set("authorization", "Bearer invalidToken");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("ensure GetBalanceController return 404 when user not exits", async () => {
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
      .get("/api/v1/statements/balance")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("ensure GetBalanceController return 200 when corect values are provided", async () => {
    await request(app)
      .post("/api/v1/statements/deposit")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBe(100);
  });
});
