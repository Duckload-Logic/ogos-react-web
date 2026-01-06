# Register Feature

## Overview

The register feature provides user registration functionality with two main
implementations:

1. **Register-Admin**: Admin registration with role selection
2. **Register**: Student registration with detailed personal information

## Directory Structure

```
client/
├── pages/
│   ├── Register-Admin.tsx    # Admin registration page
│   └── register/              # Student registration feature
│       ├── index.tsx          # Main Register page component
│       ├── components/
│       │   └── RegisterForm.tsx
│       ├── hooks/
│       │   └── useRegister.ts
│       └── utils/
│           └── validation.ts
```

## Features

### Admin Registration (Register-Admin.tsx)

- Role-based registration (Admin, Faculty, Staff)
- Full name input
- Email/Username field
- Password validation (minimum 6 characters)
- Password confirmation matching
- Success/Error alerts
- Automatic redirect to login on success

### Student Registration (register/)

- Personal information section
  - First name and last name
  - Birth date and place of birth

- Contact information section
  - Email address validation
  - Mobile number input

- Password section
  - Password strength validation (minimum 6 characters)
  - Password confirmation matching

- Comprehensive form validation
- Error messages for each field
- Loading state during submission
- Link to login page

## Usage

### Admin Registration

Navigate to `/register` to access the admin registration form.

```tsx
import Register from "./pages/Register-Admin";

// In routes
<Route path="/register" element={<Register />} />
```

### Student Registration (Feature-based)

Navigate to `/student-register` to access the student
registration form.

```tsx
import Register from "./pages/register";

// In routes
<Route path="/student-register" element={<Register />} />
```

## API Integration

The student registration form includes a hook for API
integration:

```tsx
import { useRegister } from "./pages/register/hooks/useRegister";

const { register, isLoading, error } = useRegister();

await register({
  firstName: "John",
  lastName: "Doe",
  birthDate: "1990-01-01",
  placeOfBirth: "Manila",
  email: "john@example.com",
  mobileNumber: "+63912345678",
  password: "secure_password",
});
```

## Validation Utilities

Available validation functions in `utils/validation.ts`:

- `isValidEmail(email: string): boolean`
- `isValidPhoneNumber(phone: string): boolean`
- `isValidPassword(password: string): boolean`
- `passwordsMatch(password: string, confirm: string): boolean`
- `isValidBirthDate(dateString: string): boolean`
- `isLegalAge(birthDate: string): boolean`

## Styling

All styles follow the kebab-case naming convention and are
defined in `client/global.css`:

- `.register-form__*` for student registration
- `.register-admin__*` for admin registration
- `.register-page__*` for page layout

## Code Guidelines

This feature follows the project's coding guidelines:

- **2-space indentation** for all files
- **80-character line limit** for code readability
- **snake_case** for HTML element IDs
- **kebab-case** for CSS class names
- **Feature-based organization** with dedicated
  components, hooks, and utilities
