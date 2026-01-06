# Hooks Directory

Custom React hooks for shared logic across components.

## Current Hooks

- **`use-mobile.tsx`** - Detects if viewport is mobile-sized (responsive design)
- **`use-toast.ts`** - Toast notification management (from shadcn/ui)

## Convention

Custom hooks follow the `use-kebab-case.ts` naming convention.

## Adding New Hooks

When creating a new custom hook:
1. Follow React hooks rules
2. Export the hook as a named export
3. Use TypeScript for type safety
4. Add JSDoc comments for usage
5. Consider memoization for expensive operations

Example:
```tsx
/**
 * useCustomHook - Description of what it does
 * @param dependencies - What parameters it takes
 * @returns - What it returns
 */
export const useCustomHook = (dependencies) => {
  // Hook logic
};
```
