const request = require("supertest");
const app = require("../src/app");

describe("Authentication APIs", () => {

  test("should register a new student", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Akash",
        email: "akash@test.com",
        password: "12345678",
        role: "student",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });


  test("should login successfully", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "akash@test.com",
        password: "12345678",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});