export interface User {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  role: 'admin' | 'applicant';
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface LogoutResponse {
  success: boolean;
}

export interface MeResponse {
  data: User;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// Snake case types for storage (internal use)
export interface UserSnakeCase {
  id: string;
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  role: 'admin' | 'applicant';
  created_at: string;
  updated_at: string;
}

export interface AuthSessionSnakeCase {
  user: UserSnakeCase;
  token: string;
  expires_at: string;
}
