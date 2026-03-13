import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/features/appointments/services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { QueryParam } from "../types/reqParams";
import { DailyStatusCount } from "../types/calendar";

export const useCalendarStats = ({
  isAdmin,
  params,
}: {
  isAdmin: boolean;
  params: QueryParam;
}) => {
  return useQuery<DailyStatusCount[]>({
    queryKey: [
      ...QUERY_KEYS.appointments.stats,
      isAdmin,
      params.startDate,
    ],
    queryFn: () =>
      appointmentService.GetCalendarStats(params),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
    enabled: isAdmin,
  });
};
