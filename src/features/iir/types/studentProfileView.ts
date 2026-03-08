export interface IIRProfileView {
  iirId: number;
  userId: number;
  studentNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: {
    id: number;
    name: string;
  };
  email: string;
  course: {
    id: number;
    name: string;
    code: string;
  };
  yearLevel: number;
}
