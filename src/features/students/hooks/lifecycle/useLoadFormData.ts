import { useEffect, Dispatch, SetStateAction } from 'react';
import { FormData } from '@/types';

interface UseLoadFormDataProps {
  studentRecordId: string | number | null;
  onLoadData: () => Promise<FormData | null>;
  onSetFormData: Dispatch<SetStateAction<FormData>>;
}

/**
 * Custom hook for loading saved form data from backend or localStorage.
 * Handles data persistence and recovery.
 * Only runs when studentRecordId changes.
 *
 * @param studentRecordId - Student record ID from backend initialization
 * @param onLoadData - Callback to load data from backend
 * @param onSetFormData - Callback to update form data state
 */
export const useLoadFormData = ({
  studentRecordId,
  onLoadData,
  onSetFormData,
}: UseLoadFormDataProps): void => {
  useEffect(() => {
    const loadData = async () => {
      if (studentRecordId) {
        const savedData = await onLoadData();
        console.log("Loaded saved data:", savedData);
        if (savedData) {
          onSetFormData(savedData);
        } else {
          // Try to load from localStorage if backend data not available
          const localData = localStorage.getItem("studentFormData");
          if (localData) {
            try {
              onSetFormData(JSON.parse(localData));
            } catch (e) {
              console.error("Failed to load saved data:", e);
            }
          }
        }
      }
    };
    loadData();
  }, [studentRecordId]);
};
