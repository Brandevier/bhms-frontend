import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async Thunks for API calls

// Create Patient Note
export const createPatientNote = createAsyncThunk(
  'patientNotes/createPatientNote',
  async (noteData, { rejectWithValue,getState }) => {
    console.log('visit notes',noteData)
    const {auth } = getState()
    const user = auth.admin || auth.user 
    try {
      const response = await apiClient.post('/patient-note/notes/create', {
        ...noteData,
        staff_id:user.id,
        institution_id:user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch Patient Notes
export const fetchPatientNotes = createAsyncThunk(
  'patientNotes/fetchPatientNotes',
  async ({ patient_id}, { rejectWithValue,getState }) => {
    const {auth } = getState()
    const user = auth.admin || auth.user 
    console.log('PATIENT ID=',patient_id)
    try {
      const response = await apiClient.get('/patient-note/notes', {
        params: { patient_id, institution_id:user.institution.id },
      });
      console.log('======================',response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Patient Note
export const updatePatientNote = createAsyncThunk(
  'patientNotes/updatePatientNote',
  async ({ note_id, note }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/patient-notes/${note_id}`, { note });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Patient Note
export const deletePatientNote = createAsyncThunk(
  'patientNotes/deletePatientNote',
  async (note_id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/patient-notes/${note_id}`);
      return note_id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  notes: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const patientNotesSlice = createSlice({
  name: 'patientNotes',
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Create Patient Note
      .addCase(createPatientNote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPatientNote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes.push(action.payload.note);
      })
      .addCase(createPatientNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })

      // Fetch Patient Notes
      .addCase(fetchPatientNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(fetchPatientNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Patient Note
      .addCase(updatePatientNote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePatientNote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.notes.findIndex((note) => note.id === action.payload.note.id);
        if (index !== -1) {
          state.notes[index] = action.payload.note;
        }
      })
      .addCase(updatePatientNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })

      // Delete Patient Note
      .addCase(deletePatientNote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePatientNote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      })
      .addCase(deletePatientNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      });
  },
});

// Export actions and reducer
export const { actions } = patientNotesSlice;
export default patientNotesSlice.reducer;