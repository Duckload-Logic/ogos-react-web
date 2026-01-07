export interface User {
  id: number;
  roleId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}