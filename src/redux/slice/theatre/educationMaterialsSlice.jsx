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

// Create allergies
export const createAllergy = createAsyncThunk(
  'allergies/create',
  async (allergyData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/theatre/education-materials/allergies', allergyData);
      return data.data;
    }
    catch (error) {
      console.error('❌ Error creating allergy record:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to create allergy record' });
    }
  }
);

// get allergies
export const fetchAllergies = createAsyncThunk(
  'allergies/fetch',
  async ({ visit_id }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/theatre/education-materials/allergies', {
        params: { visit_id }
      });
      return data.data;
    }
    catch (error) {
      console.error('❌ Error fetching allergy records:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch allergy records' });
    }
  }
);

// delete allergy
export const deleteAllergy = createAsyncThunk(
  'allergies/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(`/theatre/education-materials/allergies/${id}`);
      return data.data;
    }
    catch (error) {
      console.error('❌ Error deleting allergy record:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to delete allergy record' });
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
    allergies: null,     // holds allergy records

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
      })
    // ---- CREATE ALLERGY ----
    builder
      .addCase(createAllergy.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(createAllergy.fulfilled, (state, action) => {
        state.loading = false;
        if (state.allergies) {
          state.allergies.push(action.payload);
        } else {
          state.allergies = [action.payload];
        }
      }
      )
      .addCase(createAllergy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create allergy record';
      }
      )
    // ---- FETCH ALLERGIES ----
      .addCase(fetchAllergies.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchAllergies.fulfilled, (state, action) => {
        state.loading = false;
        state.allergies = action.payload;
      }
      )
      .addCase(fetchAllergies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch allergy records';
      }
      )
    // ---- DELETE ALLERGY ----
      .addCase(deleteAllergy.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(deleteAllergy.fulfilled, (state, action) => {
        state.loading = false;
        state.allergies = state.allergies.filter(allergy => allergy.id !== action.payload.id);
      }
      )
      .addCase(deleteAllergy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete allergy record';
      }
      );
  },
});

export const { clearEducationState } = educationMaterialsSlice.actions;
export default educationMaterialsSlice.reducer;
