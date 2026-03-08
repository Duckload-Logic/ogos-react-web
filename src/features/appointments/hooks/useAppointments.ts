import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/features/appointments/services";
import {
  Appointment,
  AppointmentStatus,
  StatusCount,
  type PaginatedAppointmentsResponse,
} from "../types";
import { QueryParam } from "../types/reqParams";
import { useMe } from "@/features/users/hooks/useMe";

const APPOINTMENTS_QUERY_KEY = "appointments";
const APPOINTMENT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const APPOINTMENT_GC_TIME = 30 * 60 * 1000; // 30 minutes

export const useAppointments = (
  {
    isMe = false,
    params,
  }: {
    isMe?: boolean;
    params: QueryParam;
  } = {} as any,
) => {
  const { data: me } = useMe();
  return useQuery<PaginatedAppointmentsResponse>({
    queryKey: [APPOINTMENTS_QUERY_KEY, me?.email, isMe, params],
    queryFn: async () => {
      const result = isMe
        ? await appointmentService.getMyAppointments(params)
        : await appointmentService.getAllAppointments(params);
      return result;
    },
    staleTime: APPOINTMENT_STALE_TIME,
    gcTime: APPOINTMENT_GC_TIME,
    refetchOnWindowFocus: false,
    enabled: isMe ? !!me?.email : true,
  });
};

export const useAppointmentsStats = ({ params }: { params?: QueryParam }) => {
  const { data: me } = useMe();
  return useQuery<StatusCount[]>({
    queryKey: ["appointments-stats", me?.email, params],
    queryFn: () => appointmentService.getAppointmentStats(params),
    staleTime: APPOINTMENT_STALE_TIME,
    gcTime: APPOINTMENT_GC_TIME,
    refetchOnWindowFocus: false,
  });
};

export function useSubmitAppointment() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: (data: Appointment) =>
      appointmentService.submitAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [APPOINTMENTS_QUERY_KEY, "me", me?.email],
      });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      appointmentService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      console.log(
        "✅ Mutation successful! Invalidating appointment queries...",
      );
      queryClient.invalidateQueries({
        queryKey: [APPOINTMENTS_QUERY_KEY, "me", me?.email],
      });
      queryClient.invalidateQueries({
        queryKey: [APPOINTMENTS_QUERY_KEY, "all"],
      });
    },
  });
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Appointment }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["appointments-stats"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-stats"] });
    },
  });
};
