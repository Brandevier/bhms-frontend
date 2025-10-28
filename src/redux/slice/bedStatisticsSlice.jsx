// redux/slice/bedStatisticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const fetchBedStatistics = createAsyncThunk(
  'bedStatistics/fetchBedStatistics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/bed-statistics', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const bedStatisticsSlice = createSlice({
  name: 'bedStatistics',
  initialState: {
    statistics: null,
    loading: false,
    error: null,
    filters: {
      department_id: null
    }
  },
  reducers: {
    clearBedStatistics: (state) => {
      state.statistics = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { department_id: null };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bed Statistics
      .addCase(fetchBedStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBedStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchBedStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bed statistics';
      });
  }
});

export const { clearBedStatistics, clearError, setFilters, clearFilters } = bedStatisticsSlice.actions;
export default bedStatisticsSlice.reducer;