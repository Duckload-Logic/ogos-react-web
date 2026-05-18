import { IIRForm } from "../types";

/**
 * SCENARIO 1: Complete IIR Form
 * A fully filled out form for a typical student (not employed)
 */
export const completeIIRForm: IIRForm = {
  student: {
    basicInfo: {
      firstName: "Juan",
      middleName: "Dela",
      lastName: "Cruz",
      email: "juan.delacruz@example.com",
    },
    personalInfo: {
      suffix: "",
      studentNumber: "2023-12345-TG-0",
      gender: { id: 1 },
      civilStatus: { id: 1 },
      religion: { id: 1 },
      heightM: "1.7",
      weightKg: "70",
      complexion: "Fair",
      highSchoolGWA: "90",
      course: { id: 1 },
      yearLevel: 3,
      section: "1",
      dateOfBirth: "2000-01-01",
      placeOfBirth: "Manila, Philippines",
      mobileNumber: "09123456789",
      telephoneNumber: "0281234567",
      isEmployed: false,
      employerName: null,
      employerAddress: null,
      employerContactNumber: null,
      livingInDorm: false,
      dormAddress: null,
      landlordName: null,
      landlordContactNumber: null,
      emergencyContact: {
        firstName: "Maria",
        middleName: "Dela",
        lastName: "Cruz",
        contactNumber: "09987654321",
        relationship: { id: 1 }, // E.g., Mother
        address: {
          region: { code: "1300000000" },
          province: { code: "" },
          city: { code: "1381000000" },
          barangay: { code: "1381000007" },
          streetDetail: "456 Provincial Road",
        },
      },
    },
    addresses: [
      {
        addressType: "provincial",
        address: {
          region: { code: "1300000000" },
          province: { code: "" },
          city: { code: "1381000000" },
          barangay: { code: "1381000007" },
          streetDetail: "456 Provincial Road",
        },
      },
      {
        addressType: "residential",
        address: {
          region: { code: "1300000000" },
          province: { code: "" },
          city: { code: "1381000000" },
          barangay: { code: "1381000007" },
          streetDetail: "456 Provincial Road",
        },
      },
    ],
  },
  education: {
    natureOfSchooling: "Continuous",
    interruptedDetails: null,
    schools: [
      {
        educationalLevel: { id: 1 },
        schoolName: "Manila Science High School",
        schoolAddress: "Taft Ave, Manila",
        schoolType: "Public",
        yearStarted: "2014",
        yearCompleted: "2018",
        awards: "With Honors",
      },
      {
        educationalLevel: { id: 2 },
        schoolName: "Manila Science High School",
        schoolAddress: "Taft Ave, Manila",
        schoolType: "Public",
        yearStarted: "2014",
        yearCompleted: "2018",
        awards: "With Honors",
      },
      {
        educationalLevel: { id: 3 },
        schoolName: "Manila Science High School",
        schoolAddress: "Taft Ave, Manila",
        schoolType: "Public",
        yearStarted: "2014",
        yearCompleted: "2018",
        awards: "With Honors",
      },
      {
        educationalLevel: { id: 4 },
        schoolName: "Manila Science High School",
        schoolAddress: "Taft Ave, Manila",
        schoolType: "Public",
        yearStarted: "2014",
        yearCompleted: "2018",
        awards: "With Honors",
      },
      {
        educationalLevel: { id: 5 },
        schoolName: "Manila Science High School",
        schoolAddress: "Taft Ave, Manila",
        schoolType: "Public",
        yearStarted: "2014",
        yearCompleted: "2018",
        awards: "With Honors",
      },
    ],
  },
  family: {
    background: {
      parentalStatus: { id: 1, name: "Married and staying together" },
      parentalStatusDetails: null,
      brothers: 1,
      sisters: 1,
      employedSiblings: 0,
      ordinalPosition: 1,
      haveQuietPlaceToStudy: true,
      siblingSupportTypes: [{ id: 1 }],
      isSharingRoom: true,
      roomSharingDetails: "With brother",
      natureOfResidence: { id: 1 },
    },
    relatedPersons: [
      {
        firstName: "Pedro",
        middleName: "Dela", // If there's a suffix, append it to the firstName or lastName since there's no suffix field
        lastName: "Cruz Jr.",
        dateOfBirth: "1970-05-15",
        educationalAttainment: { id: 3, name: "College Graduate" },
        occupation: "Engineer",
        employerName: "Tech Corp",
        employerAddress: "Makati City",
        relationship: { id: 2 }, // Father
        isParent: true,
        isGuardian: false,
        isLiving: true,
      },
      {
        firstName: "Maria",
        middleName: "Santos",
        lastName: "Cruz",
        dateOfBirth: "1972-08-20",
        educationalAttainment: { id: 2, name: "High School Graduate" },
        occupation: "Housewife",
        employerName: null,
        employerAddress: null,
        relationship: { id: 1 }, // Mother
        isParent: true,
        isGuardian: false,
        isLiving: true,
      },
      {
        firstName: "Tito",
        middleName: "Ramos",
        lastName: "Cruz",
        dateOfBirth: "1965-11-02",
        educationalAttainment: { id: 3, name: "College Graduate" },
        occupation: "Business Owner",
        employerName: "Cruz Enterprises",
        employerAddress: "Quezon City",
        relationship: { id: 3 }, // Guardian (Uncle, etc.)
        isParent: false,
        isGuardian: true,
        isLiving: true,
      },
    ],
    finance: {
      monthlyFamilyIncomeRange: { id: 4 },
      otherIncomeDetails: null,
      financialSupportTypes: [{ id: 1 }],
      weeklyAllowance: "1000",
    },
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
    },
    consultations: [
      {
        professionalType: "Psychiatrist",
        hasConsulted: false,
        whenDate: null,
        forWhat: null,
      },
      {
        professionalType: "Psychologist",
        hasConsulted: false,
        whenDate: null,
        forWhat: null,
      },
      {
        professionalType: "Counselor",
        hasConsulted: false,
        whenDate: null,
        forWhat: null,
      },
    ],
  },
  interests: {
    activities: [
      {
        activityOption: { id: 1 },
        otherSpecification: null,
        role: "Member",
        roleSpecification: null,
      },
    ],
    subjectPreferences: [
      {
        subjectName: "Mathematics",
        isFavorite: true,
      },
    ],
    hobbies: [
      {
        hobbyName: "Reading",
        priorityRank: 1,
      },
    ],
  },
};

/**
 * SCENARIO 2: Incomplete IIR Form
 * Represents a student who hasn't fully completed their form.
 */
export const incompleteIIRForm: IIRForm = {
  student: {
    basicInfo: {
      firstName: "Jane",
      middleName: null,
      lastName: "Doe",
      email: "jane.doe@example.com",
    },
    personalInfo: {
      suffix: "",
      studentNumber: "2024-54321-TG-1",
      gender: { id: 2 },
      civilStatus: { id: 1 },
      religion: { id: 1 },
      heightM: "1.6",
      weightKg: "55",
      complexion: "Fair",
      highSchoolGWA: "88",
      course: { id: 2 },
      yearLevel: 1,
      section: "2",
      dateOfBirth: "2005-08-10",
      placeOfBirth: "Quezon City",
      mobileNumber: "09171234567",
      telephoneNumber: null,
      isEmployed: false,
      employerName: null,
      employerAddress: null,
      employerContactNumber: null,
      livingInDorm: false,
      dormAddress: null,
      landlordName: null,
      landlordContactNumber: null,
      emergencyContact: {} as any, // Incomplete
    },
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
};

/**
 * SCENARIO 3: Employed Student IIR Form
 * A fully filled out form where the student is currently employed
 */
export const employedStudentIIRForm: IIRForm = {
  ...completeIIRForm,
  student: {
    ...completeIIRForm.student,
    personalInfo: {
      ...completeIIRForm.student.personalInfo,
      suffix: "",
      studentNumber: "2023-12345-TG-0",
      isEmployed: true,
      employerName: "Example BPO Company",
      employerAddress: "BGC, Taguig City",
    },
  },
};

/**
 * SCENARIO 4: Student with Health Concerns
 * A complete form but with specific health conditions noted
 */
export const healthConcernIIRForm: IIRForm = {
  ...completeIIRForm,
  health: {
    healthRecord: {
      visionHasProblem: true,
      visionDetails: "Nearsighted, wears reading glasses",
      hearingHasProblem: false,
      hearingDetails: null,
      speechHasProblem: false,
      speechDetails: null,
      generalHealthHasProblem: true,
      generalHealthDetails: "Asthma triggered by cold weather",
      mentalEmotionalHasProblem: false,
      mentalEmotionalDetails: null,
    },
    consultations: [
      {
        professionalType: "Pulmonologist",
        hasConsulted: true,
        whenDate: "2023-11-15",
        forWhat: "Severe Asthma Attack",
      },
    ],
  },
};
