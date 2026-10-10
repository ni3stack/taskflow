import request from "supertest";
import app from "../../src/app";

describe("Task API", () => {
  let token: string;
  let secondUserToken: string;

  const testUser = {
    name: "Task Test User",
    email: `task-test-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };
  const secondUser = {
    name: "Second Task Test User",
    email: `task-test-second-${Date.now()}@example.com`,
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

  const createProject = async (workspaceId: string, name: string, authToken = token) => {
    const response = await request(app)
      .post(`/api/workspaces/${workspaceId}/projects`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name });
    expect(response.status).toBe(201);
    return response.body;
  };

  const createTask = async (projectId: string, title: string, authToken = token) => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ projectId, title });
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

  describe("GET /api/tasks", () => {
    it("returns tasks created by the authenticated user", async () => {
      const workspace = await createWorkspace("Task list workspace");
      const project = await createProject(workspace.id, "Task list project");
      const firstTask = await createTask(project.id, "First listed task");
      const secondTask = await createTask(project.id, "Second listed task");

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: firstTask.id }),
          expect.objectContaining({ id: secondTask.id }),
        ])
      );
    });

    it("rejects an unauthenticated request", async () => {
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/workspaces/:workspaceId/tasks", () => {
    it("returns workspace tasks only to workspace members", async () => {
      const workspace = await createWorkspace("Workspace task filter workspace");
      const project = await createProject(workspace.id, "Workspace task filter project");
      const task = await createTask(project.id, "Workspace-filtered task");

      const response = await request(app)
        .get(`/api/workspaces/${workspace.id}/tasks`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );

      const nonMemberResponse = await request(app)
        .get(`/api/workspaces/${workspace.id}/tasks`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(nonMemberResponse.status).toBe(404);
    });
  });

  describe("POST /api/tasks", () => {
    it("creates a task with the requested attributes", async () => {
      const workspace = await createWorkspace("Task creation workspace");
      const project = await createProject(workspace.id, "Task creation project");

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          projectId: project.id,
          title: "Created task",
          description: "Created by integration test",
          status: "in_progress",
          priority: "high",
          dueDate: "2027-01-01T00:00:00.000Z",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          project_id: project.id,
          title: "Created task",
          description: "Created by integration test",
          status: "in_progress",
          priority: "high",
        })
      );
    });

    it("rejects unauthenticated and invalid requests", async () => {
      const workspace = await createWorkspace("Task validation workspace");
      const project = await createProject(workspace.id, "Task validation project");

      const unauthenticatedResponse = await request(app)
        .post("/api/tasks")
        .send({ projectId: project.id, title: "Unauthorized task" });
      expect(unauthenticatedResponse.status).toBe(401);

      const invalidResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ projectId: project.id, status: "not-a-status" });
      expect(invalidResponse.status).toBe(400);
    });

    it("does not create a task in another user's project", async () => {
      const workspace = await createWorkspace("Private task workspace", secondUserToken);
      const project = await createProject(workspace.id, "Private task project", secondUserToken);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ projectId: project.id, title: "Foreign task" });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("returns a task when the caller belongs to its workspace", async () => {
      const workspace = await createWorkspace("Task detail workspace");
      const project = await createProject(workspace.id, "Task detail project");
      const task = await createTask(project.id, "Task detail");

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ id: task.id, title: "Task detail" }));
    });

    it("does not expose a task outside its workspace", async () => {
      const workspace = await createWorkspace("Private task detail workspace");
      const project = await createProject(workspace.id, "Private task detail project");
      const task = await createTask(project.id, "Private task");

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });

    it("rejects invalid task ids", async () => {
      const response = await request(app)
        .get("/api/tasks/not-a-uuid")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("lets a task author update their task", async () => {
      const workspace = await createWorkspace("Task update workspace");
      const project = await createProject(workspace.id, "Task update project");
      const task = await createTask(project.id, "Original task");

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated task", priority: "low", dueDate: null });

      expect(response.status).toBe(200);
      expect(response.body.task).toEqual(
        expect.objectContaining({ id: task.id, title: "Updated task", priority: "low", due_date: null })
      );
    });

    it("rejects empty updates and non-author updates", async () => {
      const workspace = await createWorkspace("Task update permissions workspace");
      const project = await createProject(workspace.id, "Task update permissions project");
      const task = await createTask(project.id, "Protected task");

      const emptyResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(emptyResponse.status).toBe(400);

      const nonAuthorResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Hacked task" });
      expect(nonAuthorResponse.status).toBe(404);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("lets a task author delete their task", async () => {
      const workspace = await createWorkspace("Task deletion workspace");
      const project = await createProject(workspace.id, "Task deletion project");
      const task = await createTask(project.id, "Task to delete");

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getResponse.status).toBe(404);
    });

    it("does not let a non-author delete a task", async () => {
      const workspace = await createWorkspace("Task deletion permissions workspace");
      const project = await createProject(workspace.id, "Task deletion permissions project");
      const task = await createTask(project.id, "Protected deletion task");

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/projects/:projectId/tasks", () => {
    it("returns tasks for an accessible project", async () => {
      const workspace = await createWorkspace("Project task list workspace");
      const project = await createProject(workspace.id, "Project task list project");
      const task = await createTask(project.id, "Project task");

      const response = await request(app)
        .get(`/api/projects/${project.id}/tasks`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });

    it("does not expose a project outside the caller's workspace", async () => {
      const workspace = await createWorkspace("Private project task workspace");
      const project = await createProject(workspace.id, "Private project task project");

      const response = await request(app)
        .get(`/api/projects/${project.id}/tasks`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });

    it("rejects invalid project ids", async () => {
      const response = await request(app)
        .get("/api/projects/not-a-uuid/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
  });
});
