import { useState } from 'react';
import { useAuth } from '@/context';
import { studentService } from '@/features/students/services/service';
import { FormData } from '../types';
import { CIVIL_STATUS_MAP, PARENTAL_STATUS_MAP, REASON_MAP } from '../utils/maps';

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Check if date is valid to prevent "Invalid Date" strings
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // CORRECT FORMAT: YYYY-MM-DD
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

// Helper functions to convert FormData to API payload formats
const mapFormDataToBaseProfile = (formData: FormData) => {
  return {
    firstName: formData.firstName,
    middleName: formData.middleName,
    lastName: formData.lastName,
    email: formData.email,
    contactNo: formData.mobileNo,
    birthDate: formData.dateOfBirth,
    placeOfBirth: formData.placeOfBirth,
    course: formData.course,
    civilStatusTypeId: formData.civilStatus,
    religion: formData.religion,
    heightFt: formData.height ? parseFloat(formData.height) : null,
    weightKg: formData.weight ? parseFloat(formData.weight) : null,
    genderId: formData.gender ? parseInt(formData.gender) : null,
    highSchoolGWA: formData.highSchoolAverage,
    emergencyContactName: formData.emergencyContactName,
    emergencyContactPhone: formData.emergencyContactPhone,
    emergencyContactRelationship: formData.emergencyContactRelationship,
  };
};

const mapFormDataToAddresses = (formData: FormData) => {
  const addresses = [];
  
  // Provincial address
  if (formData.provincialAddressProvince) {
    addresses.push({
      addressType: "Provincial",
      provinceName: formData.provincialAddressProvince,
      cityName: formData.provincialAddressMunicipality,
      barangayName: formData.provincialAddressBarangay,
      regionName: formData.provincialAddressRegion,
      streetLotBlk: formData.provincialAddressStreet,
    });
  }
  
  // Residential address
  if (formData.residentialAddressProvince) {
    addresses.push({
      addressType: "Residential",
      provinceName: formData.residentialAddressProvince,
      cityName: formData.residentialAddressMunicipality,
      barangayName: formData.residentialAddressBarangay,
      regionName: formData.residentialAddressRegion,
      streetLotBlk: formData.residentialAddressStreet,
    });
  }
  
  return addresses;
};

const mapFormDataToEducation = (formData: FormData) => {
  const education = [];
  
  if (formData.education.elementary.school) {
    education.push({
      educationalLevel: "Elementary",
      schoolName: formData.education.elementary.school,
      location: formData.education.elementary.location,
      schoolType: formData.education.elementary.public,
      yearCompleted: formData.education.elementary.yearGrad,
      awards: formData.education.elementary.awards,
    });
  }
  
  if (formData.education.juniorHS.school) {
    education.push({
      educationalLevel: "Junior High School",
      schoolName: formData.education.juniorHS.school,
      location: formData.education.juniorHS.location,
      schoolType: formData.education.juniorHS.public,
      yearCompleted: formData.education.juniorHS.yearGrad,
      awards: formData.education.juniorHS.awards,
    });
  }
  
  if (formData.education.seniorHS.school) {
    education.push({
      educationalLevel: "Senior High School",
      schoolName: formData.education.seniorHS.school,
      location: formData.education.seniorHS.location,
      schoolType: formData.education.seniorHS.public,
      yearCompleted: formData.education.seniorHS.yearGrad,
      awards: formData.education.seniorHS.awards,
    });
  }
  
  return education;
};

const mapFormDataToFamily = (formData: FormData) => {
  const parents = [];
  
  // Father
  if (formData.fatherFirstName || formData.fatherLastName) {
    parents.push({
      relationship: "Father",
      firstName: formData.fatherFirstName,
      middleName: formData.fatherMiddleName,
      lastName: formData.fatherLastName,
      birthDate: formData.fatherBirthDate,
      educationalLevel: formData.fatherEducation,
      occupation: formData.fatherOccupation,
      companyName: formData.fatherCompany,
    });
  }
  
  // Mother
  if (formData.motherFirstName || formData.motherLastName) {
    parents.push({
      relationship: "Mother",
      firstName: formData.motherFirstName,
      middleName: formData.motherMiddleName,
      lastName: formData.motherLastName,
      birthDate: formData.motherBirthDate,
      educationalLevel: formData.motherEducation,
      occupation: formData.motherOccupation,
      companyName: formData.motherCompany,
    });
  }
  
  return {
    parents,
    background: {
      parentalStatusID: formData.parentalStatusID,
      parentalStatusDetails: formData.parentalDetails,
      guardianName: formData.guardianName,
      guardianAddress: formData.guardianAddress,
      siblingsBrothers: formData.brothers ? parseInt(formData.brothers) : 0,
      siblingSisters: formData.sisters ? parseInt(formData.sisters) : 0,
      monthlyFamilyIncome: formData.monthlyFamilyIncome ? parseFloat(formData.monthlyFamilyIncome) : null,
    },
    finance: {
      employedFamilyMembersCount: formData.gainfullyEmployed === "1" ? 1 : 0,
      supportsStudiesCount: formData.supportStudies === "1" ? 1 : 0,
      supportsFamilyCount: formData.supportFamily === "1" ? 1 : 0,
      financialSupport: formData.financialSupport,
      weeklyAllowance: formData.weeklyAllowance ? parseFloat(formData.weeklyAllowance) : null,
    },
  };
};

const mapFormDataToHealth = (formData: FormData) => {
  return {
    visionRemark: formData.vision,
    hearingRemark: formData.hearing,
    mobilityRemark: formData.mobility,
    speechRemark: formData.speech,
    generalHealthRemark: formData.generalHealth,
    consultedProfessional: formData.consultedWith,
    consultationReason: formData.consultReason,
    dateStarted: formData.whenStarted,
    numberOfSessions: formData.numSessions ? parseInt(formData.numSessions) : 0,
    dateConcluded: formData.dateConcluded,
  };
};

const mapToFormData = (data: any): FormData => {
  let personalInfo = data.personalInfo
  let education = data.education
  let family = data.family
  let health = data.health
  
  return {
    reasonForEnrollment: data.enrollmentReasons?.reduce((acc: any, item: any) => {
        // 1. Find which key in your REASON_MAP matches this reasonId
        const reasonKey = Object.keys(REASON_MAP).find(
            (key) => REASON_MAP[key] === item.reasonId
        );
        
        // 2. If a match is found, set that key to true in our state object
        if (reasonKey) {
            acc[reasonKey] = true;
        }
        
        return acc;
    }, {}) || {},
    reasonOther: data.enrollmentReasons?.[0]?.otherReasonText || "",
    expecting_scholarship: false,
    scholarship_details: "",
    lastName: personalInfo.profile?.lastName || "",
    firstName: personalInfo.profile?.firstName || "",
    middleName: personalInfo.profile?.middleName || "",
    civilStatus: CIVIL_STATUS_MAP[personalInfo.profile?.civilStatusTypeId || 1],
    religion: personalInfo.profile?.religion || "",
    highSchoolAverage: personalInfo.profile?.highSchoolGWA || "",
    course: personalInfo.profile?.course,
    email: personalInfo.profile?.email || "",
    dateOfBirth: formatDateForInput(personalInfo.profile?.birthDate) || "",
    placeOfBirth: personalInfo.profile?.placeOfBirth || "",
    mobileNo: personalInfo.profile?.contactNo || "",
    height: personalInfo.profile?.heightFt?.toString(),
    weight: personalInfo.profile?.weightKg?.toString() || "",
    gender: personalInfo.profile?.genderId?.toString() || "",
    provincialAddressProvince: personalInfo.addresses?.find((a: any) => a.addressType === "Provincial")?.provinceName || "",
    provincialAddressMunicipality: personalInfo.addresses?.find((a: any) => a.addressType === "Provincial")?.cityName || "",
    provincialAddressBarangay: personalInfo.addresses?.find((a: any) => a.addressType === "Provincial")?.barangayName || "",
    provincialAddressRegion: personalInfo.addresses?.find((a: any) => a.addressType === "Provincial")?.regionName || "",
    provincialAddressStreet: personalInfo.addresses?.find((a: any) => a.addressType === "Provincial")?.streetLotBlk || "",
    residentialAddressProvince: personalInfo.addresses?.find((a: any) => a.addressType === "Residential")?.provinceName || "",
    residentialAddressMunicipality: personalInfo.addresses?.find((a: any) => a.addressType === "Residential")?.cityName || "",
    residentialAddressBarangay: personalInfo.addresses?.find((a: any) => a.addressType === "Residential")?.barangayName || "",
    residentialAddressRegion: personalInfo.addresses?.find((a: any) => a.addressType === "Residential")?.regionName || "",
    residentialAddressStreet: personalInfo.addresses?.find((a: any) => a.addressType === "Residential")?.streetLotBlk || "",
    employerName: "",
    emergencyContactName: personalInfo.emergencyContact?.emergencyContactName || "",
    emergencyContactPhone: personalInfo.emergencyContact?.emergencyContactPhone || "",
    emergencyContactRelationship: personalInfo.emergencyContact?.emergencyContactRelationship || "",
    education: {
      elementary: {
        school: education?.find((e: any) => e.educationalLevel === "Elementary")?.schoolName || "",
        location: education?.find((e: any) => e.educationalLevel === "Elementary")?.location || "",
        public: education?.find((e: any) => e.educationalLevel === "Elementary")?.schoolType || "",
        yearGrad: education?.find((e: any) => e.educationalLevel === "Elementary")?.yearCompleted || "",
        awards: education?.find((e: any) => e.educationalLevel === "Elementary")?.awards || "",
      },
      juniorHS: {
        school: education?.find((e: any) => e.educationalLevel === "Junior High School")?.schoolName || "",
        location: education?.find((e: any) => e.educationalLevel === "Junior High School")?.location || "",
        public: education?.find((e: any) => e.educationalLevel === "Junior High School")?.schoolType || "",
        yearGrad: education?.find((e: any) => e.educationalLevel === "Junior High School")?.yearCompleted || "",
        awards: education?.find((e: any) => e.educationalLevel === "Junior High School")?.awards || "",
      },
      seniorHS: {
        school: education?.find((e: any) => e.educationalLevel === "Senior High School")?.schoolName || "",
        location: education?.find((e: any) => e.educationalLevel === "Senior High School")?.location || "",
        public: education?.find((e: any) => e.educationalLevel === "Senior High School")?.schoolType || "",
        yearGrad: education?.find((e: any) => e.educationalLevel === "Senior High School")?.yearCompleted || "",
        awards: education?.find((e: any) => e.educationalLevel === "Senior High School")?.awards || "",
      },
      others: "",
    },
    fatherFirstName: family.parents?.find((p: any) => p.relationship === "Father")?.firstName || "",  
    fatherMiddleName: family.parents?.find((p: any) => p.relationship === "Father")?.middleName || "",
    fatherLastName: family.parents?.find((p: any) => p.relationship === "Father")?.lastName || "",
    fatherEducation: family.parents?.find((p: any) => p.relationship === "Father")?.educationalLevel || "",
    fatherOccupation: family.parents?.find((p: any) => p.relationship === "Father")?.occupation || "",
    fatherCompany: family.parents?.find((p: any) => p.relationship === "Father")?.companyName || "",
    fatherBirthDate: formatDateForInput(family.parents?.find((p: any) => p.relationship === "Father")?.birthDate) || "",
    motherFirstName: family.parents?.find((p: any) => p.relationship === "Mother")?.firstName || "",
    motherMiddleName: family.parents?.find((p: any) => p.relationship === "Mother")?.middleName || "",
    motherLastName: family.parents?.find((p: any) => p.relationship === "Mother")?.lastName || "",
    motherEducation: family.parents?.find((p: any) => p.relationship === "Mother")?.educationalLevel || "",
    motherOccupation: family.parents?.find((p: any) => p.relationship === "Mother")?.occupation || "",
    motherCompany: family.parents?.find((p: any) => p.relationship === "Mother")?.companyName || "",
    motherBirthDate: formatDateForInput(family.parents?.find((p: any) => p.relationship === "Mother")?.birthDate) || "",
    parentalDetails: family.background?.parentalStatusDetails || "",
    guardianName: family.background?.guardianName || "",
    guardianAddress: family.background?.guardianAddress || "",
    parentalStatusID: parseInt(family.background?.parentalStatusID || 1),
    monthlyFamilyIncome: family.background?.monthlyFamilyIncome?.toString() || "",
    monthlyFamilyIncomeOther: "",
    brothers: family.background?.siblingsBrothers?.toString() || "0",
    sisters: family.background?.siblingSisters?.toString() || "0",
    gainfullyEmployed: family.finance?.employedFamilyMembersCount ? "1" : "0",
    supportStudies: family.finance?.supportsStudiesCount ? "1" : "0",
    supportFamily: family.finance?.supportsFamilyCount ? "1" : "0",
    financialSupport: family.finance?.financialSupport || "",
    weeklyAllowance: family.finance?.weeklyAllowance?.toString() || "",
    vision: health?.visionRemark || "",
    hearing: health?.hearingRemark || "",
    mobility: health?.mobilityRemark || "",
    speech: health?.speechRemark || "",
    generalHealth: health?.generalHealthRemark || "",
    consultedWith: health?.consultedProfessional || "",
    consultReason: health?.consultationReason || "",
    whenStarted: health?.dateStarted || "",
    numSessions: health?.numberOfSessions?.toString() || "",
    dateConcluded: health?.dateConcluded || "",
    dateTest: "",
    testAdministered: "",
    rs: "",
    pr: "",
    description: "",
    significantNotesDate: "",
    incident: "",
    remarks: "",
  };
};

export const useStudentForm = () => {
  const { user } = useAuth();
  const [studentRecordId, setStudentRecordId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data with empty values
  const initializeFormData = () => {
    const emptyFormData: FormData = {
      reasonForEnrollment: {},
      reasonOther: "",
      expecting_scholarship: false,
      scholarship_details: "",
      lastName: "",
      firstName: "",
      middleName: "",
      civilStatus: "",
      religion: "",
      highSchoolAverage: "",
      course: "",
      email: "",
      dateOfBirth: "",
      placeOfBirth: "",
      mobileNo: "",
      height: "",
      weight: "",
      gender: "",
      provincialAddressProvince: "",
      provincialAddressMunicipality: "",
      provincialAddressBarangay: "",
      provincialAddressRegion: "",
      provincialAddressStreet: "",
      residentialAddressProvince: "",
      residentialAddressMunicipality: "",
      residentialAddressBarangay: "",
      residentialAddressRegion: "",
      residentialAddressStreet: "",
      employerName: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      education: {
        elementary: {
          school: "",
          location: "",
          public: "",
          yearGrad: "",
          awards: "",
        },
        juniorHS: {
          school: "",
          location: "",
          public: "",
          yearGrad: "",
          awards: "",
        },
        seniorHS: {
          school: "",
          location: "",
          public: "",
          yearGrad: "",
          awards: "",
        },
        others: "",
      },
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherLastName: "",
      fatherEducation: "",
      fatherOccupation: "",
      fatherCompany: "",
      fatherBirthDate: "",
      motherFirstName: "",
      motherMiddleName: "",
      motherLastName: "",
      motherEducation: "",
      motherOccupation: "",
      motherCompany: "",
      motherBirthDate: "",
      parentalStatusID: 1,
      parentalDetails: "",
      guardianName: "",
      guardianAddress: "",
      monthlyFamilyIncome: "",
      monthlyFamilyIncomeOther: "",
      brothers: "0",
      sisters: "0",
      gainfullyEmployed: "0",
      supportStudies: "0",
      supportFamily: "0",
      financialSupport: "",
      weeklyAllowance: "",
      vision: "",
      hearing: "",
      mobility: "",
      speech: "",
      generalHealth: "",
      consultedWith: "",
      consultReason: "",
      whenStarted: "",
      numSessions: "",
      dateConcluded: "",
      dateTest: "",
      testAdministered: "",
      rs: "",
      pr: "",
      description: "",
      significantNotesDate: "",
      incident: "",
      remarks: "",
    };
    setFormData(emptyFormData);
  };

  // Handle input change for form fields
  const handleInputChange = (field: string, value: any) => {
    if (!formData) {
      initializeFormData();
      return;
    }

    // Handle nested fields (e.g., "education.seniorHS.school")
    const keys = field.split(".");
    const newFormData = { ...formData };
    let current: any = newFormData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    setFormData(newFormData);

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  // Set form error messages
  const setFormError = (message: string | null) => {
    setError(message);
  };

  // Clear error for a specific field
  const clearError = (field: string) => {
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const initializeStudentRecord = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const existingRecord = await studentService.getStudentRecord(user.id);
      
      const existingId = existingRecord?.studentRecordID;
      
      if (existingId) {
        setStudentRecordId(existingId);
        return await studentService.getStudentProgress(user.id);
      } else {
        const result = await studentService.createStudentRecord(user.id);
        setStudentRecordId(result.student_record_id);
        initializeFormData();
        return null;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const result = await studentService.createStudentRecord(user.id);
          setStudentRecordId(result.student_record_id);
          initializeFormData();
        } catch (createErr: any) {
          setError(createErr.response?.data?.error || 'Failed to create student record');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to initialize student record');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedFormData = async (): Promise<FormData | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profileData = await studentService.getStudentProgress(user.id);
      if (profileData) {
        const mappedData = mapToFormData(profileData);
        setFormData(mappedData);
        return mappedData;
      }
      initializeFormData();
      return null;
    } catch (err: any) {
      console.error('Error loading saved form data:', err);
      setError(err.response?.data?.error || 'Failed to load saved data');
      initializeFormData();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save current step data to backend
  const saveFormData = async (): Promise<boolean> => {
    if (!studentRecordId || !formData) {
      setError('Student record not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map FormData to appropriate API payloads and save all sections
      await Promise.all([
        studentService.saveBaseProfile(studentRecordId, mapFormDataToBaseProfile(formData)),
        studentService.saveAddressInfo(studentRecordId, mapFormDataToAddresses(formData)),
        studentService.saveEducationInfo(studentRecordId, mapFormDataToEducation(formData)),
        studentService.saveFamilyInfo(studentRecordId, mapFormDataToFamily(formData)),
        studentService.saveHealthInfo(studentRecordId, mapFormDataToHealth(formData)),
      ]);
      return true;
    } catch (err: any) {
      console.error('Error saving form data:', err);
      setError(err.response?.data?.error || 'Failed to save form data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit entire student form
  const submitStudentForm = async (): Promise<{ success: boolean; error?: string }> => {
    if (!studentRecordId) {
      return { success: false, error: 'Student record not initialized' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Save all data one final time before submission
      if (formData) {
        await Promise.all([
          studentService.saveBaseProfile(studentRecordId, mapFormDataToBaseProfile(formData)),
          studentService.saveAddressInfo(studentRecordId, mapFormDataToAddresses(formData)),
          studentService.saveEducationInfo(studentRecordId, mapFormDataToEducation(formData)),
          studentService.saveFamilyInfo(studentRecordId, mapFormDataToFamily(formData)),
          studentService.saveHealthInfo(studentRecordId, mapFormDataToHealth(formData)),
        ]);
      }

      // Complete onboarding
      await studentService.completeOnboarding(studentRecordId);
      return { success: true };
    } catch (err: any) {
      console.error('Error submitting student form:', err);
      const errorMessage = err.response?.data?.error || 'Failed to submit form';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const submitOnboarding = async (): Promise<boolean> => {
    if (!studentRecordId) {
      setError('Student record not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await studentService.completeOnboarding(studentRecordId);
      return true;
    } catch (err: any) {
      console.error('Error submitting onboarding:', err);
      setError(err.response?.data?.error || 'Failed to complete onboarding');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSection = async (section: string, data: any): Promise<boolean> => {
    if (!studentRecordId) {
      setError('Student record not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      switch (section) {
        case 'enrollment':
          await studentService.saveEnrollmentReasons(studentRecordId, data);
          break;
        case 'personal':
          await studentService.saveBaseProfile(studentRecordId, data);
          break;
        case 'family':
          await studentService.saveFamilyInfo(studentRecordId, data);
          break;
        case 'education':
          await studentService.saveEducationInfo(studentRecordId, data);
          break;
        case 'address':
          await studentService.saveAddressInfo(studentRecordId, data);
          break;
        case 'health':
          await studentService.saveHealthInfo(studentRecordId, data);
          break;
        case 'finance':
          await studentService.saveFinanceInfo(studentRecordId, data);
          break;
        default:
          throw new Error('Invalid section');
      }
      return true;
    } catch (err: any) {
      console.error(`Error saving ${section}:`, err);
      setError(err.response?.data?.error || `Failed to save ${section} section`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    user,
    studentRecordId,
    formData: formData || ({} as FormData),
    formErrors,
    isLoading,
    error,
    
    // State setters
    setFormData,
    setFormError,
    
    // Form management
    handleInputChange,
    clearError,
    initializeFormData,
    
    // API operations
    initializeStudentRecord,
    loadSavedFormData,
    saveFormData,
    saveSection,
    submitStudentForm,
    submitOnboarding,
  };
};