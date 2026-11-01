<div align="center">

# Connect

### A place for people, conversations, and communities.

A social network project built with **Next.js**, **React**, **Go**, and **SQLite**.

![Status: In development](https://img.shields.io/badge/status-in_development-f59e0b)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Go 1.25.4](https://img.shields.io/badge/Go-1.25.4-00ADD8?logo=go&logoColor=white)
![SQLite](https://img.shields.io/badge/database-SQLite-003B57?logo=sqlite&logoColor=white)

[Overview](#overview) · [Getting started](#getting-started) · [Project structure](#project-structure) · [API](#api) · [Roadmap](#roadmap)

</div>

---

## Overview

Connect brings together a social feed, user profiles, groups, events, and conversations in a responsive interface with light and dark themes. The frontend uses the Next.js App Router, Tailwind CSS, and Lucide icons. The backend uses Go's HTTP server and a SQLite database.

**Current stage:** the frontend is primarily a demo using sample data and component state. The backend exposes user listing, creation, and lookup endpoints. Authentication, persistent social interactions, and real-time messaging still need integration.

## Explore the interface

| Page | Route | Current implementation |
| --- | --- | --- |
| Home | `/` | Sample feed and post composer interface |
| Login | `/login` | Login form; authentication is not connected |
| Register | `/register` | Registration form with avatar preview; submission is a demo |
| My profile | `/profile` | Sample profile, posts, follower tabs, and a local privacy toggle |
| User profile | `/u/[username]` | Sample public profile view |
| Groups | `/groups` | Demo group creation, group posts, events, and RSVP interactions |
| Messages | `/messages` | Sample conversations and a message composer |
| Notifications | `/notifications` | Notification interface with all/unread filtering |
| Friends | `/friends` | Placeholder page |

Theme preference is saved in `localStorage`. Most other interface changes are temporary and reset on reload. Some demo images load from external services.

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | Next.js 16.0.1, React 19.2.0, JavaScript / JSX |
| Styling | Tailwind CSS, PostCSS, Lucide React |
| Backend | Go 1.25.4, `net/http`, `database/sql` |
| Database | SQLite via `github.com/mattn/go-sqlite3` |
| Migrations | Versioned SQL files and a `golang-migrate` helper |
| Code checks | ESLint, Go tooling |

## Getting started

Run all commands from the repository root unless a step says otherwise. The frontend and backend run in separate terminals.

### Prerequisites

- Node.js and npm compatible with the frontend's Next.js 16 dependency.
- Go **1.25.4 or newer**.
- A C compiler with **CGO enabled**, required by `go-sqlite3`.
- The `sqlite3` command-line tool for the database setup below.

### 1. Start the frontend

```bash
cd frontend/my-next-app
npm ci
npm run dev
```

Open **[localhost:3000](http://localhost:3000)** to explore the demo. The frontend can be explored independently of the backend.

> Install frontend dependencies inside `frontend/my-next-app`. The repository-root `package.json` does not contain the application scripts.

### 2. Prepare the database and start the backend

In another terminal, start from the repository root:

```bash
cd backend
go mod download

# Use a separate local database from the database included in the repository.
export DATABASE_PATH=./socialnet.local.db

# Apply the schema files in version order. Stop if any file fails.
for migration in pkg/db/migrations/sqlite/*.up.sql; do
  sqlite3 -bail "$DATABASE_PATH" < "$migration" || break
done

go run .
```

The API listens on **[localhost:8080](http://localhost:8080)**. Confirm the schema commands completed successfully before starting the server.

The server opens the database but **does not run migrations automatically**. The commands above initialize a local database directly from the SQL files; they do not record migration versions in `golang-migrate`. The repository also provides `sqlite.Open` and `sqlite.Migrate` helpers, but `server.go` does not currently call them.

### 3. Check the API

```bash
curl http://localhost:8080/users
```

An empty database currently returns `null` for the user list. Once users exist, the endpoint returns a JSON array.

### Configuration

| Setting | Default | Purpose |
| --- | --- | --- |
| `DATABASE_PATH` | `./socialnet.db` | SQLite file path, relative to the backend process's working directory |
| Backend address | `:8080` | Currently hardcoded in `backend/server.go` |
| Frontend development address | `localhost:3000` | Default address for `npm run dev` |

No `.env` file is required for the current demo. Keep `DATABASE_PATH` set in the terminal used to run the backend when using the separate local database above.

## Project structure

```text
social-network/
├── README.md
├── backend/
│   ├── server.go                 # HTTP server and user handlers
│   ├── go.mod                    # Go dependencies
│   ├── socialnet.db              # Database included in the repository
│   └── pkg/
│       ├── db/
│       │   ├── sqlite/sqlite.go   # Database and migration helpers
│       │   └── migrations/sqlite/ # Versioned up/down SQL migrations
│       └── repos/
│           ├── user_repo.go      # User persistence
│           └── post_repo.go      # Post persistence
└── frontend/
    └── my-next-app/
        ├── app/                  # Pages and shared root layout
        ├── api/users.jsx         # Draft backend proxy handler
        ├── components/           # Shared authentication shell
        ├── styles/               # Global styles
        └── package.json          # Frontend scripts and dependencies
```

## API

Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | List users, ordered by first and last name |
| `POST` | `/users` | Create a user from a JSON request body |
| `GET` | `/users/{id}` | Look up a user by numeric ID |

The current API serializes Go structs directly, so response keys use names such as `ID`, `Email`, and `FirstName`. Nullable profile fields use Go's `sql.NullString` representation.

The user creation endpoint accepts a `PasswordHash` field directly. Password hashing, authentication, authorization, and safe response DTOs are still pending; user responses currently include `PasswordHash`. Treat these endpoints as development scaffolding.

`frontend/my-next-app/api/users.jsx` contains a draft proxy to the Go API. Its current location is **not a registered Next.js API route**. Frontend pages are not yet connected to the backend.

## Database design

The five migration pairs define the following areas:

| Migration | Tables and purpose |
| --- | --- |
| `000001` | Users and sessions |
| `000002` | Follow requests, follows, posts, custom post audiences, and comments |
| `000003` | Groups, memberships, invitations, join requests, group posts, events, and RSVPs |
| `000004` | Direct messages, group messages, and notifications |
| `000005` | Media metadata and query indexes |

The schema includes public/private profiles and post audiences (`public`, `followers`, `custom`). These definitions provide the foundation for future behavior; the current API does not enforce the full social and privacy model.

## Development commands

Run frontend commands from `frontend/my-next-app`:

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Serve the production build after building
npm run lint    # Run ESLint
```

Run backend commands from `backend`:

```bash
go run .        # Start the API
go build ./...  # Compile backend packages
go test ./...   # Run Go tests when test files are added
```

There are currently no application test files in the repository.

## Roadmap

- [ ] Connect the frontend to registered API routes.
- [ ] Implement registration, password hashing, login, and sessions.
- [ ] Validate requests and exclude sensitive fields from API responses.
- [ ] Persist feed posts, comments, and profile updates.
- [ ] Implement follows, follow requests, and privacy enforcement.
- [ ] Connect groups, invitations, events, and RSVPs to the database.
- [ ] Add real-time direct and group messaging.
- [ ] Persist notifications and read status.
- [ ] Implement media uploads and the friends page.
- [ ] Wire database initialization and migrations into backend startup.
- [ ] Add automated tests and deployment configuration.

## Contributing

Keep changes focused, follow the conventions in the area you edit, and run the relevant development checks before opening a pull request. Include a description of the behavior changed and screenshots for interface updates.
