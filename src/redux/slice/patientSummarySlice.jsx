// redux/slice/patientSummarySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const fetchInpatientOutpatientSummary = createAsyncThunk(
  'patientSummary/fetchInpatientOutpatientSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/patient-summary/inpatient-outpatient');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMonthlyInpatientOutpatient = createAsyncThunk(
  'patientSummary/fetchMonthlyInpatientOutpatient',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/patient-summary/monthly-trend');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDepartmentInpatientOutpatient = createAsyncThunk(
  'patientSummary/fetchDepartmentInpatientOutpatient',
  async (department_id = null, { rejectWithValue }) => {
    try {
      const params = department_id ? { department_id } : {};
      const response = await apiClient.get('/patient-summary/department-stats', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const patientSummarySlice = createSlice({
  name: 'patientSummary',
  initialState: {
    summary: null,
    monthlyTrend: [],
    departmentStats: [],
    loading: false,
    error: null,
    filters: {
      department_id: null
    }
  },
  reducers: {
    clearPatientSummary: (state) => {
      state.summary = null;
      state.monthlyTrend = [];
      state.departmentStats = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setDepartmentFilter: (state, action) => {
      state.filters.department_id = action.payload;
    },
    clearFilters: (state) => {
      state.filters.department_id = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inpatient/Outpatient Summary
      .addCase(fetchInpatientOutpatientSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInpatientOutpatientSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchInpatientOutpatientSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch patient summary';
      })
      // Fetch Monthly Trend
      .addCase(fetchMonthlyInpatientOutpatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyInpatientOutpatient.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTrend = action.payload;
      })
      .addCase(fetchMonthlyInpatientOutpatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch monthly trend';
      })
      // Fetch Department Stats
      .addCase(fetchDepartmentInpatientOutpatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentInpatientOutpatient.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentStats = action.payload;
      })
      .addCase(fetchDepartmentInpatientOutpatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch department statistics';
      });
  }
});

export const { 
  clearPatientSummary, 
  clearError, 
  setDepartmentFilter, 
  clearFilters 
} = patientSummarySlice.actions;
export default patientSummarySlice.reducer;