import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const uploadNHIAXML = createAsyncThunk(
  'nhiaVetting/uploadXML',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/nhia-vetting/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Upload failed' }
      );
    }
  }
);

export const fetchValidationRules = createAsyncThunk(
  'nhiaVetting/fetchValidationRules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/nhia-vetting/validation-rules');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch validation rules' }
      );
    }
  }
);

export const fetchNHIAMappings = createAsyncThunk(
  'nhiaVetting/fetchMappings',
  async ({ page = 1, limit = 50, activeOnly = true } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/nhia-vetting/mappings', {
        params: { page, limit, activeOnly },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch NHIA mappings' }
      );
    }
  }
);

export const createNHIAMapping = createAsyncThunk(
  'nhiaVetting/createMapping',
  async (mappingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/nhia-vetting/mappings', mappingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to create NHIA mapping' }
      );
    }
  }
);

// Initial State
const initialState = {
  // Upload State
  uploadStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  uploadError: null,
  uploadResult: null,
  
  // Validation Rules State
  validationRules: [],
  rulesStatus: 'idle',
  rulesError: null,
  
  // Mappings State
  mappings: [],
  mappingsPagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 50,
  },
  mappingsStatus: 'idle',
  mappingsError: null,
  
  // Create Mapping State
  createMappingStatus: 'idle',
  createMappingError: null,
  createdMapping: null,
};

// Slice
const nhiaVettingSlice = createSlice({
  name: 'nhiaVetting',
  initialState,
  reducers: {
    // Reset upload state
    resetUpload: (state) => {
      state.uploadStatus = 'idle';
      state.uploadError = null;
      state.uploadResult = null;
    },
    
    // Reset mapping creation state
    resetCreateMapping: (state) => {
      state.createMappingStatus = 'idle';
      state.createMappingError = null;
      state.createdMapping = null;
    },
    
    // Clear all errors
    clearErrors: (state) => {
      state.uploadError = null;
      state.rulesError = null;
      state.mappingsError = null;
      state.createMappingError = null;
    },
  },
  extraReducers: (builder) => {
    // Upload XML
    builder
      .addCase(uploadNHIAXML.pending, (state) => {
        state.uploadStatus = 'loading';
        state.uploadError = null;
      })
      .addCase(uploadNHIAXML.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.uploadResult = action.payload;
      })
      .addCase(uploadNHIAXML.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload;
      });

    // Fetch Validation Rules
    builder
      .addCase(fetchValidationRules.pending, (state) => {
        state.rulesStatus = 'loading';
        state.rulesError = null;
      })
      .addCase(fetchValidationRules.fulfilled, (state, action) => {
        state.rulesStatus = 'succeeded';
        state.validationRules = action.payload.data;
      })
      .addCase(fetchValidationRules.rejected, (state, action) => {
        state.rulesStatus = 'failed';
        state.rulesError = action.payload;
      });

    // Fetch NHIA Mappings
    builder
      .addCase(fetchNHIAMappings.pending, (state) => {
        state.mappingsStatus = 'loading';
        state.mappingsError = null;
      })
      .addCase(fetchNHIAMappings.fulfilled, (state, action) => {
        state.mappingsStatus = 'succeeded';
        state.mappings = action.payload.data.mappings;
        state.mappingsPagination = action.payload.data.pagination;
      })
      .addCase(fetchNHIAMappings.rejected, (state, action) => {
        state.mappingsStatus = 'failed';
        state.mappingsError = action.payload;
      });

    // Create NHIA Mapping
    builder
      .addCase(createNHIAMapping.pending, (state) => {
        state.createMappingStatus = 'loading';
        state.createMappingError = null;
      })
      .addCase(createNHIAMapping.fulfilled, (state, action) => {
        state.createMappingStatus = 'succeeded';
        state.createdMapping = action.payload.data;
        // Add the new mapping to the list
        state.mappings.unshift(action.payload.data);
      })
      .addCase(createNHIAMapping.rejected, (state, action) => {
        state.createMappingStatus = 'failed';
        state.createMappingError = action.payload;
      });
  },
});

// Export actions
export const { resetUpload, resetCreateMapping, clearErrors } = nhiaVettingSlice.actions;

// Export selectors
export const selectUploadStatus = (state) => state.nhiaVetting.uploadStatus;
export const selectUploadError = (state) => state.nhiaVetting.uploadError;
export const selectUploadResult = (state) => state.nhiaVetting.uploadResult;

export const selectValidationRules = (state) => state.nhiaVetting.validationRules;
export const selectRulesStatus = (state) => state.nhiaVetting.rulesStatus;
export const selectRulesError = (state) => state.nhiaVetting.rulesError;

export const selectMappings = (state) => state.nhiaVetting.mappings;
export const selectMappingsPagination = (state) => state.nhiaVetting.mappingsPagination;
export const selectMappingsStatus = (state) => state.nhiaVetting.mappingsStatus;
export const selectMappingsError = (state) => state.nhiaVetting.mappingsError;

export const selectCreateMappingStatus = (state) => state.nhiaVetting.createMappingStatus;
export const selectCreateMappingError = (state) => state.nhiaVetting.createMappingError;
export const selectCreatedMapping = (state) => state.nhiaVetting.createdMapping;

export default nhiaVettingSlice.reducer;