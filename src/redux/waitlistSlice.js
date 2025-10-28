import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Endpoint
const API_URL = "https://hms-backend-v1.onrender.com/api/v1/waitlist"; // Replace with your actual API

// Async thunk to add user to waitlist
export const addToWaitlist = createAsyncThunk(
  "waitlist/addToWaitlist",
  async ({ email, hospitalName,phone_number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { email, fullname:hospitalName,phone_number });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState: {
    waitlist: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.waitlist.push(action.payload);
      })
      .addCase(addToWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default waitlistSlice.reducer;
