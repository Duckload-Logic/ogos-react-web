export interface StudentAnalytics {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  civilStatus?: string;
  religion?: string;
  studentNumber?: string;
  addresses?: any[];
  personalInfo?: {
    highSchoolGWA?: number;
  };
  education?: {
    schools?: any[];
  };
  family?: {
    fatherEducation?: string;
    motherEducation?: string;
    parentMaritalStatus?: string;
    monthlyFamilyIncome?: string;
    relatedPersons?: any[];
  };
}