// Axios wrapper with auth & logging
// TODO: maybe add retry logic later?
import axios, { AxiosError } from 'axios';
import { logger } from '@shared/services/logger';

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: unknown;
}

// extending axios config to track request timing
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _startTime?: number;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000, // 15 seconds seems reasonable
  headers: { 'Content-Type': 'application/json' },
});

// automatically inject auth token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // track when request started (for perf monitoring)
  config._startTime = Date.now();
  return config;
});

// log all responses + errors
apiClient.interceptors.response.use(
  (response) => {
    const duration = response.config._startTime ? Date.now() - response.config._startTime : 0;

    logger.info('API call completed', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      durationMs: duration,
    });
    return response;
  },
  (error: AxiosError) => {
    const duration = error.config?._startTime ? Date.now() - error.config._startTime : 0;

    // normalize error format - backend sometimes returns different structures
    const apiError: ApiError = {
      message:
        (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 0,
      code: (error.response?.data as any)?.code || error.code || 'UNKNOWN_ERROR',
      details: (error.response?.data as any)?.details,
    };

    logger.error('API call failed', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: apiError.status,
      code: apiError.code,
      durationMs: duration,
    });

    return Promise.reject(apiError);
  }
);

export default apiClient;
