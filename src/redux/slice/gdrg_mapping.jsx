import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const fetchAllMappings = createAsyncThunk(
  'icd10GDRG/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/gdrg/icd10-gdrg-mappings');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addMapping = createAsyncThunk(
  'icd10GDRG/add',
  async (mappingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/icd10-gdrg-mappings', mappingData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateMapping = createAsyncThunk(
  'icd10GDRG/update',
  async ({ gdrg_code, ...mappingData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/icd10-gdrg-mappings/${gdrg_code}`, mappingData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteMapping = createAsyncThunk(
  'icd10GDRG/delete',
  async (gdrg_code, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/icd10-gdrg-mappings/${gdrg_code}`);
      return gdrg_code;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice
const icd10GDRGSlice = createSlice({
  name: 'icd10GDRG',
  initialState: {
    mappings: [],
    loading: false,
    error: null,
    lastAction: null
  },
  reducers: {
    resetAction(state) {
      state.lastAction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMappings.fulfilled, (state, action) => {
        state.mappings = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllMappings.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch mappings';
        state.loading = false;
      })
      
      // Add
      .addCase(addMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMapping.fulfilled, (state, action) => {
        state.mappings.push(action.payload.data);
        state.lastAction = 'added';
        state.loading = false;
      })
      .addCase(addMapping.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to add mapping';
        state.loading = false;
      })
      
      // Update
      .addCase(updateMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMapping.fulfilled, (state, action) => {
        const index = state.mappings.findIndex(
          m => m.gdrg_code === action.payload.data.gdrg_code
        );
        if (index !== -1) {
          state.mappings[index] = action.payload.data;
        }
        state.lastAction = 'updated';
        state.loading = false;
      })
      .addCase(updateMapping.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update mapping';
        state.loading = false;
      })
      
      // Delete
      .addCase(deleteMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMapping.fulfilled, (state, action) => {
        state.mappings = state.mappings.filter(
          m => m.gdrg_code !== action.payload
        );
        state.lastAction = 'deleted';
        state.loading = false;
      })
      .addCase(deleteMapping.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete mapping';
        state.loading = false;
      });
  }
});

// Selectors
export const selectAllMappings = (state) => state.icd10GDRG.mappings;
export const selectMappingByCode = (gdrg_code) => (state) => 
  state.icd10GDRG.mappings.find(m => m.gdrg_code === gdrg_code);
export const selectLoadingStatus = (state) => state.icd10GDRG.loading;
export const selectLastAction = (state) => state.icd10GDRG.lastAction;
export const selectError = (state) => state.icd10GDRG.error;

// Actions
export const { resetAction } = icd10GDRGSlice.actions;

export default icd10GDRGSlice.reducer;