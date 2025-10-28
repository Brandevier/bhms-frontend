import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';



// Async thunks
export const fetchCarePlans = createAsyncThunk(
  'carePlan/fetchCarePlans',
  async ({ visit_id, institution_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/care-plan', {
        params: { visit_id, institution_id }
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCarePlan = createAsyncThunk(
  'carePlan/createCarePlan',
  async (carePlanData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/care-plan/create', carePlanData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCarePlan = createAsyncThunk(
  'carePlan/updateCarePlan',
  async ({ carePlanId, carePlanData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/care-plans/${carePlanId}`, carePlanData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCarePlan = createAsyncThunk(
  'carePlan/deleteCarePlan',
  async (carePlanId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/care-plans/${carePlanId}`);
      return carePlanId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCarePlanStatus = createAsyncThunk(
  'carePlan/updateCarePlanStatus',
  async ({ carePlanId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/care-plans/${carePlanId}/status`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const carePlanSlice = createSlice({
  name: 'carePlan',
  initialState: {
    carePlans: [],
    currentCarePlan: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch care plans
      .addCase(fetchCarePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.carePlans = action.payload;
        state.error = null;
      })
      .addCase(fetchCarePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create care plan
      .addCase(createCarePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.carePlans.push(action.payload);
        state.success = true;
      })
      .addCase(createCarePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update care plan
      .addCase(updateCarePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarePlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.carePlans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.carePlans[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateCarePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete care plan
      .addCase(deleteCarePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCarePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.carePlans = state.carePlans.filter(plan => plan.id !== action.payload);
      })
      .addCase(deleteCarePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateCarePlanStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarePlanStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.carePlans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.carePlans[index] = action.payload;
        }
      })
      .addCase(updateCarePlanStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = carePlanSlice.actions;
export default carePlanSlice.reducer;