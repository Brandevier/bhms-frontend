// redux/slice/staffDepartmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const assignDepartmentsToStaff = createAsyncThunk(
  'staffDepartment/assignDepartmentsToStaff',
  async ({ staff_id, department_ids }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/departments/assign', {
        staff_id,
        department_ids
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDepartmentsForStaff = createAsyncThunk(
  'staffDepartment/getDepartmentsForStaff',
  async (staff_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/departments/${staff_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDepartmentsForStaff = createAsyncThunk(
  'staffDepartment/updateDepartmentsForStaff',
  async ({ staff_id, department_ids }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/${staff_id}/departments`, {
        department_ids
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeDepartmentFromStaff = createAsyncThunk(
  'staffDepartment/removeDepartmentFromStaff',
  async ({ staff_id, department_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/${staff_id}/departments/${department_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const staffDepartmentSlice = createSlice({
  name: 'staffDepartment',
  initialState: {
    staffDepartments: [],
    currentStaffDepartments: [],
    loading: false,
    error: null,
    success: false,
    operation: null // 'assign', 'update', 'remove', 'fetch'
  },
  reducers: {
    clearStaffDepartmentState: (state) => {
      state.staffDepartments = [];
      state.currentStaffDepartments = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.operation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentStaffDepartments: (state, action) => {
      state.currentStaffDepartments = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Assign Departments to Staff
      .addCase(assignDepartmentsToStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'assign';
      })
      .addCase(assignDepartmentsToStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        // You might want to update local state if needed
      })
      .addCase(assignDepartmentsToStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to assign departments';
        state.operation = null;
      })
      // Get Departments for Staff
      .addCase(getDepartmentsForStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getDepartmentsForStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaffDepartments = action.payload.data || [];
        state.operation = null;
      })
      .addCase(getDepartmentsForStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch staff departments';
        state.operation = null;
      })
      // Update Departments for Staff
      .addCase(updateDepartmentsForStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'update';
      })
      .addCase(updateDepartmentsForStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        // Update local state with new departments
        state.currentStaffDepartments = action.payload.data || [];
      })
      .addCase(updateDepartmentsForStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update departments';
        state.operation = null;
      })
      // Remove Department from Staff
      .addCase(removeDepartmentFromStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'remove';
      })
      .addCase(removeDepartmentFromStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        // Remove department from local state
        const { department_id } = action.meta.arg;
        state.currentStaffDepartments = state.currentStaffDepartments.filter(
          dept => dept.id !== department_id
        );
      })
      .addCase(removeDepartmentFromStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove department';
        state.operation = null;
      });
  }
});

export const { 
  clearStaffDepartmentState, 
  clearError, 
  clearSuccess, 
  setCurrentStaffDepartments 
} = staffDepartmentSlice.actions;
export default staffDepartmentSlice.reducer;