const request = require("supertest");
const app = require("../src/app");

describe("Application Workflow APIs", () => {

  test("should create application", async () => {

    const response = await request(app)
      .post("/api/applications")
      .send({
        student: "STUDENT_ID",
        program: "PROGRAM_ID",
        university: "UNIVERSITY_ID",
        destinationCountry: "Canada",
        intake: "Fall 2026",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });
});