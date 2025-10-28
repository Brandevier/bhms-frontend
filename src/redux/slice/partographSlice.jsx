// redux/slice/partographSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const addPartographRecord = createAsyncThunk(
  'partograph/addPartographRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/partograph', recordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePartographRecord = createAsyncThunk(
  'partograph/updatePartographRecord',
  async ({ id, recordData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/partograph/${id}`, recordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePartographRecord = createAsyncThunk(
  'partograph/deletePartographRecord',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/partograph/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPartographByVisit = createAsyncThunk(
  'partograph/getPartographByVisit',
  async (visit_id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/partograph/visit/${visit_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const partographSlice = createSlice({
  name: 'partograph',
  initialState: {
    records: [],
    currentRecord: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearPartographState: (state) => {
      state.records = [];
      state.currentRecord = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Partograph Record
      .addCase(addPartographRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPartographRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.records.push(action.payload.record);
        state.currentRecord = action.payload.record;
      })
      .addCase(addPartographRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add partograph record';
      })
      // Update Partograph Record
      .addCase(updatePartographRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePartographRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.records.findIndex(record => record.id === action.payload.record.id);
        if (index !== -1) {
          state.records[index] = action.payload.record;
        }
        state.currentRecord = action.payload.record;
      })
      .addCase(updatePartographRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update partograph record';
      })
      // Delete Partograph Record
      .addCase(deletePartographRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePartographRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.records = state.records.filter(record => record.id !== action.payload);
        state.currentRecord = null;
      })
      .addCase(deletePartographRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete partograph record';
      })
      // Get Partograph by Visit
      .addCase(getPartographByVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartographByVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records || [];
      })
      .addCase(getPartographByVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch partograph records';
      });
  }
});

export const { clearPartographState, clearError, setCurrentRecord } = partographSlice.actions;
export default partographSlice.reducer;