export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  roles?: string[];
  createdAt?: Date;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  roles: string[];
}
