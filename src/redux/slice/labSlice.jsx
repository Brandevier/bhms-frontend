import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// Async Thunks
export const requestLab = createAsyncThunk(
  "lab/requestLab",
  async (labData, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.admin || auth.user;

    try {
      const response = await apiClient.post(`/lab/request`, {
        ...labData,
        doctor_id: user.id,
        institution_id: user.institution.id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to request lab");
    }
  }
);

export const acceptLabRequest = createAsyncThunk(
  "lab/acceptLabRequest",
  async ({ labResultId }, { rejectWithValue, getState }) => {
    const { user } = getState().auth;

    try {
      const response = await apiClient.put(`/lab/accept`, {
        labResultId,
        lab_technician_id: user.id,
        institution_id: user.institution.id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to accept lab request");
    }
  }
);

export const uploadLabResult = createAsyncThunk(
  "lab/uploadLabResult",
  async ({ labResultId, testImage, results_comment }, { rejectWithValue, getState }) => {
    const { user } = getState().auth;
    try {
      const formData = new FormData();
      formData.append("labResultId", labResultId);
      formData.append("testImage", testImage);
      formData.append("results_comment", results_comment);
      formData.append("institution_id", user.institution.id);

      const response = await apiClient.put(`/lab/institution/uploadResults`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to upload lab result");
    }
  }
);

export const cancelLabRequest = createAsyncThunk(
  "lab/cancelLabRequest",
  async (labData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/cancel`, labData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel lab request");
    }
  }
);

export const fetchPatientLabResults = createAsyncThunk(
  "lab/fetchPatientLabResults",
  async ({ patient_id, page = 1 }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.get("/lab/labrequests/institution/lab-request", {
        params: {
          patient_id,
          institution_id: user.institution.id,
          page,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lab results");
    }
  }
);

export const fetchLabTest = createAsyncThunk(
  "lab/fetchLabTest",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.get("/lab/test");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lab results");
    }
  }
);

export const fetchLabStatistics = createAsyncThunk(
  "lab/labStatistics",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.get("/lab/statistics", {
        params: {
          institution_id: user.institution.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lab results");
    }
  }
);

export const fetchLabResultsByStatus = createAsyncThunk(
  "lab/fetchLabResultsByStatus",
  async ({ status, page = 1 }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.get(`/lab/lab-results/by-status`, {
        params: {
          institution_id: user.institution.id,
          status,
          page,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lab results by status");
    }
  }
);

// Slice
const labSlice = createSlice({
  name: "lab",
  initialState: {
    labResults: [],
    tests: [],
    statistics: [],
    loading: false,
    createLabLoading: false,
    approveLoading: false,
    uploadLoading: false,
    error: null,

    // Pagination fields
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestLab.pending, (state) => {
        state.createLabLoading = true;
      })
      .addCase(requestLab.fulfilled, (state, action) => {
        state.createLabLoading = false;
        state.labResults.push(action.payload.labResult);
      })
      .addCase(requestLab.rejected, (state, action) => {
        state.createLabLoading = false;
        state.error = action.payload;
      })
      .addCase(acceptLabRequest.pending, (state) => {
        state.approveLoading = true;
      })
      .addCase(acceptLabRequest.fulfilled, (state, action) => {
        state.approveLoading = false;
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(acceptLabRequest.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadLabResult.pending, (state) => {
        state.uploadLoading = true;
      })
      .addCase(uploadLabResult.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(uploadLabResult.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelLabRequest.fulfilled, (state, action) => {
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(fetchPatientLabResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientLabResults.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults = action.payload.labResults;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchPatientLabResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLabTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchLabTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLabResultsByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabResultsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults = action.payload.labResults;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchLabResultsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLabStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchLabStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default labSlice.reducer;