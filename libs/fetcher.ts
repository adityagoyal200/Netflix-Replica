import axios from 'axios';

// Create axios instance with optimized configuration
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for better error handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized requests
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const res = await axiosInstance.get<T>(url);
    return res.data;
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};

export default fetcher;
