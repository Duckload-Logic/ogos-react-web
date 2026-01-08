# Lib Directory

Core utilities, helpers, and libraries for the application. This directory contains reusable, pure functions that don't depend on React.

## Core Modules

### API & HTTP Client (`apiClient.ts`)
Centralized HTTP client with authentication and error handling.

**Features:**
- Automatic auth token injection from localStorage
- Centralized error handling
- Consistent request/response formatting
- Singleton instance for app-wide use

**Methods:**
```typescript
apiClient.get<T>(url, options?)
apiClient.post<T>(url, data?, options?)
apiClient.put<T>(url, data?, options?)
apiClient.patch<T>(url, data?, options?)
apiClient.delete<T>(url, options?)
```

**Usage:**
```typescript
import { apiClient } from "@/lib/apiClient";

// GET
const user = await apiClient.get("/users/me");

// POST
const result = await apiClient.post("/auth/login", { email, password });

// Error handling
try {
  await apiClient.post("/users", userData);
} catch (error: any) {
  console.log(error.statusCode);  // 400, 401, 500, etc.
  console.log(error.error);       // Error message
}
```

### Validation Utilities (`validation.ts`)
Centralized field and form validation with DRY principle.

**Single-field validators:**
```typescript
isValidEmail(email)              // RFC-compliant email
isValidPhone(phone)              // Philippine phone format
isValidPassword(password, min)   // Configurable length
isValidUsername(username, min, max)  // Length constraints
isValidDateOfBirth(date)         // Age verification (16+)
```

**Field validation:**
```typescript
validateField(fieldName, value)  // Auto-detect field type
```

**Batch validation:**
```typescript
const { isValid, errors } = validateFields(data, requiredFields);
// Returns array of ValidationError objects
```

**Utilities:**
```typescript
calculateFormCompletion(formData, totalFields)  // Percentage (0-100)
formatErrorMessage(error)  // Convert error object to string
```

**Usage Examples:**
```typescript
import { 
  isValidEmail, 
  validateFields, 
  calculateFormCompletion 
} from "@/lib/validation";

// Single field
if (!isValidEmail(email)) {
  setError("Invalid email address");
}

// Batch validation
const validation = validateFields(formData, ["email", "password", "name"]);
if (!validation.isValid) {
  validation.errors.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}

// Progress tracking
const progress = calculateFormCompletion(formData, 10);
console.log(`${progress}% complete`);
```

### Utilities (`utils.ts`)

#### `cn()` Function
Combines `clsx` and `tailwind-merge` for intelligent Tailwind CSS class handling.

```typescript
import { cn } from "@/lib/utils";

// Merges classes intelligently, resolving conflicts
className={cn(
  "px-4 py-2 rounded",
  { "bg-blue-500": isActive },
  props.className  // User overrides take precedence
)}
```

### Tests (`utils.spec.ts`)
Unit tests for utility functions. Run with: `npm run test`

## Best Practices

### Creating New Utilities

1. **Keep functions pure** - No side effects, same input always produces same output
2. **Single responsibility** - Each function does one thing well
3. **Type safety** - Always add TypeScript types
4. **Documentation** - Add JSDoc comments for public functions
5. **Tests** - Write corresponding `.spec.ts` tests
6. **Named exports** - Use named exports, not default exports

### Example Utility
```typescript
/**
 * formatDate - Formats a date to US locale string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  return date.toLocaleDateString('en-US', options);
};

/**
 * Test
 */
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date(2025, 0, 1);
    expect(formatDate(date)).toBe('1/1/2025');
  });
});
```

## Adding New Utilities

When adding new utilities:

1. Create file: `src/lib/newUtility.ts`
2. Implement functions with JSDoc
3. Create tests: `src/lib/newUtility.spec.ts`
4. (Optional) Export from `src/lib/index.ts` for convenience
5. Update this README.md

## Dependency Guidelines

- ✅ OK: No dependencies, or stable third-party libs (lodash, date-fns, etc.)
- ✅ OK: Standard library functions
- ❌ NO: React or component-related imports
- ❌ NO: Circular dependencies

If you need React hooks, use `/src/hooks/` instead.
