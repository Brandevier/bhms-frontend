import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../middleware/apiClient";


// API Base URL
const API_BASE_URL = "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search";

// 🔹 Async Thunk for Searching Prescriptions
export const searchPrescription = createAsyncThunk(
  "prescriptions/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        params: {
          terms: query,
          maxList: 10,
          df: "DISPLAY_NAME,STRENGTHS_AND_FORMS"
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch prescriptions");
    }
  }
);

export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (prescriptionData, { rejectWithValue, getState }) => {
    const { auth } = getState()
    const { user } = auth
    try {
      const response = await apiClient.post(`/prescriptions/create`, {
        ...prescriptionData,
        institution_id: user.institution.id,
        prescribed_by: user.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create prescription");
    }
  }
);

// 🔹 Async Thunk for Approving a Prescription
export const approvePrescription = createAsyncThunk(
  "prescriptions/approve",
  async ({ prescriptionId, patientId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/prescriptions/approve`, {
        prescriptionId,
        patientId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve prescription");
    }
  }
);

// 🔹 Async Thunk for Issuing a Prescription
export const issuePrescription = createAsyncThunk(
  "prescriptions/issue",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/prescriptions/issue`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to issue prescription");
    }
  }
);

// 🔹 Async Thunk for Requesting a Refill
export const requestRefill = createAsyncThunk(
  "prescriptions/requestRefill",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/prescriptions/request-refill`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to request refill");
    }
  }
);

// 🔹 Async Thunk for Approving a Refill
export const approveRefill = createAsyncThunk(
  "prescriptions/approveRefill",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/prescriptions/approve-refill`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve refill");
    }
  }
);

// 🔹 Async Thunk for Issuing a Refill
export const issueRefill = createAsyncThunk(
  "prescriptions/issueRefill",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/prescriptions/issue-refill`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to issue refill");
    }
  }
);

// 🔹 Async Thunk for Fetching Prescriptions by Institution
export const fetchPrescriptionsByInstitution = createAsyncThunk(
  "prescriptions/fetchByInstitution",
  async (_, { rejectWithValue,getState }) => {

    const { auth } = getState()
    const user = auth.user || auth.admin


    try {
      const response = await apiClient.get(`/prescriptions/institution/`,{
        params:{
          institutionId:user.institution.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch prescriptions");
    }
  }
);

// 🔹 Async Thunk for Fetching Prescriptions by Institution and Patient
export const fetchPrescriptionsByInstitutionAndPatient = createAsyncThunk(
  "prescriptions/fetchByInstitutionAndPatient",
  async ({ institutionId, patientId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/patient/prescriptions/", {
        params: {
          institutionId,
          patientId
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch prescriptions");
    }
  }
);

// Delete Prescription

export const deletePrescription = createAsyncThunk(
  "prescriptions/delete",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete prescription");
    }
  }

)





// 🔹 Prescription Slice
const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    results: [],
    status: "idle",
    prescriptions: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchPrescription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchPrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchPrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(createPrescription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prescriptions.push(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Approve Prescription
      .addCase(approvePrescription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(approvePrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(approvePrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Issue Prescription
      .addCase(issuePrescription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(issuePrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(issuePrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Request Refill
      .addCase(requestRefill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestRefill.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(requestRefill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Approve Refill
      .addCase(approveRefill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(approveRefill.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(approveRefill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Issue Refill
      .addCase(issueRefill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(issueRefill.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.prescriptions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(issueRefill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Prescriptions by Institution
      .addCase(fetchPrescriptionsByInstitution.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPrescriptionsByInstitution.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptionsByInstitution.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Prescriptions by Institution and Patient
      .addCase(fetchPrescriptionsByInstitutionAndPatient.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPrescriptionsByInstitutionAndPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptionsByInstitutionAndPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(deletePrescription.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prescriptions = state.prescriptions.filter(
          (p) => p.id !== action.payload.id
        );
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default prescriptionSlice.reducer;
