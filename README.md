# TeamNova

TeamNova is a full-stack B2B project-management platform for teams that need shared workspaces, projects, tasks, invitations, and role-based access in one place. It combines a Next.js and React client with an Express API, MongoDB persistence, Passport authentication, and Google OAuth.

The application gives each team an isolated workspace. Owners can manage workspace settings and membership roles, authorized members can create and maintain projects and tasks, and every user has a personal profile with a name, email address, physical address, workspace role, and profile picture.

TeamNova is designed for collaborative project tracking. It is not an employee-monitoring system, payroll platform, or replacement for an organization’s identity and compliance controls.

## Problems TeamNova solves

Teams often lose time when project information is scattered across messages, spreadsheets, personal notes, and disconnected tools. TeamNova provides one shared source of truth for the work a team has planned, who is responsible for it, and what needs attention next.

- **Scattered project information:** Workspaces keep related projects, tasks, members, and settings together instead of spreading them across multiple tools.
- **Unclear ownership:** Task assignees, creators, priorities, statuses, and due dates make responsibility and expectations visible.
- **Poor progress visibility:** Search, filters, project views, and workspace analytics help teams understand what is pending, active, completed, or overdue.
- **Difficult team onboarding:** Shareable invitation links take new members into the intended workspace while preserving the invitation through registration, sign-in, and Google OAuth.
- **Unsafe access between teams:** Workspace-scoped data queries and role-based permissions prevent members from viewing or changing resources outside their authorized workspace.
- **Inconsistent project workflows:** A common structure for projects and tasks gives every member the same view of priorities and next actions.
- **Costly account duplication:** Email normalization and Google account linking allow users to access an existing account without creating conflicting duplicate records.
- **Accidental or confusing actions:** Confirmation dialogs, validation, clear empty states, and Sonner notifications provide immediate feedback for create, update, and delete operations.

## Platform features

### Authentication and accounts

- Register and sign in with email and password.
- Sign in with Google OAuth 2.0.
- Link Google authentication to an existing account with the same normalized email.
- Persist authenticated sessions in MongoDB.
- Sign out and destroy the server-side session.
- Recover safely from repeated OAuth callbacks and duplicate-account races.
- Protect every workspace application route.

### Workspace management

- Create multiple isolated workspaces.
- Switch between workspaces from the application sidebar.
- Edit workspace names and descriptions.
- Delete a workspace and its associated projects, tasks, and memberships.
- Select a valid fallback workspace after deletion.
- View workspace-level task and project analytics.
- Keep every workspace operation scoped to an authenticated member.

### Invitations and membership

- Generate a unique invitation code for each workspace.
- Share a workspace-specific invitation link.
- Preserve the invitation destination through sign-up, sign-in, and Google OAuth.
- Add invited users directly as `MEMBER` instead of creating an unrelated owner workspace.
- Reopen invitations safely when the user is already a member.
- Change member roles when the acting user has permission.
- Prevent task assignment to users outside the workspace.

### Projects

- Create projects with a name, description, and emoji.
- List projects with server-side pagination.
- Open project details and project-specific analytics.
- Edit project details, including clearing an existing description.
- Delete a project and its associated tasks.
- Restrict create, edit, and delete operations through workspace permissions.

### Tasks

- Create tasks inside a selected workspace project.
- Store title, description, status, priority, due date, assignee, and creator.
- Edit and delete tasks.
- Search tasks by keyword.
- Filter by project, status, priority, assignee, and due date.
- Paginate and sort task results.
- Validate that projects, tasks, and assignees belong to the requested workspace.

### User profiles

- View name and account email.
- Store and edit an address.
- Display the user’s derived role in the active workspace.
- Upload, preview, replace, or remove a profile picture.
- Accept PNG, JPEG, WebP, and GIF images up to 1 MB.
- Keep email and role read-only because they require verification or workspace authorization.

### Application experience

- Responsive landing, authentication, dashboard, project, task, member, settings, and profile pages.
- Loading skeletons, empty states, confirmation dialogs, and accessible controls.
- Sonner notifications for successful mutations and API errors.
- Colored backend API, information, warning, and HTTP-status logging.
- Dark-theme-ready component tokens and a consistent modern system font stack.

## How the system works

### 1. Authentication

1. A user registers with email/password or starts Google OAuth.
2. Passport verifies the credentials or Google profile.
3. Google emails are normalized and linked to an existing matching account when appropriate.
4. Express creates a server-side session stored in MongoDB through `connect-mongo`.
5. The browser receives an HTTP-only session cookie.
6. Axios sends the cookie with API requests using `withCredentials`.
7. Passport deserializes the user and protected routes reject unauthenticated requests.

Passwords are hashed with bcrypt. The browser never receives password hashes or chooses a trusted user ID.

### 2. Creating a workspace

1. An authenticated user submits a workspace name and description.
2. Zod validates the request.
3. MongoDB creates the workspace with the user as its owner.
4. TeamNova creates an owner membership using the seeded `OWNER` role.
5. The workspace becomes the user’s current workspace.
6. React Query refreshes the workspace list and the client opens the new dashboard.

### 3. Joining through an invitation

1. A workspace member shares `/invite/workspace/:inviteCode/join`.
2. If the recipient is signed out, TeamNova carries that path through email or Google authentication.
3. A newly registered invited user is created directly with a `MEMBER` membership in the target workspace.
4. An existing user receives a membership if one does not already exist.
5. The invited workspace becomes the user’s current workspace.
6. The client refreshes workspace data and opens the invited workspace.

### 4. Managing projects and tasks

1. Every request includes the workspace ID in its URL.
2. The backend resolves the authenticated user’s membership and populated role.
3. A permission guard checks the required action.
4. Project and task queries include workspace ownership constraints.
5. Task assignees are checked against workspace memberships.
6. Validated records are stored in MongoDB.
7. React Query invalidates the affected lists and analytics.

### 5. Updating a profile

1. The user opens the Profile route available to every authenticated member.
2. The browser validates image type and the 1 MB limit.
3. The image is encoded as a data URL and submitted with the profile fields.
4. Express accepts profile payloads up to 2 MB and Zod validates the data.
5. MongoDB updates the name, address, and profile picture.
6. The API derives the active workspace role from membership data.
7. The client updates the authenticated-user cache and all avatar consumers.

## Workflow summary

```text
User signs in with email/password or Google
                    |
                    +-- Create workspace -- become OWNER
                    |
                    +-- Open invite link -- join as MEMBER
                    |
                    +-- Select workspace
                              |
                       Permission check
                              +-- Workspace settings
                              +-- Members and roles
                              +-- Projects
                              |      +-- Project analytics
                              |      +-- Create/edit/delete
                              +-- Tasks
                                     +-- Search and filters
                                     +-- Assign workspace member
                                     +-- Create/edit/delete
```

## Database collection diagram

TeamNova uses MongoDB collections for users, external authentication accounts, workspaces, memberships, roles, projects, tasks, and persistent sessions.

```text
User
 ├── currentWorkspace ──────────────> Workspace
 ├── Account (email or Google)
 └── Membership ──> Workspace
          └───────> Role ──> permissions[]

Workspace
 ├── Project ──> Task
 ├── Membership[]
 └── owner ──> User

Task
 ├── project ─────> Project
 ├── workspace ───> Workspace
 ├── assignedTo ──> User
 └── createdBy ───> User
```

## Project structure

```text
teamnova/
├── client/                          Next.js and React web application
│   ├── public/                      static images and public assets
│   ├── src/
│   │   ├── app/                     Next.js shell and catch-all SPA entry
│   │   ├── components/              UI, navigation, dialogs, forms, and tables
│   │   ├── context/                 authentication and React Query providers
│   │   ├── hooks/                   application and API hooks
│   │   ├── layout/                  public and authenticated layouts
│   │   ├── lib/                     Axios API client, notifications, and helpers
│   │   ├── page/                    landing, auth, invite, and workspace pages
│   │   ├── routes/                  React Router route definitions and guards
│   │   └── types/                   frontend TypeScript API types
│   ├── next.config.mjs              Vercel-to-Render API rewrite
│   └── vercel.json                  Vercel framework declaration
├── backend/                         Express REST API
│   └── src/
│       ├── config/                  environment, MongoDB, Passport, and HTTP config
│       ├── controllers/             request parsing and response orchestration
│       ├── middlewares/             authentication, async, and error handling
│       ├── models/                  Mongoose schemas and relationships
│       ├── routes/                  auth, user, workspace, member, project, task
│       ├── seeders/                 role and permission initialization
│       ├── services/                business and database operations
│       ├── utils/                   errors, role guards, hashing, UUIDs, and logs
│       └── validation/              Zod request schemas
├── render.yaml                      Render backend Blueprint
├── DEPLOYMENT.md                    detailed Render and Vercel instructions
├── .gitignore                       secrets and generated-file protection
└── README.md
```

The frontend and backend have separate package manifests and lockfiles. Install and run them from their respective directories.

## Tools and their purpose

| Tool | Purpose |
| --- | --- |
| Next.js 16 | Production frontend build, server shell, metadata, and Vercel deployment. |
| React 19 | Interactive workspace, project, task, member, profile, and authentication UI. |
| React Router | Client-side public and protected application routes. |
| TypeScript | Static types across frontend and backend. |
| Tailwind CSS | Responsive styling and shared design tokens. |
| Radix UI | Accessible dialogs, dropdowns, popovers, avatars, and form primitives. |
| TanStack Query | API caching, mutation state, and targeted invalidation. |
| TanStack Table | Task table state, filtering, visibility, and selection. |
| React Hook Form | Validated authentication and project/task forms. |
| Zod | Frontend form and backend request validation. |
| Axios | Credentialed communication with the Express API. |
| Sonner | Non-blocking success and error notifications. |
| Express 5 | REST API, middleware, routing, and health endpoints. |
| Passport | Local and Google authentication plus session serialization. |
| express-session | HTTP-only session-cookie management. |
| connect-mongo | Persistent production session storage in MongoDB. |
| bcrypt | Password hashing and verification. |
| MongoDB Atlas | Persistent application and session data. |
| Mongoose | Schemas, indexes, population, transactions, and constrained queries. |
| Lucide React | Accessible interface icons. |

## Requirements

Install or create the following before running TeamNova:

- Node.js 20.9 or newer
- npm
- MongoDB Atlas database or a transaction-capable MongoDB deployment
- Google Cloud OAuth client for Google sign-in

## Run on localhost

### 1. Install dependencies

Install each application separately from the repository root:

```bash
cd backend
npm install
cd ../client
npm install
```

### 2. Configure the backend

Copy the backend template:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure the private backend values:

```env
PORT=8000
NODE_ENV=development
BASE_PATH=/api
MONGO_URI=mongodb://127.0.0.1:27017/teamnova_db

SESSION_SECRET=replace_with_a_long_random_value
SESSION_EXPIRES_IN=1d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:3000/google/oauth/callback
```

Use the same callback URL in the Google Cloud OAuth client. Keep the client secret and session secret in the backend only.

### 3. Configure the client

Copy the client template:

```bash
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item client/.env.example client/.env
```

Configure the browser-readable API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Only the public API location belongs in a `NEXT_PUBLIC_*` variable. Backend credentials must never be added to the client environment.

### 4. Start the application

Open two terminals from the repository root:

```bash
cd backend
npm run dev
```

```bash
cd client
npm run dev
```

Open `http://localhost:3000`.

### 5. Confirm the backend

The public health endpoint is:

```text
http://localhost:8000/health
```

Authenticated application endpoints are mounted under `http://localhost:8000/api`.

## Local addresses

| Service | Address |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000/api` |
| Health check | `http://localhost:8000/health` |
| Sign in | `http://localhost:3000/sign-in` |
| Sign up | `http://localhost:3000/sign-up` |
| Workspace | `http://localhost:3000/workspace/:workspaceId` |
| Tasks | `http://localhost:3000/workspace/:workspaceId/tasks` |
| Members | `http://localhost:3000/workspace/:workspaceId/members` |
| Profile | `http://localhost:3000/workspace/:workspaceId/profile` |
| Settings | `http://localhost:3000/workspace/:workspaceId/settings` |

## REST API

All routes except registration, login, Google OAuth, the API root, and `/health` require a valid Passport session.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an ordinary owner account or an invited member account. |
| `POST` | `/api/auth/login` | Create an authenticated local session. |
| `POST` | `/api/auth/logout` | Destroy the session and clear its cookie. |
| `GET` | `/api/auth/google` | Start Google OAuth. |
| `GET` | `/api/auth/google/callback` | Complete Google OAuth and redirect to the client. |
| `GET` | `/api/user/current` | Retrieve the authenticated profile and active workspace role. |
| `PUT` | `/api/user/profile` | Update name, address, and profile picture. |
| `POST` | `/api/workspace/create/new` | Create a workspace and owner membership. |
| `GET` | `/api/workspace/all` | List the user’s workspaces. |
| `GET` | `/api/workspace/:id` | Retrieve one accessible workspace and memberships. |
| `PUT` | `/api/workspace/update/:id` | Update workspace details. |
| `DELETE` | `/api/workspace/delete/:id` | Delete a workspace and associated records. |
| `GET` | `/api/workspace/members/:id` | List workspace members. |
| `GET` | `/api/workspace/analytics/:id` | Retrieve workspace analytics. |
| `PUT` | `/api/workspace/change/member/role/:id` | Change a member’s workspace role. |
| `POST` | `/api/member/workspace/:inviteCode/join` | Join a workspace through its invitation. |
| `POST` | `/api/project/workspace/:workspaceId/create` | Create a project. |
| `GET` | `/api/project/workspace/:workspaceId/all` | List paginated workspace projects. |
| `GET` | `/api/project/:id/workspace/:workspaceId` | Retrieve a project. |
| `GET` | `/api/project/:id/workspace/:workspaceId/analytics` | Retrieve project analytics. |
| `PUT` | `/api/project/:id/workspace/:workspaceId/update` | Update a project. |
| `DELETE` | `/api/project/:id/workspace/:workspaceId/delete` | Delete a project and its tasks. |
| `POST` | `/api/task/project/:projectId/workspace/:workspaceId/create` | Create a task. |
| `GET` | `/api/task/workspace/:workspaceId/all` | Search, filter, and paginate tasks. |
| `GET` | `/api/task/:id/project/:projectId/workspace/:workspaceId` | Retrieve a task. |
| `PUT` | `/api/task/:id/project/:projectId/workspace/:workspaceId/update` | Update a task. |
| `DELETE` | `/api/task/:id/workspace/:workspaceId/delete` | Delete a task. |

## Development commands

Backend commands:

```bash
cd backend
npm run dev       # watch and run TypeScript source
npm run build     # compile TypeScript into dist
npm start         # build, then start compiled server
npm run seed      # ensure roles and permissions exist
```

Client commands:

```bash
cd client
npm run dev       # start Next.js development server
npm run lint      # run ESLint
npx tsc --noEmit  # run TypeScript checks
npm run build     # create the production build
npm start         # start the production Next.js server
```

## Security notes

- Environment files at every directory depth are ignored by Git; sanitized `.env.example` files remain versioned.
- MongoDB, Google, and session credentials must never receive a `NEXT_PUBLIC_` prefix.
- Passwords are hashed with bcrypt before storage.
- Sessions use HTTP-only cookies and MongoDB persistence.
- Production cookies use `Secure` and `SameSite=None`; Vercel also proxies API requests to avoid third-party-cookie restrictions.
- CORS accepts only explicitly configured frontend origins.
- Passport—not a browser-provided ID—determines the authenticated user.
- Workspace roles and permissions are resolved on the backend for protected operations.
- Workspace, project, task, and assignee relationships are validated before mutation.
- MongoDB IDs are validated as 24-character hexadecimal ObjectIds before queries.
- Zod validates authentication, workspace, project, task, role, and profile input.
- JSON and URL-encoded bodies are limited to 2 MB.
- Profile pictures are restricted by MIME type and limited to 1 MB in the client and backend validation.
- Error handling returns controlled status codes for validation, authorization, duplicate records, unavailable databases, and oversized requests.
- Production session data is stored in the `sessions` MongoDB collection instead of process memory.
- `.gitignore` excludes credentials, keys, certificates, deployment state, logs, dumps, and generated artifacts.

Rotate a credential immediately if it appears in source code, screenshots, chat messages, terminal output, logs, commits, or public history. Adding a path to `.gitignore` does not remove a secret from earlier commits.

## Production deployment

The frontend and backend deploy independently. The repository includes [`render.yaml`](render.yaml) for Render, [`client/vercel.json`](client/vercel.json) for Vercel, and a detailed [`DEPLOYMENT.md`](DEPLOYMENT.md) checklist.

### Deploy the backend to Render

1. In Render, select **New → Blueprint** and connect the repository.
2. Render reads `render.yaml` and creates `teamnova-api` with `backend` as its root directory.
3. Supply every environment variable marked `sync: false`.
4. Do not set `PORT`; Render provides it automatically.
5. Set `FRONTEND_ORIGIN` to the production Vercel URL. A trailing slash is accepted. For multiple frontends, use a comma-separated list of full URLs.
6. Deploy and confirm `https://YOUR_RENDER_SERVICE.onrender.com/health` returns a connected status.

### Deploy the client to Vercel

1. Import the same repository into Vercel.
2. Set **Root Directory** to `client`.
3. Keep the detected framework as **Next.js**.
4. Set `NEXT_PUBLIC_API_BASE_URL=/api`.
5. Set `BACKEND_URL=https://YOUR_RENDER_SERVICE.onrender.com`.
6. Deploy and note the stable production Vercel URL.
7. Put that exact URL in Render’s `FRONTEND_ORIGIN` and redeploy the backend.

The Vercel rewrite sends browser requests from `/api/*` to Render while preserving a same-origin browser session.

### Configure Google OAuth

Use the stable Vercel domain in production:

```env
GOOGLE_CALLBACK_URL=https://YOUR_VERCEL_DOMAIN/api/auth/google/callback
FRONTEND_GOOGLE_CALLBACK_URL=https://YOUR_VERCEL_DOMAIN/google/oauth/callback
```

In Google Cloud, add:

- Authorized JavaScript origin: `https://YOUR_VERCEL_DOMAIN`
- Authorized redirect URI: `https://YOUR_VERCEL_DOMAIN/api/auth/google/callback`

The redirect URI must match exactly, including scheme and path.

### Verify the deployment

1. Open the Render `/health` endpoint.
2. Register and sign in with email/password.
3. Sign out and confirm the session is invalidated.
4. Sign in with Google.
5. Create a workspace, project, and task.
6. Invite a fresh user and verify that account joins as `MEMBER`.
7. Change a member role and confirm permission-sensitive navigation updates.
8. Upload and remove a profile image.
9. Refresh the browser and confirm the session and data persist.
10. Confirm browser API requests use the Vercel `/api` origin and no secret appears in the bundle, response, or logs.

## Important limitations

- TeamNova currently stores profile-picture data in MongoDB rather than an object-storage service; the 1 MB limit keeps payload and document growth bounded.
- Email changes are read-only in the profile because a verification workflow is not yet implemented.
- Role changes depend on the predefined role and permission seed data.
- MongoDB transactions require a replica set or MongoDB Atlas; standalone local MongoDB installations might not support transactional flows.
- Render free services can spin down after inactivity, so the first request can take longer.
- Vercel preview URLs require matching CORS and Google OAuth configuration; use the stable production domain for reliable authentication.
- Deleting a workspace permanently removes its associated projects, tasks, and memberships.
