import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";
// Fetch all shifts (can be filtered by institution or department)
export const getShifts = createAsyncThunk(
  "shifts/getShifts",
  async ({ institution_id, department_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/shifts", { params: { institution_id, department_id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shifts");
    }
  }
);

// Add a single shift
export const addShift = createAsyncThunk(
  "shifts/addShift",
  async (shiftData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/shifts", shiftData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add shift");
    }
  }
);

// Add bulk shifts
export const addBulkShifts = createAsyncThunk(
  "shifts/addBulkShifts",
  async (bulkShiftData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/shifts/bulk", bulkShiftData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add bulk shifts");
    }
  }
);

// Update a shift
export const updateShift = createAsyncThunk(
  "shifts/updateShift",
  async ({ shift_id, updatedShift }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/shifts/${shift_id}`, updatedShift);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update shift");
    }
  }
);

const shiftSlice = createSlice({
  name: "shifts",
  initialState: {
    shifts: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No normal reducers needed, since everything is async
  extraReducers: (builder) => {
    builder.addCase(getShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(getShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      }).addCase(getShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(addShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(addShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts.push(action.payload.shift);
      }).addCase(addShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(addBulkShifts.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBulkShifts.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addBulkShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateShift.pending, (state) => {
        state.loading = true;
      }).addCase(updateShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = state.shifts.map((shift) =>
          shift.id === action.payload.shift.id ? action.payload.shift : shift
        );
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shiftSlice.reducer;
