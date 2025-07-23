import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async Thunks
export const createPrescription = createAsyncThunk(
  'prescriptions/create',
  async (prescriptionData, { rejectWithValue,getState }) => {
    const { user } = getState().auth; // Get the current user from the auth state
    try {
      const response = await apiClient.post('/prescriptions', {
        ...prescriptionData,
        institution_id: user.institution.id, // Include institution_id from the user
        department_id: user.department.id, // Include department_id from the user
        doctor_id:user.id // Include doctor_id from the user
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/prescriptions', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPrescriptionById = createAsyncThunk(
  'prescriptions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePrescription = createAsyncThunk(
  'prescriptions/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/prescriptions/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePrescription = createAsyncThunk(
  'prescriptions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/prescriptions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPrescriptionsByVisit = createAsyncThunk(
  'prescriptions/fetchByVisit',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/prescriptions/visit/${visitId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePrescriptionStatus = createAsyncThunk(
  'prescriptions/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/prescriptions/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPharmacyDashboardStats = createAsyncThunk(
  'prescriptions/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/prescriptions/dashboard/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  prescriptions: [],
  currentPrescription: null,
  dashboardStats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  }
};

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearCurrentPrescription(state) {
      state.currentPrescription = null;
    },
    resetPrescriptionError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Prescription
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions.unshift(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
          limit: action.payload.limit
        };
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Prescription by ID
      .addCase(fetchPrescriptionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPrescription = action.payload;
      })
      .addCase(fetchPrescriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Prescription
      .addCase(updatePrescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
        if (state.currentPrescription?.id === action.payload.id) {
          state.currentPrescription = action.payload;
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Prescription
      .addCase(deletePrescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
        if (state.currentPrescription?.id === action.payload) {
          state.currentPrescription = null;
        }
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Prescriptions by Visit
      .addCase(fetchPrescriptionsByVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrescriptionsByVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptionsByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Prescription Status
      .addCase(updatePrescriptionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePrescriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
        if (state.currentPrescription?.id === action.payload.id) {
          state.currentPrescription = action.payload;
        }
      })
      .addCase(updatePrescriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Dashboard Stats
      .addCase(fetchPharmacyDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPharmacyDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.data;
      })
      .addCase(fetchPharmacyDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentPrescription, resetPrescriptionError } = prescriptionSlice.actions;

export default prescriptionSlice.reducer;