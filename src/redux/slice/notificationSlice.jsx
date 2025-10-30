import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// ================================
// Fetch Notifications
// ================================


export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const user = getState().auth.user || getState().auth.admin;

      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Backend expects staff_id as a query parameter
      const response = await apiClient.get(`/notifications/get-notifications`, {
        params: { staffId: user.id },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


// ================================
// Mark Notification as Read
// ================================
export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/notifications/${notificationId}/read`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      // Add new notification to the top of the list
      state.list.unshift(action.payload);
    },
    updateNotification: (state, action) => {
      const index = state.list.findIndex(n => n.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(n => n.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export const { addNotification, updateNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
