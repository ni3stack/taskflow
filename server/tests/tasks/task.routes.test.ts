import request from "supertest";
import app from "../../src/app";
import {
  addProjectMember,
  addWorkspaceAdmin,
  addWorkspaceMember,
  removeProjectMember,
} from "../helpers/fixtures";

describe("Task API", () => {
  let token: string;
  let secondUserToken: string;
  let secondUserId: string;
  let taskOwnerId: string;

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

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(registerResponse.status).toBe(201);
    taskOwnerId = registerResponse.body.user.id;
  
    await request(app).post("/api/auth/register").send(testUser);
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;

    const secondRegisterResponse = await request(app)
      .post("/api/auth/register")
      .send(secondUser);
    expect(secondRegisterResponse.status).toBe(201);
    secondUserId = secondRegisterResponse.body.user.id;
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

    it("denies task changes by a workspace member outside the project", async () => {
      const workspace = await createWorkspace("Workspace task permissions workspace");
      const project = await createProject(workspace.id, "Workspace task permissions project");
      const task = await createTask(project.id, "Workspace-protected task");

      await addWorkspaceMember(workspace.id, secondUserId);

      const updateResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Updated by admin" });

      expect(updateResponse.status).toBe(404);

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(deleteResponse.status).toBe(404);

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: task.title,
        })
      );
    });

    it("denies task changes after the creator leaves the project", async () => {
      const workspace = await createWorkspace("Former member workspace");
      const project = await createProject(workspace.id, "Former member project");

      await addProjectMember(
        workspace.id,
        project.id,
        secondUserId,
        "contributor"
      );

      const task = await createTask(
        project.id,
        "Former member's task",
        secondUserToken
      );

      await removeProjectMember(project.id, secondUserId);

      const updateResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Unauthorized change" });

      expect(updateResponse.status).toBe(404);

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(deleteResponse.status).toBe(404);

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: "Former member's task",
        })
      );
    });

    it("lets a workspace owner update and delete without project membership", async () => {
      const workspace = await createWorkspace("Owner permissions workspace");
      const project = await createProject(workspace.id, "Owner permissions project");

      await addProjectMember(
        workspace.id,
        project.id,
        secondUserId,
        "contributor"
      );

      const task = await createTask(
        project.id,
        "Contributor's task",
        secondUserToken
      );

      // Remove the owner's project membership, retaining workspace ownership.
      await removeProjectMember(project.id, taskOwnerId);

      const updateResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated by workspace owner" });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.task.title).toBe("Updated by workspace owner");

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
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

    it("lets a project contributor update but not delete a task", async () => {
      const workspace = await createWorkspace("Contributor task permissions workspace");
      const project = await createProject(workspace.id, "Contributor task permissions project");
      const task = await createTask(project.id, "Contributor editable task");
      await addProjectMember(workspace.id, project.id, secondUserId, "contributor");

      const updateResponse = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Updated by contributor" });
      expect(updateResponse.status).toBe(200);

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(deleteResponse.status).toBe(404);
    });

    it("lets a workspace admin update another member's task", async () => {
      const workspace = await createWorkspace("Admin task update workspace");
      const project = await createProject(workspace.id, "Admin task update project");
      const task = await createTask(project.id, "Admin editable task");
      await addWorkspaceAdmin(workspace.id, secondUserId);

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Updated by admin" });

      expect(response.status).toBe(200);
    });

    it("lets a project manager update another member's task", async () => {
      const workspace = await createWorkspace("Manager update workspace");
      const project = await createProject(workspace.id, "Manager update project");
      const task = await createTask(project.id, "Original task");

      await addProjectMember(
        workspace.id,
        project.id,
        secondUserId,
        "manager"
      );

      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ title: "Updated by manager", status: "in_progress" });

      expect(response.status).toBe(200);
      expect(response.body.task).toEqual(
        expect.objectContaining({
          id: task.id,
          title: "Updated by manager",
          status: "in_progress",
        })
      );

      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: "Updated by manager",
          status: "in_progress",
        })
      );
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

    it("lets a project manager delete another member's task", async () => {
      const workspace = await createWorkspace("Manager task deletion workspace");
      const project = await createProject(workspace.id, "Manager task deletion project");
      const task = await createTask(project.id, "Manager deletable task");
      await addProjectMember(workspace.id, project.id, secondUserId, "manager");

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(204);
    });

    it("lets a workspace admin delete another member's task", async () => {
      const workspace = await createWorkspace("Admin task deletion workspace");
      const project = await createProject(workspace.id, "Admin task deletion project");
      const task = await createTask(project.id, "Admin deletable task");
      await addWorkspaceAdmin(workspace.id, secondUserId);

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(204);
    });

    it("does not let a contributor delete their own task", async () => {
      const workspace = await createWorkspace("Contributor task deletion workspace");
      const project = await createProject(workspace.id, "Contributor task deletion project");
      await addProjectMember(workspace.id, project.id, secondUserId, "contributor");

      const task = await createTask(project.id, "Contributor deletable task");


      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.status).toBe(404);

      // Verify the denied request did not delete the task.
      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(task.id);
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
