import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const createDischarge = createAsyncThunk(
  'discharge/createDischarge',
  async (dischargeData, { rejectWithValue,getState }) => {
    const { auth } = getState()
    const user =auth.user
    try {
      const response = await apiClient.post('/discharge/',{
        ...dischargeData,
        doctor_id:user.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDischarges = createAsyncThunk(
  'discharge/fetchDischarges',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDischargeById = createAsyncThunk(
  'discharge/fetchDischargeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDischarge = createAsyncThunk(
  'discharge/updateDischarge',
  async ({ id, dischargeData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(id, dischargeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelDischarge = createAsyncThunk(
  'discharge/cancelDischarge',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDischargeStats = createAsyncThunk(
  'discharge/fetchDischargeStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const dischargeSlice = createSlice({
  name: 'discharge',
  initialState: {
    discharges: [],
    currentDischarge: null,
    stats: [],
    loading: false,
    error: null,
    success: false,
    filters: {
      type: null,
      patient_id: null,
      doctor_id: null,
      start_date: null,
      end_date: null
    }
  },
  reducers: {
    resetDischargeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setDischargeFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentDischarge: (state) => {
      state.currentDischarge = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Discharge
      .addCase(createDischarge.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDischarge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.discharges.unshift(action.payload);
      })
      .addCase(createDischarge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create discharge';
      })
      
      // Fetch Discharges
      .addCase(fetchDischarges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischarges.fulfilled, (state, action) => {
        state.loading = false;
        state.discharges = action.payload;
      })
      .addCase(fetchDischarges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch discharges';
      })
      
      // Fetch Single Discharge
      .addCase(fetchDischargeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischargeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDischarge = action.payload;
      })
      .addCase(fetchDischargeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch discharge';
      })
      
      // Update Discharge
      .addCase(updateDischarge.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDischarge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentDischarge = action.payload;
        state.discharges = state.discharges.map(discharge => 
          discharge.id === action.payload.id ? action.payload : discharge
        );
      })
      .addCase(updateDischarge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update discharge';
      })
      
      // Cancel Discharge
      .addCase(cancelDischarge.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelDischarge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.discharges = state.discharges.filter(
          discharge => discharge.id !== action.payload.id
        );
      })
      .addCase(cancelDischarge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to cancel discharge';
      })
      
      // Fetch Stats
      .addCase(fetchDischargeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischargeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDischargeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch discharge stats';
      });
  }
});

// Export actions and reducer
export const { resetDischargeState, setDischargeFilters, clearCurrentDischarge } = dischargeSlice.actions;
export default dischargeSlice.reducer;