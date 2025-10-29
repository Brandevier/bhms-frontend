import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';


// Async thunks
export const getAllClaims = createAsyncThunk(
  'claims/getAllClaims',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/claim-items/all-visits', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch claims');
    }
  }
);

export const getClaimById = createAsyncThunk(
  'claims/getClaimById',
  async (claimId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/claims/${claimId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch claim');
    }
  }
);

export const getClaimsByVisitId = createAsyncThunk(
  'claims/getClaimsByVisitId',
  async ({ visitId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/claims/visit/${visitId}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch claims by visit');
    }
  }
);

export const updateClaimStatus = createAsyncThunk(
  'claims/updateClaimStatus',
  async ({ claim_id, claim_status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/claims/update-claim-status', { claim_id, claim_status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update claim status');
    }
  }
);

export const approveClaimsInBatch = createAsyncThunk(
  'claims/approveClaimsInBatch',
  async (batch_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/claims/batch-approve', { batch_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to approve claims in batch');
    }
  }
);

const claimsSlice = createSlice({
  name: 'claims',
  initialState: {
    claims: [],
    currentClaim: null,
    claimsByVisit: [],
    loading: false,
    error: null,
    success: false,
    operation: null, // 'fetch', 'update', 'batch-approve'
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentClaim: (state) => {
      state.currentClaim = null;
    },
    clearClaimsByVisit: (state) => {
      state.claimsByVisit = [];
    },
    setOperation: (state, action) => {
      state.operation = action.payload;
    },
    // Manual updates for optimistic UI
    updateClaimInList: (state, action) => {
      const index = state.claims.findIndex(claim => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = { ...state.claims[index], ...action.payload };
      }
    },
    removeClaimFromList: (state, action) => {
      state.claims = state.claims.filter(claim => claim.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Claims
      .addCase(getAllClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getAllClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
        state.operation = null;
      })
      .addCase(getAllClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Get Claim By ID
      .addCase(getClaimById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getClaimById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClaim = action.payload.data;
        state.operation = null;
      })
      .addCase(getClaimById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Get Claims By Visit ID
      .addCase(getClaimsByVisitId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getClaimsByVisitId.fulfilled, (state, action) => {
        state.loading = false;
        state.claimsByVisit = action.payload.data;
        state.operation = null;
      })
      .addCase(getClaimsByVisitId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Update Claim Status
      .addCase(updateClaimStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'update';
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Update in claims list
        const claimIndex = state.claims.findIndex(claim => claim.id === action.payload.claim.id);
        if (claimIndex !== -1) {
          state.claims[claimIndex] = action.payload.claim;
        }
        
        // Update current claim if it's the same
        if (state.currentClaim && state.currentClaim.id === action.payload.claim.id) {
          state.currentClaim = action.payload.claim;
        }
        
        // Update in claimsByVisit list
        const visitClaimIndex = state.claimsByVisit.findIndex(claim => claim.id === action.payload.claim.id);
        if (visitClaimIndex !== -1) {
          state.claimsByVisit[visitClaimIndex] = action.payload.claim;
        }
        
        state.operation = null;
      })
      .addCase(updateClaimStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      })
      // Approve Claims In Batch
      .addCase(approveClaimsInBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'batch-approve';
      })
      .addCase(approveClaimsInBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Update all claims in the batch to "Approved"
        state.claims = state.claims.map(claim => 
          claim.batch_id === action.meta.arg 
            ? { ...claim, claim_status: 'Approved' }
            : claim
        );
        
        state.claimsByVisit = state.claimsByVisit.map(claim =>
          claim.batch_id === action.meta.arg
            ? { ...claim, claim_status: 'Approved' }
            : claim
        );
        
        state.operation = null;
      })
      .addCase(approveClaimsInBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentClaim, 
  clearClaimsByVisit,
  setOperation,
  updateClaimInList,
  removeClaimFromList
} = claimsSlice.actions;

export default claimsSlice.reducer;