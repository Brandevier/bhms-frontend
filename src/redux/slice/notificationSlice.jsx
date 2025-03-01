import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";
// 📌 Fetch Notifications
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/notification/get-notifications", {
                params: {
                    ...data
                 },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch notifications");
        }
    }
);

// 📌 Mark Notification as Read
export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async ({ institution_id, notification_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/notifications/mark-as-read", {
                institution_id,
                notification_id,
            });
            return response.data.notification; // Return updated notification
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to mark notification as read");
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔍 Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Mark Notification as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.items = state.items.map((notification) =>
                    notification.id === action.payload.id ? action.payload : notification
                );
            });
    },
});

export default notificationSlice.reducer;
