import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";

const RESOURCE_TYPES = {
  COURSES: "courses",
  GENDERS: "genders",
  RELIGIONS: "religions",
  PARENTAL_STATUS_TYPES: "parentalStatusTypes",
  ENROLLMENT_REASONS: "enrollmentReasons",
  INCOME_RANGES: "incomeRanges",
  STUDENT_SUPPORT_TYPES: "studentSupportTypes",
  SIBLING_SUPPORT_TYPES: "siblingSupportTypes",
  CIVIL_STATUSES: "civilStatuses",
  NATURE_OF_RESIDENCE_TYPES: "natureOfResidenceTypes",
  STUDENT_RELATIONSHIP_TYPES: "studentRelationshipTypes",
} as const;

const DEFAULT_LOOKUP_QUERY_KEY = "defaultLookup";
const DEFAULT_LOOKUP_STALE_TIME = 1000 * 60 * 60; // 1 hour
const DEFAULT_LOOKUP_GC_TIME = 1000 * 60 * 60 * 24; // 24 hours

export function useCourses() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.COURSES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.COURSES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useGenders() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.GENDERS],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.GENDERS);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}
export function useCivilStatuses() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.CIVIL_STATUSES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.CIVIL_STATUSES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useReligions() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.RELIGIONS],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.RELIGIONS);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useParentalStatusTypes() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.PARENTAL_STATUS_TYPES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.PARENTAL_STATUS_TYPES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useEnrollmentReasons() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.ENROLLMENT_REASONS],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.ENROLLMENT_REASONS);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useIncomeRanges() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.INCOME_RANGES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.INCOME_RANGES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useStudentSupportTypes() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.STUDENT_SUPPORT_TYPES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.STUDENT_SUPPORT_TYPES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useSiblingSupportTypes() {
  return useQuery({
    queryKey: [DEFAULT_LOOKUP_QUERY_KEY, RESOURCE_TYPES.SIBLING_SUPPORT_TYPES],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.SIBLING_SUPPORT_TYPES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useStudentRelationshipTypes() {
  return useQuery({
    queryKey: [
      DEFAULT_LOOKUP_QUERY_KEY,
      RESOURCE_TYPES.STUDENT_RELATIONSHIP_TYPES,
    ],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.STUDENT_RELATIONSHIP_TYPES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}

export function useNatureOfResidenceTypes() {
  return useQuery({
    queryKey: [
      DEFAULT_LOOKUP_QUERY_KEY,
      RESOURCE_TYPES.NATURE_OF_RESIDENCE_TYPES,
    ],
    queryFn: async () => {
      return iirService.getIIRLookup(RESOURCE_TYPES.NATURE_OF_RESIDENCE_TYPES);
    },
    staleTime: DEFAULT_LOOKUP_STALE_TIME,
    gcTime: DEFAULT_LOOKUP_GC_TIME,
  });
}
