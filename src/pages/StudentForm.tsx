import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle, Save, AlertTriangle } from "lucide-react";
import { PersonalInformation } from "@/features/pds/components/PersonalInformation";
import { EducationalBackground } from "@/features/pds/components/EducationalBackground";
import { FamilyBackground } from "@/features/pds/components/FamilyBackground";
import { HealthWellness } from "@/features/pds/components/HealthWellness";
import { TestResults } from "@/features/pds/components/TestResults";
import { SignificantNotes } from "@/features/pds/components/SignificantNotes";

interface FormData {
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
  provincialAddressProvince: string;
  provincialAddressMunicipality: string;
  provincialAddressBarangay: string;
  residentialAddressProvince: string;
  residentialAddressMunicipality: string;
  residentialAddressBarangay: string;
  employerName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;

  education: {
    elementary: {
      school: string;
      location: string;
      public: string;
      yearGrad: string;
      awards: string;
    };
    juniorHS: {
      school: string;
      location: string;
      public: string;
      yearGrad: string;
      awards: string;
    };
    seniorHS: {
      school: string;
      location: string;
      public: string;
      yearGrad: string;
      awards: string;
    };
    others: string;
  };

  fatherName: string;
  fatherAge: string;
  fatherEducation: string;
  fatherOccupation: string;
  fatherCompany: string;
  motherName: string;
  motherAge: string;
  motherEducation: string;
  motherOccupation: string;
  motherCompany: string;
  parentalStatus: string;
  parentalDetails: string;
  guardianName: string;
  guardianAddress: string;
  parentsIncome: string;
  parentsIncomeOther: string;
  siblings: string;
  brothers: string;
  sisters: string;
  gainfullyEmployed: string;
  supportStudies: string;
  supportFamily: string;
  financialSupport: string;
  weeklyAllowance: string;

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
  dateTest: string;
  testAdministered: string;
  rs: string;
  pr: string;
  description: string;
  significantNotesDate: string;
  incident: string;
  remarks: string;
}

interface FormErrors {
  [key: string]: string;
}

const REASONS_OPTIONS = [
  "Lower tuition fee",
  "Safety of the place",
  "Spacious Campus",
  "Nearness of home to school",
  "Accessible to transportation",
  "Better quality of education",
  "Adequate School Facilities",
  "Son / Daughter of PUP Employee",
  "Closer Student-Faculty Relations",
];

const EMPTY_FORM: FormData = {
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
  residentialAddressProvince: "",
  residentialAddressMunicipality: "",
  residentialAddressBarangay: "",
  employerName: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  relationship: "",
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
  fatherName: "",
  fatherAge: "",
  fatherEducation: "",
  fatherOccupation: "",
  fatherCompany: "",
  motherName: "",
  motherAge: "",
  motherEducation: "",
  motherOccupation: "",
  motherCompany: "",
  parentalStatus: "",
  parentalDetails: "",
  guardianName: "",
  guardianAddress: "",
  parentsIncome: "",
  parentsIncomeOther: "",
  siblings: "",
  brothers: "",
  sisters: "",
  gainfullyEmployed: "",
  supportStudies: "",
  supportFamily: "",
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

const sections = [
  { title: "Reason for Enrollment", id: 0 },
  { title: "I. Personal Information", id: 1 },
  { title: "II. Educational Background", id: 2 },
  { title: "III. Family Background", id: 3 },
  { title: "IV. Health", id: 4 },
];

export default function StudentForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saving" | "saved" | "idle"
  >("idle");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [isMobileNav, setIsMobileNav] = useState(window.innerWidth < 1024);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearSuccess, setShowClearSuccess] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [validationErrorList, setValidationErrorList] = useState<string[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  // Auto-close validation error after 3 seconds
  useEffect(() => {
    if (showValidationError) {
      const timer = setTimeout(() => {
        setShowValidationError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showValidationError]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    return phone.length >= 7 && phoneRegex.test(phone);
  };

  const validateNumber = (
    value: string,
    min?: number,
    max?: number,
  ): boolean => {
    if (value === "") return true;
    const num = parseInt(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  };

  const validateYear = (year: string): boolean => {
    if (year === "") return true;
    const y = parseInt(year);
    const currentYear = new Date().getFullYear();
    return !isNaN(y) && y >= 1950 && y <= currentYear + 1;
  };

  const validateDate = (date: string): boolean => {
    if (date === "") return true;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const validateHeight = (height: string): boolean => {
    if (height === "") return true;
    const h = parseFloat(height);
    return !isNaN(h) && h >= 3 && h <= 8;
  };

  const validateWeight = (weight: string): boolean => {
    if (weight === "") return true;
    const w = parseInt(weight);
    return !isNaN(w) && w >= 20 && w <= 300;
  };

  const validateGrade = (grade: string): boolean => {
    if (grade === "") return true;
    const g = parseFloat(grade);
    return !isNaN(g) && g >= 0 && g <= 100;
  };

  const validateRequired = (value: string | boolean): boolean => {
    if (typeof value === "boolean") return true;
    return value.trim().length > 0;
  };

  const validateAge = (age: string): boolean => {
    return validateNumber(age, 10, 100);
  };

  const validateNonNegative = (value: string): boolean => {
    if (value === "") return true;
    const num = parseInt(value);
    if (isNaN(num)) return false;
    return num >= 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setError = (field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const validateEducationFields = (): boolean => {
    const errors: FormErrors = {};

    [
      { key: "elementary", label: "Elementary" },
      { key: "juniorHS", label: "Junior HS" },
      { key: "seniorHS", label: "Senior HS" },
    ].forEach((level) => {
      const levelData =
        formData.education[level.key as keyof typeof formData.education];
      if (typeof levelData === 'object' && levelData !== null) {
        if (
          (levelData as any).school ||
          (levelData as any).location ||
          (levelData as any).public ||
          (levelData as any).yearGrad
        ) {
          if (!(levelData as any).school)
            errors[`${level.key}_school`] = "School name is required";
          if (!(levelData as any).location)
            errors[`${level.key}_location`] = "Location is required";
          if (!(levelData as any).public)
            errors[`${level.key}_public`] = "Public/Private is required";
          if (!(levelData as any).yearGrad)
            errors[`${level.key}_yearGrad`] = "Year graduated is required";
          if ((levelData as any).yearGrad && !validateYear((levelData as any).yearGrad)) {
            errors[`${level.key}_yearGrad`] = "Invalid year";
          }
        }
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFamilyFields = (): boolean => {
    const errors: FormErrors = {};

    if (formData.fatherAge && !validateAge(formData.fatherAge)) {
      errors.fatherAge = "Father's age must be between 10 and 100";
    }
    if (formData.motherAge && !validateAge(formData.motherAge)) {
      errors.motherAge = "Mother's age must be between 10 and 100";
    }
    if (formData.siblings && !validateNonNegative(formData.siblings)) {
      errors.siblings = "Siblings count cannot be negative";
    }
    if (formData.brothers && !validateNonNegative(formData.brothers)) {
      errors.brothers = "Brothers count cannot be negative";
    }
    if (formData.sisters && !validateNonNegative(formData.sisters)) {
      errors.sisters = "Sisters count cannot be negative";
    }
    if (
      formData.gainfullyEmployed &&
      !validateNonNegative(formData.gainfullyEmployed)
    ) {
      errors.gainfullyEmployed = "Count cannot be negative";
    }
    if (
      formData.supportStudies &&
      !validateNonNegative(formData.supportStudies)
    ) {
      errors.supportStudies = "Count cannot be negative";
    }
    if (
      formData.supportFamily &&
      !validateNonNegative(formData.supportFamily)
    ) {
      errors.supportFamily = "Count cannot be negative";
    }

    setErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validatePersonalFields = (): boolean => {
    const errors: FormErrors = {};

    // Only validate truly required fields
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.mobileNo.trim()) {
      errors.mobileNo = "Mobile number is required";
    } else if (!validatePhone(formData.mobileNo)) {
      errors.mobileNo = "Invalid phone number";
    }

    setErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("studentFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, []);

  // Auto-save on data change
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        setAutoSaveStatus("saving");
        localStorage.setItem("studentFormData", JSON.stringify(formData));
        setAutoSaveStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());

        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [formData]);

  // Handle window resize for responsive navigation
  useEffect(() => {
    const handleResize = () => {
      setIsMobileNav(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate section completion
  const calculateSectionCompletion = (sectionIndex: number): number => {
    const getFilledFields = (obj: any): number => {
      if (!obj) return 0;
      return Object.values(obj).filter((val) => {
        if (typeof val === "string") return val.length > 0;
        if (typeof val === "boolean") return true;
        if (typeof val === "number") return val !== 0;
        if (typeof val === "object" && val !== null)
          return getFilledFields(val) > 0;
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
        reasonForEnrollment: Object.values(formData.reasonForEnrollment).some(
          (v) => v,
        )
          ? 1
          : 0,
      };
      filledCount = Object.values(enrollmentFields).filter(
        (v) => v === 1,
      ).length;
      totalCount = 1;
    } else if (sectionIndex === 1) {
      const personalFields = {
        lastName: formData.lastName ? 1 : 0,
        firstName: formData.firstName ? 1 : 0,
        email: formData.email ? 1 : 0,
        mobileNo: formData.mobileNo ? 1 : 0,
        dateOfBirth: formData.dateOfBirth ? 1 : 0,
        course: formData.course ? 1 : 0,
      };
      filledCount = Object.values(personalFields).filter((v) => v === 1).length;
      totalCount = 6;
    } else if (sectionIndex === 2) {
      // For education: All three levels (Elementary, Junior HS, Senior HS) must be completely filled
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

      // Section is complete only if ALL 3 levels are fully filled
      filledCount =
        completedLevels === 3
          ? 100
          : completedLevels > 0
            ? Math.round((completedLevels / 3) * 100)
            : 0;
      totalCount = 100;
    } else if (sectionIndex === 3) {
      const familyFields = {
        fatherName: formData.fatherName ? 1 : 0,
        motherName: formData.motherName ? 1 : 0,
        siblings: formData.siblings ? 1 : 0,
        parentsIncome: formData.parentsIncome ? 1 : 0,
      };
      filledCount = Object.values(familyFields).filter((v) => v === 1).length;
      totalCount = 4;
    } else if (sectionIndex === 4) {
      const healthFields = {
        vision: formData.vision ? 1 : 0,
        hearing: formData.hearing ? 1 : 0,
        mobility: formData.mobility ? 1 : 0,
        speech: formData.speech ? 1 : 0,
        generalHealth: formData.generalHealth ? 1 : 0,
      };
      filledCount = Object.values(healthFields).filter((v) => v === 1).length;
      totalCount = 5;
    }

    return totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
  };

  const getOverallCompletion = (): number => {
    let totalPercentage = 0;
    for (let i = 0; i < sections.length; i++) {
      totalPercentage += calculateSectionCompletion(i);
    }
    return Math.round(totalPercentage / sections.length);
  };

  const getSectionStatus = (sectionIndex: number) => {
    const percentage = calculateSectionCompletion(sectionIndex);
    if (percentage === 100) return "complete";
    if (percentage > 0) return "partial";
    return "empty";
  };

  const handleInputChange = (
    field: string,
    value: string | boolean,
    section?: string,
  ) => {
    if (section && section !== "others") {
      // Handle nested education fields (elementary, juniorHS, seniorHS)
      setFormData((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          [section]: {
            ...(prev.education[section as keyof typeof prev.education] as Record<string, string>),
            [field]: value,
          },
        },
      }));
    } else if (section === "others") {
      // Handle education.others which is a string, not a nested object
      setFormData((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          others: value as string,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    clearError(field);
  };

  const handleReasonChange = (reason: string) => {
    setFormData((prev) => ({
      ...prev,
      reasonForEnrollment: {
        ...prev.reasonForEnrollment,
        [reason]:
          !prev.reasonForEnrollment[
            reason as keyof typeof prev.reasonForEnrollment
          ],
      },
    }));
  };

  const buildDetailedErrorMessage = (
    personalValid: boolean,
    educationValid: boolean,
    familyValid: boolean,
  ): string[] => {
    const errorList: string[] = [];

    if (!personalValid) {
      if (!formData.firstName.trim())
        errorList.push("Personal Information: First name is required");
      if (!formData.email.trim())
        errorList.push("Personal Information: Email is required");
      else if (!validateEmail(formData.email))
        errorList.push("Personal Information: Invalid email format");
    }

    if (!educationValid) {
      [
        { key: "elementary", label: "Elementary" },
        { key: "juniorHS", label: "Junior HS" },
        { key: "seniorHS", label: "Senior HS" },
      ].forEach((level) => {
        const levelData =
          formData.education[level.key as keyof typeof formData.education];
        if (typeof levelData === "object" && levelData !== null) {
          if (
            (levelData as any).school ||
            (levelData as any).location ||
            (levelData as any).public ||
            (levelData as any).yearGrad
          ) {
            if (!(levelData as any).school)
              errorList.push(`Education: ${level.label} - School name required`);
            if (!(levelData as any).location)
              errorList.push(`Education: ${level.label} - Location required`);
            if (!(levelData as any).public)
              errorList.push(
                `Education: ${level.label} - Public/Private required`,
              );
            if (!(levelData as any).yearGrad)
              errorList.push(
                `Education: ${level.label} - Year graduated required`,
              );
            if (
              (levelData as any).yearGrad &&
              !validateYear((levelData as any).yearGrad)
            )
              errorList.push(`Education: ${level.label} - Invalid year`);
          }
        }
      });
    }

    if (!familyValid) {
      if (formData.fatherAge && !validateAge(formData.fatherAge))
        errorList.push("Family: Father's age must be between 10 and 100");
      if (formData.motherAge && !validateAge(formData.motherAge))
        errorList.push("Family: Mother's age must be between 10 and 100");
      if (formData.siblings && !validateNonNegative(formData.siblings))
        errorList.push("Family: Siblings count cannot be negative");
      if (formData.brothers && !validateNonNegative(formData.brothers))
        errorList.push("Family: Brothers count cannot be negative");
      if (formData.sisters && !validateNonNegative(formData.sisters))
        errorList.push("Family: Sisters count cannot be negative");
    }

    return errorList;
  };

  const buildIncompleteSection = (): string[] => {
    const incompleteSections: string[] = [];

    for (let i = 0; i < 5; i++) {
      const completion = calculateSectionCompletion(i);
      if (completion < 100) {
        incompleteSections.push(
          `${sections[i].title}: ${completion}% complete`,
        );
      }
    }

    return incompleteSections;
  };

  const buildMissingFieldsMessage = (): string[] => {
    const missingList: string[] = [];

    // Section 0: Reason for Enrollment
    const hasReason = Object.values(formData.reasonForEnrollment).some((v) => v);
    if (!hasReason) {
      missingList.push("Reason for Enrollment: Please select at least one reason");
    }

    // Section 1: Personal Information
    const personalMissing: string[] = [];
    if (!formData.firstName.trim()) personalMissing.push("First Name");
    if (!formData.lastName.trim()) personalMissing.push("Last Name");
    if (!formData.email.trim()) personalMissing.push("Email");
    if (!formData.dateOfBirth) personalMissing.push("Date of Birth");
    if (!formData.gender) personalMissing.push("Gender");
    if (!formData.mobileNo.trim()) personalMissing.push("Mobile Number");
    if (personalMissing.length > 0) {
      missingList.push(`Personal Information: ${personalMissing.join(", ")}`);
    }

    // Section 2: Educational Background
    const educationMissing: string[] = [];
    const levels = [
      { key: "elementary", label: "Elementary" },
      { key: "juniorHS", label: "Junior HS" },
      { key: "seniorHS", label: "Senior HS" },
    ];
    let hasAnyEducation = false;
    levels.forEach((level) => {
      const levelData =
        formData.education[level.key as keyof typeof formData.education];
      if (typeof levelData === "object" && levelData !== null) {
        if (
          (levelData as any).school ||
          (levelData as any).location ||
          (levelData as any).public ||
          (levelData as any).yearGrad
        ) {
          hasAnyEducation = true;
          if (!(levelData as any).school)
            educationMissing.push(`${level.label}: School`);
          if (!(levelData as any).location)
            educationMissing.push(`${level.label}: Location`);
          if (!(levelData as any).public)
            educationMissing.push(`${level.label}: Public/Private`);
          if (!(levelData as any).yearGrad)
            educationMissing.push(`${level.label}: Year Graduated`);
        }
      }
    });
    if (!hasAnyEducation) {
      missingList.push("Educational Background: Please fill in at least one education level");
    } else if (educationMissing.length > 0) {
      missingList.push(`Educational Background: ${educationMissing.join(", ")}`);
    }

    // Section 3: Family Background
    const familyMissing: string[] = [];
    if (!formData.fatherName.trim()) familyMissing.push("Father's Name");
    if (!formData.motherName.trim()) familyMissing.push("Mother's Name");
    if (familyMissing.length > 0) {
      missingList.push(`Family Background: ${familyMissing.join(", ")}`);
    }

    // Section 4: Health
    const healthMissing: string[] = [];
    if (!formData.vision) healthMissing.push("Vision");
    if (!formData.hearing) healthMissing.push("Hearing");
    if (!formData.mobility) healthMissing.push("Mobility");
    if (!formData.speech) healthMissing.push("Speech");
    if (!formData.generalHealth) healthMissing.push("General Health");
    if (healthMissing.length > 0) {
      missingList.push(`Health: ${healthMissing.join(", ")}`);
    }

    return missingList;
  };

  const handleSubmit = () => {
    // Check completion first - if form is incomplete, show which sections are missing
    if (overallCompletion < 100) {
      const incompleteSections = buildIncompleteSection();
      setValidationError(
        `Please complete the following sections:`,
      );
      setValidationErrorList(incompleteSections);
      setShowValidationError(true);
      return;
    }

    // Only run detailed validations if form is 100% complete
    const personalValid = validatePersonalFields();
    const educationValid = validateEducationFields();
    const familyValid = validateFamilyFields();

    if (!personalValid || !educationValid || !familyValid) {
      const errorList = buildDetailedErrorMessage(
        personalValid,
        educationValid,
        familyValid,
      );
      setErrors((prev) => ({
        ...prev,
        submitError: "Please fix all errors before submitting the form.",
      }));
      setValidationError("Please fix the following errors before submitting:");
      setValidationErrorList(errorList);
      setShowValidationError(true);
      return;
    }

    // Show confirmation modal
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    setShowSuccessPopup(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    localStorage.removeItem("studentFormData");
    setFormData(EMPTY_FORM);
    setCurrentSection(0);
  };


  const isSectionEmpty = (): boolean => {
    if (currentSection === 0) {
      return Object.values(formData.reasonForEnrollment).every(v => !v) && !formData.reasonOther;
    } else if (currentSection === 1) {
      return !formData.lastName && !formData.firstName && !formData.middleName && 
             !formData.civilStatus && !formData.religion && !formData.highSchoolAverage &&
             !formData.course && !formData.email && !formData.dateOfBirth && !formData.placeOfBirth &&
             !formData.mobileNo && !formData.height && !formData.weight && !formData.gender;
    } else if (currentSection === 2) {
      const education = formData.education;
      return !education.elementary.school && !education.elementary.location &&
             !education.juniorHS.school && !education.juniorHS.location &&
             !education.seniorHS.school && !education.seniorHS.location && !education.others;
    } else if (currentSection === 3) {
      return !formData.fatherName && !formData.motherName && !formData.guardianName &&
             !formData.siblings && !formData.parentsIncome && !formData.financialSupport;
    } else if (currentSection === 4) {
      return !formData.vision && !formData.hearing && !formData.mobility && !formData.speech &&
             !formData.generalHealth && !formData.consultedWith && !formData.dateTest && !formData.rs && !formData.pr;
    }
    return true;
  };

  const handleClearForm = () => {
    if (isSectionEmpty()) {
      setValidationError("Nothing to Clear - There is no data in this section to clear.");
      setShowValidationError(true);
      return;
    }
    setShowClearConfirm(true);
  };

  const confirmClearForm = () => {
    setShowClearConfirm(false);
    
    // Clear only current section data
    
    if (currentSection === 0) {
      // Clear Reason for Enrollment section
      setFormData(prev => ({
        ...prev,
        reasonForEnrollment: {},
        reasonOther: "",
        expecting_scholarship: false,
        scholarship_details: "",
      }));
    } else if (currentSection === 1) {
      // Clear Personal Information section
      setFormData(prev => ({
        ...prev,
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
        residentialAddressProvince: "",
        residentialAddressMunicipality: "",
        residentialAddressBarangay: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        relationship: "",
      }));
    } else if (currentSection === 2) {
      // Clear Educational Background section
      setFormData(prev => ({
        ...prev,
        education: {
          elementary: { school: "", location: "", public: "", yearGrad: "", awards: "" },
          juniorHS: { school: "", location: "", public: "", yearGrad: "", awards: "" },
          seniorHS: { school: "", location: "", public: "", yearGrad: "", awards: "" },
          others: "",
        },
      }));
    } else if (currentSection === 3) {
      // Clear Family Background section
      setFormData(prev => ({
        ...prev,
        fatherName: "",
        fatherAge: "",
        fatherEducation: "",
        fatherOccupation: "",
        fatherCompany: "",
        motherName: "",
        motherAge: "",
        motherEducation: "",
        motherOccupation: "",
        motherCompany: "",
        parentalStatus: "",
        parentalDetails: "",
        guardianName: "",
        guardianAddress: "",
        parentsIncome: "",
        siblings: "",
        brothers: "",
        sisters: "",
        gainfullyEmployed: "",
        supportStudies: "",
        supportFamily: "",
        financialSupport: "",
        weeklyAllowance: "",
      }));
    } else if (currentSection === 4) {
      // Clear Health & Wellness section
      setFormData(prev => ({
        ...prev,
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
      }));
    }
    
    // Show success popup
    setShowClearSuccess(true);
  };

  const handleClearSuccessClose = () => {
    setShowClearSuccess(false);
  };

  const overallCompletion = getOverallCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Individual Inventory Record Form
          </h1>
          <p className="text-base md:text-lg mt-2 opacity-90">
            Complete your student profile information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* URGENT: PDS Completion Alert Banner */}
        <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-yellow-800 mb-1">
                Important: Complete Your Personal Data Sheet
              </h3>
              <p className="text-yellow-700 text-sm sm:text-base">
                You must complete this form to access all guidance services. Your information helps us provide better support and counseling.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 shadow-sm mb-6 sm:mb-8 bg-white">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Overall Completion
                </h3>
                <span className="text-lg font-bold text-primary">
                  {overallCompletion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${overallCompletion}%` }}
                />
              </div>
            </div>

            {/* Auto-save Status */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {autoSaveStatus === "saving" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span>Saving...</span>
                  </div>
                )}
                {autoSaveStatus === "saved" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Save className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                )}
                {lastSaved && (
                  <span className="text-gray-500">Last saved: {lastSaved}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout: Desktop Side Navigation + Mobile Top Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Side Navigation */}
          {!isMobileNav && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm uppercase text-gray-600 px-2 mb-3">
                  Form Sections
                </h3>
                {sections.map((section, idx) => {
                  const status = getSectionStatus(idx);
                  const percentage = calculateSectionCompletion(idx);
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        currentSection === idx
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm">{section.title}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              currentSection === idx
                                ? "bg-primary-foreground"
                                : status === "complete"
                                  ? "bg-green-500"
                                  : status === "partial"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      {status === "complete" && (
                        <Check className="w-5 h-5 ml-2 flex-shrink-0" />
                      )}
                      {status === "partial" && (
                        <AlertCircle className="w-5 h-5 ml-2 flex-shrink-0 text-yellow-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Top Navigation + Form Content */}
          <div className={`${isMobileNav ? "col-span-1" : "lg:col-span-3"}`}>
            {/* Mobile Top Tabs */}
            {isMobileNav && (
              <div className="mb-6 flex overflow-x-auto gap-2 pb-3 -mx-4 px-4">
                {sections.map((section, idx) => {
                  const status = getSectionStatus(idx);
                  const percentage = calculateSectionCompletion(idx);
                  return (
                    <div
                      key={section.id}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors flex flex-col items-center gap-1 min-w-fit ${
                        currentSection === idx
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <span className="whitespace-nowrap">{idx + 1}</span>
                      <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            currentSection === idx
                              ? "bg-primary-foreground"
                              : status === "complete"
                                ? "bg-green-500"
                                : status === "partial"
                                  ? "bg-yellow-500"
                                  : "bg-gray-300"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {status === "complete" && <Check className="w-3 h-3" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Form Content Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg md:text-xl">
                    {sections[currentSection].title}
                  </CardTitle>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-3 py-1.5 rounded-full w-fit">
                    {calculateSectionCompletion(currentSection)}% Complete
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Section 0: Reason for Enrollment */}
                {currentSection === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-primary">
                        Your reason/s for enrolling in this University:
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {REASONS_OPTIONS.map((reason) => (
                          <label
                            key={reason}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                formData.reasonForEnrollment[reason] || false
                              }
                              onChange={() => handleReasonChange(reason)}
                              className="w-5 h-5 rounded border-gray-300 text-primary"
                            />
                            <span className="text-gray-700">{reason}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">
                        Others:{" "}
                        <span className="text-sm font-normal">
                          (Please specify)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.reasonOther}
                        onChange={(e) =>
                          handleInputChange("reasonOther", e.target.value)
                        }
                        placeholder="Please specify"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.expecting_scholarship}
                          onChange={(e) =>
                            handleInputChange(
                              "expecting_scholarship",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded border-gray-300 text-primary"
                        />
                        <span className="font-semibold text-gray-700">
                          Expecting Scholarship Offer
                        </span>
                        <span className={`text-sm font-medium ${
                          formData.expecting_scholarship
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                          {formData.expecting_scholarship ? "Yes" : "No"}
                        </span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2 ml-8">
                        (Optional - this does not affect your progress)
                      </p>
                    </div>
                  </div>
                )}

                {/* Section 1: Personal Information */}
                {currentSection === 1 && (
                  <PersonalInformation
                    formData={formData}
                    handleInputChange={handleInputChange}
                    clearError={clearError}
                  />
                )}

                {/* REPLACED: This section is now in PersonalInformation component */}

                {/* Section 2: Educational Background */}
                {currentSection === 2 && (
                  <EducationalBackground
                    formData={formData}
                    handleInputChange={handleInputChange}
                    clearError={clearError}
                  />
                )}

                {/* REPLACED: This section is now in EducationalBackground component */}

                {/* Section 3: Family Background */}
                {currentSection === 3 && (
                  <FamilyBackground
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    clearError={clearError}
                  />
                )}

                {/* REPLACED: This section is now in FamilyBackground component */}

                {/* Section 4: Health & Wellness */}
                {currentSection === 4 && (
                  <HealthWellness
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}

                {/* REPLACED: This section is now in HealthWellness component */}

                {/* Section 5: Test Results */}
                {currentSection === 5 && (
                  <TestResults
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}

                {/* Section 6: Significant Notes */}
                {currentSection === 6 && (
                  <SignificantNotes
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}
              </CardContent>
            </Card>

            {/* Form Navigation Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              {currentSection > 0 && (
                <button
                  onClick={() =>
                    setCurrentSection(Math.max(0, currentSection - 1))
                  }
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleClearForm}
                className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                  isSectionEmpty()
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-600 border border-gray-300"
                    : "bg-red-50 hover:bg-red-100 border border-red-300 text-red-700"
                }`}
              >
                Clear Section
              </button>
              {currentSection < sections.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentSection(
                      Math.min(sections.length - 1, currentSection + 1),
                    )
                  }
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-3"
                >
                  Submit Form
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
              <CardTitle className="text-lg">Clear Section Data?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to clear all data in this section ({sections[currentSection].title})?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowClearConfirm(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmClearForm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Clear Success Modal */}
      {showClearSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="w-6 h-6" />
                Section Cleared Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-6">
                All data in the "{sections[currentSection].title}" section has been cleared.
              </p>
              <Button
                onClick={handleClearSuccessClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Done
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
              <CardTitle className="text-lg">Submit Form?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to submit this form? Once submitted, your data will be saved and you can view it in your profile.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSubmit}
                  className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
                >
                  Submit Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="w-6 h-6" />
                Form Submitted Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-2">
                Your Personal Data Sheet has been successfully submitted.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Your data is now saved in your profile and can be viewed at any time. Thank you for completing the form.
              </p>
              <Button
                onClick={handleSuccessClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Done
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Error Modal Popup */}
      {showValidationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-red-600 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Unable to Submit</h3>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-4">
              <p className="text-gray-700 font-semibold mb-4">
                {validationError || "Please fix the following errors:"}
              </p>
              
              {/* Error List */}
              {validationErrorList.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {validationErrorList.map((error, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-600 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                      <span className="text-gray-700 text-sm">{error}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowValidationError(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
