import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

const BASE_URL = '/occupation-history';


// =============================
// CREATE
// =============================
export const createOccupation = createAsyncThunk(
  'occupationHistory/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// =============================
// GET ALL (optional visit_id)
// =============================
export const fetchOccupations = createAsyncThunk(
  'occupationHistory/fetchAll',
  async (visit_id, { rejectWithValue }) => {
    try {
      const url = visit_id
        ? `${BASE_URL}?visit_id=${visit_id}`
        : BASE_URL;

      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// =============================
// GET BY ID
// =============================
export const fetchOccupationById = createAsyncThunk(
  'occupationHistory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// =============================
// UPDATE
// =============================
export const updateOccupation = createAsyncThunk(
  'occupationHistory/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// =============================
// DELETE
// =============================
export const deleteOccupation = createAsyncThunk(
  'occupationHistory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// =============================
// SLICE
// =============================
const occupationHistorySlice = createSlice({
  name: 'occupationHistory',
  initialState: {
    occupations: [],
    occupation: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetOccupationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createOccupation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOccupation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.occupations.unshift(action.payload);
      })
      .addCase(createOccupation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchOccupations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = action.payload;
      })
      .addCase(fetchOccupations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchOccupationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOccupationById.fulfilled, (state, action) => {
        state.loading = false;
        state.occupation = action.payload;
      })
      .addCase(fetchOccupationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateOccupation.fulfilled, (state, action) => {
        state.success = true;
        const index = state.occupations.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.occupations[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteOccupation.fulfilled, (state, action) => {
        state.occupations = state.occupations.filter(
          (item) => item.id !== action.payload
        );
      });
  }
});


export const { resetOccupationState } = occupationHistorySlice.actions;

export default occupationHistorySlice.reducer;
