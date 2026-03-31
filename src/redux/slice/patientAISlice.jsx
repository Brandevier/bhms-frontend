import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

import { AI_ANALYZE_PATIENT } from '../../api/endpoints';

const AI_BASE_URL = AI_ANALYZE_PATIENT;

// Fetch AI analysis for patient
export const analyzePatient = createAsyncThunk(
  'patientAI/analyzePatient',
  async ({ patientId, visitId, text }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(AI_BASE_URL, {
        patient_text: text,
        patient_id: patientId,
        visit_id: visitId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  analysis: null,
  loading: false,
  error: null,
  selectedEntities: [],
};

const patientAISlice = createSlice({
  name: 'patientAI',
  initialState,
  reducers: {
    clearAnalysis: (state) => {
      state.analysis = null;
      state.error = null;
    },
    setSelectedEntities: (state, action) => {
      state.selectedEntities = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload;
      })
      .addCase(analyzePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalysis, setSelectedEntities } = patientAISlice.actions;
export default patientAISlice.reducer;

