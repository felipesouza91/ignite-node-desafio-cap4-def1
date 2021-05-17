import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { Statement } from "../../entities/Statement";
let connection: Connection;
let token: string;
describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@finapi.com",
      password: "password"
    });
  });

  beforeEach( async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com",
      password: "password"
    });
    token = response.body.token
  })

  afterEach(async () => {
    await connection.getRepository(Statement).delete({});
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('ensure GetBalanceController return 401 when no valid is provided', async () => {
    const response = await request(app).post("/api/v1/statements/balance")
      .send({amount: 100, description: "A deposit" })
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("JWT token is missing!");
  });

  it('ensure GetBalanceController return 401 when token invalid', async () => {
    const response = await request(app).post("/api/v1/statements/balance")
      .set("authorization", "Bearer invalidToken")
      .send({amount: 100, description: "A deposit" })
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("JWT invalid token!");
  });

});