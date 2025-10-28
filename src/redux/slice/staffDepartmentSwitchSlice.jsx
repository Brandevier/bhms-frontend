// src/redux/slice/staffDepartmentSwitchSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Try to get the initial department from localStorage or use null
const getInitialDepartment = () => {
  try {
    const storedDept = localStorage.getItem('staffCurrentDepartment');
    return storedDept ? JSON.parse(storedDept) : null;
  } catch (error) {
    console.error('Error reading department from localStorage:', error);
    return null;
  }
};

const initialState = {
  currentDepartment: getInitialDepartment(), // null or {id, name, ...}
  availableDepartments: [], // Array of departments the staff member has access to
  loading: false,
  error: null,
};

const staffDepartmentSwitchSlice = createSlice({
  name: "staffDepartmentSwitch",
  initialState,
  reducers: {
    setAvailableDepartments: (state, action) => {
      state.availableDepartments = action.payload;
    },
    switchStaffDepartment: (state, action) => {
      state.currentDepartment = action.payload;
      // Persist to localStorage
      try {
        localStorage.setItem('staffCurrentDepartment', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error saving department to localStorage:', error);
      }
    },
    resetStaffDepartment: (state) => {
      state.currentDepartment = null;
      // Remove from localStorage
      try {
        localStorage.removeItem('staffCurrentDepartment');
      } catch (error) {
        console.error('Error removing department from localStorage:', error);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setAvailableDepartments, 
  switchStaffDepartment, 
  resetStaffDepartment,
  setLoading,
  setError,
  clearError
} = staffDepartmentSwitchSlice.actions;

export default staffDepartmentSwitchSlice.reducer;