import { useQuery } from "@tanstack/react-query";
import { GetStudents } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { QueryParam } from "../types/reqParams";

const STUDENTS_PAGE_SIZE = 12;

export function useIIRPagination(
  params: QueryParam,
) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.iir.inventory.all,
      params.courseId,
      params.search,
      params.genderId,
      params.yearLevel,
      params.page,
    ],
    queryFn: () =>
      GetStudents({
        ...params,
        pageSize: STUDENTS_PAGE_SIZE,
      }),
    placeholderData: (prevData) => prevData,
  });
}
