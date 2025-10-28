import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';



// Async Thunks
export const fetchPatientAppointments = createAsyncThunk(
  'appointments/fetchPatientAppointments',
  async ({ patient_id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/appointments/patient', {
        params: { patient_id, institution_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue,getState }) => {
    const { auth } = getState();
    const user = auth.user || auth.admin;
    try {
      const response = await apiClient.post('/appointments/create', {
        ...appointmentData,
        institution_id: user.institution.id,
        staff_id: user.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStaffByRole = createAsyncThunk(
  'appointments/getStaffByRole',
  async ({ institution_id, role_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/appointments/staff', {
        params: { institution_id, role_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  'appointments/getDoctorAppointments',
  async ({ institution_id, doctor_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/appointments/doctor', {
        params: { institution_id, doctor_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllInstitutionAppointments = createAsyncThunk(
  'appointments/getAllInstitutionAppointments',
  async (_, { rejectWithValue,getState }) => {
    const { auth } = getState();
    const user = auth.user || auth.admin;
    const institution_id = user.institution.id;
    try {
      const response = await apiClient.get('/appointments/institution', {
        params: { institution_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async ({ id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/appointments', {
        params: { id, institution_id }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveAppointment = createAsyncThunk(
  'appointments/approveAppointment',
  async ({ patient_id, appointmentId, department_id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/appointments/approve', {
        patient_id,
        appointmentId,
        department_id,
        institution_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  patientAppointments: [],
  doctorAppointments: [],
  institutionAppointments: [],
  staffByRole: [],
  currentAppointment: null,
  status: 'idle',
  error: null,
  successMessage: null,
  loading: false
};

// Slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    resetAppointmentState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
    clearAppointments: (state) => {
      state.patientAppointments = [];
      state.doctorAppointments = [];
      state.institutionAppointments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patient Appointments
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAppointments = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch patient appointments';
      })
      
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.currentAppointment = action.payload.appointment;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create appointment';
      })
      
      // Get Staff By Role
      .addCase(getStaffByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.staffByRole = action.payload;
      })
      .addCase(getStaffByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch staff by role';
      })
      
      // Get Doctor Appointments
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorAppointments = action.payload;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch doctor appointments';
      })
      
      // Get All Institution Appointments
      .addCase(getAllInstitutionAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInstitutionAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.institutionAppointments = action.payload;
      })
      .addCase(getAllInstitutionAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch institution appointments';
      })
      
      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        // Remove deleted appointment from state
        state.patientAppointments = state.patientAppointments.filter(
          appt => appt.id !== action.payload.id
        );
        state.doctorAppointments = state.doctorAppointments.filter(
          appt => appt.id !== action.payload.id
        );
        state.institutionAppointments = state.institutionAppointments.filter(
          appt => appt.id !== action.payload.id
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete appointment';
      })
      
      // Approve Appointment
      .addCase(approveAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        // Update appointment status in state
        state.patientAppointments = state.patientAppointments.map(appt => 
          appt.id === action.payload.appointmentId ? { ...appt, status: 'completed' } : appt
        );
        state.doctorAppointments = state.doctorAppointments.map(appt => 
          appt.id === action.payload.appointmentId ? { ...appt, status: 'completed' } : appt
        );
        state.institutionAppointments = state.institutionAppointments.map(appt => 
          appt.id === action.payload.appointmentId ? { ...appt, status: 'completed' } : appt
        );
      })
      .addCase(approveAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to approve appointment';
      });
  }
});

// Export actions and reducer
export const { resetAppointmentState, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;