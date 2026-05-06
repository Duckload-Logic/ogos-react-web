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
    personalInfo: {} as any,
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
        educationalLevel: "",
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
        educationalLevel: "",
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
        educationalLevel: "",
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
    healthRecord: {} as any,
    consultations: [],
  },
  interests: {
    activities: [],
    subjectPreferences: [],
    hobbies: [],
  },
  // testResults: [],
};
