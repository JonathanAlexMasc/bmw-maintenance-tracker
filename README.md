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

## API Routes

The backend logic now lives inside the Next.js app:

```text
GET  /api/health
GET  /api/v1/status
GET  /api/v1/garage
GET  /api/v1/maintenance-items
POST /api/v1/maintenance-items
```

## Current Data Model

The dashboard stores user edits in browser `localStorage` for now. The API routes provide seed data and a future sync surface, but they do not yet persist to a hosted database.

## Useful Commands

```bash
npm run build
npm --workspace=web run build
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

Or deploy from the CLI:

```bash
cd web
vercel --prod
```
