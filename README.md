# BMW Maintenance Tracker

A Next.js web app for tracking BMW maintenance items, upcoming service, and estimated costs.

## Project Structure

```text
├── web/            Next.js app, dashboard, and API routes
└── package.json    Root workspace configuration
```

## Stack

- Next.js App Router
- React
- TypeScript
- Plain CSS
- Next.js route handlers for API endpoints
- Prisma
- PostgreSQL for hosted persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm --workspace=web run dev
```

The app will be available at `http://localhost:3000`.

Without `DATABASE_URL`, the app uses `web/data/garage.json` as fallback seed data. With
`DATABASE_URL`, API reads and writes go through PostgreSQL.

## Database Setup

Create a Postgres database with Vercel Postgres, Neon, or Supabase, then set
`DATABASE_URL` in `web/.env`:

```bash
cp web/.env.example web/.env
```

Push the schema and seed your BMW data:

```bash
npm --workspace=web run db:push
npm --workspace=web run db:seed
```

For Vercel, add the same `DATABASE_URL` in Project Settings -> Environment
Variables, then redeploy.

## API Routes

The backend logic now lives inside the Next.js app:

```text
GET  /api/health
GET  /api/v1/status
GET  /api/v1/garage
GET  /api/v1/maintenance-items
POST /api/v1/maintenance-items
PATCH /api/v1/maintenance-items/:id
GET  /api/v1/service-records
```

## Current Data Model

The canonical seed is `web/data/garage.json`, and Prisma maps it to Postgres
tables for vehicles, maintenance items, service records, and research sources.
The dashboard keeps a local browser copy for fast interaction, but API writes
persist to Postgres whenever `DATABASE_URL` is configured.

## Useful Commands

```bash
npm run build
npm --workspace=web run build
npm --workspace=web run db:push
npm --workspace=web run db:seed
```

## Deploy On Vercel

Import the repo in Vercel and use:

```text
Framework Preset: Next.js
Root Directory: web
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

After connecting a Postgres database in Vercel, seed it once from your local
machine with the production `DATABASE_URL`, or run the seed command from a
trusted environment that has access to that URL.

Or deploy from the CLI:

```bash
cd web
vercel --prod
```
