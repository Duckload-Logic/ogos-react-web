import {
  FieldValidationSchema,
  commonRules,
  ValidationRule,
} from "@/services/validationSchema";
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
        return (
          value?.id !== undefined && value?.id !== null && value?.id !== ""
        );
      },
      message: "Parental status is required",
    },
  ],

  "family.background.roomSharingDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.family?.background?.isSharingRoom === true) {
          return value && String(value).trim().length > 2;
        }
        return true;
      },
      message: "Please specify who you share a room with",
    },
    commonRules.noSpecialChars("Room sharing details"),
    commonRules.minLength(2),
    commonRules.maxLength(100),
  ],

  "family.finance.monthlyFamilyIncomeRange": [
    {
      type: "required",
      validate: (value: any) => {
        return (
          value?.id !== undefined && value?.id !== null && value?.id !== ""
        );
      },
      message: "Monthly family income range is required",
    },
  ],
  "family.finance.monthlyFamilyIncomeRange.otherSpecification": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (
          rootData?.family?.finance?.monthlyFamilyIncomeRange?.id === "others"
        ) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the income range",
    },
    commonRules.noSpecialChars("Income range"),
  ],
  "family.finance.weeklyAllowance": [
    commonRules.required("Weekly allowance"),
    commonRules.positiveNumber(),
    commonRules.maxValue(50000),
  ],
  "family.background.brothers": [
    commonRules.required("Number of brothers"),
    commonRules.minValue(0),
  ],
  "family.background.sisters": [
    commonRules.required("Number of sisters"),
    commonRules.minValue(0),
  ],
  "family.background.employedSiblings": [
    commonRules.required("Number of gainfully employed"),
    commonRules.minValue(0),
    commonRules.siblingCount(
      "family.background.brothers",
      "family.background.sisters",
    ),
  ],
  "family.background.ordinalPosition": [
    commonRules.required("Ordinal position"),
    commonRules.minValue(1),
    commonRules.ordinalPosition(
      "family.background.brothers",
      "family.background.sisters",
    ),
  ],
  "family.background.haveQuietPlaceToStudy": [
    commonRules.required("Quiet place to study"),
  ],
  "family.background.isSharingRoom": [commonRules.required("Shares room")],
  "family.background.natureOfResidence": [
    {
      type: "required",
      validate: (value: any) => {
        return (
          value?.id !== undefined && value?.id !== null && value?.id !== ""
        );
      },
      message: "Nature of residence is required",
    },
  ],
  "family.finance.financialSupportTypes": [
    {
      type: "required",
      validate: (value: any) => {
        return Array.isArray(value) && value.length > 0;
      },
      message: "Please select at least one financing source",
    },
  ],
  "family.background.siblingSupportTypes": [],
};

// Add related persons (Father, Mother, Guardian)
const RELATIONS = [
  { prefix: "family.relatedPersons.0", label: "Father" },
  { prefix: "family.relatedPersons.1", label: "Mother" },
  { prefix: "family.relatedPersons.2", label: "Guardian" },
];

RELATIONS.forEach(({ prefix, label }, idx) => {
  const isRequired = label !== "Guardian";

  if (isRequired) {
    familyValidationSchema[`${prefix}.firstName`] = [
      commonRules.required(`${label} first name`),
      commonRules.minLength(2),
      commonRules.nameFormat(),
      commonRules.noSpecialChars(`${label} first name`),
    ];
    familyValidationSchema[`${prefix}.lastName`] = [
      commonRules.required(`${label} last name`),
      commonRules.minLength(2),
      commonRules.nameFormat(),
      commonRules.noSpecialChars(`${label} last name`),
    ];
    familyValidationSchema[`${prefix}.middleName`] = [
      commonRules.nameFormat(),
      commonRules.noSpecialChars(`${label} middle name`),
    ];
    familyValidationSchema[`${prefix}.dateOfBirth`] = [
      {
        type: "required",
        validate: (value: any, rootData: any) => {
          const person = rootData?.family?.relatedPersons?.[idx];
          if (person?.isLiving !== false) {
            return !!value && String(value).trim().length > 0;
          }
          return true;
        },
        message: `${label} date of birth is required`,
      },
    ];
    familyValidationSchema[`${prefix}.educationalLevel`] = [
      {
        type: "required",
        validate: (value: any, rootData: any) => {
          const person = rootData?.family?.relatedPersons?.[idx];
          if (person?.isLiving !== false) {
            return !!value && String(value).trim().length > 0;
          }
          return true;
        },
        message: `${label} educational attainment is required`,
      },
      commonRules.noSpecialChars(`${label} educational attainment`),
    ];
    familyValidationSchema[`${prefix}.occupation`] = [
      {
        type: "required",
        validate: (value: any, rootData: any) => {
          const person = rootData?.family?.relatedPersons?.[idx];
          if (person?.isLiving !== false) {
            return !!value && String(value).trim().length > 0;
          }
          return true;
        },
        message: `${label} occupation is required`,
      },
      commonRules.noSpecialChars(`${label} occupation`),
    ];
    familyValidationSchema[`${prefix}.employerName`] = [
      commonRules.noSpecialChars(`${label} employer name`),
    ];
    familyValidationSchema[`${prefix}.employerAddress`] = [
      commonRules.noSpecialChars(`${label} employer address`),
    ];
    familyValidationSchema[`${prefix}.isLiving`] = [
      commonRules.required(`${label} status (Living/Deceased)`),
    ];
  } else {
    const guardianFields = [
      "firstName",
      "middleName",
      "lastName",
      "occupation",
      "educationalLevel",
      "employerName",
      "employerAddress",
    ];
    guardianFields.forEach((field) => {
      familyValidationSchema[`${prefix}.${field}`] = [
        {
          type: "required",
          validate: (value: any, rootData: any) => {
            const guardian = rootData?.family?.relatedPersons?.[2];
            const isAnyFilled =
              guardian &&
              (guardian.firstName || guardian.lastName || guardian.occupation);
            if (
              isAnyFilled &&
              (field === "firstName" ||
                field === "lastName" ||
                field === "occupation")
            ) {
              return !!value && String(value).trim().length > 0;
            }
            return true;
          },
          message: `${label} ${field} is required if guardian info is being provided`,
        },
        commonRules.noSpecialChars(`${label} ${field}`),
      ];
    });
  }
});
