import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  CLAIMS_DASHBOARD_SUMMARY,
  CLAIMS_DASHBOARD_RECENT,
  CLAIMS_DASHBOARD_ITEMS_BREAKDOWN,
  CLAIMS_LIST,
  CLAIMS_UPDATE_STATUS,
  CLAIMS_BY_ID
} from '../../api/endpoints';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async Thunks

// Fetch Claims Dashboard Summary
export const fetchClaimsSummary = createAsyncThunk(
  'claims/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CLAIMS_DASHBOARD_SUMMARY, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Recent Claims
export const fetchRecentClaims = createAsyncThunk(
  'claims/fetchRecent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CLAIMS_DASHBOARD_RECENT, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Claims Items Breakdown
export const fetchClaimsItemsBreakdown = createAsyncThunk(
  'claims/fetchItemsBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CLAIMS_DASHBOARD_ITEMS_BREAKDOWN, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch All Claims with pagination and filters
export const fetchAllClaims = createAsyncThunk(
  'claims/fetchAll',
  async ({ page = 1, limit = 10, status, startDate, endDate, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (search) params.append('search', search);

      const response = await axios.get(`${CLAIMS_LIST}?${params.toString()}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Single Claim by ID
export const fetchClaimById = createAsyncThunk(
  'claims/fetchById',
  async (claimId, { rejectWithValue }) => {
    try {
      const response = await axios.get(CLAIMS_BY_ID(claimId), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Claim Status
export const updateClaimStatus = createAsyncThunk(
  'claims/updateStatus',
  async ({ claim_id, claim_status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        CLAIMS_UPDATE_STATUS,
        { claim_id, claim_status },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  // Dashboard Data
  summary: {
    totalClaims: 0,
    totalAmount: 0,
    statusBreakdown: {
      approved: 0,
      rejected: 0,
      pending: 0,
      submitted: 0
    }
  },
  recentClaims: [],
  itemsBreakdown: [],
  monthlyTrend: [],
  
  // Claims List
  claims: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  },
  
  // Single Claim Details
  selectedClaim: null,
  
  // UI State
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
    dateRange: []
  }
};

// Claims Slice
const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        search: '',
        dateRange: []
      };
    },
    clearSelectedClaim: (state) => {
      state.selectedClaim = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Summary
      .addCase(fetchClaimsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchClaimsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Recent Claims
      .addCase(fetchRecentClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.recentClaims = action.payload;
      })
      .addCase(fetchRecentClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Items Breakdown
      .addCase(fetchClaimsItemsBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimsItemsBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsBreakdown = action.payload;
      })
      .addCase(fetchClaimsItemsBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Claims
      .addCase(fetchAllClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchAllClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Claim By ID
      .addCase(fetchClaimById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClaim = action.payload.data;
      })
      .addCase(fetchClaimById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Claim Status
      .addCase(updateClaimStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the claim in the list if it exists
        const updatedClaim = action.payload.claim;
        if (updatedClaim) {
          const index = state.claims.findIndex(c => c.id === updatedClaim.id);
          if (index !== -1) {
            state.claims[index] = { ...state.claims[index], ...updatedClaim };
          }
          // Update recent claims
          const recentIndex = state.recentClaims.findIndex(c => c.id === updatedClaim.id);
          if (recentIndex !== -1) {
            state.recentClaims[recentIndex] = { ...state.recentClaims[recentIndex], ...updatedClaim };
          }
        }
      })
      .addCase(updateClaimStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearSelectedClaim, clearError } = claimsSlice.actions;
export default claimsSlice.reducer;

