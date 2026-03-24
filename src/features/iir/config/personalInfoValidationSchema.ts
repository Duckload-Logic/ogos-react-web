/**
 * Validation schema for PersonalSection form
 * Defines all field validation rules declaratively
 */

import {
  FieldValidationSchema,
  commonRules,
} from "@/services/validationSchema";

export const personalInformationValidationSchema: FieldValidationSchema = {
  // Basic Information
  "student.basicInfo.firstName": [commonRules.required("First name"), commonRules.minLength(2), commonRules.nameFormat()],
  "student.basicInfo.lastName": [commonRules.required("Last name"), commonRules.minLength(2), commonRules.nameFormat()],
  "student.basicInfo.email": [commonRules.required("Email"), commonRules.email()],

  // Personal Details
  "student.personalInfo.studentNumber": [commonRules.required("Student number"), commonRules.studentNumber()],
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
    commonRules.telephone(),
  ],
  "student.personalInfo.isEmployed": [
    {
      type: "required",
      validate: (value: any) => value !== undefined && value !== null,
      message: "Please indicate if you are currently employed",
    }
  ],
  "student.personalInfo.employerName": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.student?.personalInfo?.isEmployed === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Employer name is required if employed",
    }
  ],
  "student.personalInfo.employerAddress": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.student?.personalInfo?.isEmployed === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Employer address is required if employed",
    }
  ],
  "student.personalInfo.employerNumber": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        if (rootData?.student?.personalInfo?.isEmployed === true) {
          return value && String(value).trim().length > 0;
        }
        return true;
      },
      message: "Employer phone number is required if employed",
    }
  ],

  // Emergency Contact
  "student.personalInfo.emergencyContact.firstName": [
    commonRules.required("Emergency contact first name"),
    commonRules.minLength(2),
    commonRules.nameFormat(),
  ],
  "student.personalInfo.emergencyContact.lastName": [
    commonRules.required("Emergency contact last name"),
    commonRules.minLength(2),
    commonRules.nameFormat(),
  ],
  "student.personalInfo.emergencyContact.contactNumber": [
    commonRules.required("Emergency contact number"),
    commonRules.phone(),
  ],
  "student.personalInfo.emergencyContact.relationship": [
    commonRules.required("Relationship"),
  ],

  // Addresses – Provincial
  "student.addresses.0.address.region": [commonRules.required("Region (Provincial)")],
  "student.addresses.0.address.province": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        const regionCode = rootData?.student?.addresses?.[0]?.address?.region?.code;
        if (regionCode && regionCode !== "1300000000") {
          return (value?.id !== undefined && value?.id !== "") || (value?.code !== undefined && value?.code !== "");
        }
        return true;
      },
      message: "Province (Provincial) is required",
    }
  ],
  "student.addresses.0.address.city": [commonRules.required("City/Municipality (Provincial)")],
  "student.addresses.0.address.barangay": [commonRules.required("Barangay (Provincial)")],
  "student.addresses.0.address.streetDetail": [commonRules.required("Street (Provincial)")],

  // Addresses – Residential
  "student.addresses.1.address.region": [commonRules.required("Region (Residential)")],
  "student.addresses.1.address.province": [
    {
      type: "required",
      validate: (value: any, rootData: any) => {
        const regionCode = rootData?.student?.addresses?.[1]?.address?.region?.code;
        if (regionCode && regionCode !== "1300000000") {
          return (value?.id !== undefined && value?.id !== "") || (value?.code !== undefined && value?.code !== "");
        }
        return true;
      },
      message: "Province (Residential) is required",
    }
  ],
  "student.addresses.1.address.city": [commonRules.required("City/Municipality (Residential)")],
  "student.addresses.1.address.barangay": [commonRules.required("Barangay (Residential)")],
  "student.addresses.1.address.streetDetail": [commonRules.required("Street (Residential)")],
};
