import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async thunks for each API endpoint
export const fetchOutstandingPayments = createAsyncThunk(
  'accounts/fetchOutstandingPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/outstanding-payments');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNHIAClaims = createAsyncThunk(
  'accounts/fetchNHIAClaims',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/nhia-claims');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPatientCollections = createAsyncThunk(
  'accounts/fetchPatientCollections',
  async (visit_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/accounts/patient-collections/${visit_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDepartmentRevenue = createAsyncThunk(
  'accounts/fetchDepartmentRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/department-revenue');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchServiceTypeRevenue = createAsyncThunk(
  'accounts/fetchServiceTypeRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/service-type-revenue');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStaffBilling = createAsyncThunk(
  'accounts/fetchStaffBilling',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/staff-billing');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAgingReport = createAsyncThunk(
  'accounts/fetchAgingReport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/aging-report');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPatientBillsAndInvoices = createAsyncThunk(
  'accounts/fetchPatientBillsAndInvoices',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/accounts/patient-collections/${visitId}`);
      return { visitId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'accounts/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/accounts/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// mark payment
export const markBillAsPaid = createAsyncThunk(
  'accounts/markBillAsPaid',
  async ({bill_id,data}, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/accounts/bills/mark-payment/${bill_id}`,{
        ...data
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  outstandingPayments: {
    data: null,
    loading: false,
    error: null
  },
  nhiaClaims: {
    data: null,
    loading: false,
    error: null
  },
  patientCollections: {
    data: null,
    loading: false,
    error: null
  },
  departmentRevenue: {
    data: null,
    loading: false,
    error: null
  },
  serviceTypeRevenue: {
    data: null,
    loading: false,
    error: null
  },
  staffBilling: {
    data: null,
    loading: false,
    error: null
  },
  agingReport: {
    data: null,
    loading: false,
    error: null
  },
  patientBills: {
    data: {},
    loading: false,
    error: null
  },
  dashboard: {
    data: null,
    loading: false,
    error: null
  },
  markBillAsPaid: {
    loading: false,
    error: null
  }
};

// Accounts slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccountsError: (state) => {
      Object.keys(state).forEach(key => {
        if (state[key]?.error) {
          state[key].error = null;
        }
      });
    },
    clearPatientBills: (state, action) => {
      const visitId = action.payload;
      if (visitId && state.patientBills.data[visitId]) {
        delete state.patientBills.data[visitId];
      }
    }
  },
  extraReducers: (builder) => {
    // Outstanding Payments
    builder
      .addCase(fetchOutstandingPayments.pending, (state) => {
        state.outstandingPayments.loading = true;
        state.outstandingPayments.error = null;
      })
      .addCase(fetchOutstandingPayments.fulfilled, (state, action) => {
        state.outstandingPayments.loading = false;
        state.outstandingPayments.data = action.payload.data;
      })
      .addCase(fetchOutstandingPayments.rejected, (state, action) => {
        state.outstandingPayments.loading = false;
        state.outstandingPayments.error = action.payload;
      });

    // NHIA Claims
    builder
      .addCase(fetchNHIAClaims.pending, (state) => {
        state.nhiaClaims.loading = true;
        state.nhiaClaims.error = null;
      })
      .addCase(fetchNHIAClaims.fulfilled, (state, action) => {
        state.nhiaClaims.loading = false;
        state.nhiaClaims.data = action.payload.data;
      })
      .addCase(fetchNHIAClaims.rejected, (state, action) => {
        state.nhiaClaims.loading = false;
        state.nhiaClaims.error = action.payload;
      });

    // Patient Collections
    builder
      .addCase(fetchPatientCollections.pending, (state) => {
        state.patientCollections.loading = true;
        state.patientCollections.error = null;
      })
      .addCase(fetchPatientCollections.fulfilled, (state, action) => {
        state.patientCollections.loading = false;
        state.patientCollections.data = action.payload.data;
      })
      .addCase(fetchPatientCollections.rejected, (state, action) => {
        state.patientCollections.loading = false;
        state.patientCollections.error = action.payload;
      });

    // Department Revenue
    builder
      .addCase(fetchDepartmentRevenue.pending, (state) => {
        state.departmentRevenue.loading = true;
        state.departmentRevenue.error = null;
      })
      .addCase(fetchDepartmentRevenue.fulfilled, (state, action) => {
        state.departmentRevenue.loading = false;
        state.departmentRevenue.data = action.payload.data;
      })
      .addCase(fetchDepartmentRevenue.rejected, (state, action) => {
        state.departmentRevenue.loading = false;
        state.departmentRevenue.error = action.payload;
      });

    // Service Type Revenue
    builder
      .addCase(fetchServiceTypeRevenue.pending, (state) => {
        state.serviceTypeRevenue.loading = true;
        state.serviceTypeRevenue.error = null;
      })
      .addCase(fetchServiceTypeRevenue.fulfilled, (state, action) => {
        state.serviceTypeRevenue.loading = false;
        state.serviceTypeRevenue.data = action.payload.data;
      })
      .addCase(fetchServiceTypeRevenue.rejected, (state, action) => {
        state.serviceTypeRevenue.loading = false;
        state.serviceTypeRevenue.error = action.payload;
      });

    // Staff Billing
    builder
      .addCase(fetchStaffBilling.pending, (state) => {
        state.staffBilling.loading = true;
        state.staffBilling.error = null;
      })
      .addCase(fetchStaffBilling.fulfilled, (state, action) => {
        state.staffBilling.loading = false;
        state.staffBilling.data = action.payload.data;
      })
      .addCase(fetchStaffBilling.rejected, (state, action) => {
        state.staffBilling.loading = false;
        state.staffBilling.error = action.payload;
      });

    // Aging Report
    builder
      .addCase(fetchAgingReport.pending, (state) => {
        state.agingReport.loading = true;
        state.agingReport.error = null;
      })
      .addCase(fetchAgingReport.fulfilled, (state, action) => {
        state.agingReport.loading = false;
        state.agingReport.data = action.payload.data;
      })
      .addCase(fetchAgingReport.rejected, (state, action) => {
        state.agingReport.loading = false;
        state.agingReport.error = action.payload;
      });

    // Patient Bills and Invoices
    builder
      .addCase(fetchPatientBillsAndInvoices.pending, (state) => {
        state.patientBills.loading = true;
        state.patientBills.error = null;
      })
      .addCase(fetchPatientBillsAndInvoices.fulfilled, (state, action) => {
        state.patientBills.loading = false;
        state.patientBills.data[action.payload.visitId] = action.payload.data;
      })
      .addCase(fetchPatientBillsAndInvoices.rejected, (state, action) => {
        state.patientBills.loading = false;
        state.patientBills.error = action.payload;
      });

    // Dashboard
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload.data;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      })
      // Mark Bill as Paid
      .addCase(markBillAsPaid.pending, (state) => {
        state.markBillAsPaid.loading = true;
        state.markBillAsPaid.error = null;
      })
      .addCase(markBillAsPaid.fulfilled, (state, action) => {
        state.markBillAsPaid.loading = false;
        // Optionally, update the specific bill in state if needed
      })
      .addCase(markBillAsPaid.rejected, (state, action) => {
        state.markBillAsPaid.loading = false;
        state.markBillAsPaid.error = action.payload;
      });
  }
});

export const { clearAccountsError, clearPatientBills } = accountsSlice.actions;

// Selectors
export const selectOutstandingPayments = (state) => state.accounts.outstandingPayments;
export const selectNHIAClaims = (state) => state.accounts.nhiaClaims;
export const selectPatientCollections = (state) => state.accounts.patientCollections;
export const selectDepartmentRevenue = (state) => state.accounts.departmentRevenue;
export const selectServiceTypeRevenue = (state) => state.accounts.serviceTypeRevenue;
export const selectStaffBilling = (state) => state.accounts.staffBilling;
export const selectAgingReport = (state) => state.accounts.agingReport;
export const selectPatientBills = (state, visitId) => 
  state.accounts.patientBills.data[visitId] || null;
export const selectDashboard = (state) => state.accounts.dashboard;
export const selectAccountsLoading = (state) => 
  Object.values(state.accounts).some(section => section.loading);




export default accountsSlice.reducer;