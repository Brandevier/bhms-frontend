import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// Async Thunks
export const createInstitution = createAsyncThunk(
  'institutions/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/institutions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInstitution = createAsyncThunk(
  'institutions/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/institutions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllInstitutions = createAsyncThunk(
  'institutions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/institutions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInstitutionById = createAsyncThunk(
  'institutions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/institutions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminDetails = createAsyncThunk(
  'institutions/fetchAdminDetails',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/institutions/admin/${adminId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const institutionSlice = createSlice({
  name: 'institutions',
  initialState: {
    institutions: [],
    currentInstitution: null,
    adminDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetInstitutionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentInstitution: (state) => {
      state.currentInstitution = null;
    },
    clearAdminDetails: (state) => {
      state.adminDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Institution
      .addCase(createInstitution.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.institutions.push(action.payload.institution);
        state.success = true;
      })
      .addCase(createInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create institution';
      })

      // Update Institution
      .addCase(updateInstitution.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateInstitution.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.institutions.findIndex(
          inst => inst.id === action.payload.institution.id
        );
        if (index !== -1) {
          state.institutions[index] = action.payload.institution;
        }
        if (state.currentInstitution?.id === action.payload.institution.id) {
          state.currentInstitution = action.payload.institution;
        }
        state.success = true;
      })
      .addCase(updateInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update institution';
      })

      // Fetch All Institutions
      .addCase(fetchAllInstitutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInstitutions.fulfilled, (state, action) => {
        state.loading = false;
        state.institutions = action.payload;
      })
      .addCase(fetchAllInstitutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch institutions';
      })

      // Fetch Institution By ID
      .addCase(fetchInstitutionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInstitution = action.payload;
      })
      .addCase(fetchInstitutionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch institution';
      })

      // Fetch Admin Details
      .addCase(fetchAdminDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDetails = action.payload;
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch admin details';
      });
  }
});

// Export actions and reducer
export const { 
  resetInstitutionState, 
  clearCurrentInstitution,
  clearAdminDetails 
} = institutionSlice.actions;
export default institutionSlice.reducer;