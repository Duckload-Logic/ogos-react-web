export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
