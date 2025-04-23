import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN_URL, ADMIN_LOGIN, VERIFY_EMAIL, BASE_URL } from '../../api/endpoints'; // Ensure UPDATE_STAFF_PROFILE_URL is defined
import { initializeSocket } from '../../service/socketService';
// User login thunk
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(LOGIN_URL, loginData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Check if account is locked
      if (auth.isLocked && auth.lockUntil > Date.now()) {
        const remainingTime = Math.ceil((auth.lockUntil - Date.now()) / 60000);
        return rejectWithValue({
          error: `Account temporarily locked. Try again in ${remainingTime} minutes.`
        });
      }

      const response = await axios.post(ADMIN_LOGIN, { email, password });
      initializeSocket(response.data);
      return response.data;
      
    } catch (error) {
      // Handle failed attempts
      if (error.response?.status === 400) {
        const { auth } = getState();
        const attempts = auth.loginAttempts + 1;
        const MAX_ATTEMPTS = 5;
        const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
        
        if (attempts >= MAX_ATTEMPTS) {
          return rejectWithValue({
            error: 'Account temporarily locked due to too many failed attempts',
            lockUntil: Date.now() + LOCK_TIME
          });
        }
        
        return rejectWithValue({
          error: 'Invalid credentials',
          loginAttempts: attempts
        });
      }
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

// Update staff profile thunk
export const updateStaffProfile = createAsyncThunk(
  'auth/updateStaffProfile',
  async ({ updateData}, { rejectWithValue,getState }) => {
    console.log('UPDATED DATA======',updateData)
    const loginUser = getState().auth.user;
    try {
      const response = await axios.put(`${BASE_URL}/auth/admin/staff/update-profile`, updateData, {
        headers: {
          Authorization: `Bearer ${loginUser.token}`,
          'Content-Type': 'multipart/form-data', // Ensure file upload works
        },
        params:{
          'staffId':loginUser.id
        }
      });
      return response.data;
    } catch (error) {
     
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyPuzzleAnswer = createAsyncThunk('auth/verifyPuzzleAnswer', async ({ staffID, selectedAnswer }, { getState, rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-logic-answer`, { staffID, selectedAnswer });
    
    // If successful, move pendingUser to actual user
    const { pendingUser } = getState().auth;
    initializeSocket(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Verification failed");
  }
});



// Initial state
const initialState = {
  user: null,
  admin: null,
  pendingUser: null,
  loading: false,
  // emailSent:false,
  error: null,
  token: localStorage.getItem('user') || null,
  isVerified: false, 
  loginAttempts: 0,
  isLocked: false,
  lockUntil: null
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.pendingUser= null,
      state.emailSent=false;
      state.admin = null;
      state.pendingUser = null;
      localStorage.removeItem('user');
      localStorage.clear()
      state.isVerified = false; // Reset isVerified when logging out
      
    },
  },
  extraReducers: (builder) => {
    // Handle user login
    builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingUser = action.payload; // Store user temporarily
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })


    // Handle admin login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.token = action.payload.token;
        state.loginAttempts = 0; // Reset on successful login
        state.isLocked = false;
        state.lockUntil = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('admin', JSON.stringify(action.payload)); // Store the payload in localStorage

      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
     
      });

    // Handle update staff profile
    builder
      .addCase(updateStaffProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaffProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.staff }; // Update the user state
      })
      .addCase(updateStaffProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder.addCase(verifyPuzzleAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPuzzleAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Move to actual user state
        localStorage.setItem('token', action.payload.user.token)
        state.pendingUser = null; // Clear pending user
        state.isVerified = action.payload.verified;
      })
      .addCase(verifyPuzzleAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;