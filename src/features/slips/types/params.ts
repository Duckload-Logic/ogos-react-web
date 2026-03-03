export interface QueryParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  sortBy?: string;
  statusId?: string | number;
  sortOrder?: "asc" | "desc";
  search?: string;
  startDate?: string;
  endDate?: string;
}
