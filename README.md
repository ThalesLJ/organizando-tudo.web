# Organizando Tudo Web

Organizando Tudo Web is a multilingual Next.js application for personal organization workflows, combining authentication, notes, financial tracking, user preferences, and a Backend for Frontend (BFF) layer that protects communication with the external API.

The project was developed using Specification-Driven Development (SDD). More information about the adopted SDD workflow and Microsoft Spec Kit usage is available in [`AGENTS.md`](./AGENTS.md).

## Features

- Authentication flow with login, account creation, password recovery, session persistence, and logout.
- HttpOnly cookie-based JWT session handling, keeping tokens inaccessible to client-side code.
- Private dashboard with financial summary, budget overview, and expenses by category.
- Financial management for budgets and expenses with create, update, list, and delete operations.
- Rich-text notes powered by TipTap, including creation, editing, listing, search, sorting, visibility control, and public note viewing.
- User preferences for language and interface colors, persisted through internal API routes.
- Multilingual interface with English, Portuguese, and Spanish dictionaries.
- Theme customization through CSS variables and runtime preference loading.
- Internal health check endpoint for deployment validation.
- Automated deployment workflow using GitHub Actions, a self-hosted runner, and PM2.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TipTap](https://tiptap.dev/) rich-text editor
- [Zod](https://zod.dev/) for request validation
- [React Icons](https://react-icons.github.io/react-icons/)
- ESLint with Next.js Core Web Vitals and TypeScript configuration

## Architecture

This application follows a Backend for Frontend architecture. The browser never calls the external API directly. Client components communicate with internal Next.js API routes, and those server-side routes forward requests to the external API when required.

Expected data flow:

```text
Client -> Next.js BFF -> External API -> Next.js BFF -> Client
```

The BFF layer is responsible for:

- Reading and writing authentication cookies.
- Forwarding JWT tokens as Bearer tokens to the external API.
- Keeping sensitive logic on the server side.
- Normalizing selected external API responses.
- Protecting private application routes.

## Main Routes

Public pages:

- `/login`
- `/register`
- `/recover`
- `/view-note/:id`

Private pages:

- `/dashboard`
- `/financial`
- `/notes`
- `/add-note`
- `/add-note/:id`
- `/edit-note`
- `/edit-note/:id`
- `/settings`

## Project Structure

TODO: This section will be completed when the project structure reaches its final level.

## Environment Variables

Create a local `.env` file based on [`.env.example`](./.env.example).

```env
PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3001
EXTERNAL_USER_API_URL=http://localhost:3000
```

Variables:

- `PORT`: port used by the application when running locally or under PM2.
- `NEXT_PUBLIC_APP_URL`: public application URL used by the frontend environment.
- `EXTERNAL_USER_API_URL`: external API base URL or full user endpoint.

The application also supports `NEXT_PUBLIC_SITE_URL` for metadata URL resolution when available.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server on port `3001`.

```bash
npm run build
```

Builds the production application.

```bash
npm run start
```

Starts the production server on port `3001`.

```bash
npm run lint
```

Runs ESLint for the project.

## Deployment

The repository includes a GitHub Actions workflow for deploying one active web version at a time. The workflow is defined in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

Deployment runs automatically on pushes to `master` and can also be started manually through `workflow_dispatch`. The first job, `deploy-web`, runs on the configured self-hosted Linux runner using Bash. It validates the required repository variables, checks that `pm2` is available on the runner host, prepares the deployment directories, synchronizes the repository into the active `current` directory, copies the configured environment file to `.env`, installs dependencies, builds the Next.js application, and restarts the PM2 process.

The deployment directory is always treated as a single active version:

```text
WEB_DEPLOY_BASE_DIR/
├── current/
└── logs/
```

During synchronization, the workflow excludes `.git`, `.github`, `node_modules`, and `.next`. This keeps deployment output focused on the runtime application while allowing the runner to recreate dependencies and build artifacts on the server.

After copying the environment file, the workflow reads `PORT` from `.env`. That port is then used to start the application with PM2:

```bash
PORT="$web_port" pm2 start node_modules/next/dist/bin/next --name "$WEB_PM2_APP_NAME" --time --output "$log_file" --error "$log_file" -- start -p "$web_port"
```

Before starting the new process, the workflow deletes any existing PM2 process with the same application name. It then runs `pm2 save` and verifies that PM2 can describe the process. Logs are written to `WEB_DEPLOY_BASE_DIR/logs/<WEB_PM2_APP_NAME>.log`.

After the self-hosted deployment job completes, a second GitHub-hosted job named `validate-web-public-health` runs on `ubuntu-latest`. This job calls the public health endpoint from outside the VPS and fails the workflow if the response does not include `"status":"ok"`.

Validated public health endpoint:

```text
https://organizandotudo.thaleslj.com/api/health
```

Expected health response shape:

```json
{
  "status": "ok",
  "service": "web",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Required repository variables:

- `WEB_DEPLOY_BASE_DIR`
- `WEB_ENV_FILE`
- `WEB_PM2_APP_NAME`

Recommended PM2 application name:

```text
WEB_PM2_APP_NAME=organizandotudo-web
```

The VPS runner must have Node.js 22, `pm2`, `rsync`, `curl`, and `bash` available. The external environment file referenced by `WEB_ENV_FILE` must exist and include `PORT`. Apache, or the active reverse proxy, should route public traffic to that same port.
