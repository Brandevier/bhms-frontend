import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import * as reducers from "./reducers/index";



// 🔹 Persist Configuration
const persistConfig = {
  key: "bhms",
  storage,
  whitelist: ["auth", "patientNote", "records", "departments", "permissions", "notification"], // Add only reducers you want to persist
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
  lab: reducers.labReducers,
  prescription: reducers.prescriptionSlice,
  service: reducers.serviceReducers,
  procedure: reducers.procedureReducers,
  warehouse: reducers.inventoryReducers,
  shifts: reducers.shiftReducers,
  notification: reducers.notificationSlice,
  noteComment: reducers.patientNoteCommentSlice,
  admission: reducers.admissionSlice,
  transfer: reducers.transferSlice,
  institutionAccounts: reducers.InstitutionPaymentSlice,
  patientObstetricHistory: reducers.obstetricHistorySlice,
  medicalHistory: reducers.medicalHistorySlice,
  immunization: reducers.ImmunizationSlice,
  consultation: reducers.consultationSlice,
  chat: reducers.chatSlice,
  bills: reducers.billSlice,
  attendance: reducers.attendanceSlice,
  discharge: reducers.dischargeSlice,
  billingStats: reducers.billingStatsSlice,
  beds: reducers.bedSlice,
  orScheduling: reducers.ORscheduling,
  icd10GDRG: reducers.icd10ToGdrg,
  nhiaMedications: reducers.nhiaMedicationsReducer,
  icd10:reducers.icd10Codes

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
