import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";
import { QueryParam } from "../types/reqParams";

const STUDENTS_QUERY_KEY = "students infinite";
const STUDENTS_PAGE_SIZE = 12;

export function useIIRPagination(params: QueryParam) {
  return useQuery({
    queryKey: [
      STUDENTS_QUERY_KEY,
      "infinite",
      params.courseId,
      params.search,
      params.genderId,
      params.yearLevel,
      params.page,
    ],
    queryFn: () =>
      iirService.getStudents({
        ...params,
        pageSize: STUDENTS_PAGE_SIZE,
      }),
    placeholderData: (prevData) => prevData,
  });
}
