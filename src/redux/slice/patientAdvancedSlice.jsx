import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/patient-advanced';

// ==================== FAMILY HEALTH HISTORY ====================

export const createFamilyHistory = createAsyncThunk(
  'patientAdvanced/createFamilyHistory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/family-history', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientFamilyHistory = createAsyncThunk(
  'patientAdvanced/fetchFamilyHistory',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/family-history/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== SDOH ====================

export const createSDOH = createAsyncThunk(
  'patientAdvanced/createSDOH',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/sdoh`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientSDOH = createAsyncThunk(
  'patientAdvanced/fetchSDOH',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/sdoh/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== MEDICATION ADHERENCE ====================

export const createMedicationAdherence = createAsyncThunk(
  'patientAdvanced/createAdherence',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/adherence`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientAdherence = createAsyncThunk(
  'patientAdvanced/fetchAdherence',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/adherence/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== SCREENING REMINDERS ====================

export const createScreeningReminder = createAsyncThunk(
  'patientAdvanced/createScreening',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/screenings`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientScreenings = createAsyncThunk(
  'patientAdvanced/fetchScreenings',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/screenings/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchScreeningGuidelines = createAsyncThunk(
  'patientAdvanced/fetchGuidelines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/screenings/guidelines`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== WELLNESS ====================

export const createWellnessScore = createAsyncThunk(
  'patientAdvanced/createWellness',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/wellness`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientWellness = createAsyncThunk(
  'patientAdvanced/fetchWellness',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/wellness/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== PATIENT FEEDBACK ====================

export const createFeedback = createAsyncThunk(
  'patientAdvanced/createFeedback',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/feedback`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPatientFeedback = createAsyncThunk(
  'patientAdvanced/fetchFeedback',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/feedback/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== ORGAN DONOR ====================

export const createOrganDonor = createAsyncThunk(
  'patientAdvanced/createOrganDonor',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/organ-donor`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchOrganDonor = createAsyncThunk(
  'patientAdvanced/fetchOrganDonor',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/organ-donor/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ==================== SLICE ====================
const patientAdvancedSlice = createSlice({
  name: 'patientAdvanced',
  initialState: {
    familyHistory: [],
    sdoh: null,
    adherence: [],
    screenings: [],
    wellness: null,
    feedback: [],
    organDonor: null,
    screeningGuidelines: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetAdvancedState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // FAMILY HISTORY
      .addCase(createFamilyHistory.fulfilled, (state, action) => {
        state.success = true;
        state.familyHistory.unshift(action.payload.familyHistory);
      })
      .addCase(fetchPatientFamilyHistory.fulfilled, (state, action) => {
        state.familyHistory = action.payload.familyHistories || [];
      })

      // SDOH
      .addCase(createSDOH.fulfilled, (state, action) => {
        state.success = true;
        state.sdoh = action.payload.sdoh;
      })
      .addCase(fetchPatientSDOH.fulfilled, (state, action) => {
        state.sdoh = action.payload.sdoh?.[0] || null;
      })

      // ADHERENCE
      .addCase(createMedicationAdherence.fulfilled, (state, action) => {
        state.success = true;
        state.adherence.unshift(action.payload.adherence);
      })
      .addCase(fetchPatientAdherence.fulfilled, (state, action) => {
        state.adherence = action.payload.adherence || [];
      })

      // SCREENINGS
      .addCase(createScreeningReminder.fulfilled, (state, action) => {
        state.success = true;
        state.screenings.unshift(action.payload.screening);
      })
      .addCase(fetchPatientScreenings.fulfilled, (state, action) => {
        state.screenings = action.payload.screenings || [];
      })
      .addCase(fetchScreeningGuidelines.fulfilled, (state, action) => {
        state.screeningGuidelines = action.payload.guidelines;
      })

      // WELLNESS
      .addCase(createWellnessScore.fulfilled, (state, action) => {
        state.success = true;
        state.wellness = action.payload.wellness;
      })
      .addCase(fetchPatientWellness.fulfilled, (state, action) => {
        state.wellness = action.payload.wellness;
      })

      // FEEDBACK
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.success = true;
        state.feedback.unshift(action.payload.feedback);
      })
      .addCase(fetchPatientFeedback.fulfilled, (state, action) => {
        state.feedback = action.payload.feedback || [];
      })

      // ORGAN DONOR
      .addCase(createOrganDonor.fulfilled, (state, action) => {
        state.success = true;
        state.organDonor = action.payload.organDonor;
      })
      .addCase(fetchOrganDonor.fulfilled, (state, action) => {
        state.organDonor = action.payload.organDonor;
      });

    // Loading states
    [createFamilyHistory, createSDOH, createMedicationAdherence, 
     createScreeningReminder, createWellnessScore, createFeedback, 
     createOrganDonor].forEach(thunk => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    });
  }
});

export const { resetAdvancedState } = patientAdvancedSlice.actions;
export default patientAdvancedSlice.reducer;

