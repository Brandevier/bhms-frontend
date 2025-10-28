const isProduction = process.env.NODE_ENV === 'production';

export const WEBSOCKET_URL = isProduction 
  ? 'wss://hms-backend-v1.onrender.com' 
  : 'ws://localhost:7000';

export const BASE_URL = isProduction 
  ? 'https://hms-backend-v1.onrender.com/api/v1' 
  : 'http://localhost:7000/api/v1';

export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const ADMIN_LOGIN = `${BASE_URL}/auth/admin/login`;
export const VERIFY_EMAIL = `${BASE_URL}/auth/admin/verify-token`;
export const ADMIN_DETAILS = `${BASE_URL}/admin`;