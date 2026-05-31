import {
  FieldValidationSchema,
  commonRules,
  ValidationRule,
} from "@/services/validationSchema";
const currentYear = new Date().getFullYear();

export const validYearRule = (): ValidationRule => ({
  type: "validYear",
  validate: (value: any) => {
    if (!value) return true;
    const year = Number(value);
    return (
      !isNaN(year) &&
      Number.isInteger(year) &&
      year >= 1900 &&
      year <= currentYear
    );
  },
  message: `Must be a valid year (2002-${currentYear})`,
});

export const yearCompletedRule = (startedKey: string): ValidationRule => ({
  type: "yearCompleted",
  validate: (value: any, rootData: any) => {
    if (!value) return true;
    const completedYear = Number(value);
    if (isNaN(completedYear)) return true; // validYearRule handles this
    // Retrieve yearStarted from rootData based on the exact path
    // We assume startedKey is the full path e.g. "education.schools.0.yearStarted"
    const startedValue = startedKey
      .split(".")
      .reduce((obj, p) => obj?.[p], rootData);
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
      message:
        "Reason for interruption is required (at least 2 characters)",
    },
    commonRules.noSpecialChars("Reason for interruption"),
  ],
};

// Add schools dynamically
for (let i = 0; i < 5; i++) {
  educationValidationSchema[`education.schools.${i}.schoolName`] = [
    commonRules.minLength(2),
    commonRules.noSpecialChars("School name"),
  ];
  educationValidationSchema[`education.schools.${i}.schoolAddress`] = [
    commonRules.minLength(2),
    commonRules.noSpecialChars("School address"),
  ];
  educationValidationSchema[`education.schools.${i}.awards`] = [
    commonRules.noSpecialChars("Awards"),
  ];
  educationValidationSchema[`education.schools.${i}.schoolType`] = [];
  educationValidationSchema[`education.schools.${i}.yearStarted`] = [
    validYearRule(),
  ];
  educationValidationSchema[`education.schools.${i}.yearCompleted`] = [
    validYearRule(),
    yearCompletedRule(`education.schools.${i}.yearStarted`),
  ];
}
