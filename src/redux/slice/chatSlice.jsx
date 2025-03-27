import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// 🟢 Fetch Departments in an Institution
export const fetchDepartments = createAsyncThunk(
    "chat/fetchDepartments",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState();
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get(`/chats/get-departments`, {
                params: {
                    institution_id: user.institution.id
                }
            });
            return response.data.departments;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch departments");
        }
    }
);

export const fetchRecentChats = createAsyncThunk(
    "chat/fetchRecentChats",
    async ({ departmentId }, { rejectWithValue, getState }) => {
        const { auth } = getState();
        const user = auth.admin || auth.user; // Check if logged-in user is admin or staff
        const isAdmin = !!auth.admin; // If auth.admin exists, it's an admin; otherwise, it's a user

        if (!user) {
            return rejectWithValue("User not found");
        }

        try {
            const response = await apiClient.get(`/chats/recent-chats`, {
                params: { userId: user.id, departmentId, isAdmin },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch chats");
        }
    }
);


// 🟢 Send a Message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (messageData, { rejectWithValue, getState }) => {
        const { auth } = getState();
        
        // Determine sender dynamically
        const sender = auth.user || auth.admin;
        if (!sender) {
            return rejectWithValue("Unauthorized: No valid user found.");
        }

        // Prepare payload based on sender type
        const payload = {
            ...messageData,
            senderId: auth.user ? auth.user.id : null, // If user is logged in
            senderDepartmentId: auth.user ? auth.user.department.id : null,
            adminId: auth.admin ? auth.admin.id : null, // If admin is logged in
            institution_id:sender.institution.id
        };

        try {
            const response = await apiClient.post(`/chats/send`, payload);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to send message");
        }
    }
);


// 🟢 Redux Slice
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        departments: [],
        chats: [],
        loading: false,
        error: null,
        sending: false,
        chatLoading:false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchDepartments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchRecentChats
            .addCase(fetchRecentChats.pending, (state) => {
                state.chatLoading = true;
                state.error = null;
            })
            .addCase(fetchRecentChats.fulfilled, (state, action) => {
                state.chatLoading = false;
                state.chats = action.payload;
            })
            .addCase(fetchRecentChats.rejected, (state, action) => {
                state.chatLoading = false;
                state.error = action.payload;
            })

            // Handle sendMessage
            .addCase(sendMessage.pending, (state) => {
                state.sending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sending = false;
                // state.chats.unshift(action.payload); // Add new message at the top
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            });
    },
});

export default chatSlice.reducer;
