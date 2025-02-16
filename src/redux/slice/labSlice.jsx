import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// Async Thunks
export const requestLab = createAsyncThunk(
  "lab/requestLab",
  async (labData, { rejectWithValue,getState }) => {
    const { auth } = getState()

    const user = auth.admin || auth.user


    try {
      const response = await apiClient.post(`/lab/request`, {
        ...labData,
        // CHANGE THIS STAFF ID HARD CODED
        doctor_id:"4a812774-c609-4a09-819d-1bf0d6c8634f",
        institution_id:user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to request lab");
    }
  }
);

export const acceptLabRequest = createAsyncThunk(
  "lab/acceptLabRequest",
  async (labData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lab/accept`, labData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to accept lab request");
    }
  }
);

export const uploadLabResult = createAsyncThunk(
  "lab/uploadLabResult",
  async (labData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/lab/institution/uploadResults`, labData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to upload lab result");
    }
  }
);

export const cancelLabRequest = createAsyncThunk(
  "lab/cancelLabRequest",
  async (labData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/cancel`, labData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel lab request");
    }
  }
);

export const fetchPatientLabResults = createAsyncThunk(
  "lab/fetchPatientLabResults",
  async ({ patient_id }, { rejectWithValue,getState }) => {
    const {auth} = getState()
    const user = auth.admin || auth.user
    try {
      const response = await apiClient.get('/lab/labrequests/institution/lab-request',{
        params: {
          patient_id,
          institution_id:user.institution.id
          }
      });
      return response.data.labResults;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lab results");
    }
  }
);

export const fetchLabTest = createAsyncThunk(
    "lab/fetchLabTest",
    async (_, { rejectWithValue,getState }) => {
      const {auth} = getState()
      const user = auth.admin || auth.user
      try {
        const response = await apiClient.get('/lab/test');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch lab results");
      }
    }
  );

// Slice
const labSlice = createSlice({
  name: "lab",
  initialState: {
    labResults: [],
    tests:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestLab.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestLab.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults.push(action.payload.labResult);
      })
      .addCase(requestLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptLabRequest.fulfilled, (state, action) => {
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(uploadLabResult.fulfilled, (state, action) => {
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(cancelLabRequest.fulfilled, (state, action) => {
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      })
      .addCase(fetchPatientLabResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientLabResults.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults = action.payload;
      })
      .addCase(fetchPatientLabResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchLabTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchLabTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default labSlice.reducer;
