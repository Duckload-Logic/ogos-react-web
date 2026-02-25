import { apiClient } from "@/lib/api";
import { QueryParam } from "../types/reqParams";
import { decamelizeKeys } from "humps";
import { IIRForm } from "../types/IIRForm";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizeIIRPayload = (iir: IIRForm) => {
  const activities = Array.isArray(iir.interests?.activities)
    ? iir.interests.activities.flatMap((activity) => {
        const options = Array.isArray(activity.activityOptions)
          ? activity.activityOptions
          : [];

        return options.map((option) => ({
          id: activity.id,
          activityOption: option,
          role: activity.role,
        }));
      })
    : [];

  const schools = Array.isArray(iir.education?.schools)
    ? iir.education.schools.map((school) => ({
        ...school,
        yearStarted: toNumber(school.yearStarted),
        yearCompleted: toNumber(school.yearCompleted),
      }))
    : [];

  const addresses = Array.isArray(iir.student?.addresses)
    ? iir.student.addresses
    : [];

  return {
    iirId: iir.id ?? 0,
    student: {
      basicInfo: iir.student.basicInfo,
      personalInfo: {
        ...iir.student.personalInfo,
        heightFt: toNumber(iir.student.personalInfo.heightFt),
        weightKg: toNumber(iir.student.personalInfo.weightKg),
        highSchoolGWA: toNumber(iir.student.personalInfo.highSchoolGWA),
        section: toNumber(iir.student.personalInfo.section),
      },
      addresses,
    },
    education: {
      ...iir.education,
      schools,
    },
    family: {
      ...iir.family,
      relatedPersons: Array.isArray(iir.family?.relatedPersons)
        ? iir.family.relatedPersons
        : [],
      finance: {
        ...iir.family.finance,
        weeklyAllowance: toNumber(iir.family.finance.weeklyAllowance),
      },
    },
    health: {
      ...iir.health,
      consultations: Array.isArray(iir.health?.consultations)
        ? iir.health.consultations
        : [],
    },
    interests: {
      activities,
      subjectPreferences: Array.isArray(iir.interests?.subjectPreferences)
        ? iir.interests.subjectPreferences
        : [],
      hobbies: Array.isArray(iir.interests?.hobbies)
        ? iir.interests.hobbies.map((hobby) => ({
            ...hobby,
            priorityRank: toNumber(hobby.priorityRanking),
          }))
        : [],
    },
    testResults: Array.isArray(iir.testResults) ? iir.testResults : [],
    significantNotes: Array.isArray(iir.significantNotes)
      ? iir.significantNotes
      : [],
  };
};

export const checkStudentOnboardingStatus = async (
  userID: number,
): Promise<boolean> => {
  const { data } = await apiClient.get(`/students/record/${userID}`);

  return data?.studentRecord?.isSubmitted;
};

const LOOKUP_GET_ROUTES = {
  courses: "/students/lookups/courses",
  genders: "/students/lookups/genders",
  religions: "/students/lookups/religions",
  parentalStatusTypes: "/students/lookups/parental-status-types",
  enrollmentReasons: "/students/lookups/enrollment-reasons",
  incomeRanges: "/students/lookups/income-ranges",
  studentSupportTypes: "/students/lookups/support-types",
  siblingSupportTypes: "/students/lookups/support-types/siblings",
  civilStatuses: "/students/lookups/civil-statuses",
  natureOfResidenceTypes: "/students/lookups/nature-of-residence-types",
  studentRelationshipTypes: "/students/lookups/student-relationship-types",
};

const INVENTORY_GET_ROUTES = {
  listStudents: "/students/inventory/records",
  iirByUserID: (userID: number) => `/students/inventory/records/user/${userID}`,
  iirByIIRID: (iirID: number) => `/students/inventory/records/iir/${iirID}`,
  IIRProfile: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/profile`,
  enrollmentReasons: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/enrollment-reasons`,
  personalInfo: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/personal-info`,
  addresses: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/addresses`,
  familyBackground: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/family-background`,
  relatedPersons: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/related-persons`,
  education: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/education`,
  finance: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/finance`,
  health: (iirID: number) => `/students/inventory/records/iir/${iirID}/health`,
  consultations: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/consultations`,
  activities: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/activities`,
  subjectPreferences: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/subject-preferences`,
  hobbies: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/hobbies`,
  testResults: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/test-results`,
  significantNotes: (iirID: number) =>
    `/students/inventory/records/iir/${iirID}/significant-notes`,
};

const DRAFT_ROUTES = {
  saveSection: `/students/inventory/records/iir/draft`,
  submitDraft: `/students/inventory/records/iir/draft`,
};

const POST_ROUTES = {
  submit: () => `/students/inventory/records/iir`,
};

export const iirService = {
  async getLookupData(lookupType: keyof typeof LOOKUP_GET_ROUTES) {
    const route = LOOKUP_GET_ROUTES[lookupType];
    const { data } = await apiClient.get(route);
    return data;
  },

  async getStudents(params: QueryParam) {
    const { data } = await apiClient.get(INVENTORY_GET_ROUTES.listStudents, {
      params: decamelizeKeys(params),
    });
    return data;
  },

  async getIIRByUserID(userID: number) {
    const route = INVENTORY_GET_ROUTES.iirByUserID(userID);
    const { data } = await apiClient.get(route);
    return data;
  },

  async getIIRByIIRID(iirID: number) {
    const route = INVENTORY_GET_ROUTES.iirByIIRID(iirID);
    const { data } = await apiClient.get(route);
    return data;
  },

  async getIIRResource(
    iirID: number,
    resourceType: keyof typeof INVENTORY_GET_ROUTES,
  ): Promise<IIRForm | any> {
    const routeFunc = INVENTORY_GET_ROUTES[resourceType];
    if (typeof routeFunc === "function") {
      const route = routeFunc(iirID);
      const { data } = await apiClient.get(route);
      return data;
    }
  },

  async getIIRLookup(lookupType: keyof typeof LOOKUP_GET_ROUTES) {
    const route = LOOKUP_GET_ROUTES[lookupType];
    const { data } = await apiClient.get(route);
    return data;
  },

  async saveIIRDraft(data: IIRForm): Promise<void> {
    const route = DRAFT_ROUTES.saveSection;
    const payload = normalizeIIRPayload(data);
    console.debug("data being sent to save draft:", payload);
    await apiClient.post(route, payload);
  },

  async getIIRDraft(): Promise<IIRForm | null> {
    const route = DRAFT_ROUTES.submitDraft;
    const { data } = await apiClient.get(route);
    return data || null;
  },

  async submitIIRForm(iir: IIRForm): Promise<void> {
    const payload = normalizeIIRPayload(iir);
    await apiClient.post(POST_ROUTES.submit(), payload);
  },
};
