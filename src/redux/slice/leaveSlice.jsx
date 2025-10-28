// slices/leaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const requestLeave = createAsyncThunk(
  'leave/requestLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/leave/request', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const reviewLeave = createAsyncThunk(
  'leave/reviewLeave',
  async ({ leaveId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/leave/${status === 'approved' ? 'approve' : 'reject'}/${leaveId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leave/updateLeave',
  async ({ leaveId, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/leave/update/${leaveId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyLeaves = createAsyncThunk(
  'leave/fetchMyLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/leave/my-leaves');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLeaveBalance = createAsyncThunk(
  'leave/fetchLeaveBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/leave/balance');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaves: [],
    leaveBalance: [],
    loading: false,
    error: null,
    success: false,
    currentAction: null, // 'requesting', 'updating', 'reviewing'
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetLeaveState: (state) => {
      state.leaves = [];
      state.leaveBalance = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request Leave
      .addCase(requestLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.currentAction = 'requesting';
      })
      .addCase(requestLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentAction = null;
        state.leaves.unshift(action.payload.leave);
      })
      .addCase(requestLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentAction = null;
      })
      // Review Leave (Approve/Reject)
      .addCase(reviewLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAction = 'reviewing';
      })
      .addCase(reviewLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentAction = null;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.leave.id);
        if (index !== -1) {
          state.leaves[index] = action.payload.leave;
        }
      })
      .addCase(reviewLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentAction = null;
      })
      // Update Leave
      .addCase(updateLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAction = 'updating';
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentAction = null;
        const index = state.leaves.findIndex(leave => leave.id === action.payload.leave.id);
        if (index !== -1) {
          state.leaves[index] = action.payload.leave;
        }
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentAction = null;
      })
      // Fetch My Leaves
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Leave Balance
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = action.payload;
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;