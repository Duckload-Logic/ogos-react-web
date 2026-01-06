/**
 * Form Service
 * Business logic for form operations
 */

/**
 * Validate form fields
 */
export function validateFormField(field: string, value: unknown): string | null {
  switch (field) {
    case "email": {
      const email = String(value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Invalid email address";
      }
      break;
    }

    case "mobileNo": {
      const phone = String(value);
      const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
        return "Invalid phone number";
      }
      break;
    }

    case "dateOfBirth": {
      const date = new Date(String(value));
      const today = new Date();
      if (date > today) {
        return "Date of birth cannot be in the future";
      }
      const age = today.getFullYear() - date.getFullYear();
      if (age < 16) {
        return "You must be at least 16 years old";
      }
      break;
    }

    default:
      return null;
  }

  return null;
}

/**
 * Calculate form completion percentage
 */
export function calculateFormCompletion(
  formData: Record<string, unknown>,
  requiredFields: string[]
): number {
  const completed = requiredFields.filter((field) => {
    const value = formData[field];
    return value !== "" && value !== null && value !== undefined;
  }).length;

  return Math.round((completed / requiredFields.length) * 100);
}

/**
 * Format form data for submission
 */
export function formatFormData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    submittedAt: new Date().toISOString(),
  };
}
