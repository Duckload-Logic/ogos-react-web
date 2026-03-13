import { useQuery } from "@tanstack/react-query";
import { GetMySlips } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { useMe } from "@/features/users/hooks/useMe";
import { QueryParams } from "../types/params";

export function useGetMySlips(
  params?: QueryParams,
) {
  const { data: me } = useMe({});
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.mySlips,
      me?.id,
      params,
    ],
    queryFn: () =>
      GetMySlips(params, {
        handlerName: 'useGetMySlips',
        stepName: 'Fetch My Slips',
      }),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
    enabled: !!me,
  });
}
