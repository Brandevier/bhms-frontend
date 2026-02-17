import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/chronic-conditions';

// ===============================
// CREATE CHRONIC CONDITION
// ===============================
export const createChronicCondition = createAsyncThunk(
  'chronicCondition/create',
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
// FETCH PATIENT CONDITIONS
// ===============================
export const fetchPatientConditions = createAsyncThunk(
  'chronicCondition/fetchPatient',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH CONDITION SUMMARY
// ===============================
export const fetchConditionSummary = createAsyncThunk(
  'chronicCondition/fetchSummary',
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
// FETCH COMMON CONDITIONS
// ===============================
export const fetchCommonConditions = createAsyncThunk(
  'chronicCondition/fetchCommon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/common`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH PATIENTS DUE FOLLOW-UP
// ===============================
export const fetchDueFollowUp = createAsyncThunk(
  'chronicCondition/fetchDueFollowUp',
  async (institution_id, { rejectWithValue }) => {
    try {
      const url = institution_id ? `${BASE_URL}/due-followup?institution_id=${institution_id}` : `${BASE_URL}/due-followup`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// UPDATE CONDITION STATUS
// ===============================
export const updateConditionStatus = createAsyncThunk(
  'chronicCondition/updateStatus',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/${id}/status`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// UPDATE CONDITION
// ===============================
export const updateChronicCondition = createAsyncThunk(
  'chronicCondition/update',
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
// DELETE CONDITION
// ===============================
export const deleteChronicCondition = createAsyncThunk(
  'chronicCondition/delete',
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
const chronicConditionSlice = createSlice({
  name: 'chronicCondition',
  initialState: {
    conditions: [],
    summary: null,
    commonConditions: null,
    dueFollowUp: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetConditionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createChronicCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChronicCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.conditions.unshift(action.payload.condition);
      })
      .addCase(createChronicCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PATIENT CONDITIONS
      .addCase(fetchPatientConditions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.conditions = action.payload.conditions || [];
      })
      .addCase(fetchPatientConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SUMMARY
      .addCase(fetchConditionSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })

      // FETCH COMMON CONDITIONS
      .addCase(fetchCommonConditions.fulfilled, (state, action) => {
        state.commonConditions = action.payload;
      })

      // FETCH DUE FOLLOW-UP
      .addCase(fetchDueFollowUp.fulfilled, (state, action) => {
        state.dueFollowUp = action.payload.conditions || [];
      })

      // UPDATE STATUS
      .addCase(updateConditionStatus.fulfilled, (state, action) => {
        state.success = true;
        const index = state.conditions.findIndex(c => c.id === action.payload.condition.id);
        if (index !== -1) {
          state.conditions[index] = action.payload.condition;
        }
      })

      // UPDATE
      .addCase(updateChronicCondition.fulfilled, (state, action) => {
        state.success = true;
        const index = state.conditions.findIndex(c => c.id === action.payload.condition.id);
        if (index !== -1) {
          state.conditions[index] = action.payload.condition;
        }
      })

      // DELETE
      .addCase(deleteChronicCondition.fulfilled, (state, action) => {
        state.conditions = state.conditions.filter(c => c.id !== action.payload);
      });
  }
});

export const { resetConditionState } = chronicConditionSlice.actions;
export default chronicConditionSlice.reducer;

