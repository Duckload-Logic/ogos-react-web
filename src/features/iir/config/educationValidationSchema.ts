import { FieldValidationSchema, commonRules, ValidationRule } from "@/services/validationSchema";
const currentYear = new Date().getFullYear();
export const validYearRule = (): ValidationRule => ({
  type: "validYear",
  validate: (value: any) => {
    if (!value) return true;
    const year = Number(value);
    return !isNaN(year) && Number.isInteger(year) && year >= 1900 && year <= currentYear;
  },
  message: `Must be a valid year (1900–${currentYear})`,
});
export const yearCompletedRule = (startedKey: string): ValidationRule => ({
  type: "yearCompleted",
  validate: (value: any, rootData: any) => {
    if (!value) return true;
    const completedYear = Number(value);
    if (isNaN(completedYear)) return true; // validYearRule handles this
    // Retrieve yearStarted from rootData based on the exact path
    // We assume startedKey is the full path e.g. "education.schools.0.yearStarted"
    const startedValue = startedKey.split('.').reduce((obj, p) => obj?.[p], rootData);
    if (!startedValue) return true;

    const startedYear = Number(startedValue);
    if (isNaN(startedYear)) return true;
    return completedYear >= startedYear;
  },
  message: "Year completed cannot be before year started",
});
export const educationValidationSchema: FieldValidationSchema = {
  "education.natureOfSchooling": [commonRules.required("Nature of schooling")],
  "education.interruptedDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.education?.natureOfSchooling === "Interrupted") {
          return value && String(value).trim().length >= 2;
        }
        return true;
      },
      message: "Reason for interruption is required and must be at least 2 characters",
    }
  ],
};
// Add schools dynamically
for (let i = 0; i < 5; i++) {
  educationValidationSchema[`education.schools.${i}.schoolName`] = [
    // commonRules.required("School name"),
    commonRules.minLength(2),
  ];
  educationValidationSchema[`education.schools.${i}.schoolAddress`] = [
    // commonRules.required("School address"),
    commonRules.minLength(2),
  ];
  educationValidationSchema[`education.schools.${i}.schoolType`] = [
    // commonRules.required("School type"),
  ];
  educationValidationSchema[`education.schools.${i}.yearStarted`] = [
    // commonRules.required("Year started"),
    validYearRule(),
  ];
  educationValidationSchema[`education.schools.${i}.yearCompleted`] = [
    // commonRules.required("Year completed"),
    validYearRule(),
    yearCompletedRule(`education.schools.${i}.yearStarted`),
  ];
}