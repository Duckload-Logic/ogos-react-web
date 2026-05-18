import { IIRForm } from "../types";

export const NOT_SPECIFIED = "-";

export const COMPLEXIONS = [
  "Fair",
  "Tan",
  "Medium",
  "Dark",
  "Olive",
  "Morena",
  "Moreno",
  "Light",
  "Brown",
  "Deep",
];

export type TabId =
  | "personal"
  | "education"
  | "family"
  | "health"
  | "interests"
  | "testResults"
  | "significantNotes";

export const EMPTY_IIR_FORM: IIRForm = {
  student: {
    basicInfo: {
      firstName: "",
      middleName: {} as any,
      lastName: "",
      email: "",
    },
    personalInfo: {
      id: undefined,
      suffix: "",
      studentNumber: "",
      gender: { id: 0 },
      civilStatus: { id: 0 },
      religion: { id: 0 },
      heightM: "",
      weightKg: "",
      complexion: "",
      highSchoolGWA: "",
      course: { id: 0 },
      yearLevel: 1,
      section: "",
      dateOfBirth: "",
      placeOfBirth: "",
      mobileNumber: "",
      telephoneNumber: null,
      isEmployed: false,
      employerName: null,
      employerAddress: null,
      employerContactNumber: null,
      livingInDorm: false,
      dormAddress: null,
      landlordName: null,
      landlordContactNumber: null,
      emergencyContact: {
        firstName: "",
        middleName: null,
        lastName: "",
        contactNumber: "",
        relationship: { id: 0 },
        address: {
          region: { id: 0, code: "" },
          province: null,
          city: { id: 0, code: "" },
          barangay: { id: 0, code: "" },
          streetDetail: "",
        },
      },
    } as any,
    addresses: [],
  },
  education: {
    natureOfSchooling: "",
    interruptedDetails: null,
    schools: [],
  },
  family: {
    background: {} as any,
    relatedPersons: [
      {
        firstName: "",
        middleName: null,
        lastName: "",
        dateOfBirth: "",
        educationalAttainment: { id: 0 },
        occupation: null,
        employerName: null,
        employerAddress: null,
        relationship: { id: 1 },
        isParent: true,
        isGuardian: false,
        isLiving: true,
      }, // Father
      {
        firstName: "",
        middleName: null,
        lastName: "",
        dateOfBirth: "",
        educationalAttainment: { id: 0 },
        occupation: null,
        employerName: null,
        employerAddress: null,
        relationship: { id: 2 },
        isParent: true,
        isGuardian: false,
        isLiving: true,
      }, // Mother
      {
        firstName: "",
        middleName: null,
        lastName: "",
        dateOfBirth: "",
        educationalAttainment: { id: 0 },
        occupation: null,
        employerName: null,
        employerAddress: null,
        relationship: { id: 3 },
        isParent: false,
        isGuardian: true,
        isLiving: true,
      }, // Guardian
    ],
    finance: {} as any,
  },
  health: {
    healthRecord: {
      visionHasProblem: false,
      visionDetails: null,
      hearingHasProblem: false,
      hearingDetails: null,
      speechHasProblem: false,
      speechDetails: null,
      generalHealthHasProblem: false,
      generalHealthDetails: null,
      mentalEmotionalHasProblem: false,
      mentalEmotionalDetails: null,
    } as any,
    consultations: [],
  },
  interests: {
    activities: [],
    subjectPreferences: [],
    hobbies: [],
  },
};
