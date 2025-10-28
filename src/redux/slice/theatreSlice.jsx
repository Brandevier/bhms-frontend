import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const createTheatreBooking = createAsyncThunk(
  'theatre/createTheatreBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/theatre/theatre-bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create theatre booking');
    }
  }
);

export const getAllTheatreBookings = createAsyncThunk(
  'theatre/getAllTheatreBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/theatre-bookings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch theatre bookings');
    }
  }
);

export const getTheatreBookingById = createAsyncThunk(
  'theatre/getTheatreBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/theatre-bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch theatre booking');
    }
  }
);

export const updateTheatreBooking = createAsyncThunk(
  'theatre/updateTheatreBooking',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre-bookings/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update theatre booking');
    }
  }
);

export const deleteTheatreBooking = createAsyncThunk(
  'theatre/deleteTheatreBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/theatre-bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete theatre booking');
    }
  }
);

const theatreSlice = createSlice({
  name: 'theatre',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    success: false,
    operation: null, // 'create', 'update', 'delete', 'fetch'
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setOperation: (state, action) => {
      state.operation = action.payload;
    },
    // Optional: Add a reducer to manually add a booking (for optimistic updates)
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },
    // Optional: Update a booking in the list
    updateBookingInList: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    // Optional: Remove a booking from the list
    removeBookingFromList: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Theatre Booking
      .addCase(createTheatreBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'create';
      })
      .addCase(createTheatreBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.push(action.payload.data || action.payload);
        state.operation = null;
      })
      .addCase(createTheatreBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      })
      // Get All Theatre Bookings
      .addCase(getAllTheatreBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getAllTheatreBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.operation = null;
      })
      .addCase(getAllTheatreBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Get Theatre Booking by ID
      .addCase(getTheatreBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetch';
      })
      .addCase(getTheatreBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.operation = null;
      })
      .addCase(getTheatreBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Update Theatre Booking
      .addCase(updateTheatreBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'update';
      })
      .addCase(updateTheatreBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.data || action.payload;
        }
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload.data || action.payload;
        }
        state.operation = null;
      })
      .addCase(updateTheatreBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      })
      // Delete Theatre Booking
      .addCase(deleteTheatreBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = 'delete';
      })
      .addCase(deleteTheatreBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        if (state.currentBooking && state.currentBooking.id === action.payload) {
          state.currentBooking = null;
        }
        state.operation = null;
      })
      .addCase(deleteTheatreBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentBooking, 
  setOperation,
  addBooking,
  updateBookingInList,
  removeBookingFromList
} = theatreSlice.actions;

export default theatreSlice.reducer;