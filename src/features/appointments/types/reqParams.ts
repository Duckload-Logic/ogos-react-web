const ORDER_BY_OPTIONS: { [key: string]: string } = {
  whenDate: "when_date",
  createdAt: "created_at",
};

export type QueryParam = {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: keyof typeof ORDER_BY_OPTIONS;
  statusId?: number;
  startDate?: string;
  endDate?: string;
};
