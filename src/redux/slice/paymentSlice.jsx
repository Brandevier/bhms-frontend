import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Create a new payment
export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get payments for an invoice
export const fetchInvoicePayments = createAsyncThunk(
  'payments/fetchInvoicePayments',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/payments/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get payments for a patient
export const fetchPatientPayments = createAsyncThunk(
  'payments/fetchPatientPayments',
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/payments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get a single payment
export const fetchPayment = createAsyncThunk(
  'payments/fetchPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Apply NHIS payment to a claim
export const applyNhisPayment = createAsyncThunk(
  'payments/applyNhisPayment',
  async ({ claimId, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/payments/claim/${claimId}/nhis`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Refund a payment
export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ paymentId, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/refund`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get payment statistics
export const fetchPaymentStats = createAsyncThunk(
  'payments/fetchPaymentStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/payments/stats/summary', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'payments/verifyPayment',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/payments/verify', { reference });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  payments: [],
  currentPayment: null,
  paymentStats: null,
  invoicePayments: [],
  patientPayments: [],
  loading: false,
  error: null,
  paymentSuccess: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    resetPaymentSuccess: (state) => {
      state.paymentSuccess = false;
    },
    clearPayments: (state) => {
      state.payments = [];
      state.currentPayment = null;
      state.invoicePayments = [];
      state.patientPayments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
        if (action.payload.data) {
          state.payments.unshift(action.payload.data);
          state.currentPayment = action.payload.data;
        }
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch invoice payments
      .addCase(fetchInvoicePayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicePayments.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicePayments = action.payload.data || [];
      })
      .addCase(fetchInvoicePayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch patient payments
      .addCase(fetchPatientPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.patientPayments = action.payload.data || [];
      })
      .addCase(fetchPatientPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single payment
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.data;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply NHIS payment
      .addCase(applyNhisPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyNhisPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(applyNhisPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refund payment
      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const index = state.payments.findIndex(p => p.id === action.payload.data.id);
          if (index !== -1) {
            state.payments[index] = action.payload.data;
          }
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch payment stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStats = action.payload.data;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.data;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearPaymentError, 
  clearCurrentPayment, 
  resetPaymentSuccess,
  clearPayments 
} = paymentSlice.actions;

export default paymentSlice.reducer;

