import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";
// Async Thunks

// Fetch All Permissions
export const getAllPermissions = createAsyncThunk(
  "staff/getAllPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/staff/permissions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch All Roles
export const getAllRoles = createAsyncThunk(
  "staff/getAllRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/roles");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch All Staff Permissions
export const getAllStaffPermissions = createAsyncThunk(
  "staff/getAllStaffPermissions",
  async ({ staff_id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/api/staff/permissions?staff_id=${staff_id}&institution_id=${institution_id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Staff Permissions
export const updateUserPermissions = createAsyncThunk(
  "staff/updateUserPermissions",
  async ({ staff_id, institution_id, permission_ids }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put("/api/staff/permissions", {
        staff_id,
        institution_id,
        permission_ids,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  permissions: [],
  roles: [],
  staffPermissions: [],
  loading: false,
  error: null,
  success: false,
};

// Slice
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearStaffState: (state) => {
      state.permissions = [];
      state.roles = [];
      state.staffPermissions = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Permissions
      .addCase(getAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.permissions;
      })
      .addCase(getAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Roles
      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Staff Permissions
      .addCase(getAllStaffPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaffPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.staffPermissions = action.payload;
      })
      .addCase(getAllStaffPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Staff Permissions
      .addCase(updateUserPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.staffPermissions = action.payload.permissions;
      })
      .addCase(updateUserPermissions.rejected, (state, action) => {
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