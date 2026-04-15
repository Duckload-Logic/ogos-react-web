import { FieldValidationSchema, commonRules } from "@/services/validationSchema";
export const healthValidationSchema: FieldValidationSchema = {
  // Physical Health
  "health.healthRecord.visionHasProblem": [
    {
      type: "required",
      validate: (value: any) => value !== undefined && value !== null,
      message: "Please select Yes or No",
    }
  ],
  "health.healthRecord.visionDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.health?.healthRecord?.visionHasProblem === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the problem",
    },
    commonRules.noSpecialChars("Vision details")
  ],

  "health.healthRecord.hearingHasProblem": [
    {
      type: "required",
      validate: (value: any) => value !== undefined && value !== null,
      message: "Please select Yes or No",
    }
  ],
  "health.healthRecord.hearingDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.health?.healthRecord?.hearingHasProblem === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the problem",
    },
    commonRules.noSpecialChars("Hearing details")
  ],

  "health.healthRecord.speechHasProblem": [
    {
      type: "required",
      validate: (value: any) => value !== undefined && value !== null,
      message: "Please select Yes or No",
    }
  ],
  "health.healthRecord.speechDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.health?.healthRecord?.speechHasProblem === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the problem",
    },
    commonRules.noSpecialChars("Speech details")
  ],

  "health.healthRecord.generalHealthHasProblem": [
    {
      type: "required",
      validate: (value: any) => value !== undefined && value !== null,
      message: "Please select Yes or No",
    }
  ],
  "health.healthRecord.generalHealthDetails": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.health?.healthRecord?.generalHealthHasProblem === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Please specify the problem",
    },
    commonRules.noSpecialChars("General health details")
  ],
  ...["Psychiatrist", "Psychologist", "Counselor"].reduce((acc, type) => {
    acc[`_consultations.${type}.hasConsulted`] = [
      {
        type: "required",
        validate: (value: any) => value !== undefined && value !== null,
        message: `Please select Yes or No`,
      }
    ];
    acc[`_consultations.${type}.whenDate`] = [
      {
        type: "required",
        validate: (value: any, rootData: any) => {
          if (rootData?._consultations?.[type]?.hasConsulted === true) {
            return value && String(value).trim().length > 0;
          }
          return true;
        },
        message: `Please specify when`,
      },
      commonRules.pattern(/^(0[1-9]|1[0-2])\/\d{2}\/\d{4}$/, "Must be in MM/DD/YYYY format"),
    ];
    acc[`_consultations.${type}.forWhat`] = [
      {
        type: "required",
        validate: (value: any, rootData: any) => {
          if (rootData?._consultations?.[type]?.hasConsulted === true) {
            return value && String(value).trim().length > 0;
          }
          return true;
        },
        message: `Please specify reason`,
      },
      commonRules.noSpecialChars(`Reason for consultation`),
    ];
    return acc;
  }, {} as any),
};
