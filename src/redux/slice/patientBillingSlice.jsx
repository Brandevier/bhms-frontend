import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Fetch all patients with billing summary
export const fetchPatientsWithBilling = createAsyncThunk(
  'patientBilling/fetchPatientsWithBilling',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/patients-billing', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch detailed billing history for a specific patient
export const fetchPatientBillingHistory = createAsyncThunk(
  'patientBilling/fetchPatientBillingHistory',
  async ({ patientId, institutionId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/accounts/patients-billing/${patientId}`, {
        params: { institution_id: institutionId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Make a payment for a patient's bill
export const makePatientPayment = createAsyncThunk(
  'patientBilling/makePatientPayment',
  async ({ patientId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/accounts/patients-billing/${patientId}/payment`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  patients: [],
  selectedPatient: null,
  patientHistory: null,
  loading: false,
  historyLoading: false,
  paymentLoading: false,
  error: null,
  historyError: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    status: 'all'
  }
};

const patientBillingSlice = createSlice({
  name: 'patientBilling',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
      state.patientHistory = null;
      state.historyError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.historyError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients with billing
      .addCase(fetchPatientsWithBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsWithBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPatientsWithBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch patients';
      })
      
      // Fetch patient billing history
      .addCase(fetchPatientBillingHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchPatientBillingHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.patientHistory = action.payload.data;
        state.selectedPatient = action.payload.data?.patient;
      })
      .addCase(fetchPatientBillingHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload?.message || 'Failed to fetch patient billing history';
      })
      
      // Make payment
      .addCase(makePatientPayment.pending, (state) => {
        state.paymentLoading = true;
      })
      .addCase(makePatientPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
      })
      .addCase(makePatientPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload?.message || 'Payment failed';
      });
  }
});

export const { setFilters, clearSelectedPatient, clearError } = patientBillingSlice.actions;
export default patientBillingSlice.reducer;

