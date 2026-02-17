import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/risk-assessments';

// ===============================
// CREATE RISK ASSESSMENT
// ===============================
export const createRiskAssessment = createAsyncThunk(
  'riskAssessment/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH PATIENT ASSESSMENTS
// ===============================
export const fetchPatientAssessments = createAsyncThunk(
  'riskAssessment/fetchPatient',
  async ({ patient_id, assessment_type }, { rejectWithValue }) => {
    try {
      let url = `${BASE_URL}/patient/${patient_id}`;
      if (assessment_type) url += `?assessment_type=${assessment_type}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH LATEST ASSESSMENT
// ===============================
export const fetchLatestAssessment = createAsyncThunk(
  'riskAssessment/fetchLatest',
  async ({ patient_id, assessment_type }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/patient/${patient_id}/latest/${assessment_type}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH RISK SUMMARY
// ===============================
export const fetchRiskSummary = createAsyncThunk(
  'riskAssessment/fetchSummary',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/summary/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH PATIENTS BY RISK LEVEL
// ===============================
export const fetchPatientsByRiskLevel = createAsyncThunk(
  'riskAssessment/fetchByRisk',
  async ({ institution_id, assessment_type, risk_category }, { rejectWithValue }) => {
    try {
      let url = `${BASE_URL}/by-risk?`;
      if (institution_id) url += `institution_id=${institution_id}&`;
      if (assessment_type) url += `assessment_type=${assessment_type}&`;
      if (risk_category) url += `risk_category=${risk_category}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// UPDATE ASSESSMENT
// ===============================
export const updateRiskAssessment = createAsyncThunk(
  'riskAssessment/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// DELETE ASSESSMENT
// ===============================
export const deleteRiskAssessment = createAsyncThunk(
  'riskAssessment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// SLICE
// ===============================
const riskAssessmentSlice = createSlice({
  name: 'riskAssessment',
  initialState: {
    assessments: [],
    latestAssessment: null,
    summary: null,
    highRiskPatients: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetRiskState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.latestAssessment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createRiskAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRiskAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.assessments.unshift(action.payload.assessment);
        state.latestAssessment = action.payload.assessment;
      })
      .addCase(createRiskAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PATIENT ASSESSMENTS
      .addCase(fetchPatientAssessments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = action.payload.assessments || [];
      })
      .addCase(fetchPatientAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH LATEST
      .addCase(fetchLatestAssessment.fulfilled, (state, action) => {
        state.latestAssessment = action.payload.assessment;
      })

      // FETCH SUMMARY
      .addCase(fetchRiskSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })

      // FETCH BY RISK
      .addCase(fetchPatientsByRiskLevel.fulfilled, (state, action) => {
        state.highRiskPatients = action.payload.assessments || [];
      })

      // UPDATE
      .addCase(updateRiskAssessment.fulfilled, (state, action) => {
        state.success = true;
        const index = state.assessments.findIndex(a => a.id === action.payload.assessment.id);
        if (index !== -1) {
          state.assessments[index] = action.payload.assessment;
        }
      })

      // DELETE
      .addCase(deleteRiskAssessment.fulfilled, (state, action) => {
        state.assessments = state.assessments.filter(a => a.id !== action.payload);
      });
  }
});

export const { resetRiskState } = riskAssessmentSlice.actions;
export default riskAssessmentSlice.reducer;

