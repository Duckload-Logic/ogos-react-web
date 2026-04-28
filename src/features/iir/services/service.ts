import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { QueryParam, IIRForm } from "../types";
import { decamelizeKeys } from "humps";

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
    ? iir.interests.activities.map((activity) => ({
        id: activity.id,
        activityOption: activity.activityOption,
        otherSpecification: activity.otherSpecification,
        role: activity.role,
        roleSpecification: activity.roleSpecification,
      }))
    : [];

  const schools = Array.isArray(iir.education?.schools)
    ? iir.education.schools.map((school) => ({
        ...school,
        yearStarted: toNumber(school.yearStarted),
        yearCompleted: toNumber(school.yearCompleted),
      }))
    : [];

  const addresses = Array.isArray(iir.student?.addresses)
    ? iir.student.addresses.map((addr) => ({
        ...addr,
        addressType:
          addr.addressType?.toLowerCase() === "residential"
            ? "residential"
            : addr.addressType,
      }))
    : [];

  return {
    iirId: iir.id ?? "",
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
            priorityRank: toNumber(hobby.priorityRank),
          }))
        : [],
    },
    // testResults: Array.isArray(iir.testResults) ? iir.testResults : []
  };
};

/**
 * Check if student has completed onboarding
 * @param userID - User ID to check
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to onboarding status
 */
export const CheckStudentOnboarding = async (
  userID: string,
  config?: AxiosConfigWithMeta,
): Promise<boolean> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.iir.checkOnboarding(userID),
      config,
    );
    return data?.isSubmitted;
  } catch (error) {
    const handlerName = config?.handlerName || "CheckStudentOnboarding";
    const stepName = config?.stepName || "Check Onboarding";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

const LOOKUP_GET_ROUTES = {
  courses: API_ROUTES.iir.lookups.courses,
  genders: API_ROUTES.iir.lookups.genders,
  religions: API_ROUTES.iir.lookups.religions,
  parentalStatusTypes: API_ROUTES.iir.lookups.parentalStatusTypes,
  enrollmentReasons: API_ROUTES.iir.lookups.enrollmentReasons,
  incomeRanges: API_ROUTES.iir.lookups.incomeRanges,
  studentSupportTypes: API_ROUTES.iir.lookups.studentSupportTypes,
  siblingSupportTypes: API_ROUTES.iir.lookups.siblingSupportTypes,
  civilStatuses: API_ROUTES.iir.lookups.civilStatuses,
  natureOfResidenceTypes: API_ROUTES.iir.lookups.natureOfResidenceTypes,
  studentRelationshipTypes: API_ROUTES.iir.lookups.studentRelationshipTypes,
  activityOptions: API_ROUTES.iir.lookups.activityOptions,
  studentStatuses: API_ROUTES.iir.lookups.studentStatuses,
};

const INVENTORY_GET_ROUTES = {
  listStudents: API_ROUTES.iir.inventory.all,
  iirByUserID: (userId: string) => API_ROUTES.iir.inventory.byUserId(userId),
  iirByIIRID: (iirID: string) => API_ROUTES.iir.inventory.byIirId(iirID),
  profileByMe: API_ROUTES.iir.inventory.profileByMe,
  IIRProfile: (iirID: string) => API_ROUTES.iir.inventory.profile(iirID),
  enrollmentReasons: (iirID: string) =>
    API_ROUTES.iir.inventory.enrollmentReasons(iirID),
  personalInfo: (iirID: string) => API_ROUTES.iir.inventory.personalInfo(iirID),
  addresses: (iirID: string) => API_ROUTES.iir.inventory.addresses(iirID),
  familyBackground: (iirID: string) =>
    API_ROUTES.iir.inventory.familyBackground(iirID),
  relatedPersons: (iirID: string) =>
    API_ROUTES.iir.inventory.relatedPersons(iirID),
  education: (iirID: string) => API_ROUTES.iir.inventory.education(iirID),
  finance: (iirID: string) => API_ROUTES.iir.inventory.finance(iirID),
  health: (iirID: string) => API_ROUTES.iir.inventory.health(iirID),
  consultations: (iirID: string) =>
    API_ROUTES.iir.inventory.consultations(iirID),
  activities: (iirID: string) => API_ROUTES.iir.inventory.activities(iirID),
  subjectPreferences: (iirID: string) =>
    API_ROUTES.iir.inventory.subjectPreferences(iirID),
  hobbies: (iirID: string) => API_ROUTES.iir.inventory.hobbies(iirID),
  testResults: (iirID: string) => API_ROUTES.iir.inventory.testResults(iirID),
  significantNotes: (iirID: string) =>
    API_ROUTES.iir.inventory.significantNotes(iirID),
  download: (iirID: string) => API_ROUTES.iir.inventory.download(iirID),
};

const DRAFT_ROUTES = {
  saveSection: API_ROUTES.iir.draft.save,
  submitDraft: API_ROUTES.iir.draft.submit,
};

const POST_ROUTES = {
  submit: API_ROUTES.iir.submit,
  update: API_ROUTES.iir.update,
  cor: API_ROUTES.iir.inventory.cor,
};

/**
 * Get IIR lookup data by type
 * @param lookupType - Type of lookup to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to lookup data
 */
export const GetIIRLookup = async (
  lookupType: keyof typeof LOOKUP_GET_ROUTES,
  config?: AxiosConfigWithMeta,
) => {
  try {
    const route = LOOKUP_GET_ROUTES[lookupType];
    const { data } = await apiClient.get(route, config);
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRLookup";
    const stepName = config?.stepName || `Fetch ${lookupType}`;
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get all students with optional filtering
 * @param params - Query parameters for filtering
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to student list
 */
export const GetStudents = async (
  params: QueryParam,
  config?: AxiosConfigWithMeta,
) => {
  try {
    const { data } = await apiClient.get(INVENTORY_GET_ROUTES.listStudents, {
      ...config,
      params: decamelizeKeys(params),
    });
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetStudents";
    const stepName = config?.stepName || "Fetch Students";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get IIR record by user ID
 * @param userId - User ID to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to IIR record
 */
export const GetIIRByUserId = async (
  userId: string,
  config?: AxiosConfigWithMeta,
) => {
  try {
    const { data } = await apiClient.get(
      INVENTORY_GET_ROUTES.iirByUserID(userId),
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRByUserId";
    const stepName = config?.stepName || "Fetch IIR by User";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get IIR record by session
 * @param sessionID - Session ID to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to IIR record
 */
export const GetIIRByMe = async (config?: AxiosConfigWithMeta) => {
  try {
    const { data } = await apiClient.get(
      INVENTORY_GET_ROUTES.profileByMe,
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRBySessionId";
    const stepName = config?.stepName || "Fetch IIR by Session";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get IIR record by IIR ID
 * @param iirID - IIR ID to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to IIR record
 */
export const GetIIRByIirId = async (
  iirID: string,
  config?: AxiosConfigWithMeta,
) => {
  try {
    const { data } = await apiClient.get(
      INVENTORY_GET_ROUTES.iirByIIRID(iirID),
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRByIirId";
    const stepName = config?.stepName || "Fetch IIR by ID";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get specific IIR resource section
 * @param iirID - IIR ID to fetch from
 * @param resourceType - Type of resource to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to resource data
 */
export const GetIIRResource = async (
  iirID: string,
  resourceType: keyof typeof INVENTORY_GET_ROUTES,
  config?: AxiosConfigWithMeta,
): Promise<IIRForm | any> => {
  try {
    const routeFunc = INVENTORY_GET_ROUTES[resourceType];
    if (typeof routeFunc === "function") {
      // @ts-ignore
      const route = routeFunc(iirID);
      const { data } = await apiClient.get(route, config);
      return data;
    }
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRResource";
    const stepName = config?.stepName || `Fetch ${resourceType}`;
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get IIR draft
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to draft data or null
 */
export const GetIIRDraft = async (
  config?: AxiosConfigWithMeta,
): Promise<IIRForm | null> => {
  try {
    const { data } = await apiClient.get(DRAFT_ROUTES.submitDraft, config);
    return data || null;
  } catch (error) {
    const handlerName = config?.handlerName || "GetIIRDraft";
    const stepName = config?.stepName || "Fetch Draft";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Save IIR draft
 * @param data - IIR form data to save
 * @param config - Optional axios config with metadata
 * @returns Promise resolving when draft is saved
 */
export const PostIIRDraft = async (
  data: IIRForm,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    const payload = normalizeIIRPayload(data);
    await apiClient.post(DRAFT_ROUTES.saveSection, payload, config);
  } catch (error) {
    const handlerName = config?.handlerName || "PostIIRDraft";
    const stepName = config?.stepName || "Save Draft";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Submit IIR form
 * @param iir - IIR form data to submit
 * @param config - Optional axios config with metadata
 * @returns Promise resolving when form is submitted
 */
export const PostIIRSubmit = async (
  iir: IIRForm,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    const payload = normalizeIIRPayload(iir);
    await apiClient.post(POST_ROUTES.submit, payload, config);
  } catch (error) {
    const handlerName = config?.handlerName || "PostIIRSubmit";
    const stepName = config?.stepName || "Submit Form";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};


/**
 * Update an existing IIR form/profile.
 * Assumption: backend accepts PATCH /students/inventory/records/iir/:iirId
 * with the same normalized payload as creation.
 */
export const PatchIIRSubmit = async (
  iirID: string,
  iir: IIRForm,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    const payload = normalizeIIRPayload({ ...iir, id: iirID });
    await apiClient.patch(POST_ROUTES.update(iirID), payload, config);
  } catch (error) {
    const handlerName = config?.handlerName || "PatchIIRSubmit";
    const stepName = config?.stepName || "Update IIR Form";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Upload a student's Certificate of Registration (COR) for an IIR record.
 * Assumption: backend accepts multipart/form-data with field name `cor`.
 */
export const UploadIIRCor = async (
  iirID: string,
  file: File,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("cor", file);

    await apiClient.post(POST_ROUTES.cor(iirID), formData, {
      ...config,
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    const handlerName = config?.handlerName || "UploadIIRCor";
    const stepName = config?.stepName || "Upload COR";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Downloads the student's IIR as a PDF blob.
 * @param iirID - The ID of the student's IIR.
 * @param config - Optional Axios configuration with metadata.
 * @returns Promise resolving to the PDF blob and the suggested filename.
 */
export const DownloadIIRPDF = async (
  iirID: string,
  config?: AxiosConfigWithMeta,
): Promise<{ blob: Blob; fileName: string }> => {
  try {
    const response = await apiClient.get(INVENTORY_GET_ROUTES.download(iirID), {
      ...config,
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header if available
    let fileName = `IIR-Record-${iirID}.pdf`;
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      // Handles filename="name.pdf" or filename=name.pdf
      const fileNameMatch = contentDisposition.match(
        /filename=["']?([^"']+)["']?/,
      );
      if (fileNameMatch?.[1]) {
        fileName = fileNameMatch[1].trim();
      }
    }

    return {
      blob: response.data,
      fileName,
    };
  } catch (error) {
    const handlerName = config?.handlerName || "DownloadIIRPDF";
    const stepName = config?.stepName || "Download IIR PDF";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Legacy service object for backward compatibility
 * @deprecated Use individual exported functions instead
 */
export const iirService = {
  async getLookupData(lookupType: keyof typeof LOOKUP_GET_ROUTES) {
    return GetIIRLookup(lookupType);
  },

  async getStudents(params: QueryParam) {
    return GetStudents(params);
  },

  async getIIRByUserID(userId: string) {
    return GetIIRByUserId(userId);
  },

  async getIIRByIIRID(iirID: string) {
    return GetIIRByIirId(iirID);
  },

  async getIIRResource(
    iirID: string,
    resourceType: keyof typeof INVENTORY_GET_ROUTES,
  ): Promise<IIRForm | any> {
    return GetIIRResource(iirID, resourceType);
  },

  async getIIRLookup(lookupType: keyof typeof LOOKUP_GET_ROUTES) {
    return GetIIRLookup(lookupType);
  },

  async saveIIRDraft(data: IIRForm): Promise<void> {
    return PostIIRDraft(data);
  },

  async getIIRDraft(): Promise<IIRForm | null> {
    return GetIIRDraft();
  },

  async submitIIRForm(iir: IIRForm): Promise<void> {
    return PostIIRSubmit(iir);
  },

  async updateIIRForm(iirID: string, iir: IIRForm): Promise<void> {
    return PatchIIRSubmit(iirID, iir);
  },

  async uploadIIRCor(iirID: string, file: File): Promise<void> {
    return UploadIIRCor(iirID, file);
  },

  async bulkUpdateStudentStatus(payload: {
    iirIds?: string[];
    excludedIirIds?: string[];
    selectAllMatching?: boolean;
    statusId: number;
    graduationYear?: number;
    filters?: {
      search?: string;
      courseId?: number;
      yearLevel?: number;
      enrollYear?: number;
    };
  }): Promise<void> {
    await apiClient.patch(API_ROUTES.iir.bulkStatus, payload);
  },
};
