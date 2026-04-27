# Web Deploy Single Version

## Goal

Configure automatic deployment of the Next.js frontend on push to `master`, using GitHub Actions with a self-hosted Linux runner on the VPS and PM2 to manage one active version at a time.

## Flow

1. The runner receives a push to the `master` branch.
2. The workflow syncs the code to `current`.
3. The workflow copies the `.env` file from the shared folder.
4. The workflow installs dependencies and runs the build.
5. The workflow removes the previous PM2 process by application name.
6. The workflow starts the new version with PM2 on the port defined by `PORT` in `.env`.
7. A second GitHub job (`ubuntu-latest`) validates the endpoint `https://organizandotudo.thaleslj.com/api/health` from outside the VPS.

## Files

- Workflow: `organizando-tudo.web/.github/workflows/deploy.yml`
- Health route: `organizando-tudo.web/src/app/api/health/route.ts`

## External Health Check

Endpoint validated by GitHub outside the VPS:

- `https://organizandotudo.thaleslj.com/api/health`

Expected response for a valid deployment:

```json
{
  "status": "ok",
  "service": "web",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Required GitHub Variables (Repository Variables)

- `WEB_DEPLOY_BASE_DIR`
- `WEB_ENV_FILE`
- `WEB_PM2_APP_NAME`

Recommended value for this project:

- `WEB_PM2_APP_NAME=organizandotudo-web`

## VPS Prerequisites

- Self-hosted Linux runner active for the repository.
- Node.js 22 installed.
- `pm2`, `rsync`, `curl`, and `bash` installed for user `github-runner`.
- Web environment file available at the path defined by `WEB_ENV_FILE`, with `PORT` set.
- Apache configured to proxy traffic to the port defined by `PORT` in the web `.env`.
- No `sudo` usage in the workflow.

## VPS Deploy Structure (Single Version)

Base directory defined by `WEB_DEPLOY_BASE_DIR`:

- `current/`
- `logs/`
- No backup of previous versions in this model.
