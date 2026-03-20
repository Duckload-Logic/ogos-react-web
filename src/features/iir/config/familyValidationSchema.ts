import { FieldValidationSchema, commonRules, ValidationRule } from "@/services/validationSchema";
export const requireAtLeastOne = (message: string): ValidationRule => ({
  type: "requireAtLeastOne",
  validate: (value: any) => {
    if (!value || typeof value !== "object") return false;
    return Object.values(value).some(Boolean);
  },
  message,
});
export const familyValidationSchema: FieldValidationSchema = {
  "family.background.parentalStatus": [
    {
      type: "required",
      validate: (value: any) => {
        return value?.id !== undefined && value?.id !== null && value?.id !== "";
      },
      message: "Parental status is required",
    }
  ],

  "family.finance.monthlyFamilyIncomeRange": [
    {
      type: "required",
      validate: (value: any) => {
        return value?.id !== undefined && value?.id !== null && value?.id !== "";
      },
      message: "Monthly family income range is required",
    }
  ],
  "family.finance.monthlyFamilyIncomeRange.otherSpecification": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.family?.finance?.monthlyFamilyIncomeRange?.id === "others") {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the income range",
    }
  ],
  "family.finance.weeklyAllowance": [
    commonRules.required("Weekly allowance"),
    {
      type: "positiveNumber",
      validate: (value: any) => {
        if (value === undefined || value === null || value === "") return true;
        const num = Number(value);
        return !isNaN(num) && num > 0;
      },
      message: "Weekly allowance must be a positive number",
    }
  ],
  "family.background.brothers": [commonRules.required("Number of brothers")],
  "family.background.sisters": [commonRules.required("Number of sisters")],
  "family.background.employedSiblings": [commonRules.required("Number of gainfully employed")],
  "family.background.ordinalPosition": [commonRules.required("Ordinal position")],
  "family.background.haveQuietPlaceToStudy": [commonRules.required("Quiet place to study")],
  "family.background.isSharingRoom": [commonRules.required("Shares room")],
  "family.background.natureOfResidence": [
    {
      type: "required",
      validate: (value: any) => {
        return value?.id !== undefined && value?.id !== null && value?.id !== "";
      },
      message: "Nature of residence is required",
    }
  ],
  "family.finance.financialSupportTypes": [
    {
      type: "required",
      validate: (value: any) => {
        return Array.isArray(value) && value.length > 0;
      },
      message: "Please select at least one financing source",
    }
  ],
  "family.background.siblingSupportTypes": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (Number(rootData?.family?.background?.employedSiblings) > 0) {
          return Array.isArray(value) && value.length > 0;
        }
        return true;
      },
      message: "Please indicate how employed siblings are providing support",
    }
  ],
};

// Add related persons (Father, Mother, Guardian)
const RELATIONS = [
  { prefix: "family.relatedPersons.0", label: "Father" },
  { prefix: "family.relatedPersons.1", label: "Mother" },
  { prefix: "family.relatedPersons.2", label: "Guardian" },
];

RELATIONS.forEach(({ prefix, label }) => {
  // Guardian is often optional unless father/mother are deceased or not living with student
  // But for this IIR, let's at least require Father and Mother names
  const isRequired = label !== "Guardian";

  if (isRequired) {
    familyValidationSchema[`${prefix}.firstName`] = [commonRules.required(`${label} first name`), commonRules.nameFormat()];
    familyValidationSchema[`${prefix}.lastName`] = [commonRules.required(`${label} last name`), commonRules.nameFormat()];
    familyValidationSchema[`${prefix}.dateOfBirth`] = [commonRules.required(`${label} date of birth`)];
    familyValidationSchema[`${prefix}.educationalLevel`] = [commonRules.required(`${label} educational attainment`)];
    familyValidationSchema[`${prefix}.occupation`] = [commonRules.required(`${label} occupation`)];
    familyValidationSchema[`${prefix}.employerName`] = [commonRules.required(`${label} employer name`)];
    familyValidationSchema[`${prefix}.isLiving`] = [commonRules.required(`${label} status (Living/Deceased)`)];
  } else {
    // Guardian is only required if SOME fields are filled (partially filled)
    const guardianFields = ["firstName", "lastName", "occupation"];
    guardianFields.forEach(field => {
      familyValidationSchema[`${prefix}.${field}`] = [
        {
          type: "required",
          validate: (value: any, rootData: any) => {
            const guardian = rootData?.family?.relatedPersons?.[2];
            const isAnyFilled = guardian && (guardian.firstName || guardian.lastName || guardian.occupation);
            if (isAnyFilled) {
              return !!value && String(value).trim().length > 0;
            }
            return true;
          },
          message: `${label} ${field} is required if guardian info is being provided`,
        }
      ];
    });
  }
});
