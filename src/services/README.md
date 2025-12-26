# Services Directory

API service modules and data fetching logic.

## Purpose

Services handle:
- API communication
- Data transformation
- Centralized business logic
- Reusable async operations

## Current Services

- **`addressService.ts`** - Address-related utilities (provinces, municipalities, barangays)

## Service Patterns

### Data Fetching Services

```tsx
export const fetchUserData = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};
```

### Transformation Services

```tsx
export const transformAddressData = (rawData: RawAddress) => {
  return {
    province: rawData.prov,
    municipality: rawData.mun,
    barangay: rawData.brgy,
  };
};
```

### Usage in Components

```tsx
import { addressService } from "@/services/addressService";

// In component or hook
const data = await addressService.getProvinces();
```

## Adding New Services

1. Create file following naming: `featureService.ts` or `actionService.ts`
2. Export functions as named exports
3. Use TypeScript for type safety
4. Keep pure - avoid React dependencies
5. Centralize API endpoints for maintainability

Example:
```tsx
// studentService.ts
export const submitStudentForm = async (data: StudentFormData) => {
  const response = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};
```
