import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../middleware/apiClient';

// ======================================================
// 🧠 1️⃣ FETCH OR CREATE EDUCATION MATERIALS
// ======================================================
export const fetchOrCreateEducation = createAsyncThunk(
  'education/fetchOrCreate',
  async ({  visit_id, surgery_schedule_id }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/theatre/education/fetch-or-create', {
        visit_id,
        surgery_schedule_id,
      });
      return data.data; // the `data` key holds the record
    } catch (error) {
      console.error('❌ Error fetching education materials:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch education materials' });
    }
  }
);

// ======================================================
// ✏️ 2️⃣ UPDATE EDUCATION MATERIALS
// ======================================================
export const updateEducation = createAsyncThunk(
  'education/update',
  async ({ id, materials_data, completed_by_staff, completed_by_admin }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/theatre/education/${id}`, {
        materials_data,
        completed_by_staff,
        completed_by_admin,
      });
      return data.data;
    } catch (error) {
      console.error('❌ Error updating education materials:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to update education materials' });
    }
  }
);

// ======================================================
// 🧩 3️⃣ SLICE DEFINITION
// ======================================================
const educationMaterialsSlice = createSlice({
  name: 'education',
  initialState: {
    materials: null,      // holds the education record (materials_data + meta)
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearEducationState: (state) => {
      state.materials = null;
      state.loading = false;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // ---- FETCH OR CREATE ----
    builder
      .addCase(fetchOrCreateEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchOrCreateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load education materials';
      });

    // ---- UPDATE ----
    builder
      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update education materials';
        state.updateSuccess = false;
      });
  },
});

export const { clearEducationState } = educationMaterialsSlice.actions;
export default educationMaterialsSlice.reducer;
