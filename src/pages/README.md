# Pages Directory

Route components that map to URLs in the application.

## File Naming Convention

- `Index.tsx` - Home page (route: `/`)
- Named files map to route paths (e.g., `StudentForm.tsx` → `/student-form`)

## Current Pages

- **`Index.tsx`** - Home/landing page
- **`StudentForm.tsx`** - Student enrollment form
- **`AdmissionSlip.tsx`** - Excuse slip request form
- **`GuidanceServices.tsx`** - Guidance services information/request
- **`ScheduleAppointment.tsx`** - Appointment scheduling
- **`ViewSchedules.tsx`** - View scheduled appointments
- **`PlaceholderPage.tsx`** - Placeholder for future pages
- **`NotFound.tsx`** - 404 error page

## Architecture

Pages are thin containers that:

1. Handle route-level state
2. Orchestrate feature components
3. Manage page-specific logic

Heavy lifting is delegated to feature components in `client/features/`.
