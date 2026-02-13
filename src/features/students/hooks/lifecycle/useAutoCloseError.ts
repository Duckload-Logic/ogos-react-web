import { useEffect } from 'react';

interface UseAutoCloseErrorProps {
  isVisible: boolean;
  onClose: () => void;
  delayMs?: number;
}

/**
 * Custom hook for auto-closing error messages after a delay.
 * Useful for temporary validation error alerts.
 *
 * @param isVisible - Current visibility state of error
 * @param onClose - Callback to close/hide the error
 * @param delayMs - Delay before auto-closing in milliseconds (default: 3000ms)
 */
export const useAutoCloseError = ({
  isVisible,
  onClose,
  delayMs = 3000,
}: UseAutoCloseErrorProps): void => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delayMs]);
};
