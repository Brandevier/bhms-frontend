import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks for API calls

// Create a new shift
export const createShift = createAsyncThunk(
    'shift/createShift',
    async (shiftData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/shifts', shiftData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch shifts by staff ID
export const fetchShiftsByStaff = createAsyncThunk(
    'shift/fetchShiftsByStaff',
    async (staffId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/shifts?staff_id=${staffId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update a shift
export const updateShift = createAsyncThunk(
    'shift/updateShift',
    async ({ id, shiftData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/shifts/${id}`, shiftData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a shift
export const deleteShift = createAsyncThunk(
    'shift/deleteShift',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/api/shifts/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Send shift table email
export const sendShiftTableEmail = createAsyncThunk(
    'shift/sendShiftTableEmail',
    async ({ staffId, email }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/shifts/send-email', { staff_id: staffId, email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch staff by shift day
export const fetchStaffByShiftDay = createAsyncThunk(
    'shift/fetchStaffByShiftDay',
    async ({ institution_id, department_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/shifts/staff-by-day?institution_id=${institution_id}&department_id=${department_id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch staff by specific shift day
export const fetchStaffBySpecificShiftDay = createAsyncThunk(
    'shift/fetchStaffBySpecificShiftDay',
    async (day, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/shifts/staff-by-specific-day?day=${day}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Initial state
const initialState = {
    shifts: [],
    staffOnDuty: [],
    loading: false,
    error: null,
};

// Slice
const shiftSlice = createSlice({
    name: 'shift',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Shift
            .addCase(createShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(createShift.fulfilled, (state, action) => {
                state.loading = false;
                state.shifts.push(action.payload.data);
            })
            .addCase(createShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch Shifts by Staff
            .addCase(fetchShiftsByStaff.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShiftsByStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.shifts = action.payload.data;
            })
            .addCase(fetchShiftsByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update Shift
            .addCase(updateShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateShift.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.shifts.findIndex(shift => shift.id === action.payload.data.id);
                if (index !== -1) {
                    state.shifts[index] = action.payload.data;
                }
            })
            .addCase(updateShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete Shift
            .addCase(deleteShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteShift.fulfilled, (state, action) => {
                state.loading = false;
                state.shifts = state.shifts.filter(shift => shift.id !== action.payload);
            })
            .addCase(deleteShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Send Shift Table Email
            .addCase(sendShiftTableEmail.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendShiftTableEmail.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendShiftTableEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch Staff by Shift Day
            .addCase(fetchStaffByShiftDay.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaffByShiftDay.fulfilled, (state, action) => {
                state.loading = false;
                state.staffOnDuty = action.payload.data;
            })
            .addCase(fetchStaffByShiftDay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch Staff by Specific Shift Day
            .addCase(fetchStaffBySpecificShiftDay.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaffBySpecificShiftDay.fulfilled, (state, action) => {
                state.loading = false;
                state.staffOnDuty = action.payload.data;
            })
            .addCase(fetchStaffBySpecificShiftDay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearError } = shiftSlice.actions;

export default shiftSlice.reducer;