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
    email: `task-test-2-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const createProject = async (name: string, authToken = token) => {
    const response = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name });

    expect(response.status).toBe(201);
    return response.body;
  };

  const createTask = async (
    projectId: string,
    title: string,
    authToken = token
  ) => {
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

  describe("GET /api/tasks", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
    });

    it("should return all tasks owned by the authenticated user", async () => {
      const project = await createProject("Task List Project");
      const firstTask = await createTask(project.id, "First listed task");
      const secondTask = await createTask(project.id, "Second listed task");

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: firstTask.id }),
          expect.objectContaining({ id: secondTask.id }),
        ])
      );
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a task with the requested attributes", async () => {
      const project = await createProject("Task Create Project");

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

    it("should reject unauthenticated requests", async () => {
      const response = await request(app).post("/api/tasks").send({
        projectId: "00000000-0000-0000-0000-000000000000",
        title: "Unauthorized task",
      });

      expect(response.status).toBe(401);
    });

    it("should reject invalid task input", async () => {
      const project = await createProject("Task Validation Project");

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ projectId: project.id, status: "not-a-status" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should not create tasks in another user's project", async () => {
      const secondUserProject = await createProject(
        "Second User Task Project",
        secondUserToken
      );

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ projectId: secondUserProject.id, title: "Foreign task" });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return a task by ID", async () => {
      const project = await createProject("Task Detail Project");
      const task = await createTask(project.id, "Task detail");

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ id: task.id, title: "Task detail" })
      );
    });

    it("should return 404 for an inaccessible task", async () => {
      const project = await createProject("Private Task Project");
      const task = await createTask(project.id, "Private task");

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });

    it("should reject an invalid task ID", async () => {
      const response = await request(app)
        .get("/api/tasks/not-a-uuid")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update a task", async () => {
      const project = await createProject("Task Update Project");
      const task = await createTask(project.id, "Original task");

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated task",
          priority: "low",
          dueDate: null,
        });

      expect(response.status).toBe(200);
      expect(response.body.task).toEqual(
        expect.objectContaining({
          id: task.id,
          title: "Updated task",
          priority: "low",
          due_date: null,
        })
      );
    });

    it("should reject an empty update", async () => {
      const project = await createProject("Empty Task Update Project");
      const task = await createTask(project.id, "Task without update");

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should not update another user's task", async () => {
      const project = await createProject("Private Update Task Project");
      const task = await createTask(project.id, "Private update task");

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Hacked task" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const project = await createProject("Task Delete Project");
      const task = await createTask(project.id, "Task to delete");

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it("should not delete another user's task", async () => {
      const project = await createProject("Private Delete Task Project");
      const task = await createTask(project.id, "Private delete task");

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/projects/:projectId/tasks", () => {
    it("should return tasks belonging to the requested project", async () => {
      const project = await createProject("Project Task List");
      const task = await createTask(project.id, "Project task");

      const response = await request(app)
        .get(`/api/projects/${project.id}/tasks`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });

    it("should not expose another user's project tasks", async () => {
      const project = await createProject("Private Nested Task Project");
      await createTask(project.id, "Private nested task");

      const response = await request(app)
        .get(`/api/projects/${project.id}/tasks`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual([]);
    });

    it("should reject an invalid project ID", async () => {
      const response = await request(app)
        .get("/api/projects/not-a-uuid/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
