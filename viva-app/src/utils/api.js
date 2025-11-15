// API utility functions
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5050';

export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${BASE_URL}/${cleanEndpoint}`;
};

export { BASE_URL };