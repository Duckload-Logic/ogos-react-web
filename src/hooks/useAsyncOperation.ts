/**
 * useAsyncOperation Hook
 * Manages async operations with loading, error, and data states
 */

import { useState, useCallback } from "react";

export interface UseAsyncOperationReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
  setError: (error: string | null) => void;
  setData: (data: T) => void;
}

/**
 * useAsyncOperation - Manages async operations with proper state management
 * @returns Async operation management methods
 */
export const useAsyncOperation = <T = unknown>(): UseAsyncOperationReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const setDataState = useCallback((newData: T) => {
    setData(newData);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
    setError: setErrorState,
    setData: setDataState,
  };
};
