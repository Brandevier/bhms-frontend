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

// Dashboard & System API Endpoints
export const DASHBOARD_STATS = `${BASE_URL}/statistics/summary`;
export const REVENUE_TRENDS = `${BASE_URL}/statistics/revenue-trends`;
export const DEPARTMENT_PERFORMANCE = `${BASE_URL}/statistics/department-performance`;
export const RECENT_ACTIVITY = `${BASE_URL}/activity/recent`;
export const UPCOMING_APPOINTMENTS = `${BASE_URL}/appointments/upcoming`;
export const SYSTEM_HEALTH = `${BASE_URL}/system/health`;
export const BACKUP_STATUS = `${BASE_URL}/system/backup/list`;
export const CREATE_BACKUP = `${BASE_URL}/system/backup/create`;
export const DASHBOARD_STATS_V2 = `${BASE_URL}/system/dashboard/stats`;
