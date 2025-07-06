import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const fetchMedications = createAsyncThunk(
  'nhiaMedications/fetchAll',
  async ({ page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/claims/medications', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch medications');
    }
  }
);

export const fetchMedicationByCode = createAsyncThunk(
  'nhiaMedications/fetchOne',
  async (code, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/claims/medications/${code}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Medication not found');
    }
  }
);

export const createMedication = createAsyncThunk(
  'nhiaMedications/create',
  async (medicationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/claims/medications/nhia-medications', medicationData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create medication');
    }
  }
);

export const updateMedication = createAsyncThunk(
  'nhiaMedications/update',
  async ({ code, ...medicationData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/claims/medications/nhia-medications/${code}`, medicationData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update medication');
    }
  }
);

export const deleteMedication = createAsyncThunk(
  'nhiaMedications/delete',
  async (code, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/claims/medications/nhia-medications/${code}`);
      return code;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete medication');
    }
  }
);

// Slice
const nhiaMedicationsSlice = createSlice({
  name: 'nhiaMedications',
  initialState: {
    items: [],
    currentMedication: null,
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 1
    },
    loading: false,
    error: null,
    operation: null, // 'create' | 'update' | 'delete'
    lastUpdated: null
  },
  reducers: {
    resetCurrentMedication: (state) => {
      state.currentMedication = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Fetch Single
      .addCase(fetchMedicationByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicationByCode.fulfilled, (state, action) => {
        state.currentMedication = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchMedicationByCode.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Create
      .addCase(createMedication.pending, (state) => {
        state.operation = 'create';
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedication.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.pageSize);
        state.loading = false;
        state.operation = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createMedication.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.operation = null;
      })
      
      // Update
      .addCase(updateMedication.pending, (state) => {
        state.operation = 'update';
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.code === action.payload.data.code);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.currentMedication = action.payload.data;
        state.loading = false;
        state.operation = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.operation = null;
      })
      
      // Delete
      .addCase(deleteMedication.pending, (state, action) => {
        state.operation = 'delete';
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.code !== action.payload);
        state.pagination.totalItems -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.pageSize);
        state.loading = false;
        state.operation = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.operation = null;
      });
  }
});

// Selectors
export const selectAllMedications = (state) => state.nhiaMedications.items;
export const selectCurrentMedication = (state) => state.nhiaMedications.currentMedication;
export const selectMedicationByCode = (code) => (state) => 
  state.nhiaMedications.items.find(item => item.code === code);
export const selectPagination = (state) => state.nhiaMedications.pagination;
export const selectLoading = (state) => state.nhiaMedications.loading;
export const selectError = (state) => state.nhiaMedications.error;
export const selectOperation = (state) => state.nhiaMedications.operation;
export const selectLastUpdated = (state) => state.nhiaMedications.lastUpdated;

// Actions
export const { resetCurrentMedication, clearError } = nhiaMedicationsSlice.actions;

export default nhiaMedicationsSlice.reducer;