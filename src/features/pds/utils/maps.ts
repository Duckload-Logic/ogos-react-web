import type { FormData, EducationalBackgroundData, FamilyBackgroundData, GuardianData, HealthRecordData, FinanceInfoData } from '@/features/pds/types';

export const CIVIL_STATUS_MAP: { [key: number]: string } = {
  1: "Single",
  2: "Married",
  3: "Widowed",
  4: "Divorced",
};

export const PARENTAL_STATUS_MAP: { [key: number]: string } = {
  1: "Married and Living Together",
  2: "Married but Living Separately",
  3: "Divorced",
  4: "Annulled",
  5: "Single Parent",
  6: "Father/Mother working abroad",
  7: "Deceased, please specify:",
};

export const REASON_MAP: { [key: string]: number } = {
  "Lower tuition fee": 1,
  "Safety of the place": 2,
  "Spacious Campus": 3,
  "Nearness of home to school": 4,
  "Accessible to transportation": 5,
  "Better quality of education": 6,
  "Adequate School Facilities": 7,
  "Son / Daughter of PUP Employee": 8,
  "Closer Student-Faculty Relations": 9,
};

export const mapEnrollmentReasons = (formData: FormData) => {
  const enrollmentReasonIds = Object.entries(formData.reasonForEnrollment)
    .filter(([_, checked]) => checked)
    .map(([reason]) => REASON_MAP[reason])
    .filter(id => id !== undefined);

  return {
    enrollmentReasonIds,
    otherReasonText: formData.reasonOther || undefined,
  };
};

export const mapPersonalInfo = (formData: FormData, user: any) => {
  return {
    genderId: parseInt(formData.gender) || 1,
    civilStatusTypeId: parseInt(formData.civilStatus) || 1,
    religion: formData.religion || '',
    heightFt: parseFloat(formData.height) || 0,
    weightKg: parseFloat(formData.weight) || 0,
    course: formData.course || '',
    highSchoolGWA: parseFloat(formData.highSchoolAverage),
    placeOfBirth: formData.placeOfBirth || '',
    birthDate: formData.dateOfBirth || '',
    contactNo: formData.mobileNo || '',
    emergencyContact: {
      emergencyContactName: formData.emergencyContactName || '',
      emergencyContactPhone: formData.emergencyContactPhone || '',
      emergencyContactRelationship: formData.emergencyContactRelationship || '', // Fixed field name
    },
    addresses: [
      {
        addressType: 'Provincial',
        regionName: formData.provincialAddressRegion || '',
        provinceName: formData.provincialAddressProvince || '',
        cityName: formData.provincialAddressMunicipality || '',
        barangayName: formData.provincialAddressBarangay || '',
        streetLotBlk: formData.provincialAddressStreet || '',
      },
      {
        addressType: 'Residential',
        regionName: formData.residentialAddressRegion || '',
        provinceName: formData.residentialAddressProvince || '',
        cityName: formData.residentialAddressMunicipality || '',
        barangayName: formData.residentialAddressBarangay || '',
        streetLotBlk: formData.residentialAddressStreet || '',
      }
    ]
  };
};

export const mapEducationInfo = (formData: FormData): EducationalBackgroundData[] => {
  const educationLevels = [
    { key: 'elementary', level: "Elementary" },
    { key: 'juniorHS', level: "Junior High School" },
    { key: 'seniorHS', level: "Senior High School" },
  ];

  const educationData: EducationalBackgroundData[] = [];

  educationLevels.forEach(({ key, level }) => {
    const eduData = formData.education[key as keyof typeof formData.education];
    if (typeof eduData === 'object' && eduData.school) {
      educationData.push({
        educationalLevel: level,
        schoolName: eduData.school,
        location: eduData.location || '',
        schoolType: (eduData.public === 'Public' ? 'Public' : 'Private') as 'Public' | 'Private',
        yearCompleted: eduData.yearGrad || '',
        awards: eduData.awards || '',
      });
    }
  });

  return educationData;
};

export const mapFamilyInfo = (formData: FormData): FamilyBackgroundData => {
  const parents: GuardianData[] = [];

  parents.push({
    firstName: formData.fatherFirstName || '',
    lastName: formData.fatherLastName || '',
    middleName: formData.fatherMiddleName || '',
    educationalLevel: formData.fatherEducation || '',
    birthDate: formData.fatherBirthDate || new Date().toISOString().split('T')[0],
    occupation: formData.fatherOccupation || '',
    companyName: formData.fatherCompany || '',
    relationship: 1, // Changed from relationshipTypeId to relationship (1 = Father enum)
  });

  // Add mother if name is provided
  parents.push({
    firstName: formData.motherFirstName || '',
    lastName: formData.motherLastName || '',
    middleName: formData.motherMiddleName || '',
    educationalLevel: formData.motherEducation || '',
    birthDate: formData.motherBirthDate || new Date().toISOString().split('T')[0],
    occupation: formData.motherOccupation || '',
    companyName: formData.motherCompany || '',
    relationship: 2, // Changed from relationshipTypeId to relationship (2 = Mother enum)
  });

  return {
    parentalStatusId: formData.parentalStatusID || 1,
    parentalStatusDetails: formData.parentalDetails || undefined,
    siblingsBrothers: parseInt(formData.brothers) || 0,
    siblingSisters: parseInt(formData.sisters) || 0,
    monthlyFamilyIncome: formData.monthlyFamilyIncome || '',
    parents,
    guardianName: formData.guardianName || undefined,
    guardianAddress: formData.guardianAddress || undefined,
    employedFamilyMembersCount: parseInt(formData.gainfullyEmployed) || 0,
    supportsStudiesCount: parseInt(formData.supportStudies) || 0,
    supportsFamilyCount: parseInt(formData.supportFamily) || 0,
    financialSupport: formData.financialSupport || '',
    weeklyAllowance: parseFloat(formData.weeklyAllowance) || 0,
  };
};

export const mapHealthInfo = (formData: FormData): HealthRecordData => {
  console.log(formData.vision)
  return {
    visionRemark: formData.vision,
    hearingRemark: formData.hearing,
    mobilityRemark: formData.mobility,
    speechRemark: formData.speech,
    generalHealthRemark: formData.generalHealth,
    consultedProfessional: formData.consultedWith || undefined,
    consultationReason: formData.consultReason || undefined,
    dateStarted: formData.whenStarted || undefined,
    numberOfSessions: formData.numSessions ? parseInt(formData.numSessions) : undefined,
    dateConcluded: formData.dateConcluded || undefined,
  };
};

export const mapFinanceInfo = (formData: FormData): FinanceInfoData => {
  return {
    isEmployed: formData.employerName?.trim().length > 0,
    supportsStudies: formData.supportStudies === 'Yes',
    supportsFamily: formData.supportFamily === 'Yes',
    financialSupportTypeId: parseInt(formData.financialSupport) || 1,
    weeklyAllowance: parseFloat(formData.weeklyAllowance) || 0,
  };
};