import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks
export const addToWaitlist = createAsyncThunk(
  'waitlist/add',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/waitlist', { phone_number: phoneNumber });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to add to waitlist');
    }
  }
);

export const checkWaitlistStatus = createAsyncThunk(
  'waitlist/checkStatus',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/waitlist/check?phone_number=${phoneNumber}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to check waitlist status');
    }
  }
);

// Slice
const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState: {
    phoneNumber: '',
    loading: false,
    error: null,
    success: false,
    exists: false,
    lastAdded: null
  },
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
      // Reset status when phone number changes
      state.success = false;
      state.error = null;
    },
    resetWaitlistState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.exists = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to waitlist
      .addCase(addToWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.exists = true;
        state.lastAdded = action.payload.phone_number;
      })
      .addCase(addToWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        
        // Handle duplicate entry case
        if (action.payload?.message?.includes('already on the waitlist')) {
          state.exists = true;
        }
      })
      
      // Check waitlist status
      .addCase(checkWaitlistStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkWaitlistStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.exists = action.payload.exists;
      })
      .addCase(checkWaitlistStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectWaitlistPhoneNumber = (state) => state.waitlist.phoneNumber;
export const selectWaitlistLoading = (state) => state.waitlist.loading;
export const selectWaitlistError = (state) => state.waitlist.error;
export const selectWaitlistSuccess = (state) => state.waitlist.success;
export const selectWaitlistExists = (state) => state.waitlist.exists;
export const selectLastAddedNumber = (state) => state.waitlist.lastAdded;

// Actions
export const { setPhoneNumber, resetWaitlistState } = waitlistSlice.actions;

export default waitlistSlice.reducer;