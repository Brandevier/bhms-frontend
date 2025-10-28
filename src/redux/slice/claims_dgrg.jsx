import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const createGDRGCode = createAsyncThunk(
  'gdrgCodes/createGDRGCode',
  async (codeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('gdrg/gdrg-codes', codeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllGDRGCodes = createAsyncThunk(
  'gdrgCodes/fetchAllGDRGCodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/gdrg/gdrg-codes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGDRGCodeByCode = createAsyncThunk(
  'gdrgCodes/fetchGDRGCodeByCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/gdrg/gdrg-codes/${code}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGDRGCode = createAsyncThunk(
  'gdrgCodes/updateGDRGCode',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/gdrg/gdrg-codes/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGDRGCode = createAsyncThunk(
  'gdrgCodes/deleteGDRGCode',
  async (code, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/gdrg-codes/${code}`);
      return code;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchGDRGCodes = createAsyncThunk(
  'gdrgCodes/searchGDRGCodes',
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/gdrg-codes/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const gdrgCodeSlice = createSlice({
  name: 'gdrgCodes',
  initialState: {
    codes: [],
    currentCode: null,
    searchResults: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearCurrentCode: (state) => {
      state.currentCode = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create GDRG Code
      .addCase(createGDRGCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGDRGCode.fulfilled, (state, action) => {
        state.loading = false;
        state.codes.push(action.payload);
        state.success = true;
      })
      .addCase(createGDRGCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Fetch All GDRG Codes
      .addCase(fetchAllGDRGCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGDRGCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = action.payload;
      })
      .addCase(fetchAllGDRGCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Fetch GDRG Code By Code
      .addCase(fetchGDRGCodeByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCode = null;
      })
      .addCase(fetchGDRGCodeByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCode = action.payload;
      })
      .addCase(fetchGDRGCodeByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Update GDRG Code
      .addCase(updateGDRGCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGDRGCode.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.codes.findIndex(code => code.code === action.payload.code);
        if (index !== -1) {
          state.codes[index] = action.payload;
        }
        if (state.currentCode?.code === action.payload.code) {
          state.currentCode = action.payload;
        }
        state.success = true;
      })
      .addCase(updateGDRGCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Delete GDRG Code
      .addCase(deleteGDRGCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteGDRGCode.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = state.codes.filter(code => code.code !== action.payload);
        if (state.currentCode?.code === action.payload) {
          state.currentCode = null;
        }
        state.success = true;
      })
      .addCase(deleteGDRGCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Search GDRG Codes
      .addCase(searchGDRGCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGDRGCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchGDRGCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      });
  }
});

// Export actions and reducer
export const { clearCurrentCode, clearSearchResults, resetSuccess } = gdrgCodeSlice.actions;
export default gdrgCodeSlice.reducer;