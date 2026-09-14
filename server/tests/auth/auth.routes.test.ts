import request  from "supertest";
import app from "../../src/app";

describe("Auth API", () => {
  const testUser = {
    name: "Auth Test User",
    email: `auth-test-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  let token: string;

  describe("POST /api/auth/register", () => {
    it("should register new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(
        expect.objectContaining({
          email:testUser.email
        })
      );
      expect(response.body.user.id).toEqual(expect.any(String));

    });

    it("should reject duplicate email", async() => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(500);

    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toEqual(expect.any(String));

      token = response.body.token;
    });

    it("should reject an incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(401);
    });

    it("should reject an unknown email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "does-not-exist@example.com",
          password: "TestPassword123!",
        });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .get("/api/auth/me");

      expect(response.status).toBe(401);
    });

    it("should return the authenticated user", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body.user).toEqual(
        expect.objectContaining({
          email: testUser.email,
        })
      );
    });

    it("should reject an invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
    });
  });
});