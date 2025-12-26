# Lib Directory

Utility functions and helper modules for the application.

## Current Utilities

- **`utils.ts`** - General utility functions (e.g., `cn()` for class merging)
- **`utils.spec.ts`** - Unit tests for utilities

## Utils Module

### `cn()` Function

Combines `clsx` and `tailwind-merge` for intelligent class name handling:

```tsx
import { cn } from "@/lib/utils";

// Automatically merges Tailwind classes and handles conflicts
className={cn(
  "px-4 py-2 rounded",
  { "bg-blue-500": isActive },
  props.className  // User-provided overrides
)}
```

## Adding Utilities

When adding new utilities:
1. Keep functions pure and single-purpose
2. Add TypeScript types
3. Write corresponding tests in `.spec.ts`
4. Document with JSDoc comments
5. Export as named exports

Example:
```tsx
/**
 * formatDate - Formats a date to readable string
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US');
};
```
