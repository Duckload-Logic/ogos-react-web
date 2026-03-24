/**
 * IIR Form utilities
 * Exports transformation, validation, and helper functions
 */

export { transformFormToDTO } from './transform';
export { iirFormSchema, type IIRFormData } from './validation';
export {
  updateNestedField,
  countFilledField,
  getOverallCompletion,
  getSectionStatus,
  createResetFormData,
  initializeFormData,
} from './formHelpers';
export { calculateSectionCompletion } from './completion';
export {
  validateAllSections,
  validateSection,
  type SectionValidationResult,
  type ValidationSummary,
} from './validationHelpers';
