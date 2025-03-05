import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../api/endpoints';


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Set a default timeout (optional)
});

// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Retry mechanism with exponential backoff
const retryRequest = async (error) => {
  const config = error.config;
  if (!config || !config.retryCount) {
    config.retryCount = 0; // Initialize retry count
  }
  if (config.retryCount < MAX_RETRIES) {
    config.retryCount += 1;
    const delay = 1000 * Math.pow(2, config.retryCount); // Exponential backoff
    await new Promise((resolve) => setTimeout(resolve, delay));
    toast(`Retrying request... Attempt ${config.retryCount}`, { icon: '🔄' });
    return apiClient(config); // Retry the request
  }
  return Promise.reject(error); // Reject after max retries
};

// Check internet connectivity
const checkInternetConnectivity = async () => {
  try {
    const response = await fetch(`${BASE_URL}/google.com`, { method: 'HEAD' }); // Replace '/ping' with a health-check endpoint
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
  }, 500); // Debounce delay
};

// Add event listeners for online/offline
window.addEventListener('online', monitorConnection);
window.addEventListener('offline', monitorConnection);

// Add a request interceptor to include the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('THIS IS A TOKEN',token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling and retry mechanism
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 🔹 Handle invalid token
      if (status === 403) {
        const errorMessage = data?.message?.toLowerCase();

        if (errorMessage.includes('invalid token') || errorMessage.includes('not authorized as admin or staff')) {
          console.error('Invalid token or unauthorized access! Logging out...');
          toast.error('Session expired! Redirecting to login.');

          // Clear user data and redirect to login
          window.localStorage.clear();
          window.location.href = '/hms/login';
          return Promise.reject(error);
        }

        toast.error('Forbidden! You do not have permission.');
      } else if (status === 401) {
        console.error('Unauthorized! Redirecting to login.');
        toast.error('Session expired! Redirecting to login.');
        
        window.localStorage.clear();
        window.location.href = '/hms/login';
      } else if (status === 500) {
        toast.error('Server error, please try again later.');
      } else if (status === 404) {
        toast.error('Not Found');
      } 
    } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      toast.error('Connection issue. Retrying...');
      return retryRequest(error);
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);



export default apiClient;