# Routes Directory

API route handlers for the Express server.

## Purpose

Routes contain request handlers organized by feature or domain.

## File Naming Convention

- `feature.ts` - Handlers related to a specific feature
- `action.ts` - Handlers for specific actions or operations

Export handlers as named exports:
```typescript
export const handleFeatureName: RequestHandler = (req, res) => {
  // Route logic
};
```

## Current Routes

- **`demo.ts`** - Example/demo endpoint handler

## Adding New Routes

1. Create file: `routes/featureName.ts`
2. Define handler with proper typing:
```typescript
import { RequestHandler } from "express";
import type { FeatureResponse } from "@shared/api";

export const handleFeatureName: RequestHandler = (req, res) => {
  const response: FeatureResponse = {
    // response data
  };
  res.json(response);
};
```

3. Register in `server/index.ts`:
```typescript
import { handleFeatureName } from "./routes/featureName";
app.get("/api/feature-name", handleFeatureName);
// or
app.post("/api/feature-name", handleFeatureName);
```

## Type Safety

Use shared types from `@shared/api.ts` for request/response contracts:
```typescript
import type { StudentFormResponse } from "@shared/api";
```

## Error Handling

Return appropriate HTTP status codes:
```typescript
if (!data) {
  return res.status(404).json({ error: "Not found" });
}
res.status(200).json(response);
```
