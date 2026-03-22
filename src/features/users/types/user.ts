export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: string;
  roles: string[];
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  type: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}
