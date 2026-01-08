## Appointments Feature

The appointments feature is responsible for managing student appointment scheduling, slot availability, and appointment status tracking.

### Directory Structure

```
appointments/
├── components/              # Reusable UI components for appointments
│   ├── AppointmentHeader.tsx        # Header with title and subtitle
│   ├── AppointmentMessages.tsx      # Error and success message display
│   ├── DatePickerCalendar.tsx       # Calendar date selection
│   ├── TimeSlotSelector.tsx         # Available time slots selection
│   ├── AppointmentDetailsForm.tsx   # Form for appointment details
│   └── index.ts                     # Component exports
├── pages/                   # Page-level components (route entry points)
│   └── ScheduleAppointment.tsx      # Main scheduling page
├── hooks/                   # Feature-specific React hooks
│   └── useAppointments.ts           # Appointments state and operations
├── services/                # API and business logic layer
│   ├── service.ts                   # AppointmentService with API calls
│   └── appointmentService.ts        # Alternative API utilities
├── types/                   # TypeScript interfaces and types
│   └── index.ts                     # All feature types
├── constants/               # Feature-specific static values
│   └── index.ts                     # Status codes, messages, constraints
├── utils/                   # Helper functions (feature-scoped)
│   └── index.ts                     # Date formatting, validation, error handling
├── tests/                   # Feature tests
│   └── appointmentTest.ts           # Test utilities and mocks
├── api/                     # API-related helpers (currently empty)
├── index.js                 # (deprecated) Empty file from setup
├── index.ts                 # Feature public API exports
└── README.md                # This file
```

### Key Files Overview

#### Types (`types/index.ts`)
Central location for all TypeScript interfaces:
- `Appointment` - Core appointment data model
- `TimeSlot` - Available appointment time slot
- `AppointmentStatus` - Appointment status enum
- `CreateAppointmentRequest` - Request payload for creating appointments
- `UseAppointmentsReturn` - Hook return type interface

#### Constants (`constants/index.ts`)
Static values used throughout the feature:
- `APPOINTMENT_STATUS` - Status codes and values
- `APPOINTMENT_API_ENDPOINTS` - API endpoint definitions
- `APPOINTMENT_ERROR_MESSAGES` - Standardized error messages
- `APPOINTMENT_SUCCESS_MESSAGES` - Success notification messages
- `APPOINTMENT_FORM_CONSTRAINTS` - Form validation constraints

#### Utils (`utils/index.ts`)
Helper functions scoped to this feature:
- `mapDateToString()` - Convert Date to YYYY-MM-DD format
- `formatAvailableSlots()` - Normalize API slot response data
- `extractErrorMessage()` - Consistent error message extraction
- `validateAppointmentForm()` - Client-side form validation

#### Hook (`hooks/useAppointments.ts`)
Main custom hook for appointment operations:
- State management for appointments and available slots
- Async operations: fetch, create, update, cancel
- Error handling with extracted utility functions
- Returns: `UseAppointmentsReturn` interface

#### Services (`services/service.ts`)
API communication layer:
- `AppointmentService` class with methods:
  - `getAvailableSlots(date?)` - Fetch available time slots
  - `getAllAppointments()` - Get user's appointments
  - `getStudentAppointments(userId)` - Get specific student's appointments
  - `getAppointmentById(id)` - Get single appointment
  - `createAppointment(request)` - Create new appointment
  - `updateAppointmentStatus(id, status)` - Update appointment status
  - `cancelAppointment(id)` - Cancel an appointment

#### Page Component (`pages/ScheduleAppointment.tsx`)
Main entry point for appointment scheduling:
- Routes: `/student/schedule`
- Uses `useAppointments` hook for state and operations
- Uses utility functions: `mapDateToString()`, `validateAppointmentForm()`
- Uses constants: error and success messages
- Orchestrates child components (Header, Calendar, TimeSlots, Form)

### Usage Examples

#### Importing from the feature

```typescript
// Import types
import type { Appointment, TimeSlot } from '@/features/appointments';

// Import hook
import { useAppointments } from '@/features/appointments';

// Import utilities
import { mapDateToString, validateAppointmentForm } from '@/features/appointments';

// Import constants
import { APPOINTMENT_STATUS, APPOINTMENT_ERROR_MESSAGES } from '@/features/appointments';

// Import components
import ScheduleAppointment from '@/features/appointments';
```

#### Using the hook

```typescript
export default function MyComponent() {
  const {
    appointments,
    availableSlots,
    loading,
    error,
    fetchAvailableSlots,
    createAppointment,
  } = useAppointments();

  const handleSchedule = async () => {
    const appointment = await createAppointment({
      reason: 'Consultation',
      scheduledDate: '2026-01-15',
      scheduledTime: '10:00',
      concernCategory: 'Academic',
    });
  };

  return (
    // Component JSX
  );
}
```

### API Endpoints Used

- `GET /appointments/slots?date={date}` - Get available time slots
- `GET /appointments` - Get current user's appointments
- `POST /appointments` - Create new appointment
- `PUT /appointments/{id}/status` - Update appointment status
- `GET /appointments/{id}` - Get specific appointment

### Best Practices

1. **Import from feature index**: Use `@/features/appointments` for cleaner imports
2. **Use types from `types/`**: All TypeScript interfaces are centralized
3. **Use utility functions**: Leverage helper functions for common operations
4. **Use constants**: Reference static values from `constants/` instead of hardcoding
5. **Error handling**: Use `extractErrorMessage()` utility for consistent error extraction

### Testing

Test utilities and mocks are available in `tests/appointmentTest.ts`. This file contains:
- Mock appointment data
- Test database simulation
- Service function mocks for testing

### Future Enhancements

- [ ] Add appointment filtering and sorting
- [ ] Implement appointment reminders
- [ ] Add reschedule functionality
- [ ] Create appointment history view
- [ ] Add export to calendar functionality
