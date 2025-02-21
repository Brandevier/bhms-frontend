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
  async ({labResultId}, { rejectWithValue,getState }) => {
    const { user } = getState().auth
    
    try {
      const response = await apiClient.put(`/lab/accept`, {
        labResultId,
        lab_technician_id:user.id,
        institution_id:user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to accept lab request");
    }
  }
);

export const uploadLabResult = createAsyncThunk(
  "lab/uploadLabResult",
  async ({ labResultId, testImage, results_comment }, { rejectWithValue, getState }) => {
    const { user } = getState().auth;
    try {
      const formData = new FormData();
      formData.append("labResultId", labResultId);
      formData.append("testImage", testImage); // File upload
      formData.append("results_comment", results_comment);
      formData.append("institution_id", user.institution.id);

      const response = await apiClient.put(`/lab/institution/uploadResults`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  export const fetchLabStatistics = createAsyncThunk(
    "lab/labStatistics",
    async (_, { rejectWithValue,getState }) => {
      const {auth} = getState()
      const user = auth.admin || auth.user
      try {
        const response = await apiClient.get('/lab/statistics',{
          params:{
            institution_id:user.institution.id
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch lab results");
      }
    }
  );


  export const fetchLabResultsByStatus = createAsyncThunk(
    "lab/fetchLabResultsByStatus",
    async ({ status }, { rejectWithValue,getState }) => {
      const { auth } = getState()

      const user = auth.admin || auth.user
      try {
        const response = await apiClient.get(`/lab/lab-results/by-status`,{
          params: {
            institution_id:user.institution.id,
            status
            }
        });
        return response.data.labResults;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch lab results by status");
      }
    }
  );
  
// Slice
const labSlice = createSlice({
  name: "lab",
  initialState: {
    labResults: [],
    tests:[],
    statistics:[],
    loading: false,
    approveLoading:false,
    uploadLoading:false,
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
        state.approveLoading = false;
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );

      }).addCase(acceptLabRequest.pending,(state,action)=>{
        state.approveLoading=true
      }).addCase(acceptLabRequest.rejected,(state,action)=>{
        state.approveLoading=false
      })

      .addCase(uploadLabResult.fulfilled, (state, action) => {
        state.uploadLoading=false
        state.labResults = state.labResults.map((lab) =>
          lab.id === action.payload.labResult.id ? action.payload.labResult : lab
        );
      }).addCase(uploadLabResult.pending,(state,action)=>{
        state.uploadLoading=true
      }).addCase(uploadLabResult.rejected,(state,action)=>{
        state.uploadLoading=false
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
      }).addCase(fetchLabResultsByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabResultsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults = action.payload;
      })
      .addCase(fetchLabResultsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchLabStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchLabStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchLabStatistics.pending, (state) => {
        state.loading = true;
      });;
  },
});

export default labSlice.reducer;
