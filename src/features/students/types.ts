export interface EducationLevel {
  school: string;
  location: string;
  public: string;
  yearGrad: string;
  awards: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Personal Information Section
export interface PersonalInformationData {
  reasonForEnrollment: { [key: string]: boolean };
  reasonOther: string;
  expecting_scholarship: boolean;
  scholarship_details: string;
  lastName: string;
  firstName: string;
  middleName: string;
  civilStatus: string;
  religion: string;
  highSchoolAverage: string;
  course: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  mobileNo: string;
  height: string;
  weight: string;
  gender: string;
}

// Address Information Section
export interface AddressInformationData {
  provincialAddressProvince: string;
  provincialAddressMunicipality: string;
  provincialAddressBarangay: string;
  provincialAddressRegion: string;
  provincialAddressStreet: string;
  residentialAddressProvince: string;
  residentialAddressMunicipality: string;
  residentialAddressBarangay: string;
  residentialAddressRegion: string;
  residentialAddressStreet: string;
}

// Emergency Contact Section
export interface EmergencyContactData {
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactMiddleName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  employerName: string;
}

// Education Section
export interface EducationData {
  education: {
    elementary: EducationLevel;
    juniorHS: EducationLevel;
    seniorHS: EducationLevel;
    others: string;
  };
}

// Family Background Section
export interface FamilyInformationData {
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherEducation: string;
  fatherOccupation: string;
  fatherCompany: string;
  fatherBirthDate: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherEducation: string;
  motherOccupation: string;
  motherCompany: string;
  motherBirthDate: string;
  parentalStatusID: number;
  parentalDetails: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianMiddleName: string;
  guardianAddressProvince: string;
  guardianAddressMunicipality: string;
  guardianAddressBarangay: string;
  guardianAddressRegion: string;
  guardianAddressStreet: string;
  monthlyFamilyIncome: string;
  monthlyFamilyIncomeOther: string;
  brothers: string;
  sisters: string;
}

// Finance & Employment Section
export interface FinanceEmploymentData {
  gainfullyEmployed: string;
  supportStudies: string;
  supportFamily: string;
  financialSupport: string;
  weeklyAllowance: string;
}

// Health & Wellness Section
export interface HealthWellnessData {
  vision: string;
  hearing: string;
  mobility: string;
  speech: string;
  generalHealth: string;
  consultedWith: string;
  consultReason: string;
  whenStarted: string;
  numSessions: string;
  dateConcluded: string;
}

// Test Results Section
export interface TestResultsData {
  dateTest: string;
  testAdministered: string;
  rs: string;
  pr: string;
  description: string;
}

// Significant Notes Section
export interface SignificantNotesData {
  significantNotesDate: string;
  incident: string;
  remarks: string;
}

// Complete Form Data (aggregated)
export interface StudentRecord
  extends PersonalInformationData,
    AddressInformationData,
    EmergencyContactData,
    EducationData,
    FamilyInformationData,
    FinanceEmploymentData,
    HealthWellnessData,
    TestResultsData,
    SignificantNotesData {}

// Backend API Types
export interface EducationalBackgroundData {
  educationalLevel: string; // Changed from educationalLevelId
  schoolName: string;
  location: string;
  schoolType: 'Public' | 'Private';
  yearCompleted: string;
  awards: string;
}

export interface GuardianData {
  firstName: string;
  lastName: string;
  middleName: string;
  educationalLevel: string;
  birthDate: string;
  occupation: string;
  maidenName?: string;
  companyName: string;
  relationship: number; // Changed from relationshipTypeId to match backend enum (1=Father, 2=Mother)
}

export interface FamilyBackgroundData {
  parentalStatusId: number;
  parentalStatusDetails?: string;
  siblingsBrothers: number;
  siblingSisters: number;
  monthlyFamilyIncome: string;
  parents: GuardianData[]; // Changed from 'guardians' to 'parents'
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianMiddleName?: string;
  guardianAddress?: string;
  employedFamilyMembersCount: number;
  supportsStudiesCount: number;
  supportsFamilyCount: number;
  financialSupport: string;
  weeklyAllowance: number;
}

export interface StudentAddressData {
  addressTypeId: number;
  regionName: string;
  provinceName: string;
  cityName: string;
  barangayName: string;
  streetLotBlk?: string;
  unitNo?: string;
  buildingName?: string;
}

export interface HealthRecordData {
  visionRemark: string;
  hearingRemark: string;
  mobilityRemark: string;
  speechRemark: string;
  generalHealthRemark: string;
  consultedProfessional?: string;
  consultationReason?: string;
  dateStarted?: string;
  numberOfSessions?: number;
  dateConcluded?: string;
}

export interface FinanceInfoData {
  isEmployed: boolean;
  supportsStudies: boolean;
  supportsFamily: boolean;
  financialSupportTypeId: number;
  weeklyAllowance: number;
}