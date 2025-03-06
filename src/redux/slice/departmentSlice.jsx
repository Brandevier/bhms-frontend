import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";
// Async Thunks

// Create a department
export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (departmentData, { rejectWithValue,getState }) => {
    const { auth } = getState()
    const institution_id = auth.admin.institution.id
    try {
      const response = await apiClient.post("/department/create", {
        ...departmentData,
        "institution_id":institution_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update department beds
export const updateDepartmentBeds = createAsyncThunk(
  "department/updateDepartmentBeds",
  async ({ departmentId, total_beds }, { rejectWithValue }) => {
    
    try {
      const response = await apiClient.put(`/api/departments/${departmentId}/beds`, { total_beds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all departments by institution
export const getDepartmentsByInstitution = createAsyncThunk(
  "department/getDepartmentsByInstitution",
  async (_, { rejectWithValue,getState }) => {
    const { auth } = getState()
    const user = auth.admin || auth.user


    try {
      const response = await apiClient.get(`/institutions/departments`,{
        params:{
            "institution_id":user.institution.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get a single department
export const getDepartment = createAsyncThunk(
  "department/getDepartment",
  async (_, { rejectWithValue,getState }) => {
    const { auth } = getState()

    const user = auth.user || auth.admin

    try {
      const response = await apiClient.get(`/institution/department/`,{
        params:{
          institution_id : user.institution.id,
          department_id : user.department.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add staff to a department
export const addStaffToDepartment = createAsyncThunk(
  "department/addStaffToDepartment",
  async ({ departmentId, staffId, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/departments/${departmentId}/staff`, {
        staffId,
        institution_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove staff from a department
export const removeStaffFromDepartment = createAsyncThunk(
  "department/removeStaffFromDepartment",
  async ({ staffId, institutionId, departmentId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/api/departments/${departmentId}/staff/${staffId}?institutionId=${institutionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all staff by institution
export const getStaffByInstitution = createAsyncThunk(
  "department/getStaffByInstitution",
  async (institution_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/departments/staff?institution_id=${institution_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all patients in a department
export const getAllPatientsFromDepartment = createAsyncThunk(
  "department/getAllPatientsFromDepartment",
  async ({ institution_id, department_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/api/departments/${department_id}/patients?institution_id=${institution_id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get department summary with diagnosis details
export const getDepartmentSummaryWithDiagnosisDetails = createAsyncThunk(
  "department/getDepartmentSummaryWithDiagnosisDetails",
  async (_, { rejectWithValue,getState }) => {

    const { auth } = getState()

    const user = auth.user;

    try {
      const response = await apiClient.get('/department/get-summary',{
        params:{
          institution_id:user.institution.id,
          department_id:user.department.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  departments: [],
  department: null,
  stats : null,
  staff: [],
  patients: [],
  loading: false,
  error: null,
};

// Slice
const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    clearDepartmentState: (state) => {
      state.departments = [];
      state.department = null;
      state.staff = [];
      state.patients = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Department
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Department Beds
      .addCase(updateDepartmentBeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartmentBeds.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDepartment = action.payload;
        state.departments = state.departments.map((dept) =>
          dept.id === updatedDepartment.id ? updatedDepartment : dept
        );
      })
      .addCase(updateDepartmentBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Departments by Institution
      .addCase(getDepartmentsByInstitution.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentsByInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(getDepartmentsByInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Department
      .addCase(getDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = action.payload;
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Staff to Department
      .addCase(addStaffToDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStaffToDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(addStaffToDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Staff from Department
      .addCase(removeStaffFromDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeStaffFromDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = state.staff.filter((staff) => staff.id !== action.payload.staffId);
      })
      .addCase(removeStaffFromDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Staff by Institution
      .addCase(getStaffByInstitution.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStaffByInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(getStaffByInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Patients from Department
      .addCase(getAllPatientsFromDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPatientsFromDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(getAllPatientsFromDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Department Summary with Diagnosis Details
      .addCase(getDepartmentSummaryWithDiagnosisDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentSummaryWithDiagnosisDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDepartmentSummaryWithDiagnosisDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions
export const { clearDepartmentState } = departmentSlice.actions;

// Export Reducer
export default departmentSlice.reducer;