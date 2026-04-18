/**
 * Section completion calculation utilities
 * Dynamic logic based on required fields in validation schemas
 */

import { IIRForm } from "../../types";
import {
  FieldValidationSchema,
  getValueByPath,
} from "@/services/validationSchema";
import { personalInformationValidationSchema } from "../../config/personalInfoValidationSchema";
import { educationValidationSchema } from "../../config/educationValidationSchema";
import { familyValidationSchema } from "../../config/familyValidationSchema";
import { healthValidationSchema } from "../../config/healthValidationSchema";
import { interestsValidationSchema } from "../../config/interestsValidationSchema";

/**
 * Calculate completion from a schema by identifying "active" required fields
 */
function calculateCompletionFromSchema(
  schema: FieldValidationSchema,
  data: any,
): number {
  let totalCount = 0;
  let filledCount = 0;

  Object.entries(schema).forEach(([fieldPath, rules]) => {
    // A field is "active required" if the required rule is present
    // AND passes when the field is empty (meaning it's technically optional under current conditions)
    // Actually, isActive logic in line 29 was: !requiredRule.validate(null, data);
    // This means "if I pass null, does it fail?". If yes, it's currently required.
    const requiredRule = rules.find((r) => r.type === "required");
    if (!requiredRule) return;

    const isActive = !requiredRule.validate(null, data);

    if (isActive) {
      totalCount++;
      // Check if it's currently valid against ALL rules
      const value = getValueByPath(data, fieldPath);
      const isValid = rules.every((r) => r.validate(value, data));
      if (isValid) {
        filledCount++;
      }
    }
  });

  return totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 100;
}

/**
 * Calculate completion percentage for a specific section
 * @param sectionIndex - Section index (1-based)
 * @param formData - Current form data
 * @returns Completion percentage (0-100)
 */
export function calculateSectionCompletion(
  sectionIndex: number,
  formData: IIRForm | null,
): number {
  if (!formData) return 0;

  switch (sectionIndex) {
    case 1:
      // Personal Information
      return calculateCompletionFromSchema(
        personalInformationValidationSchema,
        formData,
      );

    case 2:
      // Education
      return calculateCompletionFromSchema(educationValidationSchema, formData);

    case 3:
      // Family Background
      return calculateCompletionFromSchema(familyValidationSchema, formData);

    case 4: {
      // Health Information
      // Helper to map consultations by type for easy access in rules
      const _consultations = (formData.health?.consultations || []).reduce(
        (acc: any, c: any) => {
          acc[c.professionalType] = c;
          return acc;
        },
        {},
      );
      return calculateCompletionFromSchema(healthValidationSchema, {
        ...formData,
        _consultations,
      });
    }

    case 5:
      // Interests and Hobbies
      return calculateCompletionFromSchema(interestsValidationSchema, formData);

    default:
      return 0;
  }
}
