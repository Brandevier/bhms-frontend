import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks for API Calls

// Fetch all services
export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (_, { rejectWithValue,getState }) => {
    const { admin,user } = getState().auth;
    const institution_id = admin.institution.id || user.institution.id
    try {
      const response = await apiClient.get(`/service/institution`,{
        params:{
            institution_id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new service
export const createService = createAsyncThunk(
  'service/createService',
  async (serviceData, { rejectWithValue,getState }) => {
    const { admin,user } = getState().auth;
    const institution_id = admin.institution.id || user.institution.id
    try {
      const response = await apiClient.post('/create-service', {
        ...serviceData,
        institution_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a service
export const deleteService = createAsyncThunk(
  'service/deleteService',
  async (serviceId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/invoices/delete-invoice`);
      return serviceId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch patient invoices
export const fetchPatientInvoices = createAsyncThunk(
  'service/fetchPatientInvoices',
  async ({ patient_id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/invoices/patient`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a patient invoice
export const createPatientInvoice = createAsyncThunk(
  'service/createPatientInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a patient invoice
export const updatePatientInvoice = createAsyncThunk(
  'service/updatePatientInvoice',
  async ({ invoice_id, amount, is_free }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/invoices/${invoice_id}`, { amount, is_free });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a patient invoice
export const deletePatientInvoice = createAsyncThunk(
  'service/deletePatientInvoice',
  async (invoiceId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/invoices/${invoiceId}`);
      return invoiceId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Make a patient payment
export const makePatientPayment = createAsyncThunk(
  'service/makePatientPayment',
  async ({ id, patient_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/invoices/pay`, { id, patient_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  services: [],
  invoices: [],
  loading: false,
  error: null,
};

// Slice
const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Service
      .addCase(createService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Patient Invoices
      .addCase(fetchPatientInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchPatientInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Patient Invoice
      .addCase(createPatientInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPatientInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createPatientInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Patient Invoice
      .addCase(updatePatientInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatientInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        );
      })
      .addCase(updatePatientInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Patient Invoice
      .addCase(deletePatientInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatientInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
      })
      .addCase(deletePatientInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Make Patient Payment
      .addCase(makePatientPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(makePatientPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        );
      })
      .addCase(makePatientPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;