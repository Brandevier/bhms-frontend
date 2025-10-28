import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from '../middleware/apiClient';


// Async Thunk to Fetch Procedures from ClinicalTables API
export const fetchProcedures = createAsyncThunk(
  "procedures/fetchProcedures",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          terms: searchTerm,
          maxList: 10, // Adjust number of results if needed
          df: "code_dotted,long_name", // Fetch formatted code and full name
        },
      });

      console.log(response.data)

      return response.data[3].map((item) => ({
        code: item?.[0], // ICD-9 Code
        name: item?.[1], // Procedure Name
      }));
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data || "Failed to fetch procedures");
    }
  }
);

// fetch-all procedures for in  institution
export const fetchAllProcedures = createAsyncThunk(
  "procedures/fetchAllProcedures",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState()
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.get(`/procedure/get-all-procedures`, {
        params: {
          institution_id: user.institution.id
        }
      });
      return response.data.procedures;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch procedures");
    }
  }
);


// Async Thunk to Add a New Procedure
export const addProcedure = createAsyncThunk(
  "procedures/addProcedure",
  async (procedureData, { rejectWithValue, getState }) => {
    const { auth } = getState()
    const user = auth.admin || auth.user;
    try {
      const response = await apiClient.post(`/procedure/add-procedure`, {
        ...procedureData,
        institution_id: user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add procedure");
    }
  }
);

// Async Thunk to Remove Staff from a Procedure
export const removeStaffFromProcedure = createAsyncThunk(
  "procedures/removeStaffFromProcedure",
  async ({ procedure_id, staff_id }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/procedure/remove-staff`, {
        data: { procedure_id, staff_id },
      });
      return { procedure_id, staff_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove staff from procedure");
    }
  }
);

// Async Thunk to Delete a Procedure
export const deleteProcedure = createAsyncThunk(
  "procedures/deleteProcedure",
  async (procedure_id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${BACKEND_BASE_URL}/${procedure_id}`);
      return procedure_id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete procedure");
    }
  }
);

// update procedure status
export const updateProcedureStatus = createAsyncThunk(
  "procedures/updateProcedureStatus",
  async (data, { rejectWithValue,getState }) => {

    const { user } = getState().auth
    try {
      const response = await apiClient.patch(`/procedure/update-status`,{
        ...data,
        institution_id:user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update procedure status");
    }
  }
);

// Redux Slice for Procedures
const procedureSlice = createSlice({
  name: "procedures",
  initialState: {
    procedures: [], // Stores fetched procedures from API
    patientProcedures: [],
    allProcedures: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Procedures (ICD-9)
      .addCase(fetchProcedures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProcedures.fulfilled, (state, action) => {
        state.loading = false;
        state.procedures = action.payload;
      })
      .addCase(fetchProcedures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Procedure
      .addCase(addProcedure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProcedure.fulfilled, (state, action) => {
        state.loading = false;
        state.patientProcedures.push(action.payload);
      })
      .addCase(addProcedure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Staff from Procedure
      .addCase(removeStaffFromProcedure.fulfilled, (state, action) => {
        const { procedure_id, staff_id } = action.payload;
        const procedure = state.patientProcedures.find((p) => p.id === procedure_id);
        if (procedure) {
          procedure.staff_assistance = procedure.staff_assistance.filter((id) => id !== staff_id);
        }
      })

      // Delete Procedure
      .addCase(deleteProcedure.fulfilled, (state, action) => {
        state.procedures = state.patientProcedures.filter((procedure) => procedure.id !== action.payload);
      })

      // Fetch all procedures in the institution
      .addCase(fetchAllProcedures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProcedures.fulfilled, (state, action) => {
        state.loading = false;
        state.allProcedures = action.payload;
      })
      .addCase(fetchAllProcedures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProcedureStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProcedureStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProcedure = action.payload;
        const index = state.patientProcedures.findIndex((p) => p.id === updatedProcedure.id);
        if (index !== -1) {
          state.patientProcedures[index] = updatedProcedure;
        }
      })
      .addCase(updateProcedureStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
      );


  },
});

export default procedureSlice.reducer;
