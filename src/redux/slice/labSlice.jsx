import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks
export const createTemplate = createAsyncThunk(
  'lab/createTemplate',
  async (templateData, { rejectWithValue, getState }) => {
    const user = getState().auth.user || getState().auth.admin
    try {
      const response = await apiClient.post('/lab/templates', {
        ...templateData,
        createdBy: user.id
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
  async (resultData, { rejectWithValue, getState }) => {
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
      const response = await apiClient.get('/lab/results');
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response || { message: 'Failed to fetch test results' });
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

export const updateTestResult = createAsyncThunk(
  'lab/updateTestResult',
  async ({ id, resultData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lab/results/${id}`, resultData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response || { message: 'Failed to update test result' });
    }
  }
);

export const getLabStatistics = createAsyncThunk(
  'lab/getLabStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab/statistics');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response || { message: 'Failed to fetch lab statistics' });
    }
  }
);

export const createLabRange = createAsyncThunk(
  'lab/createLabRange',
  async (rangeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/lab/ranges', rangeData);
      return response.data;
    } catch (err) {

      return rejectWithValue(err.response?.data || { message: 'Failed to create lab range' });
    }
  }
);

export const getLabRanges = createAsyncThunk(
  'lab/getLabRanges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab/ranges');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch lab ranges' });
    }
  }
);

export const updateLabRange = createAsyncThunk(
  'lab/updateLabRange',
  async ({ id, rangeData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lab/ranges/${id}`, rangeData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update lab range' });
    }
  }
);

export const deleteLabRange = createAsyncThunk(
  'lab/deleteLabRange',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/lab/ranges/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete lab range' });
    }
  }
);


const initialState = {
  templates: [],
  results: [],
  currentResult: null,
  statistics: null,
  ranges: [],
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
        state.results = action.payload || [];
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
      })
      .addCase(updateTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results = state.results.map(result =>
          result.id === action.payload.result.id ? action.payload.result : result
        );
        state.currentResult = action.payload.result;
        state.success = true;
      }
      )
      .addCase(updateTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      )
      // Lab Statistics
      .addCase(getLabStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data || {};
      })
      .addCase(getLabStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      )
      // Lab Ranges
      .addCase(createLabRange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createLabRange.fulfilled, (state, action) => {
        state.loading = false;
        state.ranges.push(action.payload.range);
        state.success = true;
      }
      )
      .addCase(createLabRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      )
      .addCase(getLabRanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(getLabRanges.fulfilled, (state, action) => {
        state.loading = false;
        state.ranges = action.payload.labRanges || [];
      }
      )
      .addCase(getLabRanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      )
      .addCase(updateLabRange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      }
      )
      .addCase(updateLabRange.fulfilled, (state, action) => {
        state.loading = false;
        state.ranges = state.ranges.map(range =>
          range.id === action.payload.range.id ? action.payload.range : range
        );
        state.success = true;
      }
      )
      .addCase(updateLabRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      )
      .addCase(deleteLabRange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      }
      )
      .addCase(deleteLabRange.fulfilled, (state, action) => {
        state.loading = false;
        state.ranges = state.ranges.filter(range => range.id !== action.payload);
        state.success = true;
      }
      )
      .addCase(deleteLabRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      }
      );
  }
});

export const { resetLabState, clearCurrentResult, setPagination } = labSlice.actions;

export default labSlice.reducer;