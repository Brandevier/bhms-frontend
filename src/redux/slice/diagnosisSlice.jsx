import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../middleware/apiClient";
import { loadDiagnosisData } from "../../util/loadDiagnosisData";

// 🔹 Load diagnosis data once when the app starts
let diagnosisSearchData = [];
let searchDataLoaded = false;

const loadSearchData = async () => {
  if (!searchDataLoaded) {
    diagnosisSearchData = await loadDiagnosisData();
    searchDataLoaded = true;
  }
};

// 🔹 Offline Diagnosis Search
export const searchDiagnosis = createAsyncThunk(
  "diagnosis/searchDiagnosis",
  async (query, { rejectWithValue }) => {
    try {
      await loadSearchData();
      
      if (!query) return [];
      
      const lowerQuery = query.toLowerCase();
      
      // Simple search implementation - can be optimized
      const results = diagnosisSearchData.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.code.toLowerCase().includes(lowerQuery)
      ).slice(0, 50); // Limit to 50 results
      
      return results.map(item => ({
        code: item.code,
        description: item.name,
        level: item.level
      }));
      
    } catch (error) {
      return rejectWithValue(error.message || "Failed to search diagnoses");
    }
  }
);

// 🔹 Add New Diagnosis
export const addDiagnosis = createAsyncThunk(
  "diagnosis/addDiagnosis",
  async (diagnosisData, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const user = auth.user;
    try {
      const response = await apiClient.post(`/diagnosis/patient-diagnoses/add-diagnosis`, {
        ...diagnosisData,
        institution_id: user.institution.id,
        staff_id: user.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add diagnosis");
    }
  }
);

// 🔹 Get Patient Diagnosis
export const getPatientDiagnosis = createAsyncThunk(
  "diagnosis/getPatientDiagnosis",
  async (patientId, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const response = await apiClient.get(`/diagnosis/patient-diagnoses/${patientId}`, {
        params: {
          institution_id: auth.user.institution.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient diagnosis");
    }
  }
);

// 🔹 Update Diagnosis
export const updateDiagnosis = createAsyncThunk(
  "diagnosis/updateDiagnosis",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/diagnosis/patient-diagnosis/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update diagnosis");
    }
  }
);

// 🔹 Delete Diagnosis
export const deleteDiagnosis = createAsyncThunk(
  "diagnosis/deleteDiagnosis",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/diagnosis/patient-diagnosis/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete diagnosis");
    }
  }
);

const initialState = {
  searchResults: [], // For search results
  patientDiagnoses: [], // For patient-specific diagnoses
  loading: false,
  searchLoading: false,
  addDiagnosisStatus: false,
  error: null,
};

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    clearDiagnosisSearch: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    resetDiagnosisState: (state) => {
      state.searchResults = [];
      state.patientDiagnoses = [];
      state.error = null;
      state.loading = false;
      state.searchLoading = false;
      state.addDiagnosisStatus = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search Diagnosis
      .addCase(searchDiagnosis.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchDiagnosis.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchDiagnosis.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      
      // Add Diagnosis
      .addCase(addDiagnosis.pending, (state) => {
        state.addDiagnosisStatus = true;
        state.error = null;
      })
      .addCase(addDiagnosis.fulfilled, (state, action) => {
        state.addDiagnosisStatus = false;
        state.patientDiagnoses.push(action.payload);
      })
      .addCase(addDiagnosis.rejected, (state, action) => {
        state.addDiagnosisStatus = false;
        state.error = action.payload;
      })
      
      // Get Patient Diagnosis
      .addCase(getPatientDiagnosis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientDiagnosis.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDiagnoses = action.payload;
      })
      .addCase(getPatientDiagnosis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Diagnosis
      .addCase(updateDiagnosis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiagnosis.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDiagnoses = state.patientDiagnoses.map(diagnosis =>
          diagnosis.id === action.payload.id ? action.payload : diagnosis
        );
      })
      .addCase(updateDiagnosis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Diagnosis
      .addCase(deleteDiagnosis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiagnosis.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDiagnoses = state.patientDiagnoses.filter(
          diagnosis => diagnosis.id !== action.payload
        );
      })
      .addCase(deleteDiagnosis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDiagnosisSearch, resetDiagnosisState } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;