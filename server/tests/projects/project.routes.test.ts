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
    name: "Second Project Test User",
    email: `project-test-second-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const createWorkspace = async (name: string, authToken = token) => {
    const response = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name });

    expect(response.status).toBe(201);
    return response.body;
  };

  const createProject = async (
    workspaceId: string,
    name: string,
    authToken = token,
    description?: string
  ) => {
    const response = await request(app)
      .post(`/api/workspaces/${workspaceId}/projects`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name, ...(description ? { description } : {}) });

    expect(response.status).toBe(201);
    return response.body;
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;

    await request(app).post("/api/auth/register").send(secondUser);
    const secondLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: secondUser.email, password: secondUser.password });

    expect(secondLoginResponse.status).toBe(200);
    secondUserToken = secondLoginResponse.body.token;
  });

  describe("POST /api/workspaces/:workspaceId/projects", () => {
    it("creates a project for a workspace member", async () => {
      const workspace = await createWorkspace("Project creation workspace");

      const response = await request(app)
        .post(`/api/workspaces/${workspace.id}/projects`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Created Project", description: "Project description" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          workspace_id: workspace.id,
          created_by: expect.any(String),
          name: "Created Project",
          description: "Project description",
        })
      );
    });

    it("rejects an unauthenticated request", async () => {
      const workspace = await createWorkspace("Unauthenticated project workspace");

      const response = await request(app)
        .post(`/api/workspaces/${workspace.id}/projects`)
        .send({ name: "Unauthorized Project" });

      expect(response.status).toBe(401);
    });

    it("validates the workspace id and project payload", async () => {
      const invalidWorkspaceResponse = await request(app)
        .post("/api/workspaces/not-a-uuid/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Project" });
      expect(invalidWorkspaceResponse.status).toBe(400);

      const workspace = await createWorkspace("Project validation workspace");
      const invalidPayloadResponse = await request(app)
        .post(`/api/workspaces/${workspace.id}/projects`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Missing project name" });
      expect(invalidPayloadResponse.status).toBe(400);
    });

    it("does not let a non-member create a project", async () => {
      const workspace = await createWorkspace("Private project workspace");

      const response = await request(app)
        .post(`/api/workspaces/${workspace.id}/projects`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ name: "Unauthorized Project" });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/workspaces/:workspaceId/projects", () => {
    it("returns projects belonging to the requested workspace", async () => {
      const workspace = await createWorkspace("Project list workspace");
      const project = await createProject(workspace.id, "Listed Project");

      const response = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: project.id, name: "Listed Project" })])
      );
    });

    it("rejects unauthenticated and non-member requests", async () => {
      const workspace = await createWorkspace("Private project list workspace");

      const unauthenticatedResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects`);
      expect(unauthenticatedResponse.status).toBe(401);

      const nonMemberResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(nonMemberResponse.status).toBe(404);
    });
  });

  describe("GET /api/workspaces/:workspaceId/projects/:id", () => {
    it("returns a project to a workspace member", async () => {
      const workspace = await createWorkspace("Project detail workspace");
      const project = await createProject(workspace.id, "Detail Project");

      const response = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ id: project.id, name: "Detail Project" }));
    });

    it("does not expose a project through another workspace", async () => {
      const firstWorkspace = await createWorkspace("First project boundary workspace");
      const secondWorkspace = await createWorkspace("Second project boundary workspace");
      const project = await createProject(firstWorkspace.id, "Bounded Project");

      const response = await request(app)
        .get(`/api/workspaces/${secondWorkspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("rejects invalid project ids and non-members", async () => {
      const workspace = await createWorkspace("Project access workspace");
      const project = await createProject(workspace.id, "Private Detail Project");

      const invalidIdResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects/not-a-uuid`)
        .set("Authorization", `Bearer ${token}`);
      expect(invalidIdResponse.status).toBe(400);

      const nonMemberResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(nonMemberResponse.status).toBe(404);
    });
  });

  describe("PATCH /api/workspaces/:workspaceId/projects/:id", () => {
    it("lets the project manager update a project", async () => {
      const workspace = await createWorkspace("Project update workspace");
      const project = await createProject(workspace.id, "Original Project", token, "Original description");

      const response = await request(app)
        .patch(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Project" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: project.id,
          name: "Updated Project",
          description: "Original description",
        })
      );
    });

    it("rejects empty updates and non-member updates", async () => {
      const workspace = await createWorkspace("Project update permissions workspace");
      const project = await createProject(workspace.id, "Protected Project");

      const emptyUpdateResponse = await request(app)
        .patch(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(emptyUpdateResponse.status).toBe(400);

      const nonMemberResponse = await request(app)
        .patch(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ name: "Hacked Project" });
      expect(nonMemberResponse.status).toBe(404);
    });
  });

  describe("DELETE /api/workspaces/:workspaceId/projects/:id", () => {
    it("lets the project manager delete a project", async () => {
      const workspace = await createWorkspace("Project deletion workspace");
      const project = await createProject(workspace.id, "Delete Project");

      const deleteResponse = await request(app)
        .delete(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getResponse.status).toBe(404);
    });

    it("does not let a non-member delete a project", async () => {
      const workspace = await createWorkspace("Project deletion permissions workspace");
      const project = await createProject(workspace.id, "Protected Delete Project");

      const response = await request(app)
        .delete(`/api/workspaces/${workspace.id}/projects/${project.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });
  });
});
