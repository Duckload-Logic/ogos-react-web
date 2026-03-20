import { FieldValidationSchema, commonRules } from "@/services/validationSchema";

export const interestsValidationSchema: FieldValidationSchema = {
  "interests.activities": [
    {
      type: "required",
      validate: (val: any) => Array.isArray(val) && val.length > 0,
      message: "At least one activity is required",
    },
  ],
  "interests.hobbies.0.hobbyName": [commonRules.required("First hobby")],
  "interests.hobbies.1.hobbyName": [commonRules.required("Second hobby")],
};
