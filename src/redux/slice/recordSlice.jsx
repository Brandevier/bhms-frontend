import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Helper function to safely access response data
const getSafeData = (response) => {
  return response?.data ?? null;
};

// Async Actions
export const fetchActiveVisits = createAsyncThunk(
  'records/fetchActiveVisits',
  async (_, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;

    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }

    try {
      const response = await apiClient.get('/records/visit/active', {
        params: { institution_id: institutionId }
      });
      return getSafeData(response) || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active visits');
    }
  }
);

export const createPatient = createAsyncThunk(
  'records/createPatient',
  async (patientData, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;
    
    if (!institutionId) { 
      return rejectWithValue('Institution ID is required');
    }
    
    try {
      const response = await apiClient.post('/records/patient/create', {
        ...patientData,
        institution_id: institutionId
      });
      return getSafeData(response) || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient');
    }
  }
);

export const fetchPatients = createAsyncThunk(
  'records/fetchPatients',
  async (_, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;  
    
    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }
    
    try {
      const response = await apiClient.get(`/records/patients/${institutionId}`);
      return getSafeData(response) || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const startNewVisit = createAsyncThunk(
  'records/startNewVisit',
  async (patient_id, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institution_id = auth.user?.institution?.id || auth.admin?.institution?.id;  
    
    if (!institution_id) {
      return rejectWithValue('Institution ID is required');
    }
    
    try {
      const response = await apiClient.post('/records/patient/initiate', {
        patient_id,
        institution_id
      });
      return getSafeData(response)?.visit || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize visit');
    }
  }
);

export const fetchVisitDetails = createAsyncThunk(
  'records/fetchVisitDetails',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/records/visits/${visitId}`);
      return getSafeData(response) || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visit details');
    }
  }
);

export const fetchPatientReports = createAsyncThunk(
  'records/fetchPatientReports',
  async (institutionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/records/patientReport', {
        params: { institution_id: institutionId }
      });
      return getSafeData(response)?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient reports');
    }
  }
);

// Enhanced Initial State with single loading and error states
const initialState = {
  activeVisits: [],
  currentVisit: {},
  patientReports: [],
  patients: [],
  createdPatient: {},
  loading: false, // Single loading state for all actions
  error: null,    // Single error state for all actions
  lastAction: null // Track which action caused the error
};

// Slice
const visitsSlice = createSlice({
  name: 'records', 
  initialState,
  reducers: {
    resetCurrentVisit: (state) => {
      state.currentVisit = {};
    },
    resetPatientCreation: (state) => {
      state.createdPatient = {};
    },
    resetError: (state) => {
      state.error = null;
      state.lastAction = null;
    }
  },
  extraReducers: (builder) => {
    // First, add all specific cases
    builder.addCase(fetchActiveVisits.fulfilled, (state, action) => {
      state.activeVisits = action.payload || [];
    });
    builder.addCase(fetchActiveVisits.rejected, (state) => {
      state.activeVisits = [];
    });

    builder.addCase(createPatient.fulfilled, (state, action) => {
      state.createdPatient = action.payload || {};
    });
    builder.addCase(createPatient.rejected, (state) => {
      state.createdPatient = {};
      
    });

    builder.addCase(startNewVisit.fulfilled, (state, action) => {
      state.currentVisit = action.payload || {};
    });
    builder.addCase(startNewVisit.rejected, (state) => {
      state.currentVisit = {};
    });

    builder.addCase(fetchVisitDetails.fulfilled, (state, action) => {
      state.currentVisit = action.payload || {};
    });
    builder.addCase(fetchVisitDetails.rejected, (state) => {
      state.currentVisit = {};
    });

    builder.addCase(fetchPatientReports.fulfilled, (state, action) => {
      state.patientReports = action.payload || [];
    });
    builder.addCase(fetchPatientReports.rejected, (state) => {
      state.patientReports = [];
    });

    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.patients = action.payload || [];
    });
    builder.addCase(fetchPatients.rejected, (state) => {
      state.patients = [];
    });

    // Then add the matchers
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastAction = action.type.replace('/pending', '');
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state) => {
        state.loading = false;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = action.type.replace('/rejected', '');
      }
    );
  }
});

// Actions
export const { resetCurrentVisit, resetPatientCreation, resetError } = visitsSlice.actions;

// Reducer
export default visitsSlice.reducer;