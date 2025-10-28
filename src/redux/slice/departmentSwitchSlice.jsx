// src/redux/slice/departmentSwitchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDepartment: "Admin", // default view
  toolbarName: "Admin",       // default toolbar name
};

const departmentSwitchSlice = createSlice({
  name: "departmentSwitch",
  initialState,
  reducers: {
    switchDepartment: (state, action) => {
      const { department, toolbarName } = action.payload;
      state.currentDepartment = department;
      state.toolbarName = toolbarName;
    },
    resetDepartment: (state) => {
      state.currentDepartment = "Admin";
      state.toolbarName = "Admin";
    },
    setToolbarName: (state, action) => {
      state.toolbarName = action.payload;
    },
  },
});

export const { switchDepartment, resetDepartment, setToolbarName } =
  departmentSwitchSlice.actions;

export default departmentSwitchSlice.reducer;
