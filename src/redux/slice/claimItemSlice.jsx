// slices/claimItemSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async thunks
export const createClaimItem = createAsyncThunk(
  'claimItem/create',
  async (claimItemData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/claim-items', claimItemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateClaimItem = createAsyncThunk(
  'claimItem/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/claim-items/${id}`, data); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const patchClaimItem = createAsyncThunk(
  'claimItem/patch',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/claim-items/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteClaimItem = createAsyncThunk(
  'claimItem/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/claim-items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchClaimItemsByClaim = createAsyncThunk(
  'claimItem/fetchByClaim',
  async (claimId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/claim-items/claim/${claimId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchClaimItem = createAsyncThunk(
  'claimItem/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/claim-items/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get claims getClaimSummary
export const fetchClaimSummary = createAsyncThunk(
  'claimItem/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/claim-items/dashboard/summary');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get claims recents
export const fetchRecentClaims = createAsyncThunk(
  'claimItem/fetchRecent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/claim-items/dashboard/recent');
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get claim items breakdown
export const fetchClaimItemsBreakdown = createAsyncThunk(
  'claimItem/fetchItemsBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/claim-items/dashboard/items-breakdown');
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const claimItemSlice = createSlice({
  name: 'claimItem',
  initialState: {
    items: [],
    summary: null,
    recentClaims: [],
    itemsBreakdown: [],
    currentItem: null,
    loading: false,
    error: null,
    success: false,
    operation: null, // 'creating', 'updating', 'deleting', 'fetching'
    claimItemsByClaim: {} // Cache by claim ID
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearClaimItemsCache: (state) => {
      state.claimItemsByClaim = {};
    },
    resetClaimItemState: (state) => {
      state.items = [];
      state.currentItem = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.operation = null;
      state.claimItemsByClaim = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Claim Item
      .addCase(createClaimItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'creating';
      })
      .addCase(createClaimItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        state.items.push(action.payload);
        // Clear cache for the claim this item belongs to
        if (action.payload.claim_id) {
          delete state.claimItemsByClaim[action.payload.claim_id];
        }
      })
      .addCase(createClaimItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      
      // Update Claim Item
      .addCase(updateClaimItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'updating';
      })
      .addCase(updateClaimItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Clear cache for the claim this item belongs to
        if (action.payload.claim_id) {
          delete state.claimItemsByClaim[action.payload.claim_id];
        }
      })
      .addCase(updateClaimItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      
      // Patch Claim Item
      .addCase(patchClaimItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'updating';
      })
      .addCase(patchClaimItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Clear cache for the claim this item belongs to
        if (action.payload.claim_id) {
          delete state.claimItemsByClaim[action.payload.claim_id];
        }
      })
      .addCase(patchClaimItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      
      // Delete Claim Item
      .addCase(deleteClaimItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'deleting';
      })
      .addCase(deleteClaimItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        state.items = state.items.filter(item => item.id !== action.payload);
        // Clear cache for all claims since we don't know which claim this belonged to
        state.claimItemsByClaim = {};
      })
      .addCase(deleteClaimItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      
      // Fetch Claim Items by Claim
      .addCase(fetchClaimItemsByClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching';
      })
      .addCase(fetchClaimItemsByClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.operation = null;
        const claimId = action.meta.arg;
        state.claimItemsByClaim[claimId] = action.payload;
      })
      .addCase(fetchClaimItemsByClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      
      // Fetch Single Claim Item
      .addCase(fetchClaimItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching';
      })
      .addCase(fetchClaimItem.fulfilled, (state, action) => {
        state.loading = false;
        state.operation = null;
        state.currentItem = action.payload;
      })
      .addCase(fetchClaimItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Fetch Claim Summary
      .addCase(fetchClaimSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching';
      })
      .addCase(fetchClaimSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.operation = null;
        state.summary = action.payload;
      })
      .addCase(fetchClaimSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Fetch Recent Claims
      .addCase(fetchRecentClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching';
      })
      .addCase(fetchRecentClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.operation = null;
        state.recentClaims = action.payload;
      })
      .addCase(fetchRecentClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Fetch Claim Items Breakdown
      .addCase(fetchClaimItemsBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching';
      })
      .addCase(fetchClaimItemsBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.operation = null;
        state.itemsBreakdown = action.payload;
      })
      .addCase(fetchClaimItemsBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  clearCurrentItem,
  clearClaimItemsCache,
  resetClaimItemState,
} = claimItemSlice.actions;

export default claimItemSlice.reducer;