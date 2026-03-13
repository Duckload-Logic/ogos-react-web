import { useQuery } from "@tanstack/react-query";
import { GetAllSlips, GetMySlips } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { useMe } from "@/features/users/hooks/useMe";
import { QueryParams } from "../types/params";

export function useSlips({
  isAdmin = false,
  params,
}: { isAdmin?: boolean; params?: QueryParams } = {}) {
  const { data: me } = useMe({});
  return useQuery({
    queryKey: isAdmin
      ? [
          ...QUERY_KEYS.slips.all,
          "admin",
          params,
        ]
      : [
          ...QUERY_KEYS.slips.mySlips,
          me?.id,
          params,
        ],
    queryFn: isAdmin
      ? () =>
          GetAllSlips(params, {
            handlerName: 'useSlips',
            stepName: 'Fetch All Slips',
          })
      : () =>
          GetMySlips(params, {
            handlerName: 'useSlips',
            stepName: 'Fetch My Slips',
          }),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
    enabled: !!me,
  });
}
