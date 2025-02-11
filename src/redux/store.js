import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import * as reducers from "./reducers/index";

// 🔹 Persist Configuration
const persistConfig = {
  key: "bhms",
  storage,
};

// 🔹 Root Reducer
const rootReducer = {
  auth: persistReducer(persistConfig, reducers.authReducer),
  waitlist: persistReducer(persistConfig, reducers.waitListReducers),
  departments:persistReducer(persistConfig,reducers.departmentReducers),
  adminStaffManagement:persistReducer(persistConfig,reducers.staffAdminManagementSlice),
  permissions:persistReducer(persistConfig,reducers.staff_permission_slice)
};

// 🔹 Create Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Redux Persist
    }).concat(logger), // Adds Redux Logger
});

// 🔹 Create Persistor
export const persistor = persistStore(store);

export default store;
