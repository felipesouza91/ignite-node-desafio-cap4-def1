import { response } from "express";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

import {app} from '../../../../app'
import { User } from "../../entities/User";


let connection: Connection;
let token: string;
describe('Authenticate User Controller', () => {
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
    await connection.getRepository(User).delete({});
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it('ensure return 200 when correct values are provided', async () => {
    const response = await request(app).get("/api/v1/profile")
    .set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe("admin@finapi.com");
  });

});
