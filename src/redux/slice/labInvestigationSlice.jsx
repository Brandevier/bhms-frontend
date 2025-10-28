import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async Thunks
export const createLabInvestigation = createAsyncThunk(
  'labInvestigations/create',
  async (investigationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/lab-investigations', investigationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLabInvestigations = createAsyncThunk(
  'labInvestigations/fetchAll',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab-investigations', {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLabInvestigationById = createAsyncThunk(
  'labInvestigations/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/lab-investigations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLabInvestigation = createAsyncThunk(
  'labInvestigations/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/lab-investigations/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLabInvestigation = createAsyncThunk(
  'labInvestigations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/lab-investigations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchLabInvestigations = createAsyncThunk(
  'labInvestigations/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/lab-investigations/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const labInvestigationSlice = createSlice({
  name: 'labInvestigations',
  initialState: {
    investigations: [],
    currentInvestigation: null,
    searchResults: [],
    loading: false,
    error: null,
    pagination: {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 10
    }
  },
  reducers: {
    clearCurrentInvestigation: (state) => {
      state.currentInvestigation = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createLabInvestigation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLabInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations.unshift(action.payload);
      })
      .addCase(createLabInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create lab investigation';
      })
      
      // Fetch All
      .addCase(fetchLabInvestigations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = action.payload.investigations;
        state.pagination = {
          totalItems: action.payload.totalItems,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          limit: action.payload.limit || 10
        };
      })
      .addCase(fetchLabInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch lab investigations';
      })
      
      // Fetch One
      .addCase(fetchLabInvestigationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabInvestigationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvestigation = action.payload;
      })
      .addCase(fetchLabInvestigationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch lab investigation';
      })
      
      // Update
      .addCase(updateLabInvestigation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLabInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.investigations.findIndex(
          inv => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.investigations[index] = action.payload;
        }
        if (state.currentInvestigation?.id === action.payload.id) {
          state.currentInvestigation = action.payload;
        }
      })
      .addCase(updateLabInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update lab investigation';
      })
      
      // Delete
      .addCase(deleteLabInvestigation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLabInvestigation.fulfilled, (state, action) => {
        state.loading = false;
        state.investigations = state.investigations.filter(
          inv => inv.id !== action.payload
        );
        if (state.currentInvestigation?.id === action.payload) {
          state.currentInvestigation = null;
        }
      })
      .addCase(deleteLabInvestigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete lab investigation';
      })
      
      // Search
      .addCase(searchLabInvestigations.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchLabInvestigations.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchLabInvestigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to search lab investigations';
      });
  }
});

// Export actions and reducer
export const { clearCurrentInvestigation, clearSearchResults, resetError } = labInvestigationSlice.actions;
export default labInvestigationSlice.reducer;