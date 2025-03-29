import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../api/endpoints';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Set a default timeout (optional)
});

const MAX_RETRIES = 3;
let isRetrying = false; // Prevent multiple retry notifications

// Retry mechanism with exponential backoff
const retryRequest = async (error) => {
  const config = error.config;

  if (!config || config.retryCount >= MAX_RETRIES) {
    return Promise.reject(error);
  }

  config.retryCount = (config.retryCount || 0) + 1;
  const delay = 1000 * Math.pow(2, config.retryCount);

  if (!isRetrying) {
    isRetrying = true;
    toast(`Retrying request... Attempt ${config.retryCount}`, { icon: '🔄' });
    setTimeout(() => (isRetrying = false), 3000); // Prevents multiple toasts
  }

  await new Promise((resolve) => setTimeout(resolve, delay));
  return apiClient(config); // Retry the request
};

// Check internet connectivity
const checkInternetConnectivity = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health-check`, { method: 'HEAD' }); // Use a proper health-check endpoint
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Monitor connection status with debouncing
let debounceTimeout;
const monitorConnection = async () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      toast.success('Connection restored! 🎉', { icon: '🔌' });
    } else {
      toast.error('You are offline. Check your connection.', { icon: '⚠️' });
    }
  }, 1000); // Debounce delay
};

// Add event listeners for online/offline
window.addEventListener('online', monitorConnection);
window.addEventListener('offline', monitorConnection);

// Add a request interceptor to include the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling and retry mechanism
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response) {
      const { status } = response;

      if (status === 500) {
        toast.error('Server error, please try again later.');
      } else if (status === 404) {
        toast.error('Requested resource not found.');
      }
    } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      if (!config.url.includes('/auth')) { // Avoid retrying auth endpoints
        return retryRequest(error);
      }
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
