import { IIRForm } from "../types";

export const NOT_SPECIFIED = "-";

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
    relatedPersons: [],
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
