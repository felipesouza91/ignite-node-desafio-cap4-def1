import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { Statement } from "../../entities/Statement";

let connection: Connection;
let token: string;

describe('Get Statement Operation Controller', () => {
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

  it('ensure GetStatementOperationController return 401 when no valid is provided', async () => {
    const response = await request(app).get("/api/v1/statements/any_id")
      .send({amount: 100, description: "A deposit" });
      expect(response.body.message).toBe("JWT token is missing!");
  });


  it('ensure GetStatementOperationController return 401 when token invalid', async () => {
    const response = await request(app).get("/api/v1/statements/any_id")
      .set("authorization", "Bearer invalidToken");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("JWT invalid token!");
  });

});
