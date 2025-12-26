# Components Directory

Reusable UI components for the application.

## Structure

- **`Header.tsx`** - Main navigation and header component
- **`ui/`** - Pre-built component library (Radix UI + TailwindCSS)

## UI Component Library

The `ui/` subdirectory contains a comprehensive library of accessible, reusable components:

- Form elements (Input, Textarea, Select, Checkbox, Radio, etc.)
- Layout components (Card, Sheet, Dialog, Drawer, etc.)
- Navigation (Tabs, Breadcrumb, Pagination, Sidebar, etc.)
- Display (Badge, Avatar, Skeleton, Progress, etc.)
- Specialized (Calendar, Carousel, OTP Input, Toast, etc.)

These components are:
- Built with Radix UI for accessibility
- Styled with TailwindCSS
- Fully typed with TypeScript
- Re-exported from feature-specific index files when needed

## Usage

Import directly from `ui/`:
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

Or use the `cn()` utility for conditional styling:
```tsx
import { cn } from "@/lib/utils";

className={cn(
  "base-classes",
  { "conditional-class": condition }
)}
```
