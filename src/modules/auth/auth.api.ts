import type {
  User,
  LoginInput,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  AuthSession,
  UserSnakeCase,
  AuthSessionSnakeCase,
} from './auth.types';
import authMockData from './auth.mock.json';
import { camelizeKeys, snakeCaseKeys } from '@/lib/utils';

const SESSION_STORAGE_KEY = 'hiring_dashboard_session';
const USERS_STORAGE_KEY = 'hiring_dashboard_users';

// Helper function to get users from localStorage
const getUsersFromStorage = (): (UserSnakeCase & { password: string })[] => {
  if (typeof window === 'undefined') {
    return authMockData.users as (UserSnakeCase & { password: string })[];
  }

  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data if nothing exists
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(authMockData.users));
    return authMockData.users as (UserSnakeCase & { password: string })[];
  }

  return JSON.parse(stored);
};

// Helper function to get current session from localStorage
const getSessionFromStorage = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;

  const sessionSnakeCase = JSON.parse(stored) as AuthSessionSnakeCase;
  return camelizeKeys<AuthSession>(sessionSnakeCase);
};

// Helper function to save session to localStorage
const saveSessionToStorage = (session: AuthSession): void => {
  if (typeof window === 'undefined') return;
  const sessionSnakeCase = snakeCaseKeys<AuthSessionSnakeCase>(session);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionSnakeCase));
};

// Helper function to clear session from localStorage
const clearSessionFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

// Generate a simple token
const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Simulate API delay
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Convert UserSnakeCase to User (without password)
const sanitizeUser = (userSnakeCase: UserSnakeCase): User => {
  const user = camelizeKeys<User & { password?: string }>(userSnakeCase);
  // Remove password from user object
  delete user.password;
  return user;
};

/**
 * Login user
 */
export const login = async (input: LoginInput): Promise<LoginResponse> => {
  await simulateDelay();

  const users = getUsersFromStorage();
  const userSnakeCase = users.find(
    (u) => u.email === input.email && u.password === input.password
  );

  if (!userSnakeCase) {
    throw new Error('Invalid email or password');
  }

  const user = sanitizeUser(userSnakeCase);

  // Create session with 24 hour expiry
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const token = generateToken();

  const session: AuthSession = {
    user,
    token,
    expiresAt: expiresAt.toISOString(),
  };

  saveSessionToStorage(session);

  return {
    data: {
      user,
      token,
    },
  };
};

/**
 * Logout user
 */
export const logout = async (): Promise<LogoutResponse> => {
  await simulateDelay();

  clearSessionFromStorage();

  return {
    success: true,
  };
};

/**
 * Get current user (me)
 */
export const getMe = async (): Promise<MeResponse> => {
  await simulateDelay();

  const session = getSessionFromStorage();

  if (!session) {
    throw new Error('No active session. Please login.');
  }

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);

  if (now > expiresAt) {
    clearSessionFromStorage();
    throw new Error('Session expired. Please login again.');
  }

  return {
    data: session.user,
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const session = getSessionFromStorage();

  if (!session) return false;

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);

  if (now > expiresAt) {
    clearSessionFromStorage();
    return false;
  }

  return true;
};

/**
 * Get current session
 */
export const getCurrentSession = (): AuthSession | null => {
  return getSessionFromStorage();
};

/**
 * Check if user has admin role
 */
export const isAdmin = (): boolean => {
  const session = getSessionFromStorage();
  return session?.user?.role === 'admin';
};

/**
 * Check if user has applicant role
 */
export const isApplicant = (): boolean => {
  const session = getSessionFromStorage();
  return session?.user?.role === 'applicant';
};

/**
 * Reset users to initial mock data
 */
export const resetUsersToMock = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(authMockData.users));
};

/**
 * Clear session storage
 */
export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(USERS_STORAGE_KEY);
};
