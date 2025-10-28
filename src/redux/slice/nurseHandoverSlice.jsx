import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks
export const createNurseHandover = createAsyncThunk(
  'nurseHandover/createNurseHandover',
  async (handoverData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/nurse-handovers', handoverData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create handover');
    }
  }
);

export const getAllNurseHandovers = createAsyncThunk(
  'nurseHandover/getAllNurseHandovers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/nurse-handovers', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch handovers');
    }
  }
);

export const getNurseHandoverById = createAsyncThunk(
  'nurseHandover/getNurseHandoverById',
  async (handoverId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/nurse-handovers/${handoverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch handover');
    }
  }
);

export const updateNurseHandover = createAsyncThunk(
  'nurseHandover/updateNurseHandover',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/nurse-handovers/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update handover');
    }
  }
);

export const deleteNurseHandover = createAsyncThunk(
  'nurseHandover/deleteNurseHandover',
  async (handoverId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/nurse-handovers/${handoverId}`);
      return handoverId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete handover');
    }
  }
);

export const getHandoversByVisit = createAsyncThunk(
  'nurseHandover/getHandoversByVisit',
  async ({ visitId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/nurse-handovers/visit/${visitId}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visit handovers');
    }
  }
);

export const getHandoversByNurse = createAsyncThunk(
  'nurseHandover/getHandoversByNurse',
  async ({ nurseId, type = 'from', params = {} }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/nurse-handovers/nurse/${nurseId}`, { 
        params: { type, ...params } 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nurse handovers');
    }
  }
);

export const acknowledgeHandover = createAsyncThunk(
  'nurseHandover/acknowledgeHandover',
  async ({ handoverId, toNurseId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/nurse-handovers/${handoverId}/acknowledge`, {
        to_nurse_id: toNurseId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to acknowledge handover');
    }
  }
);

// Initial State
const initialState = {
  handovers: [],
  currentHandover: null,
  visitHandovers: [],
  nurseHandovers: [],
  loading: false,
  error: null,
  success: false,
  pagination: {
    current: 1,
    pages: 0,
    total: 0
  }
};

// Slice
const nurseHandoverSlice = createSlice({
  name: 'nurseHandover',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentHandover: (state) => {
      state.currentHandover = null;
    },
    clearHandovers: (state) => {
      state.handovers = [];
      state.pagination = {
        current: 1,
        pages: 0,
        total: 0
      };
    },
    clearVisitHandovers: (state) => {
      state.visitHandovers = [];
    },
    clearNurseHandovers: (state) => {
      state.nurseHandovers = [];
    },
    resetState: (state) => {
      state.handovers = [];
      state.currentHandover = null;
      state.visitHandovers = [];
      state.nurseHandovers = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.pagination = {
        current: 1,
        pages: 0,
        total: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Nurse Handover
      .addCase(createNurseHandover.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNurseHandover.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.handovers.unshift(action.payload.data);
      })
      .addCase(createNurseHandover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Nurse Handovers
      .addCase(getAllNurseHandovers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNurseHandovers.fulfilled, (state, action) => {
        state.loading = false;
        state.handovers = action.payload.data.handovers;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllNurseHandovers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Nurse Handover By ID
      .addCase(getNurseHandoverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNurseHandoverById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHandover = action.payload.data;
      })
      .addCase(getNurseHandoverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Nurse Handover
      .addCase(updateNurseHandover.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNurseHandover.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentHandover = action.payload.data;
        // Update in handovers list if exists
        const index = state.handovers.findIndex(h => h.id === action.payload.data.id);
        if (index !== -1) {
          state.handovers[index] = action.payload.data;
        }
      })
      .addCase(updateNurseHandover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Nurse Handover
      .addCase(deleteNurseHandover.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteNurseHandover.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.handovers = state.handovers.filter(h => h.id !== action.payload);
        if (state.currentHandover?.id === action.payload) {
          state.currentHandover = null;
        }
      })
      .addCase(deleteNurseHandover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Handovers By Visit
      .addCase(getHandoversByVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHandoversByVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visitHandovers = action.payload.data.handovers;
      })
      .addCase(getHandoversByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Handovers By Nurse
      .addCase(getHandoversByNurse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHandoversByNurse.fulfilled, (state, action) => {
        state.loading = false;
        state.nurseHandovers = action.payload.data.handovers;
      })
      .addCase(getHandoversByNurse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Acknowledge Handover
      .addCase(acknowledgeHandover.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(acknowledgeHandover.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentHandover = action.payload.data;
        // Update in handovers list if exists
        const index = state.handovers.findIndex(h => h.id === action.payload.data.id);
        if (index !== -1) {
          state.handovers[index] = action.payload.data;
        }
      })
      .addCase(acknowledgeHandover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  clearCurrentHandover,
  clearHandovers,
  clearVisitHandovers,
  clearNurseHandovers,
  resetState
} = nurseHandoverSlice.actions;

// Export reducer
export default nurseHandoverSlice.reducer;