import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async thunks
export const fetchBillingStats = createAsyncThunk(
  'billing/fetchBillingStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/billing/stats', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecentTransactions = createAsyncThunk(
  'billing/fetchRecentTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/billing/recent-transactions', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createServiceBill = createAsyncThunk(
  'billing/createServiceBill',
  async (serviceBillData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/service-bills', serviceBillData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchServiceBillsByVisit = createAsyncThunk(
  'billing/fetchServiceBillsByVisit',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/visits/${visitId}/service-bills`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stats: {
    total_revenue: 0,
    paid_amount: 0,
    pending_invoices: 0,
    pending_amount: 0,
    overdue_invoices: 0,
    overdue_amount: 0,
    payment_methods: []
  },
  recentTransactions: [],
  serviceBills: [],
  loading: false,
  error: null
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearServiceBills: (state) => {
      state.serviceBills = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch billing stats
      .addCase(fetchBillingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchBillingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recent transactions
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.recentTransactions = action.payload.data;
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create service bill
      .addCase(createServiceBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceBill.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceBills.push(action.payload.data);
      })
      .addCase(createServiceBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch service bills by visit
      .addCase(fetchServiceBillsByVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceBillsByVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceBills = action.payload.data;
      })
      .addCase(fetchServiceBillsByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearServiceBills } = billingSlice.actions;
export default billingSlice.reducer;