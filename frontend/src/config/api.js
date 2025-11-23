const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3000';
  }
  
  if (typeof window !== 'undefined') {
    return '/api';
  }
  
  return '/api';
};

export const API_BASE = getApiBaseUrl();

