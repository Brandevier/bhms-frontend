import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/allergies';

// ===============================
// CREATE ALLERGY
// ===============================
export const createAllergy = createAsyncThunk(
  'allergy/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH PATIENT ALLERGIES
// ===============================
export const fetchPatientAllergies = createAsyncThunk(
  'allergy/fetchPatient',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/patient/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// FETCH ALLERGY SUMMARY
// ===============================
export const fetchAllergySummary = createAsyncThunk(
  'allergy/fetchSummary',
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/summary/${patient_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// CHECK DRUG ALLERGIES
// ===============================
export const checkDrugAllergy = createAsyncThunk(
  'allergy/checkDrug',
  async ({ patient_id, drug_name }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/check-drug?patient_id=${patient_id}&drug_name=${drug_name}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// UPDATE ALLERGY
// ===============================
export const updateAllergy = createAsyncThunk(
  'allergy/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// DELETE ALLERGY
// ===============================
export const deleteAllergy = createAsyncThunk(
  'allergy/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// VERIFY ALLERGY
// ===============================
export const verifyAllergy = createAsyncThunk(
  'allergy/verify',
  async ({ id, verification_status, verified_by }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/verify/${id}`, { verification_status, verified_by });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ===============================
// SLICE
// ===============================
const allergySlice = createSlice({
  name: 'allergy',
  initialState: {
    allergies: [],
    summary: null,
    drugCheck: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetAllergyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.drugCheck = null;
    },
    clearDrugCheck: (state) => {
      state.drugCheck = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createAllergy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAllergy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allergies.unshift(action.payload.allergy);
      })
      .addCase(createAllergy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PATIENT ALLERGIES
      .addCase(fetchPatientAllergies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientAllergies.fulfilled, (state, action) => {
        state.loading = false;
        state.allergies = action.payload.allergies || [];
      })
      .addCase(fetchPatientAllergies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SUMMARY
      .addCase(fetchAllergySummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })

      // CHECK DRUG
      .addCase(checkDrugAllergy.fulfilled, (state, action) => {
        state.drugCheck = action.payload;
      })

      // UPDATE
      .addCase(updateAllergy.fulfilled, (state, action) => {
        state.success = true;
        const index = state.allergies.findIndex(a => a.id === action.payload.allergy.id);
        if (index !== -1) {
          state.allergies[index] = action.payload.allergy;
        }
      })

      // DELETE
      .addCase(deleteAllergy.fulfilled, (state, action) => {
        state.allergies = state.allergies.filter(a => a.id !== action.payload);
      })

      // VERIFY
      .addCase(verifyAllergy.fulfilled, (state, action) => {
        const index = state.allergies.findIndex(a => a.id === action.payload.allergy.id);
        if (index !== -1) {
          state.allergies[index] = action.payload.allergy;
        }
      });
  }
});

export const { resetAllergyState, clearDrugCheck } = allergySlice.actions;
export default allergySlice.reducer;

