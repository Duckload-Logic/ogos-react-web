import { useEffect, Dispatch, SetStateAction } from 'react';
import { FormData } from '@/types';

interface UseLocalStorageLoadProps {
  userId: string | number | undefined;
  onSetFormData: Dispatch<SetStateAction<FormData>>;
}

/**
 * Custom hook for loading form data from localStorage on mount.
 * Provides data persistence across browser sessions.
 *
 * @param userId - User ID for localStorage key
 * @param onSetFormData - Callback to update form data state
 */
export const useLocalStorageLoad = ({
  userId,
  onSetFormData,
}: UseLocalStorageLoadProps): void => {
  useEffect(() => {
    const savedData = localStorage.getItem(`user${userId}FormData`);
    if (savedData) {
      try {
        onSetFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, []);
};
