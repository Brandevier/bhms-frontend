import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// =========================
// Create a new meeting
// =========================
export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/meetings', meetingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create meeting' });
    }
  }
);

// =========================
// Fetch all meetings
// =========================
export const getMeetings = createAsyncThunk(
  'meetings/getMeetings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/meetings?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch meetings' });
    }
  }
);

// =========================
// Get single meeting
// =========================
export const getMeetingById = createAsyncThunk(
  'meetings/getMeetingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/meetings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch meeting' });
    }
  }
);

// =========================
// Cancel a meeting
// =========================
export const cancelMeeting = createAsyncThunk(
  'meetings/cancelMeeting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/meetings/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel meeting' });
    }
  }
);

// =========================
// Join a meeting (get URL)
// =========================
export const joinMeeting = createAsyncThunk(
  'meetings/joinMeeting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/meetings/${id}/join`);
      return response.data; // contains meeting_url and room_name
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to join meeting' });
    }
  }
);

const meetingSlice = createSlice({
  name: 'meetings',
  initialState: {
    meetings: [],
    currentMeeting: null,
    joinedMeeting: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearMeetingState: (state) => {
      state.error = null;
      state.success = false;
      state.joinedMeeting = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE MEETING =====
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.meetings.unshift(action.payload);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL MEETINGS =====
      .addCase(getMeetings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(getMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET MEETING BY ID =====
      .addCase(getMeetingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeetingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeeting = action.payload;
      })
      .addCase(getMeetingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CANCEL MEETING =====
      .addCase(cancelMeeting.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) state.meetings[index] = action.payload;
      })
      .addCase(cancelMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== JOIN MEETING =====
      .addCase(joinMeeting.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.joinedMeeting = action.payload;
      })
      .addCase(joinMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMeetingState } = meetingSlice.actions;

export default meetingSlice.reducer;
