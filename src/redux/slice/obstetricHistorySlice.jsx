import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// Async Thunks
export const fetchObstetricHistories = createAsyncThunk(
  "obstetricHistory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(``);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchObstetricHistoryById = createAsyncThunk(
  "obstetricHistory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createObstetricHistory = createAsyncThunk(
  "obstetricHistory/create",
  async (data, { rejectWithValue,getState }) => {
    const { auth } = getState()
    const user = auth.user
    try {
      const response = await apiClient.post(`/ANC/obstetric-history`, {
        ...data,
        institution_id:user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateObstetricHistory = createAsyncThunk(
  "obstetricHistory/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/ANC/obstetric-history/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteObstetricHistory = createAsyncThunk(
  "obstetricHistory/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/ANC/obstetric-history/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const obstetricHistorySlice = createSlice({
  name: "obstetricHistory",
  initialState: {
    histories: [],
    history: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObstetricHistories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchObstetricHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload;
      })
      .addCase(fetchObstetricHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchObstetricHistoryById.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(createObstetricHistory.fulfilled, (state, action) => {
        state.histories.push(action.payload);
      })
      .addCase(updateObstetricHistory.fulfilled, (state, action) => {
        state.histories = state.histories.map((history) =>
          history.id === action.payload.id ? action.payload : history
        );
      })
      .addCase(deleteObstetricHistory.fulfilled, (state, action) => {
        state.histories = state.histories.filter(
          (history) => history.id !== action.payload
        );
      });
  },
});

export default obstetricHistorySlice.reducer;
