test("should prevent duplicate applications", async () => {

  const payload = {
    student: "STUDENT_ID",
    program: "PROGRAM_ID",
    university: "UNIVERSITY_ID",
    destinationCountry: "Canada",
    intake: "Fall 2026",
  };

  await request(app)
    .post("/api/applications")
    .send(payload);

  const duplicateResponse = await request(app)
    .post("/api/applications")
    .send(payload);

  expect(duplicateResponse.statusCode).toBe(400);
});