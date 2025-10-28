// src/redux/slices/diagnosisAnalysisSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";


// Async thunk to fetch diagnosis analysis
export const fetchDiagnosisAnalysis = createAsyncThunk(
  "diagnosisAnalysis/fetchDiagnosisAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/diagnosis-analysis"); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const diagnosisAnalysisSlice = createSlice({
  name: "diagnosisAnalysis",
  initialState: {
    topDiseases: [],
    genderDistribution: [],
    statusSummary: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagnosisAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosisAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.topDiseases = action.payload.topDiseases;
        state.genderDistribution = action.payload.genderDistribution;
        state.statusSummary = action.payload.statusSummary;
      })
      .addCase(fetchDiagnosisAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default diagnosisAnalysisSlice.reducer;
