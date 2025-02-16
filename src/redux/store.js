import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import * as reducers from "./reducers/index";



// 🔹 Persist Configuration
const persistConfig = {
  key: "bhms",
  storage,
  whitelist: ["auth", "patientNote", "records"], // Add only reducers you want to persist
};

// 🔹 Root Reducer (Combine all reducers)
const rootReducer = combineReducers({
  auth: reducers.authReducer,
  waitlist: reducers.waitListReducers,
  departments: reducers.departmentReducers,
  adminStaffManagement: reducers.staffAdminManagementSlice,
  permissions: reducers.staff_permission_slice,
  records: reducers.recordsReducers,
  diagnosis: reducers.diagnosisReducers,
  vitals: reducers.vitalSignsReducers,
  patientNote: reducers.patientNoteSlice,
  lab:reducers.labReducers
});

// 🔹 Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Create Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Redux Persist
    }).concat(logger), // Adds Redux Logger
});

// 🔹 Create Persistor
export const persistor = persistStore(store);

export default store;
