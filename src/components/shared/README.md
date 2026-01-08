# Components Directory

Reusable React components organized by scope and concern.

## Directory Structure

```
components/
├── shared/              # Shared components used across features
│   ├── FormField.tsx    # Reusable form input with error display
│   ├── FormCard.tsx     # Standard form container
│   ├── LoadingSpinner.tsx  # Loading indicator
│   ├── ErrorBoundary.tsx   # Error handling wrapper
│   └── index.ts         # Central export
├── ui/                  # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── Header.tsx
├── Layout.tsx
├── ProtectedRoute.tsx
└── index.ts
```

## Shared Components

Reusable components available across all features in `/components/shared/`.

### FormField
Text input component with integrated error display and validation styling.

```tsx
import { FormField } from "@/components/shared";

<FormField
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
  helperText="We'll never share your email"
  disabled={isLoading}
/>
```

**Props:**
- `label` (string) - Field label
- `error?` (string) - Error message to display
- `required?` (boolean) - Show required asterisk
- `helperText?` (string) - Helper text below input
- `disabled?` (boolean) - Disable input
- All standard HTML input attributes

### FormCard
Standard container for form sections with optional title, description, and footer.

```tsx
import { FormCard } from "@/components/shared";

<FormCard
  title="Personal Information"
  description="Please provide your details"
  footer={
    <Button type="submit">Submit</Button>
  }
>
  <FormField label="First Name" />
  <FormField label="Last Name" />
</FormCard>
```

**Props:**
- `title` (string) - Card title
- `description?` (string) - Card description
- `children` (ReactNode) - Card content
- `footer?` (ReactNode) - Footer content

### LoadingSpinner
Animated loading indicator with optional text.

```tsx
import { LoadingSpinner } from "@/components/shared";

<LoadingSpinner size="md" text="Loading..." />
```

**Props:**
- `size?` ('sm' | 'md' | 'lg') - Spinner size
- `text?` (string) - Optional loading text

### ErrorBoundary
Error handling wrapper that catches React errors and displays fallback UI.

```tsx
import { ErrorBoundary } from "@/components/shared";

<ErrorBoundary fallback={<CustomErrorUI />}>
  <RiskyComponent />
</ErrorBoundary>
```

**Props:**
- `children` (ReactNode) - Child components
- `fallback?` (ReactNode) - Fallback UI if error occurs

## UI Components

All shadcn/ui components are in `/components/ui/`. Import directly:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
```

## Core Components

### Header
Navigation header component.

```tsx
import { Header } from "@/components";

export default function App() {
  return (
    <>
      <Header />
      {/* Page content */}
    </>
  );
}
```

### Layout
Page layout wrapper with sidebar and main content area.

```tsx
import { Layout } from "@/components";

export default function Page() {
  return (
    <Layout title="Page Title">
      {/* Page content */}
    </Layout>
  );
}
```

### ProtectedRoute
Route wrapper that checks authentication before rendering.

```tsx
import { ProtectedRoute } from "@/components";

export const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
  }
];
```

## Best Practices

### 1. Component Scope
- **Shared**: Used in 2+ features or pages
- **Feature-specific**: Lives in `features/[feature]/components/`
- **Page-specific**: Lives inline in the page component

### 2. Naming Conventions
- Files: PascalCase (ButtonSubmit.tsx)
- Components: PascalCase (export default ButtonSubmit)
- Props interfaces: ComponentNameProps (ButtonSubmitProps)

### 3. Props Design
```typescript
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, ...props }, ref) => (
    // Implementation
  )
);
```

### 4. Reusability
- Accept standard HTML attributes with spread
- Use React.forwardRef for input components
- Keep styling flexible with className props
- Export types for consumers

### 5. Documentation
Add JSDoc for component props:
```tsx
/**
 * FormField - Reusable form input with error display
 * 
 * @example
 * <FormField label="Email" type="email" error={error} />
 */
```

## Creating New Shared Components

1. Create file in `/components/shared/ComponentName.tsx`
2. Implement component with TypeScript
3. Add JSDoc comments
4. Export from `/components/shared/index.ts`
5. Update this README

**Template:**
```tsx
import React from "react";

export interface ComponentNameProps {
  // Props
}

/**
 * ComponentName - Brief description
 * 
 * @example
 * <ComponentName prop="value" />
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  // Props
}) => {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
};
```

## Component Library (shadcn/ui)

All UI components come from shadcn/ui. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

This generates the component in `/components/ui/`.

## Imports

**Export convenience exports:**
```tsx
// src/components/index.ts
export { default as Header } from "./Header";
export { ProtectedRoute } from "./ProtectedRoute";
export * from "./shared";
export * from "./ui/button";
export * from "./ui/card";
```

**Usage:**
```tsx
import { Header, Button, FormField } from "@/components";
```
