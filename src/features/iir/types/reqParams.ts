const ORDER_BY_OPTIONS: { [key: string]: string } = {
  firstName: "first_name",
  lastName: "last_name",
  studentId: "student_id",
  courseId: "course_id",
  iirId: "iir_id",
  yearLevel: "year_level",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

export type QueryParam = {
  page?: number;
  pageSize?: number;
  search?: string;
  courseId?: number;
  genderId?: number;
  orderBy?: keyof typeof ORDER_BY_OPTIONS;
  yearLevel?: number;
};
