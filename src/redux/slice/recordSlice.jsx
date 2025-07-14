import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch active visits');
    }
  }
);




export const createPatient = createAsyncThunk(
  'records/createPatient',
  async (patientData, { rejectWithValue,getState }) => {
    const auth = getState().auth;
      const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;
      if (!institutionId) { 
        return rejectWithValue('Institution ID is required');
      }
    try {
      const response = await apiClient.post('/records/patient/create', {
        ...patientData,
        institution_id:institutionId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create patient');
    }
  }
);


// get all patients in the institution
export const fetchPatients = createAsyncThunk(
  'records/fetchPatients',
  async (_, { rejectWithValue,getState }) => {
    const auth = getState().auth;
      const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;  
      if (!institutionId) {
        return rejectWithValue('Institution ID is required');
      }
    try {
      const response = await apiClient.get(`/records/patients/${institutionId}`,);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch patients');
    }
  }
);



export const startNewVisit = createAsyncThunk(
  'records/startNewVisit',
  async (patient_id, { rejectWithValue,getState}) => {
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to initialize visit');
    }
  }
);


export const fetchVisitDetails = createAsyncThunk(
  'records/fetchVisitDetails',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/records/visits/${visitId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch visit details');
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch patient reports');
    }
  }
);

// Initial State
const initialState = {
  activeVisits: [],
  currentVisit: null,
  patientReports: [],
  patients: [],
  createdPatient: null,
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
      state.currentVisit = null;
      state.error.visitDetails = null;
    },
    resetPatientCreation: (state) => {
      state.createdPatient = null;
      state.error.createPatient = null;
    }
  },
  extraReducers: (builder) => {
     const ensureStateStructure = (state) => {
      if (!state.loading) state.loading = {};
      if (!state.error) state.error = {};
      return state;
    };
    // Active Visits
    builder.addCase(fetchActiveVisits.pending, (state) => {
      ensureStateStructure(state);
      state.loading.activeVisits = true;
      state.error.activeVisits = null;
    });
    builder.addCase(fetchActiveVisits.fulfilled, (state, action) => {
      ensureStateStructure(state);
      state.loading.activeVisits = false;
      state.activeVisits = action.payload;
    });
    builder.addCase(fetchActiveVisits.rejected, (state, action) => {
      ensureStateStructure(state);
      state.loading.activeVisits = false;
      state.error.activeVisits = action.payload;
    });

    // Create Patient
    builder.addCase(createPatient.pending, (state) => {
       ensureStateStructure(state);
      state.loading.createPatient = true;
      state.error.createPatient = null;
    });
    builder.addCase(createPatient.fulfilled, (state, action) => {
       ensureStateStructure(state);
      state.loading.createPatient = false;
      state.createdPatient = action.payload;
    });
    builder.addCase(createPatient.rejected, (state, action) => {
       ensureStateStructure(state);
      state.loading.createPatient = false;
      state.error.createPatient = action.payload;
    });

    // Start New Visit
    builder.addCase(startNewVisit.pending, (state) => {
      ensureStateStructure(state);
      state.loading.startVisit = true;
      state.error.startVisit = null;
    });
    builder.addCase(startNewVisit.fulfilled, (state, action) => {
      ensureStateStructure(state);
      state.loading.startVisit = false;
      state.currentVisit = action.payload.visit;
    });
    builder.addCase(startNewVisit.rejected, (state, action) => {
      ensureStateStructure(state);
      state.loading.startVisit = false;
      state.error.startVisit = action.payload;
    });

    // Visit Details
    builder.addCase(fetchVisitDetails.pending, (state) => {
      ensureStateStructure(state);
      state.loading.visitDetails = true;
      state.error.visitDetails = null;
    });
    builder.addCase(fetchVisitDetails.fulfilled, (state, action) => {
      ensureStateStructure(state);
      state.loading.visitDetails = false;
      state.currentVisit = action.payload;
    });
    builder.addCase(fetchVisitDetails.rejected, (state, action) => {
      ensureStateStructure(state);
      state.loading.visitDetails = false;
      state.error.visitDetails = action.payload;
    });

    // Patient Reports
    builder.addCase(fetchPatientReports.pending, (state) => {
      state.loading.patientReports = true;
      state.error.patientReports = null;
    });
    builder.addCase(fetchPatientReports.fulfilled, (state, action) => {
      state.loading.patientReports = false;
      state.patientReports = action.payload;
    });
    builder.addCase(fetchPatientReports.rejected, (state, action) => {
      state.loading.patientReports = false;
      state.error.patientReports = action.payload;
    })

    // Fetch Patients
    builder.addCase(fetchPatients.pending, (state) => {
      state.loading.patients = true;
      state.error.patients = null;
    });
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.loading.patients = false;
      state.patients = action.payload;
    });
    builder.addCase(fetchPatients.rejected, (state, action) => {
      state.loading.patients = false;
      state.error.patients = action.payload;
    }
    );
  }
});

// Actions
export const { resetCurrentVisit, resetPatientCreation } = visitsSlice.actions;

// Reducer
export default visitsSlice.reducer;