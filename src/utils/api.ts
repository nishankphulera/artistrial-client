/**
 * API utility - Centralized API URL configuration
 * Use this instead of hardcoding API URLs throughout the application
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/**
 * Get the full API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/users' or 'api/users')
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

/**
 * Get API URL for a specific endpoint
 * @param path - API path (e.g., 'users', 'assets', 'community/posts')
 * @returns Full API URL with /api prefix
 */
export const apiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const apiPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;
  return `${API_URL}/${apiPath}`;
};

