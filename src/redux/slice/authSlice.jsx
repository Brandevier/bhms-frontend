import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN_URL, ADMIN_LOGIN, VERIFY_EMAIL, BASE_URL } from '../../api/endpoints'; // Ensure UPDATE_STAFF_PROFILE_URL is defined

// User login thunk
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(LOGIN_URL, loginData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Admin login thunk
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async ({email,password}, { rejectWithValue }) => {
  try {
    const response = await axios.post(ADMIN_LOGIN, {
      email,
      password
      
    });
    return response.data;
  } catch (error) {
   console.log(error.response.data)
    return rejectWithValue(error.response.data);
  }
});

// Admin token verification thunk
export const verifyAdminToken = createAsyncThunk('auth/verifyAdminToken', async ({token}, { rejectWithValue }) => {

  try {
    const response = await axios.post(VERIFY_EMAIL, {
      token,
      email:localStorage.getItem('email')
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

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
  emailSent:false,
  error: null,
  token: localStorage.getItem('user') || null,
  isVerified: false, 
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
        state.emailSent = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.emailSent = false;
      });

    // Handle admin token verification
    builder
      .addCase(verifyAdminToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminToken.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.emailSent = false;
        localStorage.setItem('token', action.payload.token)
        state.isVerified = true || false; // Set isVerified from the response
        localStorage.setItem('admin', JSON.stringify(action.payload)); // Store the payload in localStorage
      })
      .addCase(verifyAdminToken.rejected, (state, action) => {
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