import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunk for fetching billing statistics
export const fetchBillingStatistics = createAsyncThunk(
  'billingStatistics/fetchBillingStatistics',
  async (_, { rejectWithValue, getState }) => {

    const { auth } = getState()
    const user = auth.user || auth.admin

    try {
      const response = await apiClient.get('/bills/statistics', {
        params: {
          institution_id: user.institution.id,
          
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for refreshing specific statistics
export const refreshBillingStats = createAsyncThunk(
  'billingStatistics/refreshStats',
  async ({ statsType }, { rejectWithValue }) => {
    const { auth } = getState()
    const user = auth.user || auth.admin
    try {
      const response = await apiClient.get('/bills/statistics', {
        institution_id: user.institution.id,
        statsType
      });
      return { statsType, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  overview: {
    total_bills: 0,
    total_revenue: 0,
    paid_bills: 0,
    unpaid_bills: 0,
    payment_success_rate: 0,
    loading: false,
    error: null
  },
  time_based: {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    loading: false,
    error: null,
    currentRange: 'monthly'
  },
  departments: {
    by_count: [],
    by_revenue: [],
    total_departments: 0,
    loading: false,
    error: null
  },
  services: {
    most_requested: [],
    highest_revenue: [],
    average_service_cost: 0,
    total_services: 0,
    loading: false,
    error: null
  },
  trends: {
    daily: [],
    monthly: [],
    weekly: [],
    loading: false,
    error: null
  },
  current_period: {
    day: { count: 0, paid: 0, revenue: 0 },
    week: { count: 0, paid: 0, revenue: 0 },
    month: { count: 0, paid: 0, revenue: 0 },
    year: { count: 0, paid: 0, revenue: 0 },
    loading: false,
    error: null
  },
  patients: {
    average_bills_per_patient: 0,
    top_patients_by_bills: [],
    top_patients_by_spending: [],
    loading: false,
    error: null
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const billingStatisticsSlice = createSlice({
  name: 'billingStatistics',
  initialState,
  reducers: {
    resetBillingStats: () => initialState,
    setTimeRange: (state, action) => {
      state.time_based.currentRange = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all statistics
      .addCase(fetchBillingStatistics.pending, (state) => {
        state.status = 'loading';
        state.overview.loading = true;
        state.time_based.loading = true;
        state.departments.loading = true;
        state.services.loading = true;
        state.trends.loading = true;
        state.current_period.loading = true;
        state.patients.loading = true;
      })
      .addCase(fetchBillingStatistics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overview = {
          ...action.payload.overview,
          loading: false,
          error: null
        };
        state.time_based = {
          ...state.time_based,
          ...action.payload.time_based,
          loading: false,
          error: null
        };
        state.departments = {
          ...action.payload.department_stats,
          loading: false,
          error: null
        };
        state.services = {
          ...action.payload.service_stats,
          loading: false,
          error: null
        };
        state.trends = {
          ...action.payload.trends,
          loading: false,
          error: null
        };
        state.current_period = {
          ...action.payload.current_period,
          loading: false,
          error: null
        };
        state.patients = {
          ...action.payload.patient_stats,
          loading: false,
          error: null
        };
      })
      .addCase(fetchBillingStatistics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.overview.loading = false;
        state.time_based.loading = false;
        state.departments.loading = false;
        state.services.loading = false;
        state.trends.loading = false;
        state.current_period.loading = false;
        state.patients.loading = false;
      })

      // Refresh specific statistics
      .addCase(refreshBillingStats.pending, (state, action) => {
        const { statsType } = action.meta.arg;
        if (statsType === 'departments') {
          state.departments.loading = true;
        } else if (statsType === 'services') {
          state.services.loading = true;
        } else if (statsType === 'trends') {
          state.trends.loading = true;
        } else if (statsType === 'current_period') {
          state.current_period.loading = true;
        } else if (statsType === 'patients') {
          state.patients.loading = true;
        }
      })
      .addCase(refreshBillingStats.fulfilled, (state, action) => {
        const { statsType, data } = action.payload;

        if (statsType === 'departments') {
          state.departments = {
            ...data.department_stats,
            loading: false,
            error: null
          };
        } else if (statsType === 'services') {
          state.services = {
            ...data.service_stats,
            loading: false,
            error: null
          };
        } else if (statsType === 'trends') {
          state.trends = {
            ...data.trends,
            loading: false,
            error: null
          };
        } else if (statsType === 'current_period') {
          state.current_period = {
            ...data.current_period,
            loading: false,
            error: null
          };
        } else if (statsType === 'patients') {
          state.patients = {
            ...data.patient_stats,
            loading: false,
            error: null
          };
        }
      })
      .addCase(refreshBillingStats.rejected, (state, action) => {
        const { statsType } = action.meta.arg;
        const error = action.payload;

        if (statsType === 'departments') {
          state.departments.loading = false;
          state.departments.error = error;
        } else if (statsType === 'services') {
          state.services.loading = false;
          state.services.error = error;
        } else if (statsType === 'trends') {
          state.trends.loading = false;
          state.trends.error = error;
        } else if (statsType === 'current_period') {
          state.current_period.loading = false;
          state.current_period.error = error;
        } else if (statsType === 'patients') {
          state.patients.loading = false;
          state.patients.error = error;
        }
      });
  }
});

export const { resetBillingStats, setTimeRange } = billingStatisticsSlice.actions;

// Selectors
export const selectOverviewStats = (state) => state.billingStatistics.overview;
export const selectTimeBasedStats = (state) => state.billingStatistics.time_based;
export const selectDepartmentStats = (state) => state.billingStatistics.departments;
export const selectServiceStats = (state) => state.billingStatistics.services;
export const selectTrendStats = (state) => state.billingStatistics.trends;
export const selectCurrentPeriodStats = (state) => state.billingStatistics.current_period;
export const selectPatientStats = (state) => state.billingStatistics.patients;
export const selectStatsStatus = (state) => state.billingStatistics.status;
export const selectStatsError = (state) => state.billingStatistics.error;

export default billingStatisticsSlice.reducer;