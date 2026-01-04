# Server Directory

Express.js backend for the PUPT Student Guidance System.

## Structure

- **`index.ts`** - Main Express server setup and middleware configuration
- **`node-build.ts`** - Node.js binary build configuration
- **`routes/`** - API route handlers organized by feature

## Key Features

- **CORS** enabled for frontend integration
- **JSON & URL-encoded** body parsing
- **API Prefix**: All routes use `/api/` prefix
- **Environment Variables**: Configured via `.env` file
- **Dev Integration**: Runs on same port as frontend in development

## Development

Start server with:
```bash
pnpm dev
```

Server runs at `http://localhost:8080` (same as frontend dev server).

## Adding Routes

1. Create handler in `routes/feature.ts`:
```typescript
import { RequestHandler } from "express";

export const handleFeature: RequestHandler = (req, res) => {
  res.json({ data: "response" });
};
```

2. Import and register in `server/index.ts`:
```typescript
import { handleFeature } from "./routes/feature";
app.get("/api/feature", handleFeature);
```

## Guidelines

- Keep handlers focused and single-purpose
- Use TypeScript for type safety
- Validate all inputs
- Return consistent error responses
- Minimize server logic - prefer client-side when possible per project guidelines

## Current Routes

- `GET /api/ping` - Health check endpoint
- `GET /api/demo` - Demo endpoint (example)
