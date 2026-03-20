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
    }
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
    }
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
    }
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
    }
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
      }
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
      }
    ];
    return acc;
  }, {} as any),
};
