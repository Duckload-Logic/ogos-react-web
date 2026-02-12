import { useEffect, Dispatch, SetStateAction } from 'react';
import { FormData } from '@/types';

type AutoSaveStatus = 'saving' | 'saved' | 'idle';

interface UseFormAutoSaveProps {
  formData: FormData;
  userId: string | number | undefined;
  autoSaveStatus: AutoSaveStatus;
  setAutoSaveStatus: Dispatch<SetStateAction<AutoSaveStatus>>;
  setLastSaved: Dispatch<SetStateAction<string>>;
  debounceMs?: number;
}

/**
 * Custom hook for auto-saving form data with debouncing.
 * Saves to sessionStorage to preserve form state during session.
 * Manages the auto-save effect lifecycle.
 *
 * @param formData - Current form state to save
 * @param userId - User ID for storage key
 * @param autoSaveStatus - Current auto-save status state
 * @param setAutoSaveStatus - Setter for auto-save status
 * @param setLastSaved - Setter for last saved timestamp
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export const useFormAutoSave = ({
  formData,
  userId,
  autoSaveStatus,
  setAutoSaveStatus,
  setLastSaved,
  debounceMs = 500,
}: UseFormAutoSaveProps): void => {
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.keys(formData).length > 0 && userId) {
        setAutoSaveStatus("saving");
        sessionStorage.setItem(`user${userId}FormData`, JSON.stringify(formData));
        setAutoSaveStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());

        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }
    }, debounceMs);

    return () => clearTimeout(saveTimer);
  }, [formData, userId, debounceMs]);
};
