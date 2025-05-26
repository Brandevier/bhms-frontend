import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';
// Async Thunks
export const fetchBedsByDepartment = createAsyncThunk(
  'beds/fetchByDepartment',
  async ({ departmentId, institutionId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/beds/department/${departmentId}`, {
        params: { institution_id: institutionId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBedStatus = createAsyncThunk(
  'beds/updateStatus',
  async (bedData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/beds/status', bedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBedsSummary = createAsyncThunk(
  'beds/fetchSummary',
  async (institutionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/beds/summary', {
        params: { institution_id: institutionId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllBedsInInstitution = createAsyncThunk(
  'beds/fetchAllInInstitution',
  async (institutionId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/beds/institution', {
        params: { institution_id: institutionId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addBedsToDepartment = createAsyncThunk(
  'beds/addToDepartment',
  async ({ departmentId, institutionId, numberOfBeds }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/beds/add', {
        departmentId,
        institution_id: institutionId,
        numberOfBeds
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteBed = createAsyncThunk(
  'beds/delete',
  async ({ bedId, institutionId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/beds/${bedId}`, {
        params: { institution_id: institutionId }
      });
      return { bedId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  beds: [],
  summary: null,
  loading: false,
  error: null,
  currentBed: null,
  status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
};

// Slice
const bedSlice = createSlice({
  name: 'beds',
  initialState,
  reducers: {
    resetBedState: () => initialState,
    setCurrentBed: (state, action) => {
      state.currentBed = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch beds by department
      .addCase(fetchBedsByDepartment.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchBedsByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.beds = action.payload;
      })
      .addCase(fetchBedsByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update bed status
      .addCase(updateBedStatus.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(updateBedStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        const updatedBed = action.payload;
        state.beds = state.beds.map(bed => 
          bed.id === updatedBed.id ? updatedBed : bed
        );
      })
      .addCase(updateBedStatus.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch beds summary
      .addCase(fetchBedsSummary.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchBedsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchBedsSummary.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch all beds in institution
      .addCase(fetchAllBedsInInstitution.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchAllBedsInInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.beds = action.payload;
      })
      .addCase(fetchAllBedsInInstitution.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add beds to department
      .addCase(addBedsToDepartment.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(addBedsToDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.beds = [...state.beds, ...action.payload.beds];
      })
      .addCase(addBedsToDepartment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete bed
      .addCase(deleteBed.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(deleteBed.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.beds = state.beds.filter(bed => bed.id !== action.payload.bedId);
      })
      .addCase(deleteBed.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { resetBedState, setCurrentBed } = bedSlice.actions;
export default bedSlice.reducer;

// Selectors
export const selectAllBeds = (state) => state.beds.beds;
export const selectBedSummary = (state) => state.beds.summary;
export const selectBedLoading = (state) => state.beds.loading;
export const selectBedError = (state) => state.beds.error;
export const selectCurrentBed = (state) => state.beds.currentBed;
export const selectAvailableBeds = (state) => 
  state.beds.beds.filter(bed => bed.status === 'available' && !bed.is_occupied);
export const selectOccupiedBeds = (state) => 
  state.beds.beds.filter(bed => bed.is_occupied);
export const selectBedsByDepartment = (departmentId) => (state) =>
  state.beds.beds.filter(bed => bed.department_id === departmentId);