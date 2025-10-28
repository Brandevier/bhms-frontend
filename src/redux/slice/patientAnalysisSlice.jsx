// src/redux/slice/patientAnalysisSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";


// ================= Async Thunks =================
// 1. Total Visits
export const fetchTotalVisits = createAsyncThunk(
  "patientAnalysis/fetchTotalVisits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/total-visits");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Visits by Type
export const fetchVisitsByType = createAsyncThunk(
  "patientAnalysis/fetchVisitsByType",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/visits-by-type");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Admissions vs Outpatients
export const fetchAdmissionStats = createAsyncThunk(
  "patientAnalysis/fetchAdmissionStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/admission-stats");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. Average Length of Stay
export const fetchAverageLengthOfStay = createAsyncThunk(
  "patientAnalysis/fetchAverageLengthOfStay",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/average-stay");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 5. Discharge Stats
export const fetchDischargeStats = createAsyncThunk(
  "patientAnalysis/fetchDischargeStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/discharge-stats");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 6. Monthly Visits
export const fetchMonthlyVisits = createAsyncThunk(
  "patientAnalysis/fetchMonthlyVisits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/monthly-visits");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 7. Visits by Department
export const fetchVisitsByDepartment = createAsyncThunk(
  "patientAnalysis/fetchVisitsByDepartment",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/patient-analysis/visits-by-department");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ================= Slice =================
const patientAnalysisSlice = createSlice({
  name: "patientAnalysis",
  initialState: {
    totalVisits: null,
    visitsByType: [],
    admissionStats: null,
    averageStay: null,
    dischargeStats: [],
    monthlyVisits: [],
    visitsByDepartment: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetPatientAnalysis: (state) => {
      state.totalVisits = null;
      state.visitsByType = [];
      state.admissionStats = null;
      state.averageStay = null;
      state.dischargeStats = [];
      state.monthlyVisits = [];
      state.visitsByDepartment = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder
      // Total Visits
      .addCase(fetchTotalVisits.pending, handlePending)
      .addCase(fetchTotalVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.totalVisits = action.payload.totalVisits;
      })
      .addCase(fetchTotalVisits.rejected, handleRejected)

      // Visits by Type
      .addCase(fetchVisitsByType.pending, handlePending)
      .addCase(fetchVisitsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.visitsByType = action.payload;
      })
      .addCase(fetchVisitsByType.rejected, handleRejected)

      // Admission Stats
      .addCase(fetchAdmissionStats.pending, handlePending)
      .addCase(fetchAdmissionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionStats = action.payload;
      })
      .addCase(fetchAdmissionStats.rejected, handleRejected)

      // Average Stay
      .addCase(fetchAverageLengthOfStay.pending, handlePending)
      .addCase(fetchAverageLengthOfStay.fulfilled, (state, action) => {
        state.loading = false;
        state.averageStay = action.payload;
      })
      .addCase(fetchAverageLengthOfStay.rejected, handleRejected)

      // Discharge Stats
      .addCase(fetchDischargeStats.pending, handlePending)
      .addCase(fetchDischargeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeStats = action.payload;
      })
      .addCase(fetchDischargeStats.rejected, handleRejected)

      // Monthly Visits
      .addCase(fetchMonthlyVisits.pending, handlePending)
      .addCase(fetchMonthlyVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyVisits = action.payload;
      })
      .addCase(fetchMonthlyVisits.rejected, handleRejected)

      // Visits by Department
      .addCase(fetchVisitsByDepartment.pending, handlePending)
      .addCase(fetchVisitsByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.visitsByDepartment = action.payload;
      })
      .addCase(fetchVisitsByDepartment.rejected, handleRejected);
  },
});

export const { resetPatientAnalysis } = patientAnalysisSlice.actions;
export default patientAnalysisSlice.reducer;
