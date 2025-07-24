import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const createIntervention = createAsyncThunk(
  'clinicalIntervention/create',
  async (interventionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/clinical-interventions', interventionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInterventions = createAsyncThunk(
  'clinicalIntervention/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/clinical-interventions', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInterventionById = createAsyncThunk(
  'clinicalIntervention/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/clinical-interventions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateIntervention = createAsyncThunk(
  'clinicalIntervention/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/clinical-interventions/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteIntervention = createAsyncThunk(
  'clinicalIntervention/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/clinical-interventions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInterventionsByPrescription = createAsyncThunk(
  'clinicalIntervention/fetchByPrescription',
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/clinical-interventions/prescription/${prescriptionId}`);
      return { prescriptionId, interventions: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateResponse = createAsyncThunk(
  'clinicalIntervention/updateResponse',
  async ({ id, response }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/clinical-interventions/${id}/response`, { response });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const clinicalInterventionSlice = createSlice({
  name: 'clinicalIntervention',
  initialState: {
    interventions: [],
    currentIntervention: null,
    prescriptionInterventions: {},
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    responding: false,
    error: null
  },
  reducers: {
    clearCurrentIntervention: (state) => {
      state.currentIntervention = null;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Intervention
      .addCase(createIntervention.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createIntervention.fulfilled, (state, action) => {
        state.creating = false;
        state.interventions.unshift(action.payload);
        const prescriptionId = action.payload.prescription_id;
        if (state.prescriptionInterventions[prescriptionId]) {
          state.prescriptionInterventions[prescriptionId].unshift(action.payload);
        }
      })
      .addCase(createIntervention.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // Fetch All Interventions
      .addCase(fetchInterventions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterventions.fulfilled, (state, action) => {
        state.loading = false;
        state.interventions = action.payload;
      })
      .addCase(fetchInterventions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Intervention by ID
      .addCase(fetchInterventionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterventionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIntervention = action.payload;
      })
      .addCase(fetchInterventionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Intervention
      .addCase(updateIntervention.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateIntervention.fulfilled, (state, action) => {
        state.updating = false;
        state.interventions = state.interventions.map(int => 
          int.id === action.payload.id ? action.payload : int
        );
        if (state.currentIntervention?.id === action.payload.id) {
          state.currentIntervention = action.payload;
        }
      })
      .addCase(updateIntervention.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // Delete Intervention
      .addCase(deleteIntervention.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteIntervention.fulfilled, (state, action) => {
        state.deleting = false;
        state.interventions = state.interventions.filter(int => int.id !== action.payload);
        if (state.currentIntervention?.id === action.payload) {
          state.currentIntervention = null;
        }
      })
      .addCase(deleteIntervention.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      
      // Fetch Interventions by Prescription
      .addCase(fetchInterventionsByPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterventionsByPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptionInterventions = {
          ...state.prescriptionInterventions,
          [action.payload.prescriptionId]: action.payload.interventions
        };
      })
      .addCase(fetchInterventionsByPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Prescriber Response
      .addCase(updateResponse.pending, (state) => {
        state.responding = true;
        state.error = null;
      })
      .addCase(updateResponse.fulfilled, (state, action) => {
        state.responding = false;
        state.interventions = state.interventions.map(int => 
          int.id === action.payload.id ? action.payload : int
        );
        if (state.currentIntervention?.id === action.payload.id) {
          state.currentIntervention = action.payload;
        }
      })
      .addCase(updateResponse.rejected, (state, action) => {
        state.responding = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentIntervention, resetError } = clinicalInterventionSlice.actions;
export default clinicalInterventionSlice.reducer;