const isProduction = import.meta.env.MODE === 'production';

export const WEBSOCKET_URL = isProduction 
  ? 'wss://hms-backend-v1.onrender.com' 
  : 'ws://localhost:4000';

export const BASE_URL = isProduction 
  ? 'https://hms-backend-v1.onrender.com/api/v1' 
  : 'http://localhost:4000/api/v1';

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
export const DELETE_BACKUP = (id) => `${BASE_URL}/system/backup/${id}`;
export const DOWNLOAD_BACKUP = (id) => `${BASE_URL}/system/backup/download/${id}`;
export const RESTORE_BACKUP = (id) => `${BASE_URL}/system/backup/restore/${id}`;
export const BACKUP_SETTINGS = `${BASE_URL}/system/backup/settings`;
export const DASHBOARD_STATS_V2 = `${BASE_URL}/system/dashboard/stats`;

// System Config Endpoints
export const SYSTEM_CONFIG = `${BASE_URL}/system/config`;
export const SYSTEM_CONFIG_DATABASE = `${BASE_URL}/system/config/database`;
export const TEST_EMAIL_CONNECTION = `${BASE_URL}/system/config/test-email`;

// Claims API Endpoints
export const CLAIMS_DASHBOARD_SUMMARY = `${BASE_URL}/claims/dashboard/summary`;
export const CLAIMS_DASHBOARD_RECENT = `${BASE_URL}/claims/dashboard/recent`;
export const CLAIMS_DASHBOARD_ITEMS_BREAKDOWN = `${BASE_URL}/claims/dashboard/items-breakdown`;
export const CLAIMS_LIST = `${BASE_URL}/claims/all-visits`;
export const CLAIMS_UPDATE_STATUS = `${BASE_URL}/claims/update-claim-status`;
export const CLAIMS_XML_GENERATE = `${BASE_URL}/claims/xml/generate`;
export const CLAIMS_EXPORT_HISTORY = `${BASE_URL}/claims/export-history`;
export const CLAIMS_BY_ID = (id) => `${BASE_URL}/claims/${id}`;
