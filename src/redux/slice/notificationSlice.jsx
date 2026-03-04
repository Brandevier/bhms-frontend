import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// ================================
// Fetch Notifications
// ================================


export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const authState = getState().auth;
      // Check both user and admin, and get ID from either
      const user = authState?.user || authState?.admin;
      
      if (!user?.id) {
        // Return empty array instead of throwing error when no user is logged in
        return [];
      }

      // Backend expects staff_id as a query parameter
      const response = await apiClient.get(`/notifications/get-notifications`, {
        params: { staffId: user.id },
      });

      return response.data;
    } catch (error) {
      // Return empty array on error instead of rejecting
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }
);

// ================================
// Fetch Unread Count
// ================================
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const authState = getState().auth;
      const user = authState?.user || authState?.admin;
      
      if (!user?.id) {
        return 0;
      }

      const response = await apiClient.get(`/notifications/get-unread-count`, {
        params: { staffId: user.id },
      });

      return response.data.unreadCount || 0;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return 0;
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
      const res = await apiClient.put(`/notifications/notification/markAsRead`, {
        notificationIds: [notificationId]
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ================================
// Mark All Notifications as Read
// ================================
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const authState = getState().auth;
      const user = authState?.user || authState?.admin;
      
      if (!user?.id) {
        return rejectWithValue('User not found');
      }

      const res = await apiClient.put(`/notifications/notification/markAllAsRead`, {
        staffId: user.id
      });
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
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      // Add new notification to the top of the list
      state.list.unshift(action.payload);
      // Increment unread count
      state.unreadCount += 1;
    },
    updateNotification: (state, action) => {
      const index = state.list.findIndex(n => n.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
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
        // Handle empty array or actual notifications
        state.list = action.payload || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep existing list on error
      })
      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Mark as Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          // Decrement unread count
          if (!action.payload.is_read && state.unreadCount > 0) {
            state.unreadCount -= 1;
          }
        }
      })
      // Mark All as Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map(n => ({ ...n, is_read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, updateNotification, incrementUnreadCount, resetUnreadCount } = notificationSlice.actions;

export default notificationSlice.reducer;
