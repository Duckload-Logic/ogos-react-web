import { FieldValidationSchema, commonRules } from "@/services/validationSchema";

export const interestsValidationSchema: FieldValidationSchema = {
  "interests.activities": [
    {
      type: "required",
      validate: (val: any) => Array.isArray(val) && val.length > 0,
      message: "Please select at least one school club or organization",
    },
    {
      validate: (val: any) =>
        Array.isArray(val) &&
        val.every((a: any) => a.role && a.role.trim().length > 0),
      message: "Please assign a role (Officer or Member) to your selected clubs",
    },
  ],
  "interests.hobbies.0.hobbyName": [commonRules.required("First hobby"), commonRules.noSpecialChars("Hobby")],
  "interests.hobbies.1.hobbyName": [commonRules.required("Second hobby"), commonRules.noSpecialChars("Hobby")],
  "interests.hobbies.2.hobbyName": [commonRules.noSpecialChars("Hobby")],
  "interests.subjectPreferences.0.subjectName": [commonRules.required("Favorite subject 1"), commonRules.noSpecialChars("Subject name")],
  "interests.subjectPreferences.1.subjectName": [commonRules.required("Favorite subject 2"), commonRules.noSpecialChars("Subject name")],
  "interests.subjectPreferences.2.subjectName": [commonRules.required("Least liked subject"), commonRules.noSpecialChars("Subject name")],
};
