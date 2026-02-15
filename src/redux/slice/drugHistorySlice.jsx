import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/drug-history';


// ===============================
// CREATE
// ===============================
export const createDrugHistory = createAsyncThunk(
  'drugHistory/create',
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
export const fetchDrugHistories = createAsyncThunk(
  'drugHistory/fetchAll',
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
export const fetchDrugHistoryById = createAsyncThunk(
  'drugHistory/fetchById',
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
export const updateDrugHistory = createAsyncThunk(
  'drugHistory/update',
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
export const deleteDrugHistory = createAsyncThunk(
  'drugHistory/delete',
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
const drugHistorySlice = createSlice({
  name: 'drugHistory',
  initialState: {
    drugHistories: [],
    drugHistory: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetDrugHistoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.drugHistory = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createDrugHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDrugHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.drugHistories.unshift(action.payload);
      })
      .addCase(createDrugHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchDrugHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrugHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.drugHistories = action.payload;
      })
      .addCase(fetchDrugHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchDrugHistoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDrugHistoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.drugHistory = action.payload;
      })
      .addCase(fetchDrugHistoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDrugHistory.fulfilled, (state, action) => {
        state.success = true;
        const index = state.drugHistories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.drugHistories[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteDrugHistory.fulfilled, (state, action) => {
        state.drugHistories = state.drugHistories.filter(
          (item) => item.id !== action.payload
        );
      });
  }
});


export const { resetDrugHistoryState } = drugHistorySlice.actions;

export default drugHistorySlice.reducer;
