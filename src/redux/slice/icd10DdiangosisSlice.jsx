import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const fetchDiagnoses = createAsyncThunk(
  'diagnoses/fetchAll',
  async ({ gender, search }, { rejectWithValue }) => {
    try {
      const params = {};
      if (gender) params.gender = gender;
      if (search) params.search = search;
      
      const response = await apiClient.get('/icd10/diagnoses', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch diagnoses');
    }
  }
);

export const fetchAllDiagnoses = createAsyncThunk(
  'diagnoses/fetchCompleteList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/icd10/diagnoses/all');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch all diagnoses');
    }
  }
);

export const fetchDiagnosisById = createAsyncThunk(
  'diagnoses/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/icd10/diagnoses/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Diagnosis not found');
    }
  }
);

export const createDiagnosis = createAsyncThunk(
  'diagnoses/create',
  async (diagnosisData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/icd10/diagnoses', diagnosisData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create diagnosis');
    }
  }
);

export const updateDiagnosis = createAsyncThunk(
  'diagnoses/update',
  async ({ id, ...diagnosisData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/icd10/diagnoses/${id}`, diagnosisData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update diagnosis');
    }
  }
);

export const deleteDiagnosis = createAsyncThunk(
  'diagnoses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/icd10/diagnoses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete diagnosis');
    }
  }
);

// Slice
const diagnosesSlice = createSlice({
  name: 'diagnoses',
  initialState: {
    items: [],
    completeList: [], // Stores unfiltered list
    currentDiagnosis: null,
    loading: false,
    error: null,
    lastOperation: null,
    filters: {
      gender: null,
      search: ''
    }
  },
  reducers: {
    setDiagnosisFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentDiagnosis: (state) => {
      state.currentDiagnosis = null;
    },
    resetDiagnosesState: (state) => {
      state.items = [];
      state.completeList = [];
      state.currentDiagnosis = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch filtered diagnoses
      .addCase(fetchDiagnoses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagnoses.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchDiagnoses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Fetch complete unfiltered list
      .addCase(fetchAllDiagnoses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDiagnoses.fulfilled, (state, action) => {
        state.completeList = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllDiagnoses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Fetch single diagnosis
      .addCase(fetchDiagnosisById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosisById.fulfilled, (state, action) => {
        state.currentDiagnosis = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchDiagnosisById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Create diagnosis
      .addCase(createDiagnosis.pending, (state) => {
        state.lastOperation = 'create';
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiagnosis.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
        state.completeList.unshift(action.payload.data);
        state.loading = false;
        state.lastOperation = null;
      })
      .addCase(createDiagnosis.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.lastOperation = null;
      })
      
      // Update diagnosis
      .addCase(updateDiagnosis.pending, (state) => {
        state.lastOperation = 'update';
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiagnosis.fulfilled, (state, action) => {
        const updateItem = (arr) => {
          const index = arr.findIndex(item => item.id === action.payload.data.id);
          if (index !== -1) arr[index] = action.payload.data;
        };
        
        updateItem(state.items);
        updateItem(state.completeList);
        state.currentDiagnosis = action.payload.data;
        state.loading = false;
        state.lastOperation = null;
      })
      .addCase(updateDiagnosis.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.lastOperation = null;
      })
      
      // Delete diagnosis
      .addCase(deleteDiagnosis.pending, (state) => {
        state.lastOperation = 'delete';
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiagnosis.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.completeList = state.completeList.filter(item => item.id !== action.payload);
        state.loading = false;
        state.lastOperation = null;
      })
      .addCase(deleteDiagnosis.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.lastOperation = null;
      });
  }
});

// Selectors
export const selectFilteredDiagnoses = (state) => state.icd10.items;
export const selectAllDiagnoses = (state) => state.icd10.completeList;
export const selectCurrentDiagnosis = (state) => state.icd10.currentDiagnosis;
export const selectDiagnosisById = (id) => (state) => 
  state.icd10.completeList.find(item => item.id === id);
export const selectDiagnosesLoading = (state) => state.icd10.loading;
export const selectDiagnosesError = (state) => state.icd10.error;
export const selectDiagnosesFilters = (state) => state.icd10.filters;
export const selectLastOperation = (state) => state.icd10.lastOperation;

// Actions
export const { 
  setDiagnosisFilters, 
  clearCurrentDiagnosis,
  resetDiagnosesState 
} = diagnosesSlice.actions;

export default diagnosesSlice.reducer;