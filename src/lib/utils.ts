import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert snake_case string to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert object keys from snake_case to camelCase
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function camelizeKeys<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelizeKeys(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = camelizeKeys(obj[key]);
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any) as T;
  }

  return obj;
}

/**
 * Convert object keys from camelCase to snake_case
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function snakeCaseKeys<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeCaseKeys(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = toSnakeCase(key);
      acc[snakeKey] = snakeCaseKeys(obj[key]);
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any) as T;
  }

  return obj;
}
