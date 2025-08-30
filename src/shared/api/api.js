import axios from "axios";

export const api = axios.create({
  baseURL: 'https://booklink.pro/cf',
  timeout: 10000, // 10s default timeout
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['Accept'] = config.headers['Accept'] || 'application/json';
  config.headers['X-Requested-With'] = config.headers['X-Requested-With'] || 'XMLHttpRequest';

  // Only set JSON Content-Type when sending plain objects (not FormData)
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (!isFormData && config.data && typeof config.data === 'object') {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status ?? null;
    const data = error?.response?.data ?? null;
    const message = (data && (data.message || data.error)) || error.message || 'Request failed';

    const normalizedError = {
      message,
      status,
      data,
      isNetworkError: !error?.response,
      original: error,
    };

    // Log concise error for debugging (can be replaced with a logger later)
    // eslint-disable-next-line no-console
    console.error('[API]', status ?? 'NETWORK', message);

    return Promise.reject(normalizedError);
  }
);

export default api;