import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
import {
  DATA_TABLES,
  DATA_SYNC_TABLE,
  DATA_SYNC_ALL,
  DATA_EXPORT_TABLE,
  DATA_CLEAR_TABLE,
  DATA_STORAGE,
  DATA_CLEANUP,
  DATA_RETENTION
} from '../../api/endpoints';

// Fetch database tables
export const fetchDatabaseTables = createAsyncThunk(
  'dataManagement/fetchTables',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(DATA_TABLES, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Sync a single table
export const syncTable = createAsyncThunk(
  'dataManagement/syncTable',
  async (tableName, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(DATA_SYNC_TABLE(tableName));
      return { ...response.data, tableName };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Sync all tables
export const syncAllTables = createAsyncThunk(
  'dataManagement/syncAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(DATA_SYNC_ALL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Export table
export const exportTable = createAsyncThunk(
  'dataManagement/exportTable',
  async ({ tableName, format = 'json' }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(DATA_EXPORT_TABLE(tableName), { 
        params: { format },
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      return { ...response.data, tableName, format };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear table data
export const clearTableData = createAsyncThunk(
  'dataManagement/clearTable',
  async ({ tableName, confirm = true }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(DATA_CLEAR_TABLE(tableName), {
        data: { confirm }
      });
      return { ...response.data, tableName };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch storage info
export const fetchStorageInfo = createAsyncThunk(
  'dataManagement/fetchStorage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(DATA_STORAGE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Data cleanup operations
export const performCleanup = createAsyncThunk(
  'dataManagement/cleanup',
  async (operation, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(DATA_CLEANUP(operation));
      return { ...response.data, operation };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch retention policies
export const fetchRetentionPolicies = createAsyncThunk(
  'dataManagement/fetchRetention',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(DATA_RETENTION);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update retention policies
export const updateRetentionPolicies = createAsyncThunk(
  'dataManagement/updateRetention',
  async (policies, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(DATA_RETENTION, { policies });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  // Tables data
  tables: [],
  tablesLoading: false,
  tablesError: null,
  
  // Storage data
  storage: null,
  storageLoading: false,
  storageError: null,
  
  // Retention policies
  retentionPolicies: [],
  retentionLoading: false,
  retentionError: null,
  
  // Operations state
  syncing: false,
  syncingTable: null,
  exporting: false,
  clearing: false,
  cleaning: false,
  
  // Last sync time
  lastSync: null,
  
  // Error/Success messages
  error: null,
  successMessage: null,
  
  // Export/Import modal state
  importModalVisible: false,
  clearModalVisible: false
};

// Data Management slice
const dataManagementSlice = createSlice({
  name: 'dataManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.tablesError = null;
      state.storageError = null;
      state.retentionError = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setImportModalVisible: (state, action) => {
      state.importModalVisible = action.payload;
    },
    setClearModalVisible: (state, action) => {
      state.clearModalVisible = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tables
      .addCase(fetchDatabaseTables.pending, (state) => {
        state.tablesLoading = true;
        state.tablesError = null;
      })
      .addCase(fetchDatabaseTables.fulfilled, (state, action) => {
        state.tablesLoading = false;
        if (action.payload.success && action.payload.data) {
          state.tables = action.payload.data;
        }
      })
      .addCase(fetchDatabaseTables.rejected, (state, action) => {
        state.tablesLoading = false;
        state.tablesError = action.payload?.error || 'Failed to fetch tables';
      })
      
      // Sync Single Table
      .addCase(syncTable.pending, (state, action) => {
        state.syncing = true;
        state.syncingTable = action.meta.arg;
      })
      .addCase(syncTable.fulfilled, (state, action) => {
        state.syncing = false;
        state.syncingTable = null;
        state.successMessage = `${action.payload.tableName} synced successfully!`;
        state.lastSync = new Date().toISOString();
        
        // Update the specific table in the list
        if (action.payload.data) {
          const tableIndex = state.tables.findIndex(t => t.name === action.payload.tableName);
          if (tableIndex !== -1) {
            state.tables[tableIndex] = {
              ...state.tables[tableIndex],
              recordCount: action.payload.data.recordCount,
              lastSync: action.payload.data.lastSync
            };
          }
        }
      })
      .addCase(syncTable.rejected, (state, action) => {
        state.syncing = false;
        state.syncingTable = null;
        state.error = action.payload?.error || 'Failed to sync table';
      })
      
      // Sync All Tables
      .addCase(syncAllTables.pending, (state) => {
        state.syncing = true;
        state.syncingTable = 'all';
      })
      .addCase(syncAllTables.fulfilled, (state, action) => {
        state.syncing = false;
        state.syncingTable = null;
        state.successMessage = 'All tables synced successfully!';
        state.lastSync = new Date().toISOString();
      })
      .addCase(syncAllTables.rejected, (state, action) => {
        state.syncing = false;
        state.syncingTable = null;
        state.error = action.payload?.error || 'Failed to sync all tables';
      })
      
      // Export Table
      .addCase(exportTable.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportTable.fulfilled, (state, action) => {
        state.exporting = false;
        state.successMessage = `${action.payload.tableName} exported successfully!`;
      })
      .addCase(exportTable.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload?.error || 'Failed to export table';
      })
      
      // Clear Table Data
      .addCase(clearTableData.pending, (state) => {
        state.clearing = true;
      })
      .addCase(clearTableData.fulfilled, (state, action) => {
        state.clearing = false;
        state.successMessage = `${action.payload.tableName} data cleared successfully!`;
        
        // Update table record count
        const tableIndex = state.tables.findIndex(t => t.name === action.payload.tableName);
        if (tableIndex !== -1) {
          state.tables[tableIndex].recordCount = 0;
        }
      })
      .addCase(clearTableData.rejected, (state, action) => {
        state.clearing = false;
        state.error = action.payload?.error || 'Failed to clear table data';
      })
      
      // Fetch Storage
      .addCase(fetchStorageInfo.pending, (state) => {
        state.storageLoading = true;
        state.storageError = null;
      })
      .addCase(fetchStorageInfo.fulfilled, (state, action) => {
        state.storageLoading = false;
        if (action.payload.success && action.payload.data) {
          state.storage = action.payload.data;
        }
      })
      .addCase(fetchStorageInfo.rejected, (state, action) => {
        state.storageLoading = false;
        state.storageError = action.payload?.error || 'Failed to fetch storage info';
      })
      
      // Data Cleanup
      .addCase(performCleanup.pending, (state) => {
        state.cleaning = true;
      })
      .addCase(performCleanup.fulfilled, (state, action) => {
        state.cleaning = false;
        state.successMessage = action.payload.message || 'Cleanup completed!';
      })
      .addCase(performCleanup.rejected, (state, action) => {
        state.cleaning = false;
        state.error = action.payload?.error || 'Cleanup failed';
      })
      
      // Fetch Retention Policies
      .addCase(fetchRetentionPolicies.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(fetchRetentionPolicies.fulfilled, (state, action) => {
        state.retentionLoading = false;
        if (action.payload.success && action.payload.data) {
          state.retentionPolicies = action.payload.data;
        }
      })
      .addCase(fetchRetentionPolicies.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload?.error || 'Failed to fetch retention policies';
      })
      
      // Update Retention Policies
      .addCase(updateRetentionPolicies.pending, (state) => {
        state.retentionLoading = true;
      })
      .addCase(updateRetentionPolicies.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.successMessage = 'Retention policies updated successfully!';
        if (action.payload.data) {
          state.retentionPolicies = action.payload.data;
        }
      })
      .addCase(updateRetentionPolicies.rejected, (state, action) => {
        state.retentionLoading = false;
        state.error = action.payload?.error || 'Failed to update retention policies';
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setImportModalVisible,
  setClearModalVisible
} = dataManagementSlice.actions;

export default dataManagementSlice.reducer;

