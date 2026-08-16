# TaskFlow

TaskFlow is a modern task management application for organizing projects, managing tasks, and tracking progress from a single workspace.

The application is being built with a production-oriented architecture with a focus on maintainability, security, scalability, performance, and a clean user experience.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- React-Redux
- CSS
- Jest
- React Testing Library

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- bcrypt
- JSON Web Tokens (JWT)

### Infrastructure

- GitHub
- Vercel
- Neon PostgreSQL

---

## Architecture

```text
                         ┌──────────────────────┐
                         │        Vercel        │
                         │   React + TypeScript │
                         └──────────┬───────────┘
                                    │
                                  HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      API Server      │
                         │   Node + Express     │
                         └──────────┬───────────┘
                                    │
                              PostgreSQL
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        Neon          │
                         │      PostgreSQL      │
                         └──────────────────────┘