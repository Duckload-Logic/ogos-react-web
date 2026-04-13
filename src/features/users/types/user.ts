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
  suffixName?: string;
  email: string;
  type: string;
  studentNumber?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}
