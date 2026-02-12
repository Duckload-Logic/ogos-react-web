/**
 * Section Completion Utilities
 * Calculates completion percentages and status for form sections
 */

import { FormData } from '@/types';

type SectionStatus = 'complete' | 'partial' | 'empty';

/**
 * Calculate completion percentage for a specific section
 */
export const calculateSectionCompletion = (sectionIndex: number, formData: FormData): number => {
  const getFilledFields = (obj: any): number => {
    if (!obj) return 0;
    return Object.values(obj).filter((val) => {
      if (typeof val === "string") return val.length > 0;
      if (typeof val === "boolean") return true;
      if (typeof val === "number") return val !== 0;
      if (typeof val === "object" && val !== null) return getFilledFields(val) > 0;
      return false;
    }).length;
  };

  const getTotalFields = (obj: any): number => {
    if (!obj) return 1;
    return Object.values(obj).reduce((count: number, val: unknown): number => {
      if (typeof val === "object" && val !== null) {
        return count + getTotalFields(val);
      }
      return count + 1;
    }, 0) as number;
  };

  let filledCount: number = 0;
  let totalCount: number = 0;

  if (sectionIndex === 0) {
    const enrollmentFields = {
      reasonForEnrollment: Object.values(formData.reasonForEnrollment).some((v) => v) ? 1 : 0,
      reasonOther: formData.reasonOther ? 1 : 0,
    };
    filledCount = Object.values(enrollmentFields).filter((v) => v === 1).length;
    totalCount = enrollmentFields.reasonForEnrollment + enrollmentFields.reasonOther;
  } else if (sectionIndex === 1) {
    const personalFields = {
      mobileNo: formData.mobileNo ? 1 : 0,
      dateOfBirth: formData.dateOfBirth ? 1 : 0,
      course: formData.course ? 1 : 0,
    };
    filledCount = Object.values(personalFields).filter((v) => v === 1).length;
    totalCount = 3;
  } else if (sectionIndex === 2) {
    let completedLevels = 0;
    const requiredFields = ["school", "location", "public", "yearGrad"];

    [
      formData.education.elementary,
      formData.education.juniorHS,
      formData.education.seniorHS,
    ].forEach((level) => {
      const isLevelComplete = requiredFields.every(
        (field) =>
          level[field as keyof typeof level] &&
          String(level[field as keyof typeof level]).trim().length > 0,
      );
      if (isLevelComplete) {
        completedLevels++;
      }
    });

    filledCount = completedLevels === 3 ? 100 : completedLevels > 0 ? Math.round((completedLevels / 3) * 100) : 0;
    totalCount = 100;
  } else if (sectionIndex === 3) {
    const familyFields = {
      fatherFirstName: formData.fatherFirstName ? 1 : 0,
      motherFirstName: formData.motherFirstName ? 1 : 0,
      brothers: formData.brothers ? 1 : 0,
      sisters: formData.sisters ? 1 : 0,
    };
    filledCount = Object.values(familyFields).filter((v) => v === 1).length;
    totalCount = 4;
  } else if (sectionIndex === 4) {
    const healthFields = {
      vision: formData.vision ? 1 : 0,
      hearing: formData.hearing ? 1 : 0,
      generalHealth: formData.generalHealth ? 1 : 0,
    };
    filledCount = Object.values(healthFields).filter((v) => v === 1).length;
    totalCount = 3;
  }

  return totalCount === 0 ? 0 : Math.round((filledCount / totalCount) * 100);
};

/**
 * Get status badge for a section based on completion percentage
 */
export const getSectionStatus = (percentage: number): SectionStatus => {
  if (percentage === 100) return 'complete';
  if (percentage > 0) return 'partial';
  return 'empty';
};

/**
 * Calculate overall completion across all sections
 */
export const getOverallCompletion = (formData: FormData, totalSections: number): number => {
  let totalCompletion = 0;
  
  for (let i = 0; i < totalSections; i++) {
    totalCompletion += calculateSectionCompletion(i, formData);
  }
  
  return Math.round(totalCompletion / totalSections);
};
