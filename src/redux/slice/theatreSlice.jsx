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
      const response = await apiClient.patch(`/theatre/theatre-bookings/${bookingId}/start`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start surgery');
    }
  }
);

export const completeSurgery = createAsyncThunk(
  'theatre/completeSurgery',
  async ({ bookingId, outcome, notes, blood_loss_ml, complications, specimens_collected, implants_used }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/theatre-bookings/${bookingId}/complete`, {
        outcome,
        notes,
        blood_loss_ml,
        complications,
        specimens_collected,
        implants_used
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to complete surgery');
    }
  }
);

// Get surgery status with duration
export const getSurgeryStatus = createAsyncThunk(
  'theatre/getSurgeryStatus',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/theatre/theatre-bookings/${bookingId}/status`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get surgery status');
    }
  }
);

// Update intra-operative notes in real-time
export const updateIntraOpNotes = createAsyncThunk(
  'theatre/updateIntraOpNotes',
  async ({ bookingId, intra_op_notes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/theatre-bookings/${bookingId}/intra-op-notes`, {
        intra_op_notes
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update intra-op notes');
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
      const response = await apiClient.delete(`/theatre/theatre-bookings/${bookingId}`, {
        data: { cancellation_reason }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel surgery');
    }
  }
);

// ==================== Equipment Management ====================
export const getAllEquipment = createAsyncThunk(
  'theatre/getAllEquipment',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/equipment', { params: filters });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch equipment');
    }
  }
);

export const getEquipmentById = createAsyncThunk(
  'theatre/getEquipmentById',
  async (equipmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/theatre/equipment/${equipmentId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch equipment');
    }
  }
);

export const createEquipment = createAsyncThunk(
  'theatre/createEquipment',
  async (equipmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/theatre/equipment', equipmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create equipment');
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'theatre/updateEquipment',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/equipment/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update equipment');
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  'theatre/deleteEquipment',
  async (equipmentId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/theatre/equipment/${equipmentId}`);
      return equipmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete equipment');
    }
  }
);

export const transferEquipment = createAsyncThunk(
  'theatre/transferEquipment',
  async ({ id, room_id, notes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/equipment/${id}/transfer`, { room_id, notes });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to transfer equipment');
    }
  }
);

export const scheduleMaintenance = createAsyncThunk(
  'theatre/scheduleMaintenance',
  async ({ id, next_maintenance_date, notes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/equipment/${id}/maintenance`, { 
        next_maintenance_date, 
        notes 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to schedule maintenance');
    }
  }
);

export const getEquipmentStatistics = createAsyncThunk(
  'theatre/getEquipmentStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/equipment/statistics');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch equipment statistics');
    }
  }
);

// ==================== Case Cart Management ====================
export const createCaseCart = createAsyncThunk(
  'theatre/createCaseCart',
  async (caseCartData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/theatre/case-carts', caseCartData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create case cart');
    }
  }
);

export const getAllCaseCarts = createAsyncThunk(
  'theatre/getAllCaseCarts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/case-carts', { params: filters });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch case carts');
    }
  }
);

export const getCaseCartById = createAsyncThunk(
  'theatre/getCaseCartById',
  async (caseCartId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/theatre/case-carts/${caseCartId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch case cart');
    }
  }
);

export const updateCaseCart = createAsyncThunk(
  'theatre/updateCaseCart',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/theatre/case-carts/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update case cart');
    }
  }
);

export const deleteCaseCart = createAsyncThunk(
  'theatre/deleteCaseCart',
  async (caseCartId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/theatre/case-carts/${caseCartId}`);
      return caseCartId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete case cart');
    }
  }
);

export const confirmCaseCart = createAsyncThunk(
  'theatre/confirmCaseCart',
  async ({ id, confirmed_by }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/case-carts/${id}/confirm`, { confirmed_by });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to confirm case cart');
    }
  }
);

export const addCaseCartItem = createAsyncThunk(
  'theatre/addCaseCartItem',
  async ({ caseCartId, item }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/theatre/case-carts/${caseCartId}/items`, item);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item');
    }
  }
);

export const updateCaseCartItemStatus = createAsyncThunk(
  'theatre/updateCaseCartItemStatus',
  async ({ itemId, status, prepared_by, notes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/theatre/case-carts/items/${itemId}/status`, { 
        status, 
        prepared_by,
        notes 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item status');
    }
  }
);

export const deleteCaseCartItem = createAsyncThunk(
  'theatre/deleteCaseCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/theatre/case-carts/items/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete item');
    }
  }
);

export const getCaseCartStatistics = createAsyncThunk(
  'theatre/getCaseCartStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/theatre/case-carts/statistics');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch case cart statistics');
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
    // Equipment state
    equipment: [],
    currentEquipment: null,
    equipmentStatistics: null,
    // Case Cart state
    caseCarts: [],
    currentCaseCart: null,
    caseCartStatistics: null,
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
      .addCase(startSurgery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSurgery.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.surgeryInProgress = action.payload;
        state.currentBooking = action.payload;
      })
      .addCase(startSurgery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete Surgery
      .addCase(completeSurgery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSurgery.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.surgeryInProgress = null;
        state.currentBooking = action.payload;
      })
      .addCase(completeSurgery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Surgery Status
      .addCase(getSurgeryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSurgeryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(getSurgeryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Intra-Op Notes
      .addCase(updateIntraOpNotes.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
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
      })
      // ==================== Equipment Management ====================
      // Get All Equipment
      .addCase(getAllEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipment = action.payload;
      })
      .addCase(getAllEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Equipment by ID
      .addCase(getEquipmentById.fulfilled, (state, action) => {
        state.currentEquipment = action.payload;
      })
      // Create Equipment
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.equipment.push(action.payload);
      })
      // Update Equipment
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.equipment[index] = action.payload;
        }
      })
      // Delete Equipment
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.equipment = state.equipment.filter(e => e.id !== action.payload);
      })
      // Transfer Equipment
      .addCase(transferEquipment.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.equipment[index] = action.payload;
        }
      })
      // Schedule Maintenance
      .addCase(scheduleMaintenance.fulfilled, (state, action) => {
        const index = state.equipment.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.equipment[index] = action.payload;
        }
      })
      // Get Equipment Statistics
      .addCase(getEquipmentStatistics.fulfilled, (state, action) => {
        state.equipmentStatistics = action.payload;
      })
      // ==================== Case Cart Management ====================
      // Create Case Cart
      .addCase(createCaseCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCaseCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.caseCarts.unshift(action.payload);
      })
      .addCase(createCaseCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get All Case Carts
      .addCase(getAllCaseCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCaseCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.caseCarts = action.payload;
      })
      .addCase(getAllCaseCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Case Cart by ID
      .addCase(getCaseCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCaseCartById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCaseCart = action.payload;
      })
      .addCase(getCaseCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Case Cart
      .addCase(updateCaseCart.fulfilled, (state, action) => {
        const index = state.caseCarts.findIndex(cart => cart.id === action.payload.id);
        if (index !== -1) {
          state.caseCarts[index] = action.payload;
        }
        if (state.currentCaseCart && state.currentCaseCart.id === action.payload.id) {
          state.currentCaseCart = action.payload;
        }
      })
      // Delete Case Cart
      .addCase(deleteCaseCart.fulfilled, (state, action) => {
        state.caseCarts = state.caseCarts.filter(cart => cart.id !== action.payload);
        if (state.currentCaseCart && state.currentCaseCart.id === action.payload) {
          state.currentCaseCart = null;
        }
      })
      // Confirm Case Cart
      .addCase(confirmCaseCart.fulfilled, (state, action) => {
        const index = state.caseCarts.findIndex(cart => cart.id === action.payload.id);
        if (index !== -1) {
          state.caseCarts[index] = action.payload;
        }
      })
      // Add Case Cart Item
      .addCase(addCaseCartItem.fulfilled, (state, action) => {
        if (state.currentCaseCart) {
          state.currentCaseCart.items = state.currentCaseCart.items || [];
          state.currentCaseCart.items.push(action.payload);
        }
      })
      // Update Case Cart Item Status
      .addCase(updateCaseCartItemStatus.fulfilled, (state, action) => {
        if (state.currentCaseCart && state.currentCaseCart.items) {
          const itemIndex = state.currentCaseCart.items.findIndex(
            item => item.id === action.payload.id
          );
          if (itemIndex !== -1) {
            state.currentCaseCart.items[itemIndex] = action.payload;
          }
        }
        // Also update in the list
        const cartIndex = state.caseCarts.findIndex(
          cart => cart.id === state.currentCaseCart?.id
        );
        if (cartIndex !== -1 && state.caseCarts[cartIndex].items) {
          const itemIndex = state.caseCarts[cartIndex].items.findIndex(
            item => item.id === action.payload.id
          );
          if (itemIndex !== -1) {
            state.caseCarts[cartIndex].items[itemIndex] = action.payload;
          }
        }
      })
      // Delete Case Cart Item
      .addCase(deleteCaseCartItem.fulfilled, (state, action) => {
        if (state.currentCaseCart && state.currentCaseCart.items) {
          state.currentCaseCart.items = state.currentCaseCart.items.filter(
            item => item.id !== action.payload
          );
        }
      })
      // Get Case Cart Statistics
      .addCase(getCaseCartStatistics.fulfilled, (state, action) => {
        state.caseCartStatistics = action.payload;
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
