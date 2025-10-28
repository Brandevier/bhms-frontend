// src/redux/hooks/useStaffDepartmentSwitch.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  setAvailableDepartments, 
  switchStaffDepartment, 
  resetStaffDepartment,
  setLoading,
  setError,
  clearError
} from '../slice/staffDepartmentSwitchSlice';

export const useStaffDepartmentSwitch = () => {
  const dispatch = useDispatch();
  const staffDepartmentState = useSelector((state) => state.staffDepartmentSwitch);

  const setDepartments = useCallback((departments) => {
    dispatch(setAvailableDepartments(departments));
  }, [dispatch]);

  const switchDepartment = useCallback((department) => {
    dispatch(switchStaffDepartment(department));
  }, [dispatch]);

  const resetDepartment = useCallback(() => {
    dispatch(resetStaffDepartment());
  }, [dispatch]);

  const setLoadingState = useCallback((loading) => {
    dispatch(setLoading(loading));
  }, [dispatch]);

  const setErrorState = useCallback((error) => {
    dispatch(setError(error));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...staffDepartmentState,
    setDepartments,
    switchDepartment,
    resetDepartment,
    setLoading: setLoadingState,
    setError: setErrorState,
    clearError: clearErrorState
  };
};

// Selector hooks
export const useCurrentStaffDepartment = () => useSelector((state) => state.staffDepartmentSwitch.currentDepartment);
export const useAvailableStaffDepartments = () => useSelector((state) => state.staffDepartmentSwitch.availableDepartments);
export const useStaffDepartmentSwitchLoading = () => useSelector((state) => state.staffDepartmentSwitch.loading);
export const useStaffDepartmentSwitchError = () => useSelector((state) => state.staffDepartmentSwitch.error);