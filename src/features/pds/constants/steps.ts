/**
 * PDS Form Steps Configuration
 * Defines all steps in the multi-part form with their order and metadata
 */

export interface PDSStep {
  id: string;
  label: string;
  title: string;
  description: string;
  component: string; // Component name to render
  order: number;
}

export const PDS_STEPS: PDSStep[] = [
  {
    id: "personal-info",
    label: "Personal Information",
    title: "Personal Information",
    description: "Basic personal details and contact information",
    component: "PersonalInformation",
    order: 1,
  },
  {
    id: "address",
    label: "Address",
    title: "Address Information",
    description: "Provincial and residential addresses",
    component: "AddressSelector",
    order: 2,
  },
  {
    id: "education",
    label: "Education",
    title: "Educational Background",
    description: "Elementary through Senior High School education details",
    component: "EducationalBackground",
    order: 3,
  },
  {
    id: "family",
    label: "Family",
    title: "Family Background",
    description: "Family information and financial details",
    component: "FamilyBackground",
    order: 4,
  },
  {
    id: "health",
    label: "Health",
    title: "Health & Wellness",
    description: "Health information and medical consultations",
    component: "HealthWellness",
    order: 5,
  },
  {
    id: "test-results",
    label: "Test Results",
    title: "Test Results",
    description: "Psychological and aptitude test results",
    component: "TestResults",
    order: 6,
  },
  {
    id: "significant-notes",
    label: "Notes",
    title: "Significant Notes",
    description: "Any significant incidents or remarks",
    component: "SignificantNotes",
    order: 7,
  },
];

export const STEP_IDS = {
  PERSONAL_INFO: "personal-info",
  ADDRESS: "address",
  EDUCATION: "education",
  FAMILY: "family",
  HEALTH: "health",
  TEST_RESULTS: "test-results",
  SIGNIFICANT_NOTES: "significant-notes",
} as const;

export const getStepById = (id: string): PDSStep | undefined => {
  return PDS_STEPS.find((step) => step.id === id);
};

export const getStepByOrder = (order: number): PDSStep | undefined => {
  return PDS_STEPS.find((step) => step.order === order);
};

export const getNextStep = (currentId: string): PDSStep | undefined => {
  const current = getStepById(currentId);
  if (!current) return undefined;
  return getStepByOrder(current.order + 1);
};

export const getPreviousStep = (currentId: string): PDSStep | undefined => {
  const current = getStepById(currentId);
  if (!current) return undefined;
  return getStepByOrder(current.order - 1);
};

export const getTotalSteps = (): number => PDS_STEPS.length;

export const isFirstStep = (stepId: string): boolean => {
  const step = getStepById(stepId);
  return step?.order === 1;
};

export const isLastStep = (stepId: string): boolean => {
  const step = getStepById(stepId);
  return step?.order === getTotalSteps();
};

export const getProgressPercentage = (currentStepId: string): number => {
  const step = getStepById(currentStepId);
  if (!step) return 0;
  return Math.round((step.order / getTotalSteps()) * 100);
};

export const getCompletedStepsCount = (
  completedSteps: string[]
): { completed: number; total: number } => {
  return {
    completed: completedSteps.length,
    total: getTotalSteps(),
  };
};
