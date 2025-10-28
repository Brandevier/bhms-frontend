import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async thunks
export const fetchFluidEntries = createAsyncThunk(
  'fluidMonitoring/fetchFluidEntries',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/fluid-monitoring/entries', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addFluidEntry = createAsyncThunk(
  'fluidMonitoring/addFluidEntry',
  async (entryData, { rejectWithValue,getState }) => {
    const { user } = getState().auth
    try {
      const response = await apiClient.post('/fluid-monitoring/entries', {
        ...entryData,
        staff_id:user.id
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFluidEntry = createAsyncThunk(
  'fluidMonitoring/updateFluidEntry',
  async ({ id, entryData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/fluid-monitoring/entries/${id}`, entryData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFluidEntry = createAsyncThunk(
  'fluidMonitoring/deleteFluidEntry',
  async ({ id, voidReason }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/fluid-monitoring/entries/${id}`, {
        data: { void_reason: voidReason }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFluidBalanceSummary = createAsyncThunk(
  'fluidMonitoring/fetchFluidBalanceSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/fluid-monitoring/summary', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFluidSettings = createAsyncThunk(
  'fluidMonitoring/fetchFluidSettings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/fluid-monitoring/settings', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFluidSettings = createAsyncThunk(
  'fluidMonitoring/updateFluidSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/fluid-monitoring/settings', settingsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  entries: {
    intake: [],
    output: [],
    all: []
  },
  currentSummary: null,
  settings: null,
  loading: {
    entries: false,
    summary: false,
    settings: false,
    action: false
  },
  error: {
    entries: null,
    summary: null,
    settings: null,
    action: null
  },
  success: {
    add: false,
    update: false,
    delete: false,
    settings: false
  },
  filters: {
    startDate: null,
    endDate: null,
    type: null,
    category: null
  },
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
};

// Slice
const fluidMonitoringSlice = createSlice({
  name: 'fluidMonitoring',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        entries: null,
        summary: null,
        settings: null,
        action: null
      };
    },
    clearSuccess: (state) => {
      state.success = {
        add: false,
        update: false,
        delete: false,
        settings: false
      };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        type: null,
        category: null
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFluidState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch fluid entries
      .addCase(fetchFluidEntries.pending, (state) => {
        state.loading.entries = true;
        state.error.entries = null;
      })
      .addCase(fetchFluidEntries.fulfilled, (state, action) => {
        state.loading.entries = false;
        state.entries.all = action.payload;
        state.entries.intake = action.payload.filter(entry => entry.type === 'intake');
        state.entries.output = action.payload.filter(entry => entry.type === 'output');
        state.error.entries = null;
      })
      .addCase(fetchFluidEntries.rejected, (state, action) => {
        state.loading.entries = false;
        state.error.entries = action.payload;
        state.entries = { intake: [], output: [], all: [] };
      })
      // Add fluid entry
      .addCase(addFluidEntry.pending, (state) => {
        state.loading.action = true;
        state.error.action = null;
        state.success.add = false;
      })
      .addCase(addFluidEntry.fulfilled, (state, action) => {
        state.loading.action = false;
        state.entries.all.unshift(action.payload);
        if (action.payload.type === 'intake') {
          state.entries.intake.unshift(action.payload);
        } else {
          state.entries.output.unshift(action.payload);
        }
        state.success.add = true;
        state.error.action = null;
      })
      .addCase(addFluidEntry.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
        state.success.add = false;
      })
      // Update fluid entry
      .addCase(updateFluidEntry.pending, (state) => {
        state.loading.action = true;
        state.error.action = null;
        state.success.update = false;
      })
      .addCase(updateFluidEntry.fulfilled, (state, action) => {
        state.loading.action = false;
        
        // Update in all entries
        const allIndex = state.entries.all.findIndex(entry => entry.id === action.payload.id);
        if (allIndex !== -1) {
          state.entries.all[allIndex] = action.payload;
        }
        
        // Update in type-specific arrays
        if (action.payload.type === 'intake') {
          const intakeIndex = state.entries.intake.findIndex(entry => entry.id === action.payload.id);
          if (intakeIndex !== -1) {
            state.entries.intake[intakeIndex] = action.payload;
          }
        } else {
          const outputIndex = state.entries.output.findIndex(entry => entry.id === action.payload.id);
          if (outputIndex !== -1) {
            state.entries.output[outputIndex] = action.payload;
          }
        }
        
        state.success.update = true;
        state.error.action = null;
      })
      .addCase(updateFluidEntry.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
        state.success.update = false;
      })
      // Delete fluid entry
      .addCase(deleteFluidEntry.pending, (state) => {
        state.loading.action = true;
        state.error.action = null;
        state.success.delete = false;
      })
      .addCase(deleteFluidEntry.fulfilled, (state, action) => {
        state.loading.action = false;
        
        // Remove from all arrays
        state.entries.all = state.entries.all.filter(entry => entry.id !== action.payload);
        state.entries.intake = state.entries.intake.filter(entry => entry.id !== action.payload);
        state.entries.output = state.entries.output.filter(entry => entry.id !== action.payload);
        
        state.success.delete = true;
        state.error.action = null;
      })
      .addCase(deleteFluidEntry.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
        state.success.delete = false;
      })
      // Fetch fluid balance summary
      .addCase(fetchFluidBalanceSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchFluidBalanceSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.currentSummary = action.payload;
        state.error.summary = null;
      })
      .addCase(fetchFluidBalanceSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload;
        state.currentSummary = null;
      })
      // Fetch fluid settings
      .addCase(fetchFluidSettings.pending, (state) => {
        state.loading.settings = true;
        state.error.settings = null;
      })
      .addCase(fetchFluidSettings.fulfilled, (state, action) => {
        state.loading.settings = false;
        state.settings = action.payload;
        state.error.settings = null;
      })
      .addCase(fetchFluidSettings.rejected, (state, action) => {
        state.loading.settings = false;
        state.error.settings = action.payload;
        state.settings = null;
      })
      // Update fluid settings
      .addCase(updateFluidSettings.pending, (state) => {
        state.loading.settings = true;
        state.error.settings = null;
        state.success.settings = false;
      })
      .addCase(updateFluidSettings.fulfilled, (state, action) => {
        state.loading.settings = false;
        state.settings = action.payload;
        state.success.settings = true;
        state.error.settings = null;
      })
      .addCase(updateFluidSettings.rejected, (state, action) => {
        state.loading.settings = false;
        state.error.settings = action.payload;
        state.success.settings = false;
      });
  }
});

// Export actions and reducer
export const {
  clearErrors,
  clearSuccess,
  setFilters,
  clearFilters,
  setPagination,
  resetFluidState
} = fluidMonitoringSlice.actions;

export default fluidMonitoringSlice.reducer;