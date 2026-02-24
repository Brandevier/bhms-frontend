import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const initiateDepartmentCall = createAsyncThunk(
  'call/initiateDepartmentCall',
  async (callData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/department-calls', callData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to initiate call' });
    }
  }
);

export const updateCallStatus = createAsyncThunk(
  'call/updateCallStatus',
  async ({ id, status, end_time, receiver_id, receiver_name }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/department-calls/${id}/status`, {
        status,
        end_time,
        receiver_id,
        receiver_name
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update call status' });
    }
  }
);

export const endCall = createAsyncThunk(
  'call/endCall',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/department-calls/${id}/end`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to end call' });
    }
  }
);

export const fetchCallHistory = createAsyncThunk(
  'call/fetchCallHistory',
  async ({ userId, limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/department-calls/user/${userId}`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch call history' });
    }
  }
);

export const fetchMissedCalls = createAsyncThunk(
  'call/fetchMissedCalls',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/department-calls/missed/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch missed calls' });
    }
  }
);

export const fetchActiveCalls = createAsyncThunk(
  'call/fetchActiveCalls',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/department-calls/active/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch active calls' });
    }
  }
);

const initialState = {
  // Call state
  currentCall: null,
  callHistory: [],
  missedCalls: [],
  activeCalls: [],
  
  // UI state
  isCallModalOpen: false,
  isIncomingCallModalOpen: false,
  incomingCall: null,
  
  // Call status
  callStatus: 'idle', // idle, initiating, ringing, connected, ended, failed
  isInCall: false,
  
  // Media state
  isAudioEnabled: true,
  isVideoEnabled: true,
  localStream: null,
  remoteStream: null,
  
  // Loading states
  loading: {
    initiating: false,
    history: false,
    missed: false,
    active: false,
  },
  
  // Error state
  error: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    // Set current call
    setCurrentCall: (state, action) => {
      state.currentCall = action.payload;
      state.isInCall = action.payload !== null;
    },
    
    // Open/Close call modal
    openCallModal: (state) => {
      state.isCallModalOpen = true;
    },
    closeCallModal: (state) => {
      state.isCallModalOpen = false;
    },
    
    // Incoming call handling
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
      state.isIncomingCallModalOpen = true;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
      state.isIncomingCallModalOpen = false;
    },
    
    // Call status
    setCallStatus: (state, action) => {
      state.callStatus = action.payload;
    },
    
    // Media controls
    toggleAudio: (state) => {
      state.isAudioEnabled = !state.isAudioEnabled;
    },
    toggleVideo: (state) => {
      state.isVideoEnabled = !state.isVideoEnabled;
    },
    
    // Set local stream
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    
    // Set remote stream
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    
    // Reset call state
    resetCallState: (state) => {
      state.currentCall = null;
      state.callStatus = 'idle';
      state.isInCall = false;
      state.isIncomingCallModalOpen = false;
      state.incomingCall = null;
      state.isAudioEnabled = true;
      state.isVideoEnabled = true;
      state.localStream = null;
      state.remoteStream = null;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Initiate call
      .addCase(initiateDepartmentCall.pending, (state) => {
        state.loading.initiating = true;
        state.callStatus = 'initiating';
        state.error = null;
      })
      .addCase(initiateDepartmentCall.fulfilled, (state, action) => {
        state.loading.initiating = false;
        state.currentCall = action.payload;
        state.callStatus = 'ringing';
      })
      .addCase(initiateDepartmentCall.rejected, (state, action) => {
        state.loading.initiating = false;
        state.callStatus = 'failed';
        state.error = action.payload?.message || 'Failed to initiate call';
      })
      
      // Update call status
      .addCase(updateCallStatus.fulfilled, (state, action) => {
        if (state.currentCall?.id === action.payload.id) {
          state.currentCall = action.payload;
          if (action.payload.status === 'accepted') {
            state.callStatus = 'connected';
          } else if (action.payload.status === 'rejected') {
            state.callStatus = 'ended';
          }
        }
      })
      
      // End call
      .addCase(endCall.fulfilled, (state, action) => {
        state.currentCall = action.payload;
        state.callStatus = 'ended';
        state.isInCall = false;
      })
      
      // Fetch call history
      .addCase(fetchCallHistory.pending, (state) => {
        state.loading.history = true;
      })
      .addCase(fetchCallHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.callHistory = action.payload.data || action.payload;
      })
      .addCase(fetchCallHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload?.message;
      })
      
      // Fetch missed calls
      .addCase(fetchMissedCalls.pending, (state) => {
        state.loading.missed = true;
      })
      .addCase(fetchMissedCalls.fulfilled, (state, action) => {
        state.loading.missed = false;
        state.missedCalls = action.payload;
      })
      .addCase(fetchMissedCalls.rejected, (state, action) => {
        state.loading.missed = false;
        state.error = action.payload?.message;
      })
      
      // Fetch active calls
      .addCase(fetchActiveCalls.pending, (state) => {
        state.loading.active = true;
      })
      .addCase(fetchActiveCalls.fulfilled, (state, action) => {
        state.loading.active = false;
        state.activeCalls = action.payload;
      })
      .addCase(fetchActiveCalls.rejected, (state, action) => {
        state.loading.active = false;
        state.error = action.payload?.message;
      });
  },
});

export const {
  setCurrentCall,
  openCallModal,
  closeCallModal,
  setIncomingCall,
  clearIncomingCall,
  setCallStatus,
  toggleAudio,
  toggleVideo,
  setLocalStream,
  setRemoteStream,
  resetCallState,
  clearError,
} = callSlice.actions;

export default callSlice.reducer;
