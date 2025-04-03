import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// Async Thunks

// Register Staff
export const registerStaff = createAsyncThunk(
    "staff/registerStaff",
    async (staffData, { rejectWithValue,getState }) => {
        const { admin } = getState().auth
        try {
            const response = await apiClient.post("/auth/register/staff", {
                ...staffData,
                admin_id: admin.id,
                institution_id:admin.institution.id,

            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Register Admin
export const registerAdmin = createAsyncThunk(
    "staff/registerAdmin",
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/api/admin/register", adminData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get Single Staff
export const getSingleStaff = createAsyncThunk(
    "staff/getSingleStaff",
    async ({staffId}, { rejectWithValue,getState }) => {
        const { auth } = getState()

        const user = auth.user || auth.admin


        try {
            const response = await apiClient.get(`/auth/single-staff`,{
                params:{
                    staff_id:staffId,
                    institution_id:user.institution.id
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get All Staff
export const getAllStaff = createAsyncThunk(
    "staff/getAllStaff",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        try {
            const response = await apiClient.get("/auth/all-staffs", {
                params: {
                    "institution_id": user.institution.id
                }

            });
            return response.data.staff;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete Staff
export const deleteStaff = createAsyncThunk(
    "staff/deleteStaff",
    async ({ staff_id, institution_id, admin_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/staff/delete?staff_id=${staff_id}&institution_id=${institution_id}&admin_id=${admin_id}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial State
const initialState = {
    staff: null,
    admin: null,
    allStaffs: [], // Array to hold all staff members
    singleStaff: null, // Object to hold a single staff member
    loading: false,
    register_staff_loading:false,
    error: null,
    success: false,
};

// Slice
const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {
        clearStaffState: (state) => {
            state.staff = null;
            state.admin = null;
            state.allStaffs = [];
            state.singleStaff = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register Staff
            .addCase(registerStaff.pending, (state) => {
                state.register_staff_loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerStaff.fulfilled, (state, action) => {
                state.register_staff_loading = false;
                state.staff = action.payload;
                state.success = true;
            })
            .addCase(registerStaff.rejected, (state, action) => {
                state.register_staff_loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Register Admin
            .addCase(registerAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
                state.success = true;
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Delete Staff
            .addCase(deleteStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = null; // Clear the staff state after deletion
                state.success = true;
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get All Staff
            .addCase(getAllStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAllStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.allStaffs = action.payload;
                state.success = true;
            })
            .addCase(getAllStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get Single Staff
            .addCase(getSingleStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getSingleStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.singleStaff = action.payload;
                state.success = true;
            })
            .addCase(getSingleStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

// Export Actions
export const { clearStaffState } = staffSlice.actions;

// Export Reducer
export default staffSlice.reducer;