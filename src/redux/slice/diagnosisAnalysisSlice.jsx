// src/redux/slices/diagnosisAnalysisSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

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
    topDiseases: { data: [], interpretation: [] },
    genderDistribution: { data: [], interpretation: [] },
    statusSummary: { data: [], interpretation: [] },
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
        
        // Handle the nested structure from your API response
        state.topDiseases = {
          data: action.payload.topDiseases?.data || [],
          interpretation: action.payload.topDiseases?.interpretation || []
        };
        
        state.genderDistribution = {
          data: action.payload.genderDistribution?.data || [],
          interpretation: action.payload.genderDistribution?.interpretation || []
        };
        
        state.statusSummary = {
          data: action.payload.statusSummary?.data || [],
          interpretation: action.payload.statusSummary?.interpretation || []
        };
      })
      .addCase(fetchDiagnosisAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default diagnosisAnalysisSlice.reducer;