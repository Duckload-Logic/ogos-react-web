import { apiClient } from '@/lib/api';

export const checkStudentOnboardingStatus = async (userID: number): Promise<boolean> => {
  const { data } = await apiClient.get(`/students/record/${userID}`);

  return data?.studentRecord?.isSubmitted;
}

export const studentService = {
  async createStudentRecord(userID: number) {
    const { data } = await apiClient.post(`/students/onboarding/${userID}`);
    return data;
  },

  async getStudentRecord(userID: number) {
    const { data } = await apiClient.get(`/students/record/${userID}`);
    return data.studentRecordID;
  },

  async saveEnrollmentReasons(studentRecordId: number, reasons: any) {
    await apiClient.put(`/students/onboarding/enrollment-reasons/${studentRecordId}`, reasons);
  },

  async saveBaseProfile(studentRecordId: number, profile: any) {
    await apiClient.put(`/students/onboarding/base/${studentRecordId}`, profile);
  },

  async saveFamilyInfo(studentRecordId: number, family: any) {
    await apiClient.put(`/students/onboarding/family/${studentRecordId}`, family);
  },

  async saveEducationInfo(studentRecordId: number, educationalBackgrounds: any[]) {
    await apiClient.put(`/students/onboarding/education/${studentRecordId}`, {
      educationalBackgrounds, // Wrapped in object as backend expects
    });
  },

  async saveAddressInfo(studentRecordId: number, addresses: any[]) {
    await apiClient.put(`/students/onboarding/address/${studentRecordId}`, { 
      addresses, // Wrapped in object as backend expects
    });
  },

  async saveHealthInfo(studentRecordId: number, health: any) {
    await apiClient.put(`/students/onboarding/health/${studentRecordId}`, health);
  },

  async saveFinanceInfo(studentRecordId: number, finance: any) {
    await apiClient.put(`/students/onboarding/finance/${studentRecordId}`, finance);
  },

  async completeOnboarding(studentRecordId: number) {
    await apiClient.post(`/students/onboarding/complete/${studentRecordId}`);
  },

  async getStudentProgress(userID: number) {
    const { data } = await apiClient.get(`/students/record/progress/${userID}`);
    return data;
  },

  async getStudentProfile(
    userID: number, include_address = false, 
    include_finance = false, include_health = false, 
    include_family = false, include_education = false
  ) {
    const { data } = await apiClient.get(`/students/${userID}`,
      {
        params: {
          include_address,
          include_finance,
          include_health,
          include_family,
          include_education,
        }
      } 
    );
    return data;
  }
};