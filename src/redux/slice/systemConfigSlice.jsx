
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
import {
  SYSTEM_CONFIG,
  SYSTEM_CONFIG_DATABASE,
  TEST_EMAIL_CONNECTION
} from '../../api/endpoints';

// Fetch system config
export const fetchSystemConfig = createAsyncThunk(
  'systemConfig/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(SYSTEM_CONFIG);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update system config
export const updateSystemConfig = createAsyncThunk(
  'systemConfig/updateConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(SYSTEM_CONFIG, configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch database info
export const fetchDatabaseInfo = createAsyncThunk(
  'systemConfig/fetchDatabaseInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(SYSTEM_CONFIG_DATABASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Test email connection
export const testEmailConnection = createAsyncThunk(
  'systemConfig/testEmail',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(TEST_EMAIL_CONNECTION, emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  // Config sections
  general: {
    institutionName: '',
    timezone: 'Africa/Accra',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    currency: 'GHS',
    enableMaintenanceMode: false
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    enableEmailNotifications: true,
    fromName: '',
    fromEmail: ''
  },
  security: {
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enable2FA: false,
    enforcePasswordChange: 90
  },
  notifications: {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    notifyNewPatient: true,
    notifyAppointment: true,
    notifyLabResults: true,
    notifyPrescription: true,
    notifyPayment: true
  },
  
  // Database info
  databaseInfo: {
    type: 'PostgreSQL',
    host: '',
    port: 5432,
    database: '',
    status: 'unknown',
    tables: 0,
    records: 0,
    lastBackup: null,
    nextBackup: null
  },
  
  // UI states
  loading: false,
  saving: false,
  testingEmail: false,
  error: null,
  successMessage: null,
  databaseLoading: false
};

// System Config slice
const systemConfigSlice = createSlice({
  name: 'systemConfig',
  initialState,
  reducers: {
    clearSystemConfigError: (state) => {
      state.error = null;
    },
    clearSystemConfigSuccess: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Config
      .addCase(fetchSystemConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          const data = action.payload.data;
          state.general = { ...state.general, ...data.general };
          state.email = { ...state.email, ...data.email };
          state.security = { ...state.security, ...data.security };
          state.notifications = { ...state.notifications, ...data.notifications };
        }
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch system config';
      })
      
      // Update Config
      .addCase(updateSystemConfig.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSystemConfig.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload.success) {
          state.successMessage = 'Settings saved successfully!';
          if (action.payload.data) {
            const data = action.payload.data;
            state.general = { ...state.general, ...data.general };
            state.email = { ...state.email, ...data.email };
            state.security = { ...state.security, ...data.security };
            state.notifications = { ...state.notifications, ...data.notifications };
          }
        }
      })
      .addCase(updateSystemConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.error || 'Failed to save settings';
      })
      
      // Fetch Database Info
      .addCase(fetchDatabaseInfo.pending, (state) => {
        state.databaseLoading = true;
      })
      .addCase(fetchDatabaseInfo.fulfilled, (state, action) => {
        state.databaseLoading = false;
        if (action.payload.success && action.payload.data) {
          state.databaseInfo = { ...state.databaseInfo, ...action.payload.data };
        }
      })
      .addCase(fetchDatabaseInfo.rejected, (state, action) => {
        state.databaseLoading = false;
      })
      
      // Test Email
      .addCase(testEmailConnection.pending, (state) => {
        state.testingEmail = true;
      })
      .addCase(testEmailConnection.fulfilled, (state, action) => {
        state.testingEmail = false;
        if (action.payload.success) {
          state.successMessage = 'Email connection test successful!';
        }
      })
      .addCase(testEmailConnection.rejected, (state, action) => {
        state.testingEmail = false;
        state.error = action.payload?.error || 'Failed to test email connection';
      });
  }
});

export const { clearSystemConfigError, clearSystemConfigSuccess } = systemConfigSlice.actions;
export default systemConfigSlice.reducer;

