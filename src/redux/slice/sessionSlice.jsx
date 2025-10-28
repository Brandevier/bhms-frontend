// src/redux/slice/sessionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isIdle: false,
  showWarning: false,
  warningCountdown: 15, // 15 seconds warning
  lastActivity: Date.now(),
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    updateActivity: (state) => {
      state.lastActivity = Date.now();
      state.isIdle = false;
      state.showWarning = false;
      state.warningCountdown = 15;
    },
    setIdle: (state) => {
      state.isIdle = true;
      state.showWarning = true;
    },
    decrementCountdown: (state) => {
      if (state.warningCountdown > 0) {
        state.warningCountdown -= 1;
      }
    },
    resetSession: (state) => {
      state.isIdle = false;
      state.showWarning = false;
      state.warningCountdown = 15;
    },
  },
});

export const {
  updateActivity,
  setIdle,
  decrementCountdown,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
