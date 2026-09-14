import request from "supertest";
import app from "../../src/app";

describe("Project API", () => {
  let token: string;
  let secondUserToken: string;

  const testUser = {
    name: "Project Test User",
    email: `project-test-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const secondUser = {
    name: "Second Test User",
    email: `project-test-2-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  beforeAll(async () => {
    // Create first user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;

    // Create second user for ownership tests
    await request(app)
      .post("/api/auth/register")
      .send(secondUser);

    const secondLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: secondUser.email,
        password: secondUser.password,
      });

    expect(secondLoginResponse.status).toBe(200);
    secondUserToken = secondLoginResponse.body.token;
  });

  describe("GET /api/projects", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .get("/api/projects");

      expect(response.status).toBe(401);
    });

    it("should return the authenticated user's projects", async () => {
      await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "My Test Project",
          description: "Project description",
        });

      const response = await request(app)
        .get("/api/projects")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "My Test Project",
          }),
        ])
      );
    });
  });

  describe("POST /api/projects", () => {
    it("should create a project", async () => {
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Created Project",
          description: "Created by integration test",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Created Project",
          description: "Created by integration test",
        })
      );

      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.user_id).toEqual(expect.any(String));
    });

    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({
          name: "Unauthorized Project",
        });

      expect(response.status).toBe(401);
    });

    it("should reject a missing project name", async () => {
      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Missing name",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("GET /api/projects/:id", () => {
    it("should return a project by id", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Get Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: projectId,
          name: "Get Project",
        })
      );
    });

    it("should return 404 when project does not exist", async () => {
      const response = await request(app)
        .get("/api/projects/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should reject an invalid project id", async () => {
      const response = await request(app)
        .get("/api/projects/not-a-uuid")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });

    it("should not allow another user to access the project", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Private Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/projects/:id", () => {
    it("should update a project", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Original Project",
          description: "Original description",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Project",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: projectId,
          name: "Updated Project",
          description: "Original description",
        })
      );
    });

    it("should reject an empty update", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return 404 when updating another user's project", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Private Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({
          name: "Hacked Project",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/projects/:id", () => {
    it("should delete a project", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Delete Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting another user's project", async () => {
      const createResponse = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Private Project",
        });

      const projectId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });
  });
});