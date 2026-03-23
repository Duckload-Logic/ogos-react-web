export interface IIRProfileView {
  iirId: string;
  userId: string;
  studentNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffixName?: string;
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
