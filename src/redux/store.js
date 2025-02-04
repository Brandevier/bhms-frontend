import { configureStore } from "@reduxjs/toolkit";
import waitlistReducer from "./waitlistSlice";

export const store = configureStore({
  reducer: {
    waitlist: waitlistReducer,
  },
});

export default store;
