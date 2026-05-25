# BMW Maintenance Tracker

A web app for tracking maintenance items, upcoming service, and estimated costs for a BMW.

## Project Structure

```text
├── backend/        Express API scaffold for future sync/database work
├── web/            Next.js maintenance dashboard
└── package.json    Root workspace configuration
```

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm --workspace=web run dev
```

The dashboard will be available at `http://localhost:3000`.

Run the backend API scaffold:

```bash
npm --workspace=backend run dev
```

The API will be available at `http://localhost:3001`.

## Current Data Model

The deployed web app currently stores maintenance items in browser `localStorage`, so it works without a hosted database. The backend contains seed endpoints for a future sync layer, but it is not required by the current web dashboard.

## Useful Commands

```bash
npm run build
npm --workspace=web run build
npm --workspace=backend run build
```

## Deployment

The web app is deployed on Vercel:

https://web-sand-delta-38.vercel.app

To deploy again:

```bash
cd web
vercel deploy --prod
```
