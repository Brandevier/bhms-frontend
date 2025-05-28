import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/orSchedulingApi'; // Adjust the import path as necessary

// Async Thunks
export const createOrSchedule = createAsyncThunk(
  'orScheduling/create',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await api.createOrSchedule(scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrSchedules = createAsyncThunk(
  'orScheduling/fetchAll',
  async ({ institution_id, date, status }, { rejectWithValue }) => {
    try {
      const params = { institution_id };
      if (date) params.date = date;
      if (status) params.status = status;
      
      const response = await apiClient.getOrSchedules(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrScheduleById = createAsyncThunk(
  'orScheduling/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getOrScheduleById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrSchedule = createAsyncThunk(
  'orScheduling/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.updateOrSchedule(id, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelOrSchedule = createAsyncThunk(
  'orScheduling/cancel',
  async ({ id, cancellation_reason }, { rejectWithValue }) => {
    try {
      const response = await api.cancelOrSchedule(id, cancellation_reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const completeSurgery = createAsyncThunk(
  'orScheduling/complete',
  async ({ id, notes, outcome }, { rejectWithValue }) => {
    try {
      const response = await api.completeSurgery(id, { notes, outcome });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSurgeonSchedules = createAsyncThunk(
  'orScheduling/fetchBySurgeon',
  async ({ surgeon_id, start_date, end_date }, { rejectWithValue }) => {
    try {
      const params = { surgeon_id };
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      
      const response = await api.getSchedulesBySurgeon(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAvailableTimeSlots = createAsyncThunk(
  'orScheduling/fetchAvailableSlots',
  async ({ date, institution_id }, { rejectWithValue }) => {
    try {
      const response = await api.getAvailableTimeSlots(date, institution_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  schedules: [],
  currentSchedule: null,
  surgeonSchedules: [],
  availableSlots: [],
  loading: false,
  error: null,
  statusFilter: 'all', // 'all', 'scheduled', 'completed', 'cancelled'
  dateFilter: null
};

// Slice
const orSchedulingSlice = createSlice({
  name: 'orScheduling',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
    resetOrSchedulingState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Create OR Schedule
      .addCase(createOrSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createOrSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create schedule';
      })
      
      // Fetch All OR Schedules
      .addCase(fetchOrSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchOrSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch schedules';
      })
      
      // Fetch OR Schedule by ID
      .addCase(fetchOrScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSchedule = action.payload;
      })
      .addCase(fetchOrScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch schedule';
      })
      
      // Update OR Schedule
      .addCase(updateOrSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        );
        if (state.currentSchedule?.id === action.payload.id) {
          state.currentSchedule = action.payload;
        }
      })
      .addCase(updateOrSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update schedule';
      })
      
      // Cancel OR Schedule
      .addCase(cancelOrSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        );
        if (state.currentSchedule?.id === action.payload.id) {
          state.currentSchedule = action.payload;
        }
      })
      .addCase(cancelOrSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to cancel schedule';
      })
      
      // Complete Surgery
      .addCase(completeSurgery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSurgery.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        );
        if (state.currentSchedule?.id === action.payload.id) {
          state.currentSchedule = action.payload;
        }
      })
      .addCase(completeSurgery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to complete surgery';
      })
      
      // Fetch Surgeon Schedules
      .addCase(fetchSurgeonSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurgeonSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.surgeonSchedules = action.payload;
      })
      .addCase(fetchSurgeonSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch surgeon schedules';
      })
      
      // Fetch Available Time Slots
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.availableSlots;
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch available slots';
      });
  }
});

// Export actions and reducer
export const { 
  setStatusFilter, 
  setDateFilter, 
  clearCurrentSchedule,
  clearAvailableSlots,
  resetOrSchedulingState 
} = orSchedulingSlice.actions;

export default orSchedulingSlice.reducer;

// Selectors
export const selectAllSchedules = (state) => state.orScheduling.schedules;
export const selectCurrentSchedule = (state) => state.orScheduling.currentSchedule;
export const selectSurgeonSchedules = (state) => state.orScheduling.surgeonSchedules;
export const selectAvailableSlots = (state) => state.orScheduling.availableSlots;
export const selectLoading = (state) => state.orScheduling.loading;
export const selectError = (state) => state.orScheduling.error;
export const selectStatusFilter = (state) => state.orScheduling.statusFilter;
export const selectDateFilter = (state) => state.orScheduling.dateFilter;

// Filtered schedules selector
export const selectFilteredSchedules = (state) => {
  const { schedules, statusFilter, dateFilter } = state.orScheduling;
  
  return schedules.filter(schedule => {
    const statusMatch = statusFilter === 'all' || schedule.status.toLowerCase() === statusFilter;
    const dateMatch = !dateFilter || schedule.scheduled_date === dateFilter;
    return statusMatch && dateMatch;
  });
};