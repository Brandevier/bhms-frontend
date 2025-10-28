import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Helper function to safely access response data
const getSafeData = (response) => {
  return response?.data ?? null;
};

// Async Actions
export const fetchActiveVisits = createAsyncThunk(
  'records/fetchActiveVisits',
  async ({ department_id = null } = {}, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;

    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }

    try {
      const params = { institution_id: institutionId };
      
      // Add department_id to params only if provided
      if (department_id) {
        params.department_id = department_id;
      }

      const response = await apiClient.get('/records/visit/active', { params });
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

export const getPatientDetails = createAsyncThunk(
  'records/getPatientDetails',
  async (id, { rejectWithValue, getState }) => {
    try {
      const response = await apiClient.get(`/records/patient/${id}`)
      return getSafeData(response.data) || null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
)

export const startNewVisit = createAsyncThunk(
  'records/startNewVisit',
  async (data, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institution_id = auth.user?.institution?.id || auth.admin?.institution?.id;

    if (!institution_id) {
      return rejectWithValue('Institution ID is required');
    }

    try {
      const response = await apiClient.post('/records/patient/initiate', {
        ...data,
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

// patch patient information
export const patchPatientInfo = createAsyncThunk(
  'records/patchPatientInfo',
  async ({ patient_id, data }, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;
    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }
    try {
      const response = await apiClient.patch(`/records/patient/${patient_id}`, {
        ...data,
        institution_id: institutionId
      });
      return getSafeData(response) || {};
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient information');
    }
  }
);

// get insurance providers
export const fetchInsuranceProviders = createAsyncThunk(
  'records/fetchInsuranceProviders',
  async (_, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;
    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }
    try {
      const response = await apiClient.get('/records/insurance');
      return getSafeData(response) || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch insurance providers');
    }
  }
);

// patch insurance information
export const patchInsuranceInfo = createAsyncThunk(
  'records/patchInsuranceInfo',
  async ({ patient_id, data }, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;
    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }
    try {
      const response = await apiClient.patch(`/records/patient/insurance/${patient_id}`, {
        ...data,
        institution_id: institutionId
      });
      return getSafeData(response) || {};
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || 'Failed to update insurance information');
    }
  }
);

// get the visit statistics
export const fetchVisitStatistics = createAsyncThunk(
  'records/fetchVisitStatistics',
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/records/visits/statistics/${visitId}`);
      return getSafeData(response) || null;
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visit statistics');
    }
  }
);

// get visit base on visit_type and attendance type
export const fetchVisitByType = createAsyncThunk(
  'records/fetchVisitByType',
  async ({ visit_type, attendance_type }, { rejectWithValue, getState }) => {
    const auth = getState().auth;
    const institutionId = auth.user?.institution?.id || auth.admin?.institution?.id;

    if (!institutionId) {
      return rejectWithValue('Institution ID is required');
    }

    try {
      const response = await apiClient.get('/records/visit/by-type', {
        params: { institution_id: institutionId, visit_type, attendance_type }
      });
      return getSafeData(response) || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visits by type');
    }
  }
);





// Enhanced Initial State with single loading and error states
const initialState = {
  activeVisits: [],
  visit_statistics: null,
  statsLoading:false,
  currentVisit: {},
  insuranceProviders: [],
  patientReports: [],
  patients: [],
  patient: null,
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
    builder
      .addCase(fetchActiveVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchActiveVisits';
      })
      .addCase(fetchActiveVisits.fulfilled, (state, action) => {
        state.activeVisits = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchActiveVisits';
      })
      .addCase(fetchActiveVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchActiveVisits';
      })
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'createPatient';
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.createdPatient = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'createPatient';
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'createPatient';
      })
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchPatients';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchPatients';
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchPatients';
      })
      .addCase(startNewVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'startNewVisit';
      })
      .addCase(startNewVisit.fulfilled, (state, action) => {
        state.currentVisit.visitDetails = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'startNewVisit';
      })
      .addCase(startNewVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state
          .lastAction = 'startNewVisit';
      })
      .addCase(fetchVisitDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchVisitDetails';
      })
      .addCase(fetchVisitDetails.fulfilled, (state, action) => {
        state.currentVisit = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchVisitDetails';
      })
      .addCase(fetchVisitDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchVisitDetails';
      })
      .addCase(fetchPatientReports.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchPatientReports';
      })
      .addCase(fetchPatientReports.fulfilled, (state, action) => {
        state.patientReports = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchPatientReports';
      })
      .addCase(fetchPatientReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchPatientReports';
      })
      .addCase(patchPatientInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'patchPatientInfo';
      })
      .addCase(patchPatientInfo.fulfilled, (state, action) => {
        const updatedPatient = action.payload;
        const index = state.patients.findIndex(p => p.id === updatedPatient.id);
        state.loading = false;
      })
      .addCase(patchPatientInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'patchPatientInfo';
      }
      ).addCase(getPatientDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'patchPatientInfo';
      }).addCase(getPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.patient = action.payload
      }).addCase(getPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload,
          state.lastAction = 'patchPatientInfo';
      })
      .addCase(fetchInsuranceProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchInsuranceProviders';
      })
      .addCase(fetchInsuranceProviders.fulfilled, (state, action) => {
        state.insuranceProviders = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchInsuranceProviders';
      }
      )
      .addCase(fetchInsuranceProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchInsuranceProviders';
      }
      )
      .addCase(patchInsuranceInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'patchInsuranceInfo';
      })
      .addCase(patchInsuranceInfo.fulfilled, (state, action) => {
        const updatedPatient = action.payload;
        const index = state.patients.findIndex(p => p.id === updatedPatient.id);
        if (index !== -1) {
          state.patients[index] = updatedPatient;
        }
        state.loading = false;
        state.error = null;
        state.lastAction = 'patchInsuranceInfo';
      }
      )
      .addCase(patchInsuranceInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'patchInsuranceInfo';
      }
      )
      .addCase(fetchVisitStatistics.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
        state.lastAction = 'fetchVisitStatistics';
      })
      .addCase(fetchVisitStatistics.fulfilled, (state, action) => {
        state.visit_statistics = action.payload;
        state.statsLoading = false;
        state.error = null;
        state.lastAction = 'fetchVisitStatistics';
      }
      )
      .addCase(fetchVisitStatistics.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
        state.lastAction = 'fetchVisitStatistics';
      }
      )
      .addCase(fetchVisitByType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'fetchVisitByType';
      })
      .addCase(fetchVisitByType.fulfilled, (state, action) => {
        state.activeVisits = action.payload;
        state.loading = false;
        state.error = null;
        state.lastAction = 'fetchVisitByType';
      })
      .addCase(fetchVisitByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastAction = 'fetchVisitByType';
      });




  }
});

// Actions
export const { resetCurrentVisit, resetPatientCreation, resetError } = visitsSlice.actions;

// Reducer
export default visitsSlice.reducer;