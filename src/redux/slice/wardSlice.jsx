import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const fetchPatientsInDepartment = createAsyncThunk(
  'patients/fetchPatientsInDepartment',
  async ({ institutionId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/patients/department/${institutionId}/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const fetchPatientDetails = createAsyncThunk(
  'patients/fetchPatientDetails',
  async ({ institutionId, departmentId, patientId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/patients/details/${institutionId}/${departmentId}/${patientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient details');
    }
  }
);

export const assignNurseToPatient = createAsyncThunk(
  'patients/assignNurseToPatient',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/patients/assign-nurse', assignmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign nurse to patient');
    }
  }
);

export const releaseNurseFromPatient = createAsyncThunk(
  'patients/releaseNurseFromPatient',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/patients/release-nurse/${assignmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to release nurse from patient');
    }
  }
);

export const fetchNurseAssignmentsByDepartment = createAsyncThunk(
  'patients/fetchNurseAssignmentsByDepartment',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/patients/nurse-assignments/${departmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nurse assignments');
    }
  }
);

// Initial state
const initialState = {
  patients: [],
  currentPatient: null,
  nurseAssignments: [],
  loading: false,
  error: null,
  success: false
};

// Slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    clearPatients: (state) => {
      state.patients = [];
    },
    clearNurseAssignments: (state) => {
      state.nurseAssignments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients in Department
      .addCase(fetchPatientsInDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsInDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients;
        state.success = true;
      })
      .addCase(fetchPatientsInDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Patient Details
      .addCase(fetchPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload.patient;
        state.success = true;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign Nurse to Patient
      .addCase(assignNurseToPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(assignNurseToPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Optionally update local state if needed
        if (state.currentPatient) {
          // You might want to update the current patient's assignments
        }
      })
      .addCase(assignNurseToPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Release Nurse from Patient
      .addCase(releaseNurseFromPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(releaseNurseFromPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove the assignment from local state
        state.nurseAssignments = state.nurseAssignments.filter(
          assignment => assignment.id !== action.payload.assignment.id
        );
      })
      .addCase(releaseNurseFromPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Nurse Assignments by Department
      .addCase(fetchNurseAssignmentsByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNurseAssignmentsByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.nurseAssignments = action.payload.assignments;
        state.success = true;
      })
      .addCase(fetchNurseAssignmentsByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearError, 
  clearSuccess, 
  clearCurrentPatient, 
  clearPatients,
  clearNurseAssignments 
} = patientSlice.actions;

// Export reducer
export default patientSlice.reducer;