# Hooks Directory

Custom React hooks for shared logic across components, organized by concern.

## Form Hooks

- **`useFormState.ts`** - Manages form state with dirty tracking and field touch state
- **`useFormValidation.ts`** - Handles form validation with debouncing and field-level validation
- **`useAsyncOperation.ts`** - Manages async operations with loading, error, and data states

## Feature Hooks

- **`useAppointments.ts`** - Manages appointment operations (list, schedule, cancel)
- **`useAdmissionSlips.ts`** - Manages excuse slip operations (list, submit, update status, delete)
- **`useRegister.ts`** - Registration logic and form handling

## UI Hooks

- **`useMobile.tsx`** - Detects if viewport is mobile-sized (responsive design)
- **`useToast.ts`** - Toast notification management (from shadcn/ui)

## Patterns & Best Practices

### Form Operations

Use composable hooks for form management:

```tsx
const { formState, setFieldValue, resetForm } = useFormState(initialData);
const { errors, validateFields } = useFormValidation(requiredFields);
```

### Async Operations

Use the base hook for async operations:

```tsx
const { data, isLoading, error, execute } = useAsyncOperation();
await execute(() => apiCall());
```

### Feature-Specific Hooks

Feature hooks are built on top of base hooks and services:

```tsx
const { appointments, isLoading, fetchAppointments } = useAppointments();
```

## Convention

Custom hooks follow the `useCamelCase.ts` naming convention.

## Adding New Hooks

1. Follow React hooks rules (ESLint will catch violations)
2. Export the hook as a named export
3. Use TypeScript for type safety
4. Add JSDoc comments with usage examples
5. Prefer composition over complex state logic
6. Keep hooks focused on a single concern
