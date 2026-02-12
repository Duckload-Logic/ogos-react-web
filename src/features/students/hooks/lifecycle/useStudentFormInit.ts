import { useEffect } from 'react';

interface UseStudentFormInitProps {
  userId: string | number | undefined;
  onInit: () => Promise<void>;
}

/**
 * Custom hook for initializing student form on component mount.
 * Handles initial student record creation/retrieval.
 * Only runs when userId changes, not on callback changes.
 *
 * @param userId - Current user's ID from auth context
 * @param onInit - Callback function to initialize student record
 */
export const useStudentFormInit = ({
  userId,
  onInit,
}: UseStudentFormInitProps): void => {
  useEffect(() => {
    const init = async () => {
      await onInit();
    };
    init();
    // Only depend on userId to avoid re-running when callback reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};
