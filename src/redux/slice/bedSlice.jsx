import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks

// Get all beds in a department
export const fetchBedsByDepartment = createAsyncThunk(
  'beds/fetchByDepartment',
  async ({ departmentId, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/beds/department/${departmentId}/${institution_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update bed status
export const updateBedStatus = createAsyncThunk(
  'beds/updateStatus',
  async ({ bed_id, bed_number, department_id, institution_id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/api/beds/update-status', {
        bed_id,
        bed_number,
        department_id,
        institution_id,
        status
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get beds summary by institution
export const fetchBedsSummary = createAsyncThunk(
  'beds/fetchSummary',
  async (institution_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/beds/summary', { params: { institution_id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all beds in an institution
export const fetchAllBedsInInstitution = createAsyncThunk(
  'beds/fetchAllInInstitution',
  async (_, { rejectWithValue,getState }) => {

     const { auth } = getState()

    const user = auth.user || auth.admin
    try {
      const response = await apiClient.get('/api/beds/institution', { params: { institution_id:user.institution.id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add beds to a department
export const addBedsToDepartment = createAsyncThunk(
  'beds/addToDepartment',
  async ({ departmentId, institution_id, numberOfBeds }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/beds/add', {
        departmentId,
        institution_id,
        numberOfBeds
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a bed from a department
export const deleteBed = createAsyncThunk(
  'beds/delete',
  async ({ bedId, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/beds/${bedId}/${institution_id}`);
      return { bedId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  beds: [],
  summary: {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    bedsByDepartment: {},
    bedsByStatus: []
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentDepartmentBeds: [],
  currentInstitutionBeds: []
};

// Slice
const bedsSlice = createSlice({
  name: 'beds',
  initialState,
  reducers: {
    resetBedsState: () => initialState,
    clearBedError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch beds by department
      .addCase(fetchBedsByDepartment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBedsByDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentDepartmentBeds = action.payload;
      })
      .addCase(fetchBedsByDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update bed status
      .addCase(updateBedStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBedStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the bed in currentDepartmentBeds if it exists there
        state.currentDepartmentBeds = state.currentDepartmentBeds.map(bed => 
          bed.id === action.payload.id ? action.payload : bed
        );
        // Update the bed in currentInstitutionBeds if it exists there
        state.currentInstitutionBeds = state.currentInstitutionBeds.map(bed => 
          bed.id === action.payload.id ? action.payload : bed
        );
        // Update the bed in all beds array if it exists there
        state.beds = state.beds.map(bed => 
          bed.id === action.payload.id ? action.payload : bed
        );
      })
      .addCase(updateBedStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch beds summary
      .addCase(fetchBedsSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBedsSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchBedsSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch all beds in institution
      .addCase(fetchAllBedsInInstitution.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllBedsInInstitution.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentInstitutionBeds = action.payload;
      })
      .addCase(fetchAllBedsInInstitution.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add beds to department
      .addCase(addBedsToDepartment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBedsToDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentDepartmentBeds = [...state.currentDepartmentBeds, ...action.payload.beds];
        state.currentInstitutionBeds = [...state.currentInstitutionBeds, ...action.payload.beds];
      })
      .addCase(addBedsToDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete bed
      .addCase(deleteBed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentDepartmentBeds = state.currentDepartmentBeds.filter(
          bed => bed.id !== action.payload.bedId
        );
        state.currentInstitutionBeds = state.currentInstitutionBeds.filter(
          bed => bed.id !== action.payload.bedId
        );
      })
      .addCase(deleteBed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { resetBedsState, clearBedError } = bedsSlice.actions;
export default bedsSlice.reducer;

// Selectors
export const selectAllBeds = (state) => state.beds.beds;
export const selectCurrentDepartmentBeds = (state) => state.beds.currentDepartmentBeds;
export const selectCurrentInstitutionBeds = (state) => state.beds.currentInstitutionBeds;
export const selectBedsSummary = (state) => state.beds.summary;
export const selectBedsStatus = (state) => state.beds.status;
export const selectBedsError = (state) => state.beds.error;