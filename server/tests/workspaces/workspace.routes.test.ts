import request from "supertest";

import app from "../../src/app";

describe("Workspace API", () => {
  let token: string;
  let secondUserToken: string;

  const testUser = {
    name: "Workspace Test User",
    email: `workspace-test-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const secondUser = {
    name: "Second Workspace Test User",
    email: `workspace-test-2-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const createWorkspace = async (
    name: string,
    authToken = token,
    description?: string
  ) => {
    const response = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name, description });

    expect(response.status).toBe(201);
    return response.body;
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;

    await request(app).post("/api/auth/register").send(secondUser);

    const secondLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: secondUser.email,
        password: secondUser.password,
      });

    expect(secondLoginResponse.status).toBe(200);
    secondUserToken = secondLoginResponse.body.token;
  });

  describe("POST /api/workspaces", () => {
    it("should create a workspace and assign its creator as owner", async () => {
      const response = await request(app)
        .post("/api/workspaces")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Product Workspace",
          description: "Workspace for product planning",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "Product Workspace",
          description: "Workspace for product planning",
          role: "owner",
        })
      );
      expect(response.body.id).toEqual(expect.any(String));
    });

    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .post("/api/workspaces")
        .send({ name: "Unauthorized Workspace" });

      expect(response.status).toBe(401);
    });

    it("should reject a missing workspace name", async () => {
      const response = await request(app)
        .post("/api/workspaces")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Missing name" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should reject an oversized description", async () => {
      const response = await request(app)
        .post("/api/workspaces")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Long Description Workspace",
          description: "a".repeat(1001),
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });
  });

  describe("GET /api/workspaces", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/workspaces");

      expect(response.status).toBe(401);
    });

    it("should return workspaces belonging to the authenticated member", async () => {
      const workspace = await createWorkspace("Workspace List");

      const response = await request(app)
        .get("/api/workspaces")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: workspace.id,
            name: "Workspace List",
            role: "owner",
          }),
        ])
      );
    });

    it("should not return workspaces for users without membership", async () => {
      const secondUserWorkspace = await createWorkspace(
        "Second User Workspace",
        secondUserToken
      );

      const response = await request(app)
        .get("/api/workspaces")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: secondUserWorkspace.id }),
        ])
      );
    });
  });

  describe("GET /api/workspaces/:workspaceId", () => {
    it("should return a workspace for an authenticated member", async () => {
      const workspace = await createWorkspace("Workspace Detail");

      const response = await request(app)
        .get(`/api/workspaces/${workspace.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: workspace.id,
          name: "Workspace Detail",
          role: "owner",
        })
      );
    });

    it("should return 404 for an inaccessible workspace", async () => {
      const workspace = await createWorkspace("Private Workspace");

      const response = await request(app)
        .get(`/api/workspaces/${workspace.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });

    it("should return 404 when a workspace does not exist", async () => {
      const response = await request(app)
        .get("/api/workspaces/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should reject an invalid workspace ID", async () => {
      const response = await request(app)
        .get("/api/workspaces/not-a-uuid")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
