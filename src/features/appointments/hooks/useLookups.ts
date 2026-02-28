import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services";

const APPOINTMENT_LOOKUPS_QUERY_KEY = "appointment-lookups";
const APPOINTMENT_LOOKUPS_STALE_TIME = 60 * 60 * 1000; // 1 hour
const APPOINTMENT_LOOKUPS_GC_TIME = 2 * 60 * 60 * 1000; // 2 hours

export const useAvailableSlots = (date: Date | undefined) => {
  return useQuery({
    queryKey: ["available-slots", date],
    queryFn: () => appointmentService.getAvailableSlots(date!),
    enabled: !!date, // Only fetch when date is selected
    staleTime: APPOINTMENT_LOOKUPS_STALE_TIME,
    gcTime: APPOINTMENT_LOOKUPS_GC_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["appointment-categories"],
    queryFn: () => appointmentService.getCategories(),
    staleTime: APPOINTMENT_LOOKUPS_STALE_TIME,
    gcTime: APPOINTMENT_LOOKUPS_GC_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useStatuses = () => {
  return useQuery({
    queryKey: ["appointment-statuses"],
    queryFn: () => appointmentService.getStatuses(),
    staleTime: APPOINTMENT_LOOKUPS_STALE_TIME,
    gcTime: APPOINTMENT_LOOKUPS_GC_TIME,
    refetchOnWindowFocus: false,
  });
};
