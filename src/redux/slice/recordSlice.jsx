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
      return getSafeData(response) || []; // Return empty array if null/undefined
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
      return getSafeData(response) || {}; // Return empty object if null/undefined
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
      return getSafeData(response) || []; // Return empty array if null/undefined
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
      return getSafeData(response)?.visit || {}; // Safely access visit property
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
      return getSafeData(response) || {}; // Return empty object if null/undefined
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
      return getSafeData(response)?.data || []; // Safely access data property
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient reports');
    }
  }
);

// Enhanced Initial State with deep defaults
const initialState = {
  activeVisits: [],
  currentVisit: {},
  patientReports: [],
  patients: [],
  createdPatient: {},
  loading: {
    activeVisits: false,
    createPatient: false,
    startVisit: false,
    visitDetails: false,
    patientReports: false,
    patients: false
  },
  error: {
    activeVisits: null,
    createPatient: null,
    startVisit: null,
    visitDetails: null,
    patientReports: null,
    patients: null
  }
};

// Slice
const visitsSlice = createSlice({
  name: 'records', 
  initialState,
  reducers: {
    resetCurrentVisit: (state) => {
      state.currentVisit = {};
      state.error.visitDetails = null;
    },
    resetPatientCreation: (state) => {
      state.createdPatient = {};
      state.error.createPatient = null;
    },
    // New reset action to clear all errors
    resetAllErrors: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key] = null;
      });
    }
  },
  extraReducers: (builder) => {
    // Active Visits
    builder.addCase(fetchActiveVisits.pending, (state) => {
      state.loading.activeVisits = true;
      state.error.activeVisits = null;
    });
    builder.addCase(fetchActiveVisits.fulfilled, (state, action) => {
      state.loading.activeVisits = false;
      state.activeVisits = action.payload || []; // Fallback to empty array
    });
    builder.addCase(fetchActiveVisits.rejected, (state, action) => {
      state.loading.activeVisits = false;
      state.error.activeVisits = action.payload;
      state.activeVisits = []; // Reset to empty array on error
    });

    // Create Patient
    builder.addCase(createPatient.pending, (state) => {
      state.loading.createPatient = true;
      state.error.createPatient = null;
    });
    builder.addCase(createPatient.fulfilled, (state, action) => {
      state.loading.createPatient = false;
      state.createdPatient = action.payload || {}; // Fallback to empty object
    });
    builder.addCase(createPatient.rejected, (state, action) => {
      state.loading.createPatient = false;
      state.error.createPatient = action.payload;
      state.createdPatient = {}; // Reset to empty object on error
    });

    // Start New Visit
    builder.addCase(startNewVisit.pending, (state) => {
      state.loading.startVisit = true;
      state.error.startVisit = null;
    });
    builder.addCase(startNewVisit.fulfilled, (state, action) => {
      state.loading.startVisit = false;
      state.currentVisit = action.payload || {}; // Fallback to empty object
    });
    builder.addCase(startNewVisit.rejected, (state, action) => {
      state.loading.startVisit = false;
      state.error.startVisit = action.payload;
      state.currentVisit = {}; // Reset to empty object on error
    });

    // Visit Details
    builder.addCase(fetchVisitDetails.pending, (state) => {
      state.loading.visitDetails = true;
      state.error.visitDetails = null;
    });
    builder.addCase(fetchVisitDetails.fulfilled, (state, action) => {
      state.loading.visitDetails = false;
      state.currentVisit = action.payload || {}; // Fallback to empty object 
    });
    builder.addCase(fetchVisitDetails.rejected, (state, action) => {
      state.loading.visitDetails = false;
      state.error.visitDetails = action.payload;
      state.currentVisit = {}; // Reset to empty object on error
    });

    // Patient Reports
    builder.addCase(fetchPatientReports.pending, (state) => {
      state.loading.patientReports = true;
      state.error.patientReports = null;
    });
    builder.addCase(fetchPatientReports.fulfilled, (state, action) => {
      state.loading.patientReports = false;
      state.patientReports = action.payload || []; // Fallback to empty array
    });
    builder.addCase(fetchPatientReports.rejected, (state, action) => {
      state.loading.patientReports = false;
      state.error.patientReports = action.payload;
      state.patientReports = []; // Reset to empty array on error
    });

    // Fetch Patients
    builder.addCase(fetchPatients.pending, (state) => {
      state.loading.patients = true;
      state.error.patients = null;
    });
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.loading.patients = false;
      state.patients = action.payload || []; // Fallback to empty array
    });
    builder.addCase(fetchPatients.rejected, (state, action) => {
      state.loading.patients = false;
      state.error.patients = action.payload;
      state.patients = []; // Reset to empty array on error
    });
  }
});

// Actions
export const { resetCurrentVisit, resetPatientCreation, resetAllErrors } = visitsSlice.actions;

// Reducer
export default visitsSlice.reducer;