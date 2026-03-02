import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
import {
  BACKUP_STATUS,
  CREATE_BACKUP,
  DELETE_BACKUP,
  DOWNLOAD_BACKUP,
  RESTORE_BACKUP,
  BACKUP_SETTINGS
} from '../../api/endpoints';

// Fetch all backups
export const fetchBackups = createAsyncThunk(
  'backup/fetchBackups',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BACKUP_STATUS, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new backup
export const createBackup = createAsyncThunk(
  'backup/createBackup',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(CREATE_BACKUP, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a backup
export const deleteBackup = createAsyncThunk(
  'backup/deleteBackup',
  async (backupId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(DELETE_BACKUP(backupId));
      return { ...response.data, backupId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Restore from a backup
export const restoreBackup = createAsyncThunk(
  'backup/restoreBackup',
  async (backupId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(RESTORE_BACKUP(backupId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch backup settings
export const fetchBackupSettings = createAsyncThunk(
  'backup/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BACKUP_SETTINGS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update backup settings
export const updateBackupSettings = createAsyncThunk(
  'backup/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(BACKUP_SETTINGS, settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  // Backup list
  backups: [],
  totalBackups: 0,
  totalSize: '0 MB',
  
  // Settings
  settings: {
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    location: '/backups',
    compression: true,
    autoBackup: true
  },
  
  // Current operation states
  lastBackup: null,
  nextScheduled: null,
  
  // UI states
  loading: false,
  creating: false,
  restoring: false,
  deleting: false,
  settingsLoading: false,
  error: null,
  successMessage: null,
  
  // Download tracking
  downloadProgress: {},
  
  // Restore status
  restoreStatus: null,
};

// Backup slice
const backupSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    clearBackupError: (state) => {
      state.error = null;
    },
    clearBackupSuccess: (state) => {
      state.successMessage = null;
    },
    setRestoreStatus: (state, action) => {
      state.restoreStatus = action.payload;
    },
    clearRestoreStatus: (state) => {
      state.restoreStatus = null;
    },
    updateDownloadProgress: (state, action) => {
      const { backupId, progress } = action.payload;
      state.downloadProgress[backupId] = progress;
    },
    clearDownloadProgress: (state, action) => {
      delete state.downloadProgress[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Backups
      .addCase(fetchBackups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBackups.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.backups = action.payload.data.backups || [];
          state.totalBackups = action.payload.data.totalBackups || 0;
          state.totalSize = action.payload.data.totalSize || '0 MB';
          
          // Set last backup from the most recent backup
          if (state.backups.length > 0) {
            state.lastBackup = state.backups[0].created_at;
          }
        }
      })
      .addCase(fetchBackups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch backups';
      })
      
      // Create Backup
      .addCase(createBackup.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBackup.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload.success) {
          state.successMessage = 'Backup created successfully!';
          // Add new backup to the list
          if (action.payload.data) {
            const newBackup = {
              id: action.payload.data.id || Date.now().toString(),
              filename: action.payload.data.filename,
              created_at: action.payload.data.created_at || new Date().toISOString(),
              size: action.payload.data.size || 0,
              status: 'completed'
            };
            state.backups.unshift(newBackup);
            state.totalBackups = (state.totalBackups || 0) + 1;
            state.lastBackup = newBackup.created_at;
          }
        }
      })
      .addCase(createBackup.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload?.error || 'Failed to create backup';
      })
      
      // Delete Backup
      .addCase(deleteBackup.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBackup.fulfilled, (state, action) => {
        state.deleting = false;
        if (action.payload.success) {
          state.backups = state.backups.filter(
            b => b.id !== action.payload.backupId
          );
          state.totalBackups = Math.max(0, (state.totalBackups || 1) - 1);
          state.successMessage = 'Backup deleted successfully';
        }
      })
      .addCase(deleteBackup.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.error || 'Failed to delete backup';
      })
      
      // Restore Backup
      .addCase(restoreBackup.pending, (state) => {
        state.restoring = true;
        state.error = null;
        state.restoreStatus = { status: 'in_progress', message: 'Restore in progress...' };
      })
      .addCase(restoreBackup.fulfilled, (state, action) => {
        state.restoring = false;
        if (action.payload.success) {
          state.restoreStatus = { 
            status: 'completed', 
            message: 'Restore completed successfully',
            data: action.payload.data
          };
          state.successMessage = 'Backup restored successfully!';
        }
      })
      .addCase(restoreBackup.rejected, (state, action) => {
        state.restoring = false;
        state.restoreStatus = { 
          status: 'failed', 
          message: action.payload?.error || 'Failed to restore backup' 
        };
        state.error = action.payload?.error || 'Failed to restore backup';
      })
      
      // Fetch Settings
      .addCase(fetchBackupSettings.pending, (state) => {
        state.settingsLoading = true;
      })
      .addCase(fetchBackupSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        if (action.payload.success && action.payload.data) {
          state.settings = { ...state.settings, ...action.payload.data };
        }
      })
      .addCase(fetchBackupSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        // Use default settings if fetch fails
        state.settings = initialState.settings;
      })
      
      // Update Settings
      .addCase(updateBackupSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(updateBackupSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        if (action.payload.success && action.payload.data) {
          state.settings = { ...state.settings, ...action.payload.data };
          state.successMessage = 'Settings updated successfully!';
        }
      })
      .addCase(updateBackupSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload?.error || 'Failed to update settings';
      });
  }
});

export const {
  clearBackupError,
  clearBackupSuccess,
  setRestoreStatus,
  clearRestoreStatus,
  updateDownloadProgress,
  clearDownloadProgress
} = backupSlice.actions;

export default backupSlice.reducer;
