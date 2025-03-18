import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";



// Fetch all immunization histories
export const fetchImmunizationHistories = createAsyncThunk(
  "immunizationHistory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(``);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

// Create immunization history
export const createImmunizationHistory = createAsyncThunk(
  "immunizationHistory/create",
  async (data, { rejectWithValue,getState }) => {
    const { auth } = getState()

    const user = auth.user



    try {
      const response = await apiClient.post(`/ANC/immunization-history`, {
        ...data,
        institution_id : user.institution.id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create entry");
    }
  }
);

// Update immunization history
export const updateImmunizationHistory = createAsyncThunk(
  "immunizationHistory/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/ANC/immunization-history/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update entry");
    }
  }
);

// Delete immunization history
export const deleteImmunizationHistory = createAsyncThunk(
  "immunizationHistory/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/ANC/immunization-history/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete entry");
    }
  }
);

const immunizationHistorySlice = createSlice({
  name: "immunizationHistory",
  initialState: {
    histories: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchImmunizationHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImmunizationHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload;
      })
      .addCase(fetchImmunizationHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createImmunizationHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createImmunizationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.histories.push(action.payload);
      })
      .addCase(createImmunizationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateImmunizationHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateImmunizationHistory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.histories.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) state.histories[index] = action.payload;
      })
      .addCase(updateImmunizationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteImmunizationHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImmunizationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = state.histories.filter((h) => h.id !== action.payload);
      })
      .addCase(deleteImmunizationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default immunizationHistorySlice.reducer;
