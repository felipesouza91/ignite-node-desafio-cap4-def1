import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";
import { v4 as uuidV4 } from "uuid";
let connection: Connection;
let token: string;

describe("Get Statement Operation Controller", () => {
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

  it("ensure GetStatementOperationController return 401 when no valid is provided", async () => {
    const response = await request(app)
      .get("/api/v1/statements/any_id")
      .send({ amount: 100, description: "A deposit" });
    expect(response.body.message).toBe("JWT token is missing!");
  });

  it("ensure GetStatementOperationController return 401 when token invalid", async () => {
    const response = await request(app)
      .get("/api/v1/statements/any_id")
      .set("authorization", "Bearer invalidToken");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("ensure GetStatementOperationController return 404 when user not exits", async () => {
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
      .get("/api/v1/statements/any_id")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("ensure GetStatementOperationController return 404 when statment id not exists", async () => {
    const fakeId = uuidV4();
    const response = await request(app)
      .get(`/api/v1/statements/${fakeId}`)
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Statement not found");
  });

  it("ensure GetStatementOperationController return 200 when valid statment id is provide", async () => {
    const createStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .set("authorization", `Bearer ${token}`)
      .send({ amount: 100, description: "A deposit" });
    const response = await request(app)
      .get(`/api/v1/statements/${createStatement.body.id}`)
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createStatement.body.id);
  });
});
