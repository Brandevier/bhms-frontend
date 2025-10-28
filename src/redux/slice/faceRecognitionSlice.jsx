// store/slices/faceRecognitionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const registerFace = createAsyncThunk(
  'faceRecognition/registerFace',
  async ({ staffId, faceImages }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      faceImages.forEach((image) => {
        formData.append('faceImages', image);
      });

      const response = await apiClient.post(
        `/staff-faces/${staffId}/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyStaffFace = createAsyncThunk(
  'faceRecognition/verifyStaffFace',
  async ({ staffId, faceImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('faceImage', faceImage);

      const response = await apiClient.post(
        `/staff-faces/${staffId}/verify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const identifyStaffByFace = createAsyncThunk(
  'faceRecognition/identifyStaffByFace',
  async (faceImage, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('faceImage', faceImage);

      const response = await apiClient.post(
        '/staff-faces/identify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAttendanceByDepartment = createAsyncThunk(
  'faceRecognition/departmentAttendance',
  async (department_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/staff-faces/attendance`,
        {
          params: {
            department_id
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAttendanceByDateRange = createAsyncThunk(
  'faceRecognition/dateRangeAttendance',
  async ({ department_id, start_date, end_date }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/attendance/department/${department_id}/range`,
        {
          params: {
            start_date,
            end_date
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  register: {
    loading: false,
    error: null,
    data: null,
  },
  attendance: {
    loading: false,
    error: null,
    data: [],
  },
  verify: {
    loading: false,
    error: null,
    data: null,
  },
  identify: {
    loading: false,
    error: null,
    data: null,
  },
};

// Face recognition slice
const faceRecognitionSlice = createSlice({
  name: 'faceRecognition',
  initialState,
  reducers: {
    clearFaceRecognitionError: (state, action) => {
      const { type } = action.payload || {};
      if (type) {
        state[type].error = null;
      } else {
        state.register.error = null;
        state.verify.error = null;
        state.identify.error = null;
        state.attendance.error = null;
      }
    },
    clearFaceRecognitionData: (state, action) => {
      const { type } = action.payload || {};
      if (type) {
        state[type].data = null;
      } else {
        state.register.data = null;
        state.verify.data = null;
        state.identify.data = null;
        state.attendance.data = [];
      }
    },
    resetFaceRecognition: (state) => {
      state.register = initialState.register;
      state.verify = initialState.verify;
      state.identify = initialState.identify;
      state.attendance = initialState.attendance;
    },
  },
  extraReducers: (builder) => {
    // Register Face
    builder
      .addCase(registerFace.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
      })
      .addCase(registerFace.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.data = action.payload;
      })
      .addCase(registerFace.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload;
      });

    // Verify Staff Face
    builder
      .addCase(verifyStaffFace.pending, (state) => {
        state.verify.loading = true;
        state.verify.error = null;
      })
      .addCase(verifyStaffFace.fulfilled, (state, action) => {
        state.verify.loading = false;
        state.verify.data = action.payload;
      })
      .addCase(verifyStaffFace.rejected, (state, action) => {
        state.verify.loading = false;
        state.verify.error = action.payload;
      });

    // Identify Staff By Face
    builder
      .addCase(identifyStaffByFace.pending, (state) => {
        state.identify.loading = true;
        state.identify.error = null;
      })
      .addCase(identifyStaffByFace.fulfilled, (state, action) => {
        state.identify.loading = false;
        state.identify.data = action.payload;
      })
      .addCase(identifyStaffByFace.rejected, (state, action) => {
        state.identify.loading = false;
        state.identify.error = action.payload;
      });

    // Get Attendance By Department
    builder
      .addCase(getAttendanceByDepartment.pending, (state) => {
        state.attendance.loading = true;
        state.attendance.error = null;
      })
      .addCase(getAttendanceByDepartment.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.data = action.payload;
      })
      .addCase(getAttendanceByDepartment.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.payload;
      });

    // Get Attendance By Date Range
    builder
      .addCase(getAttendanceByDateRange.pending, (state) => {
        state.attendance.loading = true;
        state.attendance.error = null;
      })
      .addCase(getAttendanceByDateRange.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.data = action.payload;
      })
      .addCase(getAttendanceByDateRange.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.payload;
      });
  },
});

export const {
  clearFaceRecognitionError,
  clearFaceRecognitionData,
  resetFaceRecognition,
} = faceRecognitionSlice.actions;

// Selectors
export const selectFaceRegistration = (state) => state.faceRecognition.register;
export const selectFaceVerification = (state) => state.faceRecognition.verify;
export const selectFaceIdentification = (state) => state.faceRecognition.identify;
export const selectDepartmentAttendance = (state) => state.faceRecognition.attendance;
export const selectFaceRecognitionLoading = (state) =>
  state.faceRecognition.register.loading ||
  state.faceRecognition.verify.loading ||
  state.faceRecognition.identify.loading ||
  state.faceRecognition.attendance.loading;

export default faceRecognitionSlice.reducer;