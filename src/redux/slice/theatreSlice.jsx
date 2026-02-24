import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// ==================== Theatre Bookings ====================
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
      const response = await apiClient.get(`/theatre/theatre-bookings/${bookingId}`);
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
      const response = await apiClient.put(`/theatre/theatre-bookings/${id}`, updates);
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
      await apiClient.delete(`/theatre/theatre-bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete theatre booking');
    }
  }
);

// ==================== Operating Rooms ====================
export const getAllOperatingRooms = createAsyncThunk(
  'theatre/getAllOperatingRooms',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/operating-rooms', { params: filters });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch operating rooms');
    }
  }
);

export const getOperatingRoomById = createAsyncThunk(
  'theatre/getOperatingRoomById',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/theatre/operating-rooms/${roomId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch operating room');
    }
  }
);

export const createOperatingRoom = createAsyncThunk(
  'theatre/createOperatingRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/theatre/operating-rooms', roomData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create operating room');
    }
  }
);

export const updateOperatingRoom = createAsyncThunk(
  'theatre/updateOperatingRoom',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/operating-rooms/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update operating room');
    }
  }
);

export const updateRoomStatus = createAsyncThunk(
  'theatre/updateRoomStatus',
  async ({ id, status, current_patient_id, current_booking_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/operating-rooms/${id}/status`, {
        status,
        current_patient_id,
        current_booking_id
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update room status');
    }
  }
);

export const deleteOperatingRoom = createAsyncThunk(
  'theatre/deleteOperatingRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/theatre/operating-rooms/${roomId}`);
      return roomId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete operating room');
    }
  }
);

export const getORStatistics = createAsyncThunk(
  'theatre/getORStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/operating-rooms/statistics');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch OR statistics');
    }
  }
);

// ==================== Surgery Status Transitions ====================
export const startSurgery = createAsyncThunk(
  'theatre/startSurgery',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/theatre-bookings/${bookingId}`, {
        status: 'intra-operation',
        actual_start_time: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start surgery');
    }
  }
);

export const completeSurgery = createAsyncThunk(
  'theatre/completeSurgery',
  async ({ bookingId, outcome, notes, blood_loss_ml, complications }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/theatre-bookings/${bookingId}`, {
        status: 'post-operation',
        actual_end_time: new Date().toISOString(),
        outcome,
        post_op_notes: notes,
        blood_loss_ml,
        complications
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to complete surgery');
    }
  }
);

export const dischargeFromRecovery = createAsyncThunk(
  'theatre/dischargeFromRecovery',
  async ({ bookingId, discharge_condition }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/theatre-bookings/${bookingId}`, {
        status: 'completed',
        discharge_date: new Date().toISOString(),
        discharge_condition
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to discharge patient');
    }
  }
);

export const cancelSurgery = createAsyncThunk(
  'theatre/cancelSurgery',
  async ({ bookingId, cancellation_reason }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/theatre-bookings/${bookingId}`, {
        status: 'cancelled',
        cancellation_reason
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel surgery');
    }
  }
);

const theatreSlice = createSlice({
  name: 'theatre',
  initialState: {
    bookings: [],
    currentBooking: null,
    // Operating Rooms state
    operatingRooms: [],
    currentRoom: null,
    orStatistics: null,
    // Surgery status
    surgeryInProgress: null,
    // Common state
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
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
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
    // Update a room in the list
    updateRoomInList: (state, action) => {
      const index = state.operatingRooms.findIndex(room => room.id === action.payload.id);
      if (index !== -1) {
        state.operatingRooms[index] = action.payload;
      }
    },
    // Remove a room from the list
    removeRoomFromList: (state, action) => {
      state.operatingRooms = state.operatingRooms.filter(room => room.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== Theatre Bookings ====================
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
      })
      // ==================== Operating Rooms ====================
      // Get All Operating Rooms
      .addCase(getAllOperatingRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOperatingRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.operatingRooms = action.payload;
      })
      .addCase(getAllOperatingRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Operating Room by ID
      .addCase(getOperatingRoomById.fulfilled, (state, action) => {
        state.currentRoom = action.payload;
      })
      // Create Operating Room
      .addCase(createOperatingRoom.fulfilled, (state, action) => {
        state.operatingRooms.push(action.payload);
      })
      // Update Operating Room
      .addCase(updateOperatingRoom.fulfilled, (state, action) => {
        const index = state.operatingRooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.operatingRooms[index] = action.payload;
        }
        if (state.currentRoom && state.currentRoom.id === action.payload.id) {
          state.currentRoom = action.payload;
        }
      })
      // Update Room Status
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        const index = state.operatingRooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.operatingRooms[index] = action.payload;
        }
      })
      // Delete Operating Room
      .addCase(deleteOperatingRoom.fulfilled, (state, action) => {
        state.operatingRooms = state.operatingRooms.filter(room => room.id !== action.payload);
      })
      // Get OR Statistics
      .addCase(getORStatistics.fulfilled, (state, action) => {
        state.orStatistics = action.payload;
      })
      // ==================== Surgery Status Transitions ====================
      // Start Surgery
      .addCase(startSurgery.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.surgeryInProgress = action.payload;
      })
      // Complete Surgery
      .addCase(completeSurgery.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.surgeryInProgress = null;
      })
      // Discharge from Recovery
      .addCase(dischargeFromRecovery.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      // Cancel Surgery
      .addCase(cancelSurgery.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentBooking, 
  clearCurrentRoom,
  setOperation,
  addBooking,
  updateBookingInList,
  removeBookingFromList,
  updateRoomInList,
  removeRoomFromList
} = theatreSlice.actions;

export default theatreSlice.reducer;
