import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";

const AUTO_SAVE_PROGRESS_QUERY_KEY = "autoSaveProgress";

export function useAutoSaveProgress(iirID: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [AUTO_SAVE_PROGRESS_QUERY_KEY, iirID],
    queryFn: () => {},
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    autoSaveProgress: data,
    isLoadingAutoSaveProgress: isLoading,
    autoSaveProgressError: error,
  };
}
