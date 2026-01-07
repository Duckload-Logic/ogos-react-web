import { useState } from 'react';
import { useAuth } from '@/context';
import { studentService } from '@/features/pds/services/service';
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
    dateOfBirth: formatDateForInput(personalInfo.profile?.birthDate) || "2004-01-01",
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
    parentalStatusID: parseInt(family.background?.parentalStatusID || "1"),
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeStudentRecord = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const existingId = await studentService.getStudentRecordId(user.id);
      
      if (existingId) {
        setStudentRecordId(existingId);
        return await studentService.getStudentProgress(user.id);
      } else {
        const result = await studentService.createStudentRecord(user.id);
        setStudentRecordId(result.student_record_id);
        return null;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const result = await studentService.createStudentRecord(user.id);
          setStudentRecordId(result.student_record_id);
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
        return mapToFormData(profileData);
      }
      return null;
    } catch (err: any) {
      console.error('Error loading saved form data:', err);
      setError(err.response?.data?.error || 'Failed to load saved data');
      return null;
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
    user,
    studentRecordId,
    isLoading,
    error,
    initializeStudentRecord,
    loadSavedFormData,
    saveSection,
    submitOnboarding,
  };
};