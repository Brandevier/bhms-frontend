// redux/slice/ultrasoundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const createUltrasound = createAsyncThunk(
  'ultrasound/createUltrasound',
  async (ultrasoundData, { rejectWithValue }) => {
    try {
     

      const response = await apiClient.post('/ultrasound', ultrasoundData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllUltrasounds = createAsyncThunk(
  'ultrasound/getAllUltrasounds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/ultrasound');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUltrasoundById = createAsyncThunk(
  'ultrasound/getUltrasoundById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/ultrasound/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUltrasound = createAsyncThunk(
  'ultrasound/updateUltrasound',
  async ({ id, ultrasoundData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/ultrasound/${id}`, ultrasoundData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUltrasound = createAsyncThunk(
  'ultrasound/deleteUltrasound',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/ultrasound/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUltrasoundStats = createAsyncThunk(
  'ultrasound/getUltrasoundStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/ultrasound/stats', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const ultrasoundSlice = createSlice({
  name: 'ultrasound',
  initialState: {
    ultrasounds: [],
    currentUltrasound: null,
    stats: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearUltrasoundState: (state) => {
      state.ultrasounds = [];
      state.currentUltrasound = null;
      state.stats = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUltrasound: (state, action) => {
      state.currentUltrasound = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Ultrasound
      .addCase(createUltrasound.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUltrasound.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.ultrasounds.push(action.payload.data);
        state.currentUltrasound = action.payload.data;
      })
      .addCase(createUltrasound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create ultrasound record';
      })
      // Get All Ultrasounds
      .addCase(getAllUltrasounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUltrasounds.fulfilled, (state, action) => {
        state.loading = false;
        state.ultrasounds = action.payload.data || [];
      })
      .addCase(getAllUltrasounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch ultrasounds';
      })
      // Get Ultrasound by ID
      .addCase(getUltrasoundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUltrasoundById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUltrasound = action.payload.data;
      })
      .addCase(getUltrasoundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch ultrasound';
      })
      // Update Ultrasound
      .addCase(updateUltrasound.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUltrasound.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.ultrasounds.findIndex(u => u.id === action.payload.data.id);
        if (index !== -1) {
          state.ultrasounds[index] = action.payload.data;
        }
        state.currentUltrasound = action.payload.data;
      })
      .addCase(updateUltrasound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update ultrasound record';
      })
      // Delete Ultrasound
      .addCase(deleteUltrasound.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUltrasound.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.ultrasounds = state.ultrasounds.filter(u => u.id !== action.payload);
        state.currentUltrasound = null;
      })
      .addCase(deleteUltrasound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete ultrasound record';
      })
      // Get Ultrasound Stats
      .addCase(getUltrasoundStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUltrasoundStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getUltrasoundStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch ultrasound statistics';
      });
  }
});

export const { clearUltrasoundState, clearError, setCurrentUltrasound } = ultrasoundSlice.actions;
export default ultrasoundSlice.reducer;