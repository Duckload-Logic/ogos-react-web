import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services";
import { QueryParam } from "../types/reqParams";
import { DailyStatusCount } from "../types/calendar";

const CALENDAR_QUERY_KEY = "calendar-stats";
const CALENDAR_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CALENDAR_GC_TIME = 30 * 60 * 1000; // 30 minutes

export const useCalendarStats = ({
  isAdmin,
  params,
}: {
  isAdmin: boolean;
  params: QueryParam;
}) => {
  return useQuery<DailyStatusCount[]>({
    queryKey: [CALENDAR_QUERY_KEY, isAdmin, params.startDate],
    queryFn: () => appointmentService.getCalendarStats(params),
    staleTime: CALENDAR_STALE_TIME,
    gcTime: CALENDAR_GC_TIME,
    refetchOnWindowFocus: false,
    enabled: isAdmin,
  });
};
