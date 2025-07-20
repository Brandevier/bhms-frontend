import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks
export const createTemplate = createAsyncThunk(
  'lab/createTemplate',
  async (templateData, { rejectWithValue,getState }) => {
    const user = getState().auth.user || getState().auth.admin
    try {
      const response = await apiClient.post('/lab/templates', {
        ...templateData,
        createdBy:user.id
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create template' });
    }
  }
);

export const fetchTemplates = createAsyncThunk(
  'lab/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab/templates');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch templates' });
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'lab/updateTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lab/templates/${id}`, templateData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update template' });
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'lab/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/lab/templates/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete template' });
    }
  }
);

export const createTestResult = createAsyncThunk(
  'lab/createTestResult',
  async (resultData, { rejectWithValue,getState }) => {
    const user = getState().auth.user || getState().auth.admin;
    try {
      const response = await apiClient.post('/lab/results', {
        ...resultData,
        user: user.id
      });
      if (!response.data) {
        throw new Error('Invalid response format');
      }
      console.log(response.data)
      return response.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response || { message: 'Failed to create test result' });
    }
  }
);

export const fetchTestResults = createAsyncThunk(
  'lab/fetchTestResults',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab/results', { params: filters });
      if (!Array.isArray(response.data?.results)) {
        throw new Error('Invalid response format');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch test results' });
    }
  }
);

export const fetchResultById = createAsyncThunk(
  'lab/fetchResultById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/lab/results/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch test result' });
    }
  }
);

const initialState = {
  templates: [],
  results: [],
  currentResult: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    resetLabState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Template CRUD
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.unshift(action.payload.template);
        state.success = true;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data.templates || [];
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.map(template =>
          template.id === action.payload.template.id ? action.payload.template : template
        );
        state.success = true;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(template => template.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Test Results
      .addCase(createTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results.unshift(action.payload.result);
        state.success = true;
      })
      .addCase(createTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload.result;
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  }
});

export const { resetLabState, clearCurrentResult, setPagination } = labSlice.actions;

export default labSlice.reducer;