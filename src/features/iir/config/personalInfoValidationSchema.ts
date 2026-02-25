/**
 * Validation schema for PersonalInformationSection form
 * Defines all field validation rules declaratively
 */

import {
  FieldValidationSchema,
  commonRules,
} from "@/services/validationSchema";

export const personalInformationValidationSchema: FieldValidationSchema = {
  // Basic Information Section
  "student.basicInfo.firstName": [commonRules.required("First name")],
  "student.basicInfo.lastName": [commonRules.required("Last name")],
  "student.basicInfo.email": [
    commonRules.required("Email"),
    commonRules.email(),
  ],

  // Personal Details Section
  "student.personalInfo.studentNumber": [
    commonRules.required("Student number"),
  ],
  "student.personalInfo.dateOfBirth": [commonRules.required("Date of birth")],
  "student.personalInfo.placeOfBirth": [commonRules.required("Place of birth")],
  "student.personalInfo.gender": [commonRules.required("Gender")],
  "student.personalInfo.course": [commonRules.required("Course")],
  "student.personalInfo.mobileNumber": [commonRules.required("Mobile number")],

  // Physical Characteristics Section (optional)
  // "student.personalInfo.heightFt": [commonRules.numeric()],
  // "student.personalInfo.weightKg": [commonRules.numeric()],

  // Academic Information Section (optional)
  // "student.personalInfo.highSchoolGWA": [
  //   commonRules.numeric(),
  //   commonRules.minValue(0),
  //   commonRules.maxValue(4.0),
  // ],

  // You can add more validation rules for other fields as needed
  // Simply uncomment and configure based on your requirements
};
