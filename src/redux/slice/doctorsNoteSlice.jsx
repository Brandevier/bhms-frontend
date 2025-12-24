import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

/* -------------------- THUNKS -------------------- */

// Create doctor’s note
export const createDoctorsNote = createAsyncThunk(
  'doctorsNotes/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(
        '/doctor/doctors-notes',
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create doctor’s note'
      );
    }
  }
);

// Get notes by visit
export const getNotesByVisit = createAsyncThunk(
  'doctorsNotes/getByVisit',
  async (visitId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(
        `/doctor/doctors-notes/visit/${visitId}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch notes'
      );
    }
  }
);

// Get single note
export const getSingleNote = createAsyncThunk(
  'doctorsNotes/getSingle',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(
        `/doctors-notes/${id}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch note'
      );
    }
  }
);

// Update doctor’s note
export const updateDoctorsNote = createAsyncThunk(
  'doctorsNotes/update',
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(
        `/doctors-notes/${id}`,
        { note }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update note'
      );
    }
  }
);

// Sign doctor’s note
export const signDoctorsNote = createAsyncThunk(
  'doctorsNotes/sign',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(
        `/doctors-notes/${id}/sign`
      );
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to sign note'
      );
    }
  }
);

// Delete doctor’s note
export const deleteDoctorsNote = createAsyncThunk(
  'doctorsNotes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(
        `/doctors-notes/${id}`
      );
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete note'
      );
    }
  }
);

/* -------------------- SLICE -------------------- */

const doctorsNoteSlice = createSlice({
  name: 'doctorsNotes',
  initialState: {
    notes: [],
    selectedNote: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearDoctorsNoteState: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createDoctorsNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDoctorsNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notes.unshift(action.payload);
      })
      .addCase(createDoctorsNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY VISIT */
      .addCase(getNotesByVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotesByVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotesByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET SINGLE */
      .addCase(getSingleNote.fulfilled, (state, action) => {
        state.selectedNote = action.payload;
      })

      /* UPDATE */
      .addCase(updateDoctorsNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          (n) => n.id === action.payload.id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })

      /* SIGN */
      .addCase(signDoctorsNote.fulfilled, (state, action) => {
        const note = state.notes.find(
          (n) => n.id === action.payload.id
        );
        if (note) {
          note.is_signed = true;
          note.signed_at = new Date().toISOString();
        }
      })

      /* DELETE */
      .addCase(deleteDoctorsNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(
          (n) => n.id !== action.payload
        );
      });
  }
});

export const { clearDoctorsNoteState } = doctorsNoteSlice.actions;
export default doctorsNoteSlice.reducer;
