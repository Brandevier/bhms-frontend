import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/past-medical-history';


// ===============================
// CREATE
// ===============================
export const createPastMedicalHistory = createAsyncThunk(
  'pastMedicalHistory/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


// ===============================
// FETCH ALL (optional visit_id)
// ===============================
export const fetchPastMedicalHistories = createAsyncThunk(
  'pastMedicalHistory/fetchAll',
  async (visit_id, { rejectWithValue }) => {
    try {
      const url = visit_id
        ? `${BASE_URL}?visit_id=${visit_id}`
        : BASE_URL;

      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


// ===============================
// FETCH BY ID
// ===============================
export const fetchPastMedicalHistoryById = createAsyncThunk(
  'pastMedicalHistory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


// ===============================
// UPDATE
// ===============================
export const updatePastMedicalHistory = createAsyncThunk(
  'pastMedicalHistory/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


// ===============================
// DELETE
// ===============================
export const deletePastMedicalHistory = createAsyncThunk(
  'pastMedicalHistory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


// ===============================
// SLICE
// ===============================
const pastMedicalHistorySlice = createSlice({
  name: 'pastMedicalHistory',
  initialState: {
    pastMedicalHistories: [],
    pastMedicalHistory: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetPastMedicalHistoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.pastMedicalHistory = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createPastMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPastMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pastMedicalHistories.unshift(action.payload);
      })
      .addCase(createPastMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchPastMedicalHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastMedicalHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.pastMedicalHistories = action.payload;
      })
      .addCase(fetchPastMedicalHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchPastMedicalHistoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPastMedicalHistoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.pastMedicalHistory = action.payload;
      })
      .addCase(fetchPastMedicalHistoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePastMedicalHistory.fulfilled, (state, action) => {
        state.success = true;
        const index = state.pastMedicalHistories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.pastMedicalHistories[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deletePastMedicalHistory.fulfilled, (state, action) => {
        state.pastMedicalHistories = state.pastMedicalHistories.filter(
          (item) => item.id !== action.payload
        );
      });
  }
});


export const { resetPastMedicalHistoryState } = pastMedicalHistorySlice.actions;

export default pastMedicalHistorySlice.reducer;

