/**
 * Validation schema for PersonalInformationSection form
 * Defines all field validation rules declaratively
 */

import {
  FieldValidationSchema,
  commonRules,
} from "@/services/validationSchema";

export const personalInformationValidationSchema: FieldValidationSchema = {
  // Basic Information
  "student.basicInfo.firstName": [commonRules.required("First name"), commonRules.minLength(2)],
  "student.basicInfo.lastName": [commonRules.required("Last name"), commonRules.minLength(2)],
  "student.basicInfo.email": [commonRules.required("Email"), commonRules.email()],

  // Personal Details
  "student.personalInfo.studentNumber": [commonRules.required("Student number"), commonRules.minLength(2)],
  "student.personalInfo.dateOfBirth": [commonRules.required("Date of birth"), commonRules.validDate()],
  "student.personalInfo.placeOfBirth": [commonRules.required("Place of birth"), commonRules.minLength(2)],
  "student.personalInfo.gender": [commonRules.required("Gender")],
  "student.personalInfo.civilStatus": [commonRules.required("Civil status")],
  "student.personalInfo.religion": [commonRules.required("Religion")],
  "student.personalInfo.course": [commonRules.required("Course")],
  "student.personalInfo.highSchoolGWA": [
    commonRules.required("High school GWA"),
    commonRules.numeric(),
    commonRules.minValue(60),
    commonRules.maxValue(100),
  ],
  "student.personalInfo.heightFt": [
    commonRules.required("Height"),
    commonRules.positiveNumber(),
  ],
  "student.personalInfo.weightKg": [
    commonRules.required("Weight"),
    commonRules.positiveNumber(),
  ],
  "student.personalInfo.mobileNumber": [
    commonRules.required("Mobile number"),
    commonRules.phone(),
  ],
  "student.personalInfo.telephoneNumber": [
    commonRules.required("Telephone number"),
    commonRules.minLength(7),
  ],

  // Emergency Contact
  "student.personalInfo.emergencyContact.firstName": [
    commonRules.required("Emergency contact first name"),
    commonRules.minLength(2),
  ],
  "student.personalInfo.emergencyContact.lastName": [
    commonRules.required("Emergency contact last name"),
    commonRules.minLength(2),
  ],
  "student.personalInfo.emergencyContact.contactNumber": [
    commonRules.required("Emergency contact number"),
    commonRules.phone(),
  ],
  "student.personalInfo.emergencyContact.relationship": [
    commonRules.required("Relationship"),
  ],

  // Addresses – Provincial
  "student.addresses.provincial.address.region": [commonRules.required("Region (Provincial)")],
  "student.addresses.provincial.address.city": [commonRules.required("City/Municipality (Provincial)")],
  "student.addresses.provincial.address.barangay": [commonRules.required("Barangay (Provincial)")],

  // Addresses – Residential
  "student.addresses.residential.address.region": [commonRules.required("Region (Residential)")],
  "student.addresses.residential.address.city": [commonRules.required("City/Municipality (Residential)")],
  "student.addresses.residential.address.barangay": [commonRules.required("Barangay (Residential)")],
};
