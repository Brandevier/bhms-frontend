import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// Async Thunks

// Generate QR Code
export const generateQrCode = createAsyncThunk(
  "qrAttendance/generateQrCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/attendance/generate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate QR Code");
    }
  }
);

// Scan QR Code (Attendance Check-in)
export const scanQrCode = createAsyncThunk(
  "qrAttendance/scanQrCode",
  async ({ token, staffId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/attendance/scan`, { token, staffId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to scan QR Code");
    }
  }
);

// Get all attendance records
export const getAllAttendance = createAsyncThunk(
  "qrAttendance/getAllAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/attendance/all`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch attendance records");
    }
  }
);

// Get attendance for a specific staff member
export const getStaffAttendance = createAsyncThunk(
  "qrAttendance/getStaffAttendance",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/attendance/staff/${staffId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch staff attendance records");
    }
  }
);


export const getLatestQrCode = createAsyncThunk(
  "qrAttendance/getLatestQrCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/attendance/latest`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch latest QR code");
    }
  }
);

// Redux Slice
const qrAttendanceSlice = createSlice({
  name: "qrAttendance",
  initialState: {
    qrCodeImage: null,
    qrCodeId: null,
    attendanceRecords: [],
    staffAttendance: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate QR Code
      .addCase(generateQrCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQrCode.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCodeImage = action.payload.qrCodeImage;
        state.qrCodeId = action.payload.qrCodeId;
      })
      .addCase(generateQrCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Scan QR Code
      .addCase(scanQrCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scanQrCode.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(scanQrCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Attendance Records
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Staff Attendance
      .addCase(getStaffAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.staffAttendance = action.payload.data;
      })
      .addCase(getStaffAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })// Get Latest QR Code Image
      .addCase(getLatestQrCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLatestQrCode.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCodeImage = action.payload.qrCodeImage; // Store the latest QR code image
        state.qrCodeId = action.payload.qrCodeId; // Store the QR code ID
      })
      .addCase(getLatestQrCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ;
  },
});

// Export Actions & Reducer
export const { clearError, clearSuccess } = qrAttendanceSlice.actions;
export default qrAttendanceSlice.reducer;
