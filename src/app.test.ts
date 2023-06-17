import request from "supertest";
import app from "./app";

describe("POST /login", () => {
  test("should return the user and token", async () => {
    const response = await request(app).post("/login").send({
      email: "email@gmail.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});

describe("GET /weather/:city", () => {
  let token: undefined | string;
  beforeAll(function (done) {
    request(app)
      .post("/login")
      .send({
        email: "email@gmail.com",
        password: "123456",
      })
      .end(function (err, res) {
        const result = JSON.parse(res.text);
        token = result.token;
        done();
      });
  });

  it("should return the weather data", () => {
    request(app)
      .get("/weather/london")
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });
});
