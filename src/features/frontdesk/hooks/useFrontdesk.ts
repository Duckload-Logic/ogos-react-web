/**
 * Frontdesk Hook
 * Manages admin schedule operations for the frontdesk page
 */

import { useState, useCallback } from "react";
import * as adminScheduleService from "@/features/frontdesk/services";
import { AdminSchedule, CreateScheduleRequest, UpdateScheduleRequest } from "@/features/frontdesk/services";

export const useFrontdesk = () => {
  const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules with optional filters
  const fetchSchedules = useCallback(
    async (filters?: Record<string, string>) => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminScheduleService.listAdminSchedules(filters);
        setSchedules(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch schedules";
        setError(message);
        console.error("Error fetching schedules:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Add new schedule
  const addSchedule = useCallback(
    async (payload: CreateScheduleRequest) => {
      setLoading(true);
      setError(null);
      try {
        const newSchedule = await adminScheduleService.createAdminSchedule(payload);
        setSchedules((prev) => [...prev, newSchedule]);
        return newSchedule;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create schedule";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Edit schedule
  const editSchedule = useCallback(
    async (id: string, payload: UpdateScheduleRequest) => {
      setLoading(true);
      setError(null);
      try {
        const updatedSchedule = await adminScheduleService.updateAdminSchedule(id, payload);
        setSchedules((prev) =>
          prev.map((schedule) => (schedule.id === id ? updatedSchedule : schedule))
        );
        return updatedSchedule;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update schedule";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Remove schedule
  const removeSchedule = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminScheduleService.deleteAdminSchedule(id);
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete schedule";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    editSchedule,
    removeSchedule,
  };
};
